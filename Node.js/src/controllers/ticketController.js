import db from "../models/index";
import ticketService from "../services/ticketService";
let getAllTickets = async (req, res) => {
    try {
        let id = req.query.id;
        if (!id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameter",
                tickets: [],
            });
        }
        let tickets = await ticketService.getAllTickets(id);

        return res.status(200).json({
            errCode: 0,
            errMessage: "OK",
            tickets,
        });
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};
let getDriverTicket = async (req, res) => {
    try {
        let driverId = req.query.driverId;
        let dayStart = req.query.dayStart;
        if (!driverId) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameter",
                tickets: [],
            });
        }
        let tickets = await ticketService.getDriverTicket(driverId, dayStart);

        return res.status(200).json({
            errCode: 0,
            errMessage: "OK",
            tickets,
        });
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};
let getUserTicket = async (req, res) => {
    try {
        let id = req.query.id;
        if (!id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameter",
                tickets: [],
            });
        }
        let tickets = await ticketService.getUserTicket(id);

        return res.status(200).json({
            errCode: 0,
            errMessage: "OK",
            tickets,
        });
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};
let getDriverTicketRoute = async (req, res) => {
    try {
        let driverId = req.query.driverId;
        let dayStart = req.query.dayStart;
        let routeId = req.query.tripId;
        if (!driverId || !dayStart || !routeId) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameter",
                tickets: [],
            });
        }
        let tickets = await ticketService.getDriverTicketRoute(
            driverId,
            dayStart,
            routeId
        );

        return res.status(200).json({
            errCode: 0,
            errMessage: "OK",
            tickets,
        });
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};
let createTicket = async (req, res) => {
    try {
        let response = await ticketService.bulkCreateTicket(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server ...",
        });
    }
};

let verifyTicket = async (req, res) => {
    try {
        let response = await ticketService.verifyTicket(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server ...",
        });
    }
};
let cancelTicket = async (req, res) => {
    try {
        let response = await ticketService.cancelTicket(req.body);
        return res.status(200).json(response);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server ...",
        });
    }
};
let checkCustomerIsPresent = async (req, res) => {
    try {
        let data = await ticketService.checkCustomerIsPresent(req.body);
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
    getAllTickets,
    createTicket,
    verifyTicket,
    getDriverTicket,
    checkCustomerIsPresent,
    getDriverTicketRoute,
    getUserTicket,
    cancelTicket,
};
