import busService from "../services/busService";

let getAllBus = async (req, res) => {
    try {
        let id = req.query.id;
        if (!id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameter",
                vehicles: [],
            });
        }
        let vehicles = await busService.getAllBus(id);

        return res.status(200).json({
            errCode: 0,
            errMessage: "OK",
            vehicles,
        });
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};

let createNewBus = async (req, res) => {
    try {
        let data = await busService.createNewBus(req.body);
        return res.status(200).json(data);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};

let editBus = async (req, res) => {
    try {
        let data = await busService.editBus(req.body);
        return res.status(200).json(data);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};

let deleteBus = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameter",
            });
        }
        let data = await busService.deleteBus(req.body);
        return res.status(200).json(data);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};
let handleVehicleStartTrip = async (req, res) => {
    try {
        let id = req.body.id;
        let data = req.body;
        if (!id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameter",
            });
        }
        let message = await busService.handleVehicleStartTrip(data);
        return res.status(200).json(message);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};
let handleVehicleEndTrip = async (req, res) => {
    try {
        let id = req.body.id;
        let data = req.body;
        if (!id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameter",
            });
        }
        let message = await busService.handleVehicleEndTrip(data);
        return res.status(200).json(message);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};
module.exports = {
    handleVehicleStartTrip,
    handleVehicleEndTrip,
    getAllBus,
    createNewBus,
    editBus,
    deleteBus,
};
