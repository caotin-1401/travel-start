import db from "../models/index";
import couponService from "../services/couponService";
let getAllCoupons = async (req, res) => {
    try {
        let id = req.query.id;
        if (!id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameters",
                coupons: [],
            });
        }
        let coupons = await couponService.getAllCoupons(id);
        return res.status(200).json({
            errCode: 0,
            errMessage: "OK",
            coupons,
        });
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};
let getUseCoupons = async (req, res) => {
    try {
        let name = req.query.name;
        if (!name) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameters",
                coupons: [],
            });
        }
        let coupons = await couponService.getUseCoupons(name);
        return res.status(200).json({
            errCode: 0,
            errMessage: "OK",
            coupons,
        });
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};

let createCoupon = async (req, res) => {
    try {
        let data = await couponService.createNewCoupon(req.body);
        return res.status(200).json(data);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server ...",
        });
    }
};
let deleteCoupon = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameter",
            });
        }
        let data = await couponService.deleteCoupon(req.body.id);
        return res.status(200).json(data);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};
let editCoupon = async (req, res) => {
    try {
        let data = await couponService.editCoupon(req.body);
        return res.status(200).json(data);
    } catch (e) {
        console.error("Get all code error:", e);
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};
let useCoupon = async (req, res) => {
    try {
        let data = await couponService.useCoupon(req.body);
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
    getAllCoupons,
    createCoupon,
    deleteCoupon,
    editCoupon,
    useCoupon,
    getUseCoupons,
};
