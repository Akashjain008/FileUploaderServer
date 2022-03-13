/* eslint-disable prettier/prettier */
import AWS from 'aws-sdk';
import { any } from 'joi';
import consts from '@config/consts';
import BasicUtility from '../../core/utils/basicUtility';

const sourceBucket = consts.SourceBucket;
const signedUrlExpireSeconds = consts.SignedUrlExpireSeconds;

AWS.config.update({
    accessKeyId: consts.ACCESSKEYID,
    secretAccessKey: consts.SECRETACCESSKEY,
    region: 'us-east-1',
    signatureVersion: 'v4',
});

const s3 = new AWS.S3();
const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
import logger from '@core/utils/logger';

const getPreSignedURLService = async (requestHeaders) => {
    try {
        const myKey = requestHeaders.filename;
        const url = await s3.getSignedUrlPromise('putObject', {
            Bucket: sourceBucket,
            Key: myKey,
            Expires: signedUrlExpireSeconds
        });
        const ciphertext = await BasicUtility.encodeRequest(url, myKey);
        return ciphertext;
    } catch (err: any) {
        logger.error('Error: getPreSignedURLService', JSON.stringify(err));
        throw err;
    };
};

const sendRequestToSQS = async (requestHeaders, requestBody) => {
    try {
        const myKey = requestHeaders.filename;
        logger.info(myKey);
        const originalText = await BasicUtility.decodeResponse(requestBody, myKey);
        logger.debug(originalText);
        // Setup the sendMessage parameter object
        const params = {
            MessageBody: JSON.stringify(originalText),
            QueueUrl: consts.QueueUrl,
        };
        logger.debug(params)
        const sqsResult = await sqs.sendMessage(params).promise();
        return sqsResult;
    } catch (err: any) {
        logger.error('Error: sendRequestToSQS', JSON.stringify(err));
        throw err;
    };
};


export { getPreSignedURLService, sendRequestToSQS };
