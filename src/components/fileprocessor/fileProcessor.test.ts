import { agent as request } from 'supertest';
import httpStatus from 'http-status';

import app from '@app';

describe('Helathcheck API', () => {
  describe('GET /api/fileHealth', () => {
    test('should return 200 status if all OK', async () => {
      await request(app).get('/api/health').send().expect(httpStatus.OK);
    });
  });
});

describe('Get PreSigned URL API', () => {
  describe('GET /api/file/process', () => {
    test('should return 200 status if all OK', async () => {
      await request(app).get('/api/file/process').send().expect(httpStatus.OK);
    });
  });
});

describe('Send reuqest to SQS API', () => {
  describe('POST /api/file/process', () => {
    test('should return 200 status if all OK', async () => {
      const data = { "name": "twain_32.dll", "type": "application/x-msdownload", "size": 68608, "customName": "1647169667852_twain_32.dll" };
      await request(app).post('/api/file/process').send(data).expect(httpStatus.OK);
    });
  });
});