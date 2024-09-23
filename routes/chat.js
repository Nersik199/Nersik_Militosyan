import { Router } from 'express';

import controllers from '../controllers/controllers.Chat.js';
import checkToken from '../middleware/checkToken.js';
const router = Router();

router.get('/messages', checkToken, controllers.getChatMessages);
// router.get('/users', checkToken, controllers.getFlowsUsers);
// router.get('/requests', checkToken, controllers.getFlowsRequests);
export default router;
