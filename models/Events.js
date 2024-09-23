import sequelize from '../clients/sequelize.mysql.js';

import { DataTypes, Model } from 'sequelize';

import Users from './Users.js';
class Events extends Model {}

Events.init(
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    location: {
      type: DataTypes.STRING,
    },
    dateTime: {
      type: DataTypes.DATE,
    },
  },

  {
    sequelize,
    timestamps: true,
    tableName: 'events',
    modelName: 'events',
  }
);

Users.hasMany(Events, {
  foreignKey: 'userId',
  onDelete: 'cascade',
});
Events.belongsTo(Users, {
  foreignKey: 'userId',
  onDelete: 'cascade',
});

export default Events;
