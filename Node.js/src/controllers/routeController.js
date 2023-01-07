import routeService from "../services/routeService";

let getAllRoutes = async (req, res) => {
    try {
        let id = req.query.id; //ALL, id
        if (!id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameters",
                routes: [],
            });
        }
        let routes = await routeService.getAllRoutes(id);
        return res.status(200).json({
            errCode: 0,
            errMessage: "OK",
            routes,
        });
    } catch (e) {
        console.error("Get all code error:", e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};
let getAllRoutesHome = async (req, res) => {
    try {
        let id = req.query.id; //ALL, id
        if (!id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameters",
                routes: [],
            });
        }
        let routes = await routeService.getAllRoutesHome(id);
        return res.status(200).json({
            errCode: 0,
            errMessage: "OK",
            routes,
        });
    } catch (e) {
        console.error("Get all code error:", e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};
let createNewRoute = async (req, res) => {
    try {
        if (!req.body.areaStartId || !req.body.areaEndId) {
            return res.status(200).json({
                errCode: 2,
                errMessage: "Misssing",
            });
        }
        let data = await routeService.createNewRoute(req.body);
        return res.status(200).json(data);
    } catch (e) {
        console.error("Get all code error:", e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};

let editRoute = async (req, res) => {
    try {
        let data = await routeService.editRoute(req.body);
        return res.status(200).json(data);
    } catch (e) {
        console.error("Get all code error:", e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};

let deleteRoute = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameter",
            });
        }
        let data = await routeService.deleteRoute(req.body.id);
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
    getAllRoutes,
    createNewRoute,
    editRoute,
    deleteRoute,
    getAllRoutesHome,
};
