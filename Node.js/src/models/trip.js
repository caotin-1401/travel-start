"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Trip extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Trip.belongsTo(models.Route, { foreignKey: "routeId" });
            Trip.belongsTo(models.Vehicle, { foreignKey: "busId" });
            Trip.belongsTo(models.User, { foreignKey: "driverId" });
            Trip.hasMany(models.Ticket, { foreignKey: "tripId" });
        }
    }
    Trip.init(
        {
            dateStart: DataTypes.STRING,
            dateEnd: DataTypes.STRING,
            timeStart: DataTypes.STRING,
            timeEnd: DataTypes.STRING,
            areaStart: DataTypes.STRING,
            areaEnd: DataTypes.STRING,
            driverId: DataTypes.INTEGER,
            busId: DataTypes.INTEGER,
            price: DataTypes.INTEGER,
            status: DataTypes.INTEGER,
            busOwnerId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Trip",
        }
    );
    return Trip;
};
