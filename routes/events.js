import { Router } from 'express';
import controllers from '../controllers/controllers.Events.js';

import checkToken from '../middleware/checkToken.js';
import uploadFile from '../middleware/uploadFile.js';

import eventsSchema from '../schemas/events.js';
import validator from '../middleware/validate.js';

const router = Router();
// views

router.get('/send', (req, res) => {
  const { id } = req.query;
  res.render('registerEvent', { id });
});

router.post(
  '/create',
  uploadFile('public/images/events').array('eventImage', 4),
  validator(eventsSchema.createEvents, 'body'),
  checkToken,
  controllers.createEvents
);

router.get('/list', checkToken, controllers.getEvents);
router.post(
  '/register',
  validator(eventsSchema.registerEvent, 'body'),
  controllers.registerEvent
);

router.put(
  '/update/:id',
  uploadFile('public/images/events').array('eventImage', 4),
  validator(eventsSchema.updateEvent, 'body'),
  checkToken,
  controllers.updateEvent
);
router.put(
  '/update/photo/:id',
  uploadFile('public/images/events').single('eventImage'),
  checkToken,
  controllers.updatePhoto
);

router.post('/send/:id', controllers.SendEvents);

export default router;

// router.get('/send-attachment', checkToken, controllers.getXLSXPosts);
