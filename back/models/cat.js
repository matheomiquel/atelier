'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  cat.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    path: DataTypes.STRING,
    vote: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'cat',
  });
  return cat;
};