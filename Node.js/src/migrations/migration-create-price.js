"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("Prices", {
            //     defaults: DataTypes.STRING,
            // busTypeId: DataTypes.INTEGER,
            // turnId: DataTypes.INTEGER
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            defaultPrice: {
                type: Sequelize.STRING,
            },
            busTypeId: {
                type: Sequelize.INTEGER,
            },
            turnId: {
                type: Sequelize.INTEGER,
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
        await queryInterface.dropTable("Prices");
    },
};
