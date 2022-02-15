const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Sentence extends Model {}

Sentence.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      text: {
          type: DataTypes.STRING,
          allowNull: false
      },
      user_id: {
          type: DataTypes.INTEGER,
          references: {
              model: 'user',
              key: 'id',
          }
      }
    },
    {
      sequelize,
      timestamps: false,
      freezeTableName: true,
      underscored: true,
      modelName: 'sentence',
    }
  );

  module.exports = Sentence;