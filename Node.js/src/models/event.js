"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Event extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Event.hasMany(models.Coupon, { foreignKey: "eventId" });
        }
    }
    Event.init(
        {
            name: DataTypes.STRING,
            image: DataTypes.BLOB("long"),
            description: DataTypes.TEXT,
            descriptionMarkdown: DataTypes.TEXT,
            type: DataTypes.STRING,
            startDate: DataTypes.STRING,
            endDate: DataTypes.STRING,
            busOwnerId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Event",
        }
    );
    return Event;
};
