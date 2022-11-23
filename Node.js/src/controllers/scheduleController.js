import db from "../models/index";
import scheduleService from "../services/scheduleService";
import busService from "../services/busService";
let getAllSchedule = async (req, res) => {
    try {
        let id = req.query.id;
        if (!id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameter",
                trips: [],
            });
        }
        let trips = await scheduleService.getAllSchedule(id);

        return res.status(200).json({
            errCode: 0,
            errMessage: "OK",
            trips,
        });
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};
let shouldAllSchedule = async (req, res) => {
    try {
        let areaStartId = req.query.areaStartId;
        let areaEndId = req.query.areaEndId;
        let dateStart = req.query.dateStart;
        if (!areaStartId || !areaEndId || !dateStart) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameter",
                trips: [],
            });
        }
        let trips = await scheduleService.getAllSchedules(
            areaStartId,
            areaEndId,
            dateStart
        );

        return res.status(200).json({
            errCode: 0,
            errMessage: "OK",
            trips,
        });
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};
let createSchedule = async (req, res) => {
    try {
        let response = await scheduleService.bulkCreateSchedule(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server ...",
        });
    }
};
let deleteSchedule = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameter",
            });
        }
        let data = await scheduleService.deleteSchedule(req.body);
        return res.status(200).json(data);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};
module.exports = {
    getAllSchedule,
    createSchedule,
    deleteSchedule,
    shouldAllSchedule,
};
