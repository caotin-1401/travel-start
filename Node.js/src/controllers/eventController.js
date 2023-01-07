import db from "../models/index";
import eventService from "../services/eventService";
let getAllEvents = async (req, res) => {
    try {
        let id = req.query.id;
        if (!id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameters",
                events: [],
            });
        }
        let events = await eventService.getAllEvents(id);
        return res.status(200).json({
            errCode: 0,
            errMessage: "OK",
            events,
        });
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};
let getAllEventsHome = async (req, res) => {
    try {
        let id = req.query.id;
        if (!id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameters",
                events: [],
            });
        }
        let events = await eventService.getAllEventsHome(id);
        return res.status(200).json({
            errCode: 0,
            errMessage: "OK",
            events,
        });
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};
let createNewEvent = async (req, res) => {
    try {
        let data = await eventService.createNewEvent(req.body);
        return res.status(200).json(data);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server ...",
        });
    }
};
let deleteEvent = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameter",
            });
        }
        let data = await eventService.deleteEvent(req.body.id);
        return res.status(200).json(data);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};
let editEvent = async (req, res) => {
    try {
        let data = await eventService.editEvent(req.body);
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
    getAllEvents,
    createNewEvent,
    deleteEvent,
    editEvent,
    getAllEventsHome,
};
