"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Route extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Route.hasMany(models.Trip, { foreignKey: "routeId" });
            Route.belongsTo(models.Location, {
                foreignKey: "areaStartId",
                as: "from",
            });
            Route.belongsTo(models.Location, {
                foreignKey: "areaEndId",
                as: "to",
            });
        }
    }
    Route.init(
        {
            name: DataTypes.STRING,
            // areaStartId: DataTypes.STRING,
            // areaEndId: DataTypes.STRING,
            image: DataTypes.BLOB("long"),
        },
        {
            sequelize,
            modelName: "Route",
        }
    );
    return Route;
};
