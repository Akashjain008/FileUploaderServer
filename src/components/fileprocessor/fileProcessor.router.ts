import { Router } from 'express';

import {
    healthcheck,
    getPreSignedURL,
    sendRequest,
    processRequest
} from './fileProcessor.controller';

const router: Router = Router();

router.get('/health', healthcheck);
router.get('/process', getPreSignedURL);
router.post('/process', sendRequest);
router.put('/process', processRequest);

export default router;
