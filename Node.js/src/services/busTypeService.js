import db from "../models/index";
import { reject } from "bcrypt/promises";
import bcrypt from "bcryptjs";

let getAllBusTypes = async (busTypeId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let busTypes = "";
            if (busTypeId === "ALL") {
                busTypes = await db.BusType.findAll({});
            }
            if (busTypeId && busTypeId !== "ALL") {
                busTypes = await db.BusType.findOne({
                    where: { id: busTypeId },
                });
            }
            resolve(busTypes);
        } catch (e) {
            reject(e);
        }
    });
};

let checkName = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let name = await db.BusType.findOne({
                where: {
                    typeName: data,
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

let checkNumOfSeat = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let numOfSeat = await db.BusType.findOne({
                where: {
                    numOfSeat: data,
                },
            });
            if (numOfSeat) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    });
};

let createNewBusType = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let typeName = await checkName(data.typeName);
            let numOfSeat = await checkNumOfSeat(data.numOfSeat);
            if (typeName && numOfSeat) {
                resolve({
                    errCode: 1,
                    errMessage:
                        "Bus type already exists, please try another Bus type",
                });
            } else if (isNaN(data.numOfSeat)) {
                resolve({
                    errCode: 5,
                    errMessage: "Number of seat must be a number",
                });
            } else {
                await db.BusType.create({
                    typeName: data.typeName.toUpperCase(),
                    numOfSeat: data.numOfSeat,
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

let deleteBusType = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let id = await db.BusType.findOne({
                where: {
                    id: data,
                },
            });
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: "The bus type was not found",
                });
            } else {
                await db.BusType.destroy({
                    where: { id: data },
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

let editBusType = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter",
                });
            }

            let busType = await db.BusType.findOne({
                where: { id: data.id },
                raw: false,
            });
            if (busType) {
                (busType.typeName = data.typeName.toUpperCase()),
                    (busType.numOfSeat = data.numOfSeat);
                await busType.save();
                resolve({
                    errCode: 0,
                    errMessage: "update bus type success",
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: "bus type not found",
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    getAllBusTypes,
    createNewBusType,
    editBusType,
    deleteBusType,
};
