import { Router } from 'express';
import protectedByApiKey from '@core/middlewares/apiKey.middleware';

import {
    healthcheck,
    getPreSignedURL,
    sendRequest
} from './fileProcessor.controller';

const router: Router = Router();

router.get('/health', healthcheck);
router.get('/process', [protectedByApiKey], getPreSignedURL);
router.post('/process', [protectedByApiKey], sendRequest);

export default router;
