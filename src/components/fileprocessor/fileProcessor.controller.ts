import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { any } from 'joi';
import { getPreSignedURLService, sendRequestToSQS, processRequestService } from './fileProcessor.service';

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
    console.error('Error: getPreSignedURL', JSON.stringify(err));
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    res.send({ message: err.message });
    return;
  };
};

const sendRequest = async (req: Request, res: Response) => {
  try {
    const requestHeaders = req.headers;
    const requestBody = req.body;
    let result = await sendRequestToSQS(requestHeaders, requestBody);
    res.status(httpStatus.OK);
    res.send({ result: result });
    return;
  } catch (err: any) {
    console.error('Error: getPreSignedURL', JSON.stringify(err));
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    res.send({ message: err.message });
    return;
  };
};


const processRequest = async (req: Request, res: Response) => {
  try {
    const requestHeaders = req.headers;
    const requestBody = req.body;
    let result = await processRequestService(requestHeaders, requestBody);
    res.status(httpStatus.OK);
    res.send({ result: result });
    return;
  } catch (err: any) {
    console.error('Error: processRequestService', JSON.stringify(err));
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    res.send({ message: err.message });
    return;
  };
}

export { healthcheck, getPreSignedURL, sendRequest, processRequest };
