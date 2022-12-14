"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert("User", [
            {
                name: "admin",
                password:
                    "$2a$10$cgoDQbJDTUKINReGdHa6.uQ6v95ijVtpA.LSh/QV6t9Nh52Q1rKNy",
                //password: 12345678 (login)
                email: "travelstart.ad@gmail.com",
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
