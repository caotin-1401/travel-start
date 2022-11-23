"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("Vehicles", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            number: {
                type: Sequelize.STRING,
            },
            busTypeId: {
                type: Sequelize.INTEGER,
                references: {
                    model: "BusTypes",
                    key: "id",
                },
            },
            busOwnerId: {
                type: Sequelize.INTEGER,
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
        await queryInterface.dropTable("Vehicles");
    },
};
