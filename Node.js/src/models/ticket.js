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
            Ticket.belongsTo(models.User, { foreignKey: "userId" });
            Ticket.belongsTo(models.Allcode, {
                foreignKey: "status",
                targetKey: "keyMap",
                as: "statusData",
            });
        }
    }
    Ticket.init(
        {
            userId: DataTypes.INTEGER,
            seatNo: DataTypes.STRING,
            // arrOfSeat: {
            //     type: DataTypes.ARRAY(DataTypes.STRING),
            //     defaultValue: [],
            // },
            token: DataTypes.STRING,
            totalPrice: DataTypes.INTEGER,
            // packageWeight: DataTypes.STRING,
            description: DataTypes.STRING,
            // tripId: DataTypes.INTEGER,
            status: DataTypes.STRING,
            billId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Ticket",
        }
    );
    return Ticket;
};
