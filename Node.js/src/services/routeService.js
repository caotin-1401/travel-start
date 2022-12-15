import db from "../models/index";
import { reject } from "bcrypt/promises";
import bcrypt from "bcryptjs";
let checkStart = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let name = await db.Route.findOne({
                where: {
                    areaStartId: data.areaStartId,
                    areaEndId: data.areaEndId,
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
let getAllRoutes = async (routeId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let routes = "";
            if (routeId === "ALL") {
                routes = await db.Route.findAll({
                    // attributes: {
                    //     exclude: ["image"],
                    // },
                    include: [
                        {
                            model: db.Location,
                            attributes: ["id", "name", "city"],
                            as: "from",
                        },
                        {
                            model: db.Location,
                            attributes: ["id", "name", "city"],
                            as: "to",
                        },
                    ],
                    raw: true,
                    nest: true,
                });
            }
            if (routeId && routeId !== "ALL") {
                routes = await db.Route.findAll({
                    where: { id: routeId },
                    attributes: {
                        exclude: ["image"],
                    },
                    include: [
                        {
                            model: db.Location,
                            attributes: ["id", "name", "city"],
                            as: "from",
                        },
                        {
                            model: db.Location,
                            attributes: ["id", "name", "city"],
                            as: "to",
                        },
                        {
                            model: db.Trip,
                            include: [
                                {
                                    model: db.Vehicle,
                                    attributes: ["id", "number", "busTypeId"],
                                    include: [
                                        {
                                            model: db.BusType,
                                            attributes: [
                                                "id",
                                                "typeName",
                                                "numOfSeat",
                                            ],
                                        },
                                    ],
                                },

                                {
                                    model: db.User,
                                    attributes: [
                                        "id",
                                        "name",
                                        "busOwner",
                                        "busOwnerId",
                                    ],
                                },
                            ],
                        },
                    ],
                    raw: true,
                    nest: true,
                });
            }
            // routes = routes.map((item, index) => {
            //     item.name = `${item.from.name} (${item.from.city}) - ${item.to.name} (${item.to.city})`;
            // });
            resolve(routes);
        } catch (e) {
            reject(e);
        }
    });
};

let createNewRoute = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let areaStartId = await checkStart(data);
            if (areaStartId) {
                resolve({
                    errCode: 1,
                    errMessage:
                        "Route already exists, please try another Route",
                });
            } else if (data.areaStartId === data.areaEndId) {
                resolve({
                    errCode: 2,
                    errMessage: "start and end locations must be different",
                });
            } else {
                await db.Route.create({
                    // name: `${data.areaStartId} - ${data.areaEndId}`,
                    name: data.name,
                    areaStartId: data.areaStartId,
                    areaEndId: data.areaEndId,
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

let deleteRoute = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let id = await db.Route.findOne({
                where: {
                    id: data,
                },
            });
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: "The route was not found",
                });
            } else {
                await db.Route.destroy({
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

let editRoute = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter",
                });
            }
            if (data.areaStartId === data.areaEndId) {
                resolve({
                    errCode: 1,
                    errMessage: "start and end locations must be different",
                });
            } else {
                let route = await db.Route.findOne({
                    where: { id: data.id },
                    raw: false,
                });
                if (route) {
                    (route.name = `${data.areaStartId} - ${data.areaEndId}`),
                        (route.areaStartId = data.areaStartId),
                        (route.areaEndId = data.areaEndId);

                    await route.save();
                    resolve({
                        errCode: 0,
                        errMessage: "update route success",
                    });
                } else {
                    resolve({
                        errCode: 1,
                        errMessage: "route not found",
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    getAllRoutes,
    createNewRoute,
    editRoute,
    deleteRoute,
};
