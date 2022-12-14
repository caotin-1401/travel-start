import db from "../models/index";

let getAllCity = async (locationId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let locations = "";
            if (locationId === "ALL") {
                locations = await db.Province.findAll({
                    attributes: ["id", "name"],
                });
            }

            resolve(locations);
        } catch (e) {
            reject(e);
        }
    });
};
let getAllLocations = async (locationId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let locations = "";
            if (locationId === "ALL") {
                locations = await db.Location.findAll({});
            }
            if (locationId && locationId !== "ALL") {
                locations = await db.Location.findOne({
                    where: { id: locationId },
                });
            }
            resolve(locations);
        } catch (e) {
            reject(e);
        }
    });
};
let getAllVehicleFromStation = async (locationId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let locations = "";

            locations = await db.Location.findAll({
                where: { id: locationId },
                include: [
                    {
                        model: db.Vehicle,
                        attributes: ["id", "arrivalTime", "areaEndId"],
                        as: "tovehicle",
                        include: [
                            {
                                model: db.User,
                                attributes: ["id", "name"],
                            },
                        ],
                    },
                ],
                raw: true,
                nest: true,
            });

            resolve(locations);
        } catch (e) {
            reject(e);
        }
    });
};

let checkName = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let location = await db.Location.findOne({
                where: {
                    name: data,
                },
            });
            if (location) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    });
};

let checkCity = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let location = await db.Location.findOne({
                where: {
                    city: data,
                },
            });
            if (location) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    });
};

let createNewLocations = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let name = await checkName(data.name);
            let city = await checkCity(data.city);
            if (name && city) {
                resolve({
                    errCode: 1,
                    errMessage:
                        "Location already exists, please try another Location",
                });
            } else {
                await db.Location.create({
                    name: data.name.toUpperCase(),
                    city: data.city.toUpperCase(),
                    address: data.address,
                    state: data.state,
                    status: data.status,
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

let deleteLocations = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.Location.findOne({
                where: {
                    id: data,
                },
            });
            if (!user) {
                resolve({
                    errCode: 1,
                    errMessage: "The location was not found",
                });
            } else {
                await db.Location.destroy({
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

let editLocations = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing required parameter",
                });
            }

            let location = await db.Location.findOne({
                where: { id: data.id },
                raw: false,
            });
            if (location) {
                (location.name = data.name.toUpperCase()),
                    (location.city = data.city.toUpperCase()),
                    (location.address = data.address),
                    (location.state = data.state),
                    (location.status = data.status);
                await location.save();
                resolve({
                    errCode: 0,
                    errMessage: "update location success",
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: "location not found",
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};
let getAllBusTypes = async (locationId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let locations = "";
            if (locationId === "ALL") {
                locations = await db.BusType.findAll({});
            }
            if (locationId && locationId !== "ALL") {
                locations = await db.BusType.findOne({
                    where: { id: locationId },
                });
            }
            resolve(locations);
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    getAllVehicleFromStation,
    getAllLocations,
    createNewLocations,
    deleteLocations,
    editLocations,
    getAllBusTypes,
    getAllCity,
};
