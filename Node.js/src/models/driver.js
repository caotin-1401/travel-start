"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Driver extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Driver.belongsTo(models.User, { foreignKey: "driverId" });
        }
    }
    Driver.init(
        {
            driverId: DataTypes.INTEGER,
            status: DataTypes.INTEGER,
            busOwnerId: DataTypes.INTEGER,
            busOwner: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Driver",
        }
    );
    return Driver;
};
