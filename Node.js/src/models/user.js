"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            User.belongsTo(models.Allcode, {
                foreignKey: "gender",
                targetKey: "keyMap",
                as: "genderData",
            });
            User.hasMany(models.Vehicle, { foreignKey: "busOwnerId" });
            User.hasMany(models.Trip, { foreignKey: "busId" });
            User.hasMany(models.Ticket, { foreignKey: "userId" });
        }
    }
    User.init(
        {
            username: DataTypes.STRING,
            password: DataTypes.STRING,
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            address: DataTypes.STRING,
            phoneNumber: DataTypes.INTEGER,
            roleID: DataTypes.STRING,
            busOwnerId: DataTypes.INTEGER,
            busOwner: DataTypes.STRING,
            gender: DataTypes.STRING,
            point: DataTypes.STRING,
            image: DataTypes.BLOB("long"),
        },
        {
            sequelize,
            modelName: "User",
            freezeTableName: true,
        }
    );
    return User;
};
