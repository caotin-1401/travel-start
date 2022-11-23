"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("Coupons", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            eventId: {
                type: Sequelize.INTEGER,
            },
            name: {
                type: Sequelize.STRING,
            },
            type: {
                type: Sequelize.STRING,
            },
            discount: {
                type: Sequelize.STRING,
            },
            discountMax: {
                type: Sequelize.INTEGER,
            },
            startDate: {
                type: Sequelize.STRING,
            },
            endDate: {
                type: Sequelize.STRING,
            },
            sumMoneyCondition: {
                type: Sequelize.INTEGER,
            },
            originalPrice: {
                type: Sequelize.INTEGER,
            },
            finalPrice: {
                type: Sequelize.INTEGER,
            },
            count: {
                type: Sequelize.INTEGER,
            },
            use: {
                type: Sequelize.INTEGER,
            },
            pointCondition: {
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
        await queryInterface.dropTable("Coupons");
    },
};
