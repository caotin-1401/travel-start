"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("Blogs", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },

            description: {
                type: Sequelize.STRING,
            },
            image: {
                type: Sequelize.BLOB("long"),
            },
            content: {
                type: Sequelize.TEXT,
            },
            contentMarkdown: {
                type: Sequelize.TEXT,
            },
            author: {
                type: Sequelize.STRING,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable("Blogs");
    },
};
