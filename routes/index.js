import { Router } from 'express';

import users from './users.js';
import events from './events.js';

const router = Router();

router.get('/', (req, res) => {
  res.render('login');
});

router.use('/users', users);
router.use('/event', events);



export default router;
