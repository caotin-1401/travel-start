"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Coupon extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Coupon.belongsTo(models.Event, { foreignKey: "eventId" });
        }
    }
    Coupon.init(
        {
            eventId: DataTypes.INTEGER,
            name: DataTypes.STRING,
            type: DataTypes.STRING,
            discount: DataTypes.STRING,
            discountMax: DataTypes.INTEGER,
            sumMoneyCondition: DataTypes.INTEGER,
            startDate: DataTypes.STRING,
            endDate: DataTypes.STRING,
            count: DataTypes.INTEGER,
            use: DataTypes.INTEGER,
            originalPrice: DataTypes.INTEGER,
            finalPrice: DataTypes.INTEGER,
            pointCondition: DataTypes.STRING,
            description: DataTypes.TEXT,
            descriptionMarkdown: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: "Coupon",
        }
    );
    return Coupon;
};
