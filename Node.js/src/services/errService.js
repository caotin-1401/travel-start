import db from "../models/index";

let getAllErr = (blogId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let blogs = [];
            if (blogId === "ALL") {
                blogs = await db.Error.findAll({});
            } else if (blogId && blogId !== "ALL") {
                blogs = await db.Error.findAll({
                    where: { id: blogId },
                });
            }
            resolve(blogs);
        } catch (e) {
            reject(e);
        }
    });
};

let createNewErr = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { description } = data;
            if (!description) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter",
                });
            } else {
                await db.Error.create({
                    description,
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
let deleteErr = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let id = await db.Error.findOne({
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
                await db.Error.destroy({
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
module.exports = {
    getAllErr,
    createNewErr,
    deleteErr,
};
