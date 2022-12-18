import db from "../models/index";
import blogService from "../services/blogService";
let getAllBlogs = async (req, res) => {
    try {
        let id = req.query.id;
        if (!id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameters",
                blogs: [],
            });
        }
        let blogs = await blogService.getAllBlogs(id);
        return res.status(200).json({
            errCode: 0,
            errMessage: "OK",
            blogs,
        });
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};

let createNewBlog = async (req, res) => {
    try {
        let data = await blogService.createNewBlog(req.body);
        return res.status(200).json(data);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server ...",
        });
    }
};
let deleteBlog = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameter",
            });
        }
        let data = await blogService.deleteBlog(req.body.id);
        return res.status(200).json(data);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};
let editBlog = async (req, res) => {
    try {
        let data = await blogService.editBlog(req.body);
        return res.status(200).json(data);
    } catch (e) {
        console.error("Get all code error:", e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};
module.exports = {
    getAllBlogs,
    createNewBlog,
    deleteBlog,
    editBlog,
};
