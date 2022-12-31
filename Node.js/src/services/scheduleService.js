import db from "../models/index";
import _ from "lodash";
import { reject } from "bcrypt/promises";
import bcrypt from "bcryptjs";
const { Op } = require("sequelize");
import moment from "moment";
import localization from "moment/locale/vi";
let checkDateStartDriver = (routeId, dayStart, driverId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let driver = await db.Trip.findOne({
                where: {
                    routeId: routeId,
                    dateEnd: dayStart,
                    driverId: driverId,
                },
            });
            if (driver) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    });
};
let checkDateStartBus = (routeId, dayStart, busId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let driver = await db.Trip.findOne({
                where: {
                    routeId: routeId,
                    dateEnd: dayStart,
                    busId: busId,
                },
            });
            if (driver) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    });
};

let checkBusTime1 = (routeId, busId, dateStart, timeStart, timeEnd) => {
    return new Promise(async (resolve, reject) => {
        try {
            let driver = await db.Trip.findOne({
                where: {
                    routeId: routeId,
                    busId: busId,
                    dateStart: dateStart,
                    [Op.or]: [
                        {
                            timeStart: {
                                [Op.between]: [+timeStart, +timeEnd],
                            },
                        },
                        {
                            timeEnd: {
                                [Op.between]: [+timeStart, +timeEnd],
                            },
                        },
                    ],
                },
            });
            if (driver) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    });
};
let checkBusTime2 = (routeId, busId, dateStart, timeStart, timeEnd) => {
    return new Promise(async (resolve, reject) => {
        try {
            let day1 = moment(dateStart).format("L");
            let time1 = moment(timeStart).format("LT");
            let time2 = moment(timeEnd).format("LT");

            let [day, month, year] = day1.split("/");

            let [hours1, minutes1] = time1.split(":");
            let [hours2, minutes2] = time2.split(":");

            if (hours1 >= 12) {
                let timeCheckStart1 = new Date(
                    +year,
                    month - 1,
                    +day,
                    +hours1 - (+hours2 - +hours1 + 1) * 2,
                    +minutes1
                );
                let unixTimestamp1 = Math.floor(timeCheckStart1.getTime());
                let driver = await db.Trip.findOne({
                    where: {
                        routeId: routeId,
                        busId: busId,
                        dateStart: dateStart,
                        timeStart: {
                            [Op.gt]: unixTimestamp1,
                        },
                    },
                });
                if (driver) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            } else {
                let timeCheckStart2 = new Date(
                    +year,
                    month - 1,
                    +day,
                    +hours1 + (+hours2 - +hours1 + 1) * 2,
                    +minutes1
                );
                let unixTimestamp2 = Math.floor(timeCheckStart2.getTime());
                let driver = await db.Trip.findOne({
                    where: {
                        routeId: routeId,
                        busId: busId,
                        dateStart: dateStart,
                        timeStart: {
                            [Op.lt]: unixTimestamp2,
                        },
                    },
                });
                if (driver) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};
let checkDriverTime1 = (routeId, driverId, dateStart, timeStart, timeEnd) => {
    return new Promise(async (resolve, reject) => {
        try {
            let driver = await db.Trip.findOne({
                where: {
                    routeId: routeId,
                    driverId: driverId,
                    dateStart: dateStart,
                    [Op.or]: [
                        {
                            timeStart: {
                                [Op.between]: [+timeStart, +timeEnd],
                            },
                        },
                        {
                            timeEnd: {
                                [Op.between]: [+timeStart, +timeEnd],
                            },
                        },
                    ],
                },
            });
            if (driver) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    });
};
let checkDriverTime2 = (routeId, driverId, dateStart, timeStart, timeEnd) => {
    return new Promise(async (resolve, reject) => {
        try {
            let day1 = moment(dateStart).format("L");
            let time1 = moment(timeStart).format("LT");
            let time2 = moment(timeEnd).format("LT");

            let [day, month, year] = day1.split("/");

            let [hours1, minutes1] = time1.split(":");
            let [hours2, minutes2] = time2.split(":");

            if (hours1 >= 12) {
                let timeCheckStart1 = new Date(
                    +year,
                    month - 1,
                    +day,
                    +hours1 - (+hours2 - +hours1 + 1) * 2,
                    +minutes1
                );
                let unixTimestamp1 = Math.floor(timeCheckStart1.getTime());
                let driver = await db.Trip.findOne({
                    where: {
                        routeId: routeId,
                        driverId: driverId,
                        dateStart: dateStart,
                        timeStart: {
                            [Op.gt]: unixTimestamp1,
                        },
                    },
                });
                if (driver) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            } else {
                let timeCheckStart2 = new Date(
                    +year,
                    month - 1,
                    +day,
                    +hours1 + (+hours2 - +hours1 + 1) * 2,
                    +minutes1
                );
                let unixTimestamp2 = Math.floor(timeCheckStart2.getTime());
                let driver = await db.Trip.findOne({
                    where: {
                        routeId: routeId,
                        driverId: driverId,
                        dateStart: dateStart,
                        timeStart: {
                            [Op.lt]: unixTimestamp2,
                        },
                    },
                });
                if (driver) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};
let getAllSchedule = (tripId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (tripId === "ALL") {
                let trip = await db.Trip.findAll({
                    include: [
                        {
                            model: db.Vehicle,
                            attributes: ["id", "number", "busTypeId"],
                            include: [
                                {
                                    model: db.BusType,
                                    attributes: ["id", "typeName", "numOfSeat"],
                                },
                            ],
                        },
                        {
                            model: db.Route,
                            attributes: ["id", "name", "areaStartId", "areaEndId"],
                        },
                        {
                            model: db.User,
                            attributes: ["id", "name"],
                            include: [
                                {
                                    model: db.Driver,
                                },
                            ],
                        },
                    ],
                    raw: true,
                    nest: true,
                });
                trip.map((item) => {
                    item.maxNumber = item.Vehicle.BusType.numOfSeat;
                });
                resolve(trip);
            }
            if (tripId && tripId !== "ALL") {
                let bus = await db.Trip.findOne({
                    where: { id: tripId },
                    include: [
                        {
                            model: db.Vehicle,
                            attributes: ["id", "number", "busTypeId"],
                            include: [
                                {
                                    model: db.BusType,
                                    attributes: ["id", "typeName", "numOfSeat"],
                                },
                            ],
                        },
                        {
                            model: db.Route,
                            attributes: ["id", "name", "areaStartId", "areaEndId"],
                        },
                        {
                            model: db.User,
                            attributes: ["id", "name", "busOwner"],
                        },
                    ],
                    raw: true,
                    nest: true,
                });
                if (bus && bus.image) {
                    bus.image = Buffer.from(bus.image, "base64").toString("binary");
                }
                resolve(bus);
            }
        } catch (e) {
            reject(e);
        }
    });
};
let getDriverTrips = (tripId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let trip = await db.Trip.findAll({
                where: { driverId: tripId },
                include: [
                    {
                        model: db.Vehicle,
                        attributes: ["id", "number", "busTypeId"],
                    },
                ],
                raw: false,
                nest: true,
            });
            trip = _.sortBy(trip, ["timeStart"]);
            console.log(trip);
            resolve(trip);
        } catch (e) {
            reject(e);
        }
    });
};
let getTripsFromBusCompany = (tripId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let trip = await db.Trip.findAll({
                where: { busOwnerId: tripId },
                include: [
                    {
                        model: db.User,
                        attributes: ["id", "name"],
                    },
                    {
                        model: db.Ticket,
                        attributes: ["id", "token", "totalPrice"],
                    },
                ],
                raw: false,
                nest: true,
            });
            trip = _.sortBy(trip, ["timeStart"]);
            console.log(trip);
            resolve(trip);
        } catch (e) {
            reject(e);
        }
    });
};
let getTripsFromCompany = (busOwnerId, driverId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let trip = await db.Driver.findAll({
                where: { busOwnerId: busOwnerId },
                include: [
                    {
                        model: db.User,
                        attributes: ["id", "name"],
                        include: [
                            {
                                model: db.Trip,
                                attributes: ["timeStart", "timeEnd"],
                                include: [
                                    {
                                        model: db.Ticket,
                                        attributes: ["id", "token", "totalPrice"],
                                    },
                                ],
                            },
                        ],
                    },
                ],
                raw: false,
                nest: true,
            });
            trip = _.sortBy(trip, ["id"]);
            resolve(trip);
        } catch (e) {
            reject(e);
        }
    });
};
let getAllSchedules = (areaStart, areaEnd, dateStart) => {
    return new Promise(async (resolve, reject) => {
        try {
            let trip = await db.Trip.findAll({
                where: {
                    areaStart: areaStart,
                    areaEnd: areaEnd,
                    dateStart: dateStart,
                },
                include: [
                    {
                        model: db.Vehicle,
                        attributes: ["id", "number", "busTypeId", "image"],
                        include: [
                            {
                                model: db.BusType,
                                attributes: ["id", "typeName", "numOfSeat"],
                            },
                        ],
                    },
                    {
                        model: db.Route,
                        attributes: ["id", "name", "areaStartId", "areaEndId"],
                        include: [
                            {
                                model: db.Location,
                                attributes: ["address", "name"],
                                as: "from",
                            },
                        ],
                    },
                    {
                        model: db.User,
                        attributes: ["id", "name"],
                        include: [{ model: db.Driver }],
                    },
                ],
                raw: true,
                nest: true,
            });

            trip.map((item) => {
                item.maxNumber = item.Vehicle.BusType.numOfSeat;
            });
            resolve(trip);
        } catch (e) {
            reject(e);
        }
    });
};
let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let {
                routeId,
                driverId,
                busId,
                dayStart,
                dayEnd,
                unixTimestamp1,
                unixTimestamp2,
                price,
                areaStartId,
                areaEndId,
                busOwnerId,
            } = data;
            if (!routeId || !driverId || !busId || !unixTimestamp1 || !unixTimestamp2) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter",
                });
            } else if (dayStart !== dayEnd) {
                let isDayDriverStart = await checkDateStartDriver(routeId, dayStart, driverId);
                let isDayBusStart = await checkDateStartBus(routeId, dayStart, busId);
                if (isDayDriverStart) {
                    resolve({
                        errCode: 1,
                        errMessage: "The current driver is not available at the starting point",
                    });
                } else if (isDayBusStart) {
                    resolve({
                        errCode: 1,
                        errMessage: "The current vehicle is not available at the starting point",
                    });
                } else {
                    await db.Trip.create({
                        routeId,
                        driverId,
                        busId,
                        dateStart: dayStart,
                        dateEnd: dayEnd,
                        timeStart: unixTimestamp1,
                        timeEnd: unixTimestamp2,
                        price,
                        areaStart: areaStartId,
                        areaEnd: areaEndId,
                        busOwnerId,
                        status: 1,
                    });
                }
                resolve({
                    errCode: 0,
                    errMessage: "OK",
                });
            } else {
                let isCheckBusOut = await checkBusTime1(routeId, busId, dayStart, unixTimestamp1, unixTimestamp2);
                let isCheckBusIn = await checkBusTime2(routeId, busId, dayStart, unixTimestamp1, unixTimestamp2);
                let isCheckDriverOut = await checkDriverTime1(
                    routeId,
                    driverId,
                    dayStart,
                    unixTimestamp1,
                    unixTimestamp2
                );
                let isCheckDriverIn = await checkDriverTime2(
                    routeId,
                    driverId,
                    dayStart,
                    unixTimestamp1,
                    unixTimestamp2
                );
                if (isCheckBusOut) {
                    resolve({
                        errCode: 1,
                        errMessage: "vehicle in operation",
                    });
                } else if (isCheckBusIn) {
                    resolve({
                        errCode: 1,
                        errMessage: "The current vehicle is not available at the starting point",
                    });
                } else if (isCheckDriverOut) {
                    resolve({
                        errCode: 1,
                        errMessage: "driver is running",
                    });
                } else if (isCheckDriverIn) {
                    resolve({
                        errCode: 1,
                        errMessage: "The current driver is not available at the starting point",
                    });
                } else {
                    await db.Trip.create({
                        routeId,
                        driverId,
                        busId,
                        dateStart: data.dayStart,
                        dateEnd: data.dayEnd,
                        timeStart: data.unixTimestamp1,
                        timeEnd: data.unixTimestamp2,
                        price,
                        areaStart: areaStartId,
                        areaEnd: areaEndId,
                        busOwnerId,
                        status: 1,
                    });
                    resolve({
                        errCode: 0,
                        errMessage: "OK",
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};
let deleteSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let delId = await db.Trip.findOne({
                where: {
                    id: data.id,
                },
            });

            if (!delId) {
                resolve({
                    errCode: 1,
                    errMessage: "The trip was not found",
                });
            } else {
                await db.Trip.destroy({
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
let handleStartTrip = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let trip = await db.Trip.findOne({
                where: {
                    id: data.id,
                    status: 1,
                },
                raw: false,
            });
            if (trip) {
                trip.status = 2;

                await trip.save();
                resolve({
                    errCode: 0,
                    message: "update trip success",
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: "trip not found",
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};
let handleEndTrip = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let trip = await db.Trip.findOne({
                where: {
                    id: data.id,
                    status: 2,
                },
                raw: false,
            });
            if (trip) {
                trip.status = 3;

                await trip.save();
                resolve({
                    errCode: 0,
                    message: "update trip success",
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: "trip not found",
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    getAllSchedule,
    getAllSchedules,
    bulkCreateSchedule,
    deleteSchedule,
    handleEndTrip,
    handleStartTrip,
    getDriverTrips,
    getTripsFromBusCompany,
    getTripsFromCompany,
};
