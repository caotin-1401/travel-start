"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert("User", [
            {
                name: "admin",
                password: "12345678",
                email: "admin@gmail.com",
                address: "HCM",
                phoneNumber: "12345678",
                image: "sd",
                roleID: "R1",
                gender: "M",

                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    },
};
