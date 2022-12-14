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
            status: {
                type: Sequelize.INTEGER,
            },
            areaStartId: {
                type: Sequelize.INTEGER,
            },
            areaEndId: {
                type: Sequelize.INTEGER,
            },
            driverId: {
                type: Sequelize.INTEGER,
            },
            arrivalTime: {
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
        await queryInterface.dropTable("Vehicles");
    },
};
