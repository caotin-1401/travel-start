import locationService from "../services/locationService";

let getAllLocations = async (req, res) => {
    try {
        let id = req.query.id; //ALL, id
        if (!id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameters",
                locations: [],
            });
        }
        let locations = await locationService.getAllLocations(id);
        return res.status(200).json({
            errCode: 0,
            errMessage: "OK",
            locations,
        });
    } catch (e) {
        console.error("Get all code error:", e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};

let getAllCity = async (req, res) => {
    try {
        let id = req.query.id; //ALL, id
        if (!id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameters",
                citys: [],
            });
        }
        let citys = await locationService.getAllCity(id);
        return res.status(200).json({
            errCode: 0,
            errMessage: "OK",
            citys,
        });
    } catch (e) {
        console.error("Get all code error:", e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};

let getAllVehicleFromStation = async (req, res) => {
    try {
        let id = req.query.id; //ALL, id
        if (!id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameters",
                locations: [],
            });
        }
        let locations = await locationService.getAllVehicleFromStation(id);
        return res.status(200).json({
            errCode: 0,
            errMessage: "OK",
            locations,
        });
    } catch (e) {
        console.error("Get all code error:", e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};

let handleCreateNewLocations = async (req, res) => {
    try {
        let data = await locationService.createNewLocations(req.body);
        return res.status(200).json(data);
    } catch (e) {
        console.error("Get all code error:", e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};

let handleEditLocations = async (req, res) => {
    try {
        let data = await locationService.editLocations(req.body);
        return res.status(200).json(data);
    } catch (e) {
        console.error("Get all code error:", e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};

let deleteLocations = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameter",
            });
        }
        let data = await locationService.deleteLocations(req.body.id);
        return res.status(200).json(data);
    } catch (e) {
        console.error("Get all code error:", e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};
let getAllBusTypes = async (req, res) => {
    try {
        let id = req.query.id; //ALL, id
        if (!id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameters",
                users: [],
            });
        }
        let locations = await locationService.getAllBusTypes(id);
        return res.status(200).json({
            errCode: 0,
            errMessage: "OK",
            locations,
        });
    } catch (e) {
        console.error("Get all code error:", e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};

module.exports = {
    getAllCity,
    getAllLocations,
    getAllVehicleFromStation,
    handleCreateNewLocations,
    handleEditLocations,
    deleteLocations,
    getAllBusTypes,
};
