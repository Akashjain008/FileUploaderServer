import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { any } from 'joi';
import { getPreSignedURLService, sendRequestToSQS } from './fileProcessor.service';
import logger from '@core/utils/logger';

const healthcheck = (req: Request, res: Response) => {
  res.status(httpStatus.OK);
  res.send({ status: 'OK', data: new Date().toJSON() });
};

const getPreSignedURL = async (req: Request, res: Response) => {
  try {
    const requestHeaders = req.headers;
    let result = await getPreSignedURLService(requestHeaders);
    res.status(httpStatus.OK);
    res.send({ result: result });
    return;
  } catch (err: any) {
    logger.error('Error: getPreSignedURL', JSON.stringify(err));
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    res.send({ message: err.message });
    return;
  };
};

const sendRequest = async (req: Request, res: Response) => {
  try {
    const requestHeaders = req.headers;
    const requestBody = req.body ? req.body.data : {};
    let result = await sendRequestToSQS(requestHeaders, requestBody);
    res.status(httpStatus.OK);
    res.send({ result: 'File has been sent to process further.' });
    return;
  } catch (err: any) {
    logger.error('Error: getPreSignedURL', JSON.stringify(err));
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    res.send({ message: err.message });
    return;
  };
};


export { healthcheck, getPreSignedURL, sendRequest };
