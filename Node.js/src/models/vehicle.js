"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Vehicle extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */

        static associate(models) {
            Vehicle.belongsTo(models.BusType, { foreignKey: "busTypeId" });
            Vehicle.belongsTo(models.User, { foreignKey: "busOwnerId" });
            Vehicle.hasOne(models.Trip, { foreignKey: "busId" });
            Vehicle.belongsTo(models.Location, {
                foreignKey: "areaStartId",
                as: "fromvehicle",
            });
            Vehicle.belongsTo(models.Location, {
                foreignKey: "areaEndId",
                as: "tovehicle",
            });
        }
    }
    Vehicle.init(
        {
            number: DataTypes.STRING,
            // busTypeId: DataTypes.STRING,
            busOwnerId: DataTypes.INTEGER,
            status: DataTypes.INTEGER,
            image: DataTypes.BLOB("long"),
            areaStartId: DataTypes.STRING,
            areaEndId: DataTypes.STRING,
            driverId: DataTypes.INTEGER,

            arrivalTime: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Vehicle",
        }
    );
    return Vehicle;
};
