import db from "../models/index";

let getAllEvents = (eventId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let events = [];
            if (eventId === "ALL") {
                events = await db.Event.findAll();
                events.reverse();
            } else if (eventId && eventId !== "ALL") {
                events = await db.Event.findAll({
                    where: { id: eventId },
                    // attributes: {
                    //     exclude: ["image"],
                    // },
                    include: [
                        {
                            model: db.Coupon,
                            attributes: [
                                "id",
                                "name",
                                "discount",
                                "discountMax",
                                "description",
                                "startDate",
                                "endDate",
                                "type",
                                "sumMoneyCondition",
                                "count",
                                "eventId",
                                "descriptionMarkdown",
                            ],
                        },
                    ],
                    raw: true,
                    nest: true,
                });
            }

            resolve(events);
        } catch (e) {
            reject(e);
        }
    });
};
let checkName = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let name = await db.Event.findOne({
                where: {
                    name: data,
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
let createNewEvent = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = await checkName(data.name);
            let {
                name,
                type,
                image,
                description,
                startDate,
                endDate,
                busOwnerId,
                descriptionMarkdown,
            } = data;
            if (
                !name ||
                !description ||
                // !type ||
                !startDate ||
                !endDate
                // ||                 !image
            ) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter",
                });
            } else if (check) {
                resolve({
                    errCode: 2,
                    errMessage: "Coupon already exists",
                });
            } else if (+startDate >= +endDate) {
                resolve({
                    errCode: 3,
                    errMessage: "Coupon already exists",
                });
            } else {
                await db.Event.create({
                    name,
                    type,
                    description,
                    image,
                    startDate,
                    endDate,
                    busOwnerId,
                    descriptionMarkdown,
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
let deleteEvent = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let id = await db.Event.findOne({
                where: {
                    id: data,
                },
            });
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: "The event was not found",
                });
            } else {
                await db.Event.destroy({
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
let editEvent = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter",
                });
            }
            let event = await db.Event.findOne({
                where: { id: data.id },
                raw: false,
            });
            if (event) {
                event.name = data.name;
                event.type = data.type;
                event.description = data.description;
                event.descriptionMarkdown = data.descriptionMarkdown;
                event.startDate = data.startDate;
                event.endDate = data.endDate;
                event.image = data.image;
                await event.save();
                resolve({
                    errCode: 0,
                    errMessage: "update event success",
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: "event not found",
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};
module.exports = {
    getAllEvents,
    createNewEvent,
    deleteEvent,
    editEvent,
};
