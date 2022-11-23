import busTypeService from "../services/busTypeService";

let getAllBusTypes = async (req, res) => {
    try {
        let id = req.query.id; //ALL, id
        if (!id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameters",
                busTypes: [],
            });
        }
        let busTypes = await busTypeService.getAllBusTypes(id);
        return res.status(200).json({
            errCode: 0,
            errMessage: "OK",
            busTypes,
        });
    } catch (e) {
        console.error("Get all code error:", e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};

let createNewBusTypes = async (req, res) => {
    try {
        let data = await busTypeService.createNewBusType(req.body);
        return res.status(200).json(data);
    } catch (e) {
        console.error("Get all code error:", e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};

let editBusTypes = async (req, res) => {
    try {
        let data = await busTypeService.editBusType(req.body);
        return res.status(200).json(data);
    } catch (e) {
        console.error("Get all code error:", e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};

let deleteBusTypes = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameter",
            });
        }
        let data = await busTypeService.deleteBusType(req.body.id);
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
    getAllBusTypes,
    createNewBusTypes,
    editBusTypes,
    deleteBusTypes,
};
