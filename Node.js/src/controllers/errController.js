import db from "../models/index";
import errService from "../services/errService";
let getAllErr = async (req, res) => {
    try {
        let id = req.query.id;
        if (!id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameters",
                err: [],
            });
        }
        let err = await errService.getAllErr(id);
        return res.status(200).json({
            errCode: 0,
            errMessage: "OK",
            err,
        });
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};

let createNewErr = async (req, res) => {
    try {
        let data = await errService.createNewErr(req.body);
        return res.status(200).json(data);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server ...",
        });
    }
};
let deleteErr = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameter",
            });
        }
        let data = await errService.deleteErr(req.body.id);
        return res.status(200).json(data);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};

module.exports = {
    getAllErr,
    createNewErr,
    deleteErr,
};
