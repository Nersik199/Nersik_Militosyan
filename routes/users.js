import { Router } from 'express';

import controllers from '../controllers/controllers.Users.js';

import checkToken from '../middleware/checkToken.js';
import validate from '../middleware/validate.js';
import uploadFile from '../middleware/uploadFile.js';

import userSchema from '../schemas/users.js';

const router = Router();

//views
router.get('/registration', (req, res) => {
	res.render('registration');
});
router.get('/login', (req, res) => {
	res.render('login');
});
router.get('/profile', (req, res) => {
	res.render('profile');
});
router.get('/profile/data', (req, res) => {
	res.render('usersList');
});
router.get('/update/user/profile', (req, res) => {
	res.render('UpdateUserProfile');
});
router.get('/forgot/password', (req, res) => {
	res.render('forgotPassword', {});
});

router.get('/update/password', (req, res) => {
	const { key } = req.query;
	if (!key) {
		return res.status(400).json({ message: 'Token must be provided' });
	}
	res.render('updatePassword', { key });
});

//Api
router.post(
	'/registration',
	uploadFile('public/images/avatar').single('avatar'),
	validate(userSchema.register, 'body'),
	controllers.registration
);
router.get(
	'/activate',
	validate(userSchema.activeAccount, 'query'),
	controllers.activeAccount
);

router.post('/login', validate(userSchema.login, 'body'), controllers.login);
router.get('/user/profile', checkToken, controllers.userProfile);

router.put(
	'/update/profile',
	checkToken,
	uploadFile('public/images/avatar').single('avatar'),
	validate(userSchema.userUpdate, 'body'),
	controllers.userUpdate
);
router.post('/forgot/password', controllers.forgotPassword);
router.put(
	'/update/password',
	validate(userSchema.updatePassword, 'body'),
	controllers.updatePassword
);

export default router;
