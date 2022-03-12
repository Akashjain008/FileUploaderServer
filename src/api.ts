import { Router } from 'express';

import healthCheck from '@components/healthcheck/healthCheck.router';
import user from '@components/user/user.router';
import fileProcessor from '@components/fileprocessor/fileProcessor.router';

const router: Router = Router();
router.use(healthCheck);
router.use(user);
router.use('/file', fileProcessor);

export default router;
