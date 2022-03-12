/* eslint-disable prettier/prettier */
import AWS from 'aws-sdk';
import CryptoJS from 'crypto-js';
import { any } from 'joi';
const sourceBucket = 'filereceiverbucket';
const signedUrlExpireSeconds = 60 * 5;

AWS.config.update({
    accessKeyId: '',
    secretAccessKey: '',
    region: 'us-east-1',
    signatureVersion: 'v4',
});

const s3 = new AWS.S3();

const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

const getPreSignedURLService = async (requestHeaders) => {
    try {
        const myKey = requestHeaders.filename;
        const url = await s3.getSignedUrlPromise('putObject', {
            Bucket: sourceBucket,
            Key: myKey,
            Expires: signedUrlExpireSeconds
        });
        const ciphertext = CryptoJS.AES.encrypt(url, myKey).toString();
        return ciphertext;
    } catch (err: any) {
        console.log('Error: getPreSignedURLService', JSON.stringify(err));
        throw err;
    };
};

const sendRequestToSQS = async (requestHeaders, requestBody) => {
    try {
        const myKey = requestBody.customName;
        // Setup the sendMessage parameter object
        const params = {
            MessageBody: JSON.stringify(requestBody),
            QueueUrl: `https://sqs.us-east-1.amazonaws.com/935493626899/file-info-receiver-sqs.fifo`,
            MessageGroupId: 'malwarebytes',
            MessageDeduplicationId: myKey
        };
        console.log(params)
        const sqsResult = await sqs.sendMessage(params).promise();
        return sqsResult;
    } catch (err: any) {
        console.log('Error: sendRequestToSQS', JSON.stringify(err));
        throw err;
    };
};


const processRequestService = async (requestHeaders, requestBody) => {
    try {
        console.log('requestBody', requestBody.event.Records);
        const event = requestBody.event;
        event.Records.forEach(async (record) => {
            console.log(record.body);
            const reqBody = JSON.parse(JSON.stringify(record.body));
            console.log('reqBody', reqBody);
            console.log('key', reqBody["customName"])
            const s3File = await getS3Object(reqBody.customName);
            const header = await getFileHeader(s3File.Body);
            console.log('header', header);
            if (!(header && header.toLowerCase().includes('4d5a'))) {
                console.info('File is not portable executable');
                return;
            }
            const fileBuffer = s3File.Body.toString('utf-8');
            const fileHash = await calculateFileHash(fileBuffer);
            reqBody.hash = fileHash;
            let isExists = await checkItemExists(reqBody);
            if (isExists) {
                console.log('File already exists.');
                return;
            }
            await copyS3Object(reqBody.customName);
            await saveFileDetails(reqBody);
        });

    } catch (err: any) {
        console.log('Error: processRequestService', JSON.stringify(err));
        throw err;
    };
};

const checkItemExists = async (requestBody) => {
    try {
        const dynamodb = new AWS.DynamoDB();
        let params = {
            TableName: 'fileTracker',
            Item: {
                fileHash: { S: requestBody.hash },
                fileName: { S: requestBody.customName },
                expiryDate: { S: Date.now().toString() }
            },
            ConditionExpression: 'attribute_not_exists(fileHash)'
        };
        console.log(params);
        const data = await dynamodb.putItem(params).promise();
        console.log('Item added successfully', data);
        return false;

    } catch (err) {
        if (err && err.code === 'ConditionalCheckFailedException') {
            console.log("Error: ", err.code);
            return true;
        }
        throw err;
    }
};

const saveFileDetails = async (requestBody: any) => {
    try {
        const dynamodb = new AWS.DynamoDB();
        const { v4: uuidv4 } = require('uuid');
        let params = {
            TableName: 'file-metadata',
            Item: {
                id: { S: uuidv4() },
                fileHash: { S: requestBody.hash },
                name: { S: requestBody.name },
                size: { S: requestBody.size },
                type: { S: requestBody.type },
                customName: { S: requestBody.customName },
                expiryDate: { S: Date.now().toString() }
            }
        };
        console.log(params);
        const data = await dynamodb.putItem(params).promise();
        console.log('Item added successfully', data);
        return data;
    } catch (err) {
        console.log("Error: ", err);
        throw err;
    }
};

const calculateFileHash = async (fileBuffer) => {
    try {
        const CryptoJS = require('crypto-js');
        const fileHash = await CryptoJS.MD5(fileBuffer).toString();
        return fileHash;
    } catch (err) {
        console.error('Error: calculateFileHash', err);
        throw err;
    }
}

const getS3Object = async (fileName: string) => {
    try {
        const getFileParams = {
            Bucket: 'filereceiverbucket',
            Key: fileName,
        }
        const s3File = await s3.getObject(getFileParams).promise();
        return s3File;
    } catch (err) {
        console.error('Error: getS3Object', err);
        throw err;
    }
}

const getFileHeader = async (s3FileBody) => {
    try {
        const arr = (new Uint8Array(s3FileBody)).subarray(0, 4);
        let header = ''
        for (let i = 0; i < arr.length; i++) {
            header += arr[i].toString(16);
        }
        return header;
    } catch (err) {
        console.error('Error: getFileHeader', err);
        throw err;
    }
}

const copyS3Object = async (fileName: string) => {
    try {
        const params = {
            Bucket: "portable-executable-file-bucket",
            CopySource: 'filereceiverbucket/' + fileName,
            Key: fileName
        };
        let result = await s3.copyObject(params).promise();
        return result;
    } catch (err) {
        console.error('Error: copyS3Object', err);
        throw err;
    }
}




export { getPreSignedURLService, sendRequestToSQS, processRequestService };
