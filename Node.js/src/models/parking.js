'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ParkingLot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  ParkingLot.init({
    name: DataTypes.STRING,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    busOwnerId: DataTypes.INTEGER,
    stationId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ParkingLot',
  });
  return ParkingLot;
};