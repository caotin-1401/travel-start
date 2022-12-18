"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Ticket extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Ticket.belongsTo(models.Trip, { foreignKey: "tripId" });
            Ticket.belongsTo(models.Passenger, { foreignKey: "userId" });
        }
    }
    Ticket.init(
        {
            userId: DataTypes.INTEGER,
            seatNo: DataTypes.STRING,
            token: DataTypes.STRING,
            totalPrice: DataTypes.INTEGER,
            description: DataTypes.STRING,
            name: DataTypes.STRING,
            driverId: DataTypes.INTEGER,
            status: DataTypes.STRING,
            isPresent: DataTypes.STRING,
            dayStart: DataTypes.STRING,
            phone: DataTypes.STRING,
            email: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Ticket",
        }
    );
    return Ticket;
};
