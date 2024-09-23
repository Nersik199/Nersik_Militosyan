import sequelize from '../clients/sequelize.mysql.js';
import { DataTypes, Model } from 'sequelize';
import md5 from 'md5';
const { USER_PASSWORD_SECRET } = process.env;
class Users extends Model {
	static hashPassword(password) {
		return md5(md5(password) + USER_PASSWORD_SECRET);
	}
}

Users.init(
	{
		id: {
			type: DataTypes.BIGINT.UNSIGNED,
			primaryKey: true,
			autoIncrement: true,
		},
		firstName: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		lastName: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING(255),
			allowNull: false,
			get() {
				return '******';
			},
			set(value) {
				this.setDataValue('password', Users.hashPassword(value));
			},
		},
		email: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		createdAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
		type: {
			type: DataTypes.ENUM('user', 'admin'),
			allowNull: false,
			defaultValue: 'user',
		},
		activationKey: {
			type: DataTypes.STRING,
		},
		status: {
			type: DataTypes.STRING,
			defaultValue: 'pending',
		},
	},
	{
		sequelize,
		modelName: 'user',
		tableName: 'users',
		indexes: [
			{
				unique: true,
				fields: ['email'],
			},
		],
	}
);

export default Users;
