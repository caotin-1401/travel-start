import db from "../models/index";
import { reject } from "bcrypt/promises";
import _ from "lodash";
import emailService from "./emailService";
import { v4 as uuidv4 } from "uuid";
require("dotenv").config();

let getAllTickets = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (id === "ALL") {
                let ticket = await db.Ticket.findAll({
                    include: [
                        {
                            model: db.Trip,
                            attributes: [
                                "id",
                                "timeStart",
                                "areaStart",
                                "routeId",
                                "busId",
                                "busOwnerId",
                            ],
                        },
                        {
                            model: db.User,
                            attributes: ["id", "email", "name", "phoneNumber"],
                        },
                    ],
                    raw: true,
                    nest: true,
                });

                resolve(ticket);
            }
            if (tripId && tripId !== "ALL") {
                let bus = await db.Ticket.findOne({
                    where: { id: tripId },
                    include: [
                        {
                            model: db.Trip,
                            attributes: [
                                "id",
                                "timeStart",
                                "areaStart",
                                "routeId",
                                "busId",
                                "busOwnerId",
                            ],
                        },
                        {
                            model: db.User,
                            attributes: ["id", "email", "name", "phoneNumber"],
                        },
                    ],
                    raw: true,
                    nest: true,
                });

                resolve(bus);
            }
        } catch (e) {
            reject(e);
        }
    });
};
let getDriverTicket = (id, dayStart) => {
    return new Promise(async (resolve, reject) => {
        try {
            let bus = await db.Ticket.findAll({
                where: { driverId: id, dayStart: dayStart },
                include: [
                    {
                        model: db.Trip,
                        attributes: [
                            "id",
                            "timeStart",
                            "timeEnd",
                            "areaStart",
                            "areaEnd",
                            "routeId",
                            "busId",
                            "busOwnerId",
                        ],
                        include: [
                            {
                                model: db.Vehicle,
                                attributes: ["number"],
                            },
                        ],
                    },
                ],
                raw: true,
                nest: true,
            });
            resolve(bus);
        } catch (e) {
            reject(e);
        }
    });
};
let getUserTicket = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let bus = await db.Ticket.findAll({
                where: { userId: id },
                include: [
                    {
                        model: db.Trip,
                        attributes: [
                            "id",
                            "timeStart",
                            "timeEnd",
                            "areaStart",
                            "areaEnd",
                            "routeId",
                            "busId",
                            "busOwnerId",
                        ],
                        include: [
                            {
                                model: db.Vehicle,
                                attributes: ["number"],
                            },
                        ],
                    },
                ],
                raw: true,
                nest: true,
            });
            resolve(bus);
        } catch (e) {
            reject(e);
        }
    });
};
let getDriverTicketRoute = (id, dayStart, tripId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let bus = await db.Ticket.findAll({
                where: { driverId: id, dayStart: dayStart, tripId: tripId },
                include: [
                    {
                        model: db.Trip,
                        attributes: [
                            "id",
                            "timeStart",
                            "timeEnd",
                            "areaStart",
                            "areaEnd",
                            "routeId",
                            "busId",
                            "busOwnerId",
                            "status",
                        ],
                        include: [
                            {
                                model: db.Vehicle,
                                attributes: ["number", "status"],
                            },
                        ],
                    },
                ],
                raw: true,
                nest: true,
            });
            resolve(bus);
        } catch (e) {
            reject(e);
        }
    });
};
let getAllRouteFromDateDriver = (id, dayStart) => {
    return new Promise(async (resolve, reject) => {
        try {
            let bus = await db.Trip.findAll({
                where: { driverId: id, dateStart: dayStart },
                include: [
                    {
                        model: db.Vehicle,
                        attributes: ["id", "number", "busTypeId"],
                    },
                    {
                        model: db.User,
                        attributes: ["id"],
                        include: [
                            {
                                model: db.Driver,
                                attributes: ["status", "driverId"],
                            },
                        ],
                    },
                ],
                raw: true,
                nest: true,
            });
            resolve(bus);
        } catch (e) {
            reject(e);
        }
    });
};
let bulkCreateTicket = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let result = [];
            let ticket = data.arrTicket;
            ticket &&
                ticket.length > 0 &&
                ticket.forEach((item) => result.push(item.seatNo));

            let token = uuidv4();
            ticket = ticket.map((item) => ({
                ...item,
                token: token,
            }));

            let compare = [];
            if (ticket && ticket.length > 0) {
                ticket.map((item) => {
                    let obj = {};
                    obj.seatNo = item.seatNo;
                    obj.dayStart = item.dayStart;
                    obj.tripId = item.tripId;
                    compare.push(obj);
                });
            }

            var existing = await db.Ticket.findAll({
                where: {
                    tripId: compare[0].tripId,
                },
                raw: true,
            });
            let compare1 = [];
            if (existing && existing.length > 0) {
                existing.map((item) => {
                    let obj = {};
                    obj.seatNo = item.seatNo;
                    obj.dayStart = item.dayStart;
                    obj.tripId = item.tripId;
                    compare1.push(obj);
                });
            }

            let toCreate = _.differenceWith(compare, compare1, _.isEqual);
            if (compare.length == toCreate.length) {
                await db.Ticket.bulkCreate(ticket);

                await emailService.sendEmail({
                    receiversEmail: data.arrTicket[0].email,
                    name: data.arrTicket[0].name,
                    totalPrice: data.arrTicket[0].totalPrice,
                    seatNo: result,
                    station: data.arrTicket[0].station,
                    address: data.arrTicket[0].address,
                    busOwner: data.arrTicket[0].busOwner,
                    time: data.arrTicket[0].time,
                    redirectLink: `${process.env.URL_REACT}/verify-booking?token=${token}&tripId=${data.arrTicket[0].tripId}`,
                });

                resolve({
                    errCode: 0,
                    errMessage: "OK",
                });
            } else {
                resolve({
                    errCode: 5,
                    errMessage: "OK",
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let verifyTicket = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.tripId) {
                resolve({
                    errMessage: "Missing parameters",
                });
            } else {
                var appointment = await db.Ticket.findAll({
                    where: {
                        tripId: data.tripId,
                        token: data.token,
                        status: "S1",
                    },
                    attributes: ["id", "tripId", "token"],
                    raw: false,
                });
                appointment && appointment.length > 0
                    ? appointment.forEach(async (item) => {
                          item.status = "S2";
                          await item.save();
                          resolve({
                              errCode: 0,
                              errMessage: "Update the appointment success",
                          });
                      })
                    : resolve({
                          errCode: 2,
                          errMessage:
                              "appointment has been activated or not exist",
                      });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let cancelTicket = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.tripId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameters",
                });
            } else {
                var appointment = await db.Ticket.findAll({
                    where: {
                        tripId: data.tripId,
                        token: data.token,
                        // status: "S1",
                    },
                    attributes: ["id", "tripId", "token"],
                    raw: false,
                });
                appointment && appointment.length > 0
                    ? appointment.forEach(async (item) => {
                          item.status = "S4";
                          await item.save();
                          resolve({
                              errCode: 0,
                              errMessage: "Update the appointment success",
                          });
                      })
                    : resolve({
                          errCode: 2,
                          errMessage:
                              "appointment has been activated or not exist",
                      });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let checkCustomerIsPresent = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let ticket = await db.Ticket.findAll({
                where: {
                    token: data.token,
                    tripId: data.tripId,
                },
                attributes: ["id", "tripId", "token", "isPresent"],
                raw: false,
            });
            ticket && ticket.length > 0
                ? ticket.forEach(async (item) => {
                      item.isPresent = 1;
                      await item.save();
                      resolve({
                          errCode: 0,
                          errMessage: "Update the appointment success",
                      });
                  })
                : resolve({
                      errCode: 2,
                      errMessage: "appointment has been activated or not exist",
                  });
        } catch (e) {
            reject(e);
        }
    });
};
let deleteTicket = async (tripId, token) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!token || !tripId) {
                resolve({ errCode: 1, errMessage: "Missing parameters" });
            } else {
                var ticket = await db.Ticket.findAll({
                    where: {
                        tripId: tripId,
                        token: token,
                    },
                    raw: false,
                });
                if (!ticket) {
                    resolve({
                        errCode: 2,
                        errMessage: `The user isn't exist`,
                    });
                } else {
                    await db.Ticket.destroy({
                        where: {
                            tripId: tripId,
                            token: token,
                        },
                    });
                    resolve({
                        errCode: 0,
                        errMessage: "The user is delete",
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};
let sendTickets = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.token || !data.tripId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing parameters",
                });
            } else {
                var appointment = await db.Ticket.findAll({
                    where: {
                        tripId: data.tripId,
                        token: data.token,
                        status: "S2",
                    },
                    attributes: ["id", "tripId", "token"],
                    raw: false,
                });

                if (appointment) {
                    await emailService.sendAttachment({
                        receiversEmail: data.email,
                        name: data.name,
                        img: data.img,
                    });
                }
                appointment && appointment.length > 0
                    ? appointment.forEach(async (item) => {
                          item.status = "S3";
                          await item.save();
                          resolve({
                              errCode: 0,
                              errMessage: "Update the appointment success",
                          });
                      })
                    : resolve({
                          errCode: 2,
                          errMessage:
                              "appointment has been activated or not exist",
                      });
            }
        } catch (e) {
            reject(e);
        }
    });
};
module.exports = {
    sendTickets,
    deleteTicket,
    getAllTickets,
    bulkCreateTicket,
    verifyTicket,
    getDriverTicket,
    checkCustomerIsPresent,
    getDriverTicketRoute,
    getUserTicket,
    cancelTicket,
    getAllRouteFromDateDriver,
};
