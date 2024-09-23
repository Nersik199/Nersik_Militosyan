import jwt from 'jsonwebtoken';
const { JWT_TOKEN } = process.env;

export default {
	createToken: payload => {
		const { id, email } = payload;
		return jwt.sign({ id, email }, JWT_TOKEN, { expiresIn: '30d' });
	},
};
