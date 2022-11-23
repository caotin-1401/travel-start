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
module.exports = {
    getAllTickets,
    createTicket,
    verifyTicket,
};
