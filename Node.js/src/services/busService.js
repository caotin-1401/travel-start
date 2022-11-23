import db from "../models/index";
import { reject } from "bcrypt/promises";
import bcrypt from "bcryptjs";
// const { Buffer } = require("buffer");
let checkName = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let name = await db.Vehicle.findOne({
                where: {
                    number: data,
                },
            });
            if (name) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    });
};
let getAllBus = (busId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (busId === "ALL") {
                let bus = await db.Vehicle.findAll({
                    // attributes: {
                    //     exclude: ["image"],
                    // },
                    include: [
                        {
                            model: db.BusType,
                            attributes: ["id", "typeName", "numOfSeat"],
                        },
                        {
                            model: db.User,
                            attributes: ["id", "name", "roleID"],
                        },
                    ],
                    raw: true,
                    nest: true,
                });
                bus.map((item) => {
                    if (item && item.image) {
                        item.image = Buffer.from(item.image, "base64").toString(
                            "binary"
                        );
                    }
                });
                resolve(bus);
            }
            if (busId && busId !== "ALL") {
                let bus = await db.Vehicle.findOne({
                    where: { id: busId },
                    include: [
                        {
                            model: db.BusType,
                            attributes: ["id", "typeName", "numOfSeat"],
                        },
                        {
                            model: db.User,
                            attributes: ["id", "name"],
                        },
                    ],
                    raw: true,
                    nest: true,
                });
                if (bus && bus.image) {
                    bus.image = Buffer.from(bus.image, "base64").toString(
                        "binary"
                    );
                }
                resolve(bus);
            }
        } catch (e) {
            reject(e);
        }
    });
};
let createNewBus = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let number = await checkName(data.number);
            if (number) {
                resolve({
                    errCode: 1,
                    errMessage:
                        "Vehicle already exists, please try another vehicle",
                });
            } else if (!data.number || !data.busTypeId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter",
                });
            } else {
                await db.Vehicle.create({
                    number: data.number.toUpperCase(),
                    busTypeId: data.busTypeId,
                    busOwnerId: data.busOwnerId,
                    image: data.image,
                });
                resolve({
                    errCode: 0,
                    message: "OK",
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};
let editBus = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter",
                });
            }
            let vehicle = await db.Vehicle.findOne({
                where: { id: data.id },
                raw: false,
            });
            if (vehicle) {
                (vehicle.number = data.number.toUpperCase()),
                    (vehicle.busTypeId = data.busTypeId);
                if (data.image) {
                    vehicle.image = data.image;
                }

                await vehicle.save();
                resolve({
                    errCode: 0,
                    errMessage: "update vehicle success",
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: "vehicle not found",
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};
let deleteBus = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let id = await db.Vehicle.findOne({
                where: {
                    id: data.id,
                },
            });
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: "The vehicle was not found",
                });
            } else {
                await db.Vehicle.destroy({
                    where: { id: data.id },
                });
                resolve({
                    errCode: 0,
                    errMessage: "OK",
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};
module.exports = {
    getAllBus,
    createNewBus,
    editBus,
    deleteBus,
};
