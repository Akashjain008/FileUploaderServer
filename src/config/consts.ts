const API_ROOT_PATH = '/api';
const API_DOCS_PATH = '/api-docs';
const ACCESSKEYID = '';
const SECRETACCESSKEY = '';
const SignedUrlExpireSeconds = 60 * 5;  // 5 min
const SourceBucket = 'filereceiverbucket'
const QueueUrl = 'https://sqs.us-east-1.amazonaws.com/935493626899/file-events-receiver';

export default { API_ROOT_PATH, API_DOCS_PATH, ACCESSKEYID, SECRETACCESSKEY, SignedUrlExpireSeconds, SourceBucket, QueueUrl };
