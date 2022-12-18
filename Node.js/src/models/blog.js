"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Blog extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {}
    }
    Blog.init(
        {
            description: DataTypes.STRING,
            author: DataTypes.STRING,
            image: DataTypes.BLOB("long"),
            content: DataTypes.TEXT,
            contentMarkdown: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: "Blog",
        }
    );
    return Blog;
};
