"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Passenger extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Passenger.hasMany(models.Ticket, { foreignKey: "userId" });
        }
    }
    Passenger.init(
        {
            name: DataTypes.STRING,
            password: DataTypes.STRING,
            email: DataTypes.STRING,
            address: DataTypes.STRING,
            phoneNumber: DataTypes.STRING,
            roleID: DataTypes.STRING,
            gender: DataTypes.STRING,
            isFirst: DataTypes.STRING,
            image: DataTypes.BLOB("long"),
        },
        {
            sequelize,
            modelName: "Passenger",
        }
    );
    return Passenger;
};
