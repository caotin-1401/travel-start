"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("Trips", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            dateStart: {
                type: Sequelize.STRING,
            },
            dateEnd: {
                type: Sequelize.STRING,
            },
            timeStart: {
                type: Sequelize.STRING,
            },
            timeEnd: {
                type: Sequelize.STRING,
            },
            areaStart: {
                type: Sequelize.STRING,
            },
            areaEnd: {
                type: Sequelize.STRING,
            },

            routeId: {
                type: Sequelize.INTEGER,
                // references: {
                //     model: "Routes",
                //     key: "id",
                // },
            },
            driverId: {
                type: Sequelize.INTEGER,
            },
            price: {
                type: Sequelize.INTEGER,
            },
            busId: {
                type: Sequelize.INTEGER,
                // references: {
                //     model: "Vehicles",
                //     key: "id",
                // },
            },

            maxNumber: {
                type: Sequelize.INTEGER,
            },
            busOwnerId: {
                type: Sequelize.INTEGER,
            },
            // arrOfSeat: {
            //     type: Sequelize.ARRAY(Sequelize.STRING),
            //     defaultValue: [],
            // },
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
        await queryInterface.dropTable("Trips");
    },
};
