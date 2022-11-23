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
        }
    }
    Vehicle.init(
        {
            number: DataTypes.STRING,
            // busTypeId: DataTypes.STRING,
            busOwnerId: DataTypes.INTEGER,
            image: DataTypes.BLOB("long"),
        },
        {
            sequelize,
            modelName: "Vehicle",
        }
    );
    return Vehicle;
};
