import db from "../models/index";

let getAllBlogs = (blogId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let blogs = [];
            if (blogId === "ALL") {
                blogs = await db.Blog.findAll({
                    raw: false,
                    timezone: "+07:00",
                });
                blogs.reverse();
            } else if (blogId && blogId !== "ALL") {
                blogs = await db.Blog.findAll({
                    where: { id: blogId },
                });
            }
            resolve(blogs);
        } catch (e) {
            reject(e);
        }
    });
};

let createNewBlog = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let { description, image, content, contentMarkdown, author } = data;
            if (!description || !image || !content || !contentMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter",
                });
            } else {
                console.log(data);
                await db.Blog.create({
                    description,
                    image,
                    content,
                    contentMarkdown,
                    author,
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
let deleteBlog = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let id = await db.Blog.findOne({
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
                await db.Blog.destroy({
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
let editBlog = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter",
                });
            }
            let event = await db.Blog.findOne({
                where: { id: data.id },
                raw: false,
            });
            if (event) {
                event.description = data.description;
                event.content = data.content;
                event.contentMarkdown = data.contentMarkdown;
                event.image = data.image;
                event.author = data.author;
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
    getAllBlogs,
    createNewBlog,
    deleteBlog,
    editBlog,
};
