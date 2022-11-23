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
            // arrOfSeat: {
            //     type: Sequelize.ARRAY(Sequelize.TEXT),
            //     defaultValue: [],
            // },
            userId: {
                type: Sequelize.INTEGER,
            },
            token: {
                type: Sequelize.STRING,
            },
            totalPrice: {
                type: Sequelize.INTEGER,
            },
            packageWeight: {
                type: Sequelize.STRING,
            },
            description: {
                type: Sequelize.STRING,
            },
            tripId: {
                type: Sequelize.INTEGER,
                references: {
                    model: "Trips",
                    key: "id",
                },
            },
            billId: {
                type: Sequelize.INTEGER,
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
