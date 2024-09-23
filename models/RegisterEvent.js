import sequelize from '../clients/sequelize.mysql.js';

import { DataTypes, Model } from 'sequelize';

import Events from './Events.js';
class RegisterEvent extends Model {}

RegisterEvent.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
  },

  {
    sequelize,
    timestamps: true,
    tableName: 'register_event',
    modelName: 'RegisterEvent',
  }
);

RegisterEvent.belongsTo(Events, {
  foreignKey: 'registerId',
  onDelete: 'cascade',
});

Events.hasMany(RegisterEvent, {
  foreignKey: 'registerId',
  onDelete: 'cascade',
});

export default RegisterEvent;
