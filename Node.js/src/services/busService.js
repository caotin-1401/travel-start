import db from "../models/index";
import { reject } from "bcrypt/promises";
import bcrypt from "bcryptjs";
import _ from "lodash";
// const { Buffer } = require("buffer");
const { Op } = require("sequelize");
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
let getAllBus = async (busId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (busId === "ALL") {
                let bus = await db.Vehicle.findAll({
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

                bus.map(async (item) => {
                    if (item && item.image) {
                        item.image = Buffer.from(item.image, "base64").toString("binary");
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
                let driver = {};
                if (bus && bus.image) {
                    bus.image = Buffer.from(bus.image, "base64").toString("binary");
                }
                if (bus.driverId !== 0) {
                    driver = await db.Driver.findOne({
                        where: { driverId: bus.driverId },
                    });
                }
                bus = { ...bus, driver };
                resolve(bus);
            }
        } catch (e) {
            reject(e);
        }
    });
};
let getNextTrip = async (areaStart, busId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (busId && busId !== "ALL") {
                let bus = await db.Trip.findAll({
                    where: {
                        areaStart: areaStart,
                        busId: busId,
                        status: 1,
                    },
                    include: [
                        {
                            model: db.User,
                            attributes: ["id", "name"],
                        },
                    ],
                    raw: false,
                    nest: true,
                });
                // console.log(bus);
                let a = _.sortBy(bus, ["timeStart"]);
                if (a && a.length === 0) a = [];
                // console.log(a);
                resolve(a[0]);
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
                    errMessage: "Vehicle already exists, please try another vehicle",
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
                    areaStartId: 0,
                    areaEndId: 0,
                    driverId: 0,
                    arrivalTime: 0,
                    status: 1,
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
                (vehicle.number = data.number.toUpperCase()), (vehicle.busTypeId = data.busTypeId);
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
let handleVehicleStartTrip = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let vehicle = await db.Vehicle.findOne({
                where: {
                    id: data.id,
                    [Op.or]: [{ status: 1 }, { status: 3 }],
                },
                raw: false,
            });
            if (vehicle) {
                vehicle.status = 2;
                vehicle.driverId = data.idDriver;
                vehicle.areaEndId = 0;
                await vehicle.save();

                resolve({
                    errCode: 0,
                    message: "update vehicle success",
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
let handleVehicleEndTrip = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let vehicle = await db.Vehicle.findOne({
                where: {
                    id: data.id,
                    status: 2,
                    areaEndId: 0,
                },
                raw: false,
            });
            let time = new Date().getTime();
            let station = await db.Location.findOne({
                where: { name: data.areaEndId },
            });

            if (vehicle) {
                vehicle.status = 3;
                vehicle.areaEndId = station.id;
                vehicle.arrivalTime = time;
                vehicle.driverId = 0;
                await vehicle.save();
                resolve({
                    errCode: 0,
                    message: "update vehicle success",
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
module.exports = {
    handleVehicleStartTrip,
    handleVehicleEndTrip,
    getAllBus,
    createNewBus,
    editBus,
    deleteBus,
    getNextTrip,
};
