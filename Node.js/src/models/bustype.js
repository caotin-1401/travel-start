"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class BusType extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            BusType.hasMany(models.Vehicle, { foreignKey: "busTypeId" });
        }
    }
    BusType.init(
        {
            typeName: DataTypes.STRING,
            numOfSeat: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "BusType",
        }
    );
    return BusType;
};
