"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("Tickets", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            seatNo: {
                type: Sequelize.STRING,
            },
            userId: {
                type: Sequelize.INTEGER,
            },
            driverId: {
                type: Sequelize.INTEGER,
            },
            token: {
                type: Sequelize.STRING,
            },
            dayStart: {
                type: Sequelize.STRING,
            },
            totalPrice: {
                type: Sequelize.INTEGER,
            },

            description: {
                type: Sequelize.STRING,
            },
            name: {
                type: Sequelize.STRING,
            },
            email: {
                type: Sequelize.STRING,
            },
            phone: {
                type: Sequelize.STRING,
            },
            tripId: {
                type: Sequelize.INTEGER,
                // references: {
                //     model: "Trips",
                //     key: "id",
                // },
            },
            isPresent: {
                type: Sequelize.STRING,
            },
            status: {
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
        await queryInterface.dropTable("Tickets");
    },
};
