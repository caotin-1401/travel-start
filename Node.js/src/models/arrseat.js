"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Arrseat extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {}
    }
    Arrseat.init(
        {
            name: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Arrseat",
        }
    );
    return Arrseat;
};
