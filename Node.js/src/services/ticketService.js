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
            await db.Ticket.bulkCreate(ticket);
            await emailService.sendEmail({
                receiversEmail: data.arrTicket[0].email,
                name: data.arrTicket[0].name,
                totalPrice: data.arrTicket[0].totalPrice,
                seatNo: result,
                busOwner: data.arrTicket[0].busOwner,
                time: data.arrTicket[0].time,
                redirectLink: `${process.env.URL_REACT}/verify-booking?token=${token}&tripId=${data.arrTicket[0].tripId}`,
            });

            resolve({
                errCode: 0,
                errMessage: "OK",
            });
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
module.exports = {
    getAllTickets,
    bulkCreateTicket,
    verifyTicket,
};
