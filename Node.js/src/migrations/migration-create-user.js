"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("User", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },

            password: {
                type: Sequelize.STRING,
            },
            name: {
                type: Sequelize.STRING,
            },
            email: {
                type: Sequelize.STRING,
            },
            address: {
                type: Sequelize.STRING,
            },
            phoneNumber: {
                type: Sequelize.STRING,
            },
            roleID: {
                type: Sequelize.STRING,
            },
            gender: {
                type: Sequelize.STRING,
            },
            isFirst: {
                type: Sequelize.STRING,
            },
            point: {
                type: Sequelize.STRING,
            },
            image: {
                type: Sequelize.BLOB("long"),
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
        await queryInterface.dropTable("User");
    },
};
