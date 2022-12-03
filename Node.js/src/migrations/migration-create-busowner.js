"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("Busowners", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },

            busOwnerId: {
                type: Sequelize.INTEGER,
            },
            busOwner: {
                type: Sequelize.STRING,
            },
            description: {
                type: Sequelize.TEXT,
            },
            descriptionMarkdown: {
                type: Sequelize.TEXT,
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
        await queryInterface.dropTable("Busowners");
    },
};
