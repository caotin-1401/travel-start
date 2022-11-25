import db from "../models/index";

let getAllCoupons = (couponId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let coupons = [];
            if (couponId === "ALL") {
                coupons = await db.Coupon.findAll({
                    include: [
                        {
                            model: db.Event,
                            attributes: ["id", "name"],
                        },
                    ],
                    raw: true,
                    nest: true,
                });
            } else if (couponId && couponId !== "ALL") {
                coupons = await db.Coupon.findAll({
                    where: { id: couponId },
                    include: [
                        {
                            model: db.Event,
                            attributes: ["id", "name"],
                        },
                    ],
                    raw: true,
                    nest: true,
                });
            }
            resolve(coupons);
        } catch (e) {
            reject(e);
        }
    });
};
let getUseCoupons = (couponId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let coupons = [];
            coupons = await db.Coupon.findAll({
                where: { name: couponId },
                include: [
                    {
                        model: db.Event,
                        attributes: ["id"],
                    },
                ],
                raw: true,
                nest: true,
            });
            resolve(coupons);
        } catch (e) {
            reject(e);
        }
    });
};
let checkName = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(data);
            console.log(1);
            let name1 = await db.Coupon.findOne({
                where: {
                    name: data,
                },
            });
            console.log(name1);
            if (name1) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    });
};
let createNewCoupon = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let check = await checkName(data.name);
            let {
                discount,
                discountMax,
                eventId,
                name,
                description,
                descriptionMarkdown,
                type,
                startDate,
                endDate,
                count,
                use,
                sumMoneyCondition,
            } = data;
            if (
                !name ||
                !description ||
                !type ||
                !startDate ||
                !endDate ||
                !count ||
                !sumMoneyCondition
            ) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter",
                });
            } else if (check) {
                resolve({
                    errCode: 2,
                    errMessage: "Coupon already exists",
                });
            } else if (startDate >= endDate) {
                resolve({
                    errCode: 3,
                    errMessage: "Coupon already exists",
                });
            } else {
                await db.Coupon.create({
                    discount,
                    discountMax,
                    eventId,
                    name: name.toUpperCase(),
                    description,
                    descriptionMarkdown,
                    type,
                    startDate,
                    endDate,
                    count,
                    use,
                    sumMoneyCondition,
                });
                resolve({
                    errCode: 0,
                    message: "OK",
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};
let deleteCoupon = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let coupon = await db.Coupon.findOne({
                where: { id: data },
            });
            if (!coupon) {
                resolve({
                    errCode: 1,
                    errMessage: "The coupon was not found",
                });
            } else {
                await db.Coupon.destroy({
                    where: { id: data },
                });
                resolve({
                    errCode: 0,
                    errMessage: "OK",
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};
let editCoupon = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing required parameter",
                });
            } else {
                let coupon = await db.Coupon.findOne({
                    where: { id: data.id },
                    raw: false,
                });
                if (coupon) {
                    (coupon.name = data.name.toUpperCase()),
                        (coupon.description = data.description),
                        (coupon.descriptionMarkdown = data.descriptionMarkdown),
                        (coupon.type = data.type),
                        (coupon.startDate = data.startDate),
                        (coupon.endDate = data.endDate),
                        (coupon.count = data.count),
                        (coupon.sumMoneyCondition = data.sumMoneyCondition);
                    await coupon.save();
                    resolve({
                        errCode: 0,
                        errMessage: "update coupon success",
                    });
                } else {
                    resolve({
                        errCode: 1,
                        errMessage: "coupon not found",
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};

let useCoupon = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(data);
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing required parameter",
                });
            } else {
                let coupon = await db.Coupon.findOne({
                    where: { id: data.id },
                    raw: false,
                });
                console.log(coupon);
                if (coupon) {
                    if (data.use <= coupon.count) {
                        coupon.use = data.use;
                        await coupon.save();
                        resolve({
                            errCode: 0,
                            errMessage: "use Coupon success",
                        });
                    } else {
                        resolve({
                            errCode: 2,
                            errMessage: "ma giam gia da het",
                        });
                    }
                } else {
                    resolve({
                        errCode: 1,
                        errMessage: "coupon not found",
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};
module.exports = {
    getAllCoupons,
    createNewCoupon,
    deleteCoupon,
    editCoupon,
    useCoupon,
    getUseCoupons,
};
