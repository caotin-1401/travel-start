"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Location extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Location.hasMany(models.Route, {
                foreignKey: "areaStartId",
                as: "from",
            });
            Location.hasMany(models.Route, {
                foreignKey: "areaEndId",
                as: "to",
            });
        }
    }
    Location.init(
        {
            name: DataTypes.STRING,
            city: DataTypes.STRING,
            address: DataTypes.STRING,
            state: DataTypes.STRING,
            status: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Location",
        }
    );
    return Location;
};
