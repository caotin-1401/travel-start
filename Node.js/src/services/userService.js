import db from "../models/index";
import { reject } from "bcrypt/promises";
import bcrypt from "bcryptjs";
import _ from "lodash";
import emailService from "./emailService";
import { v4 as uuidv4 } from "uuid";
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
var salt = bcrypt.genSaltSync(10);
let checkUserEmailAdmin = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail },
            });
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    });
};
let checkPhoneAdmin = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(userEmail);
            let user = await db.User.findOne({
                where: { phoneNumber: userEmail },
            });
            console.log(user);
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    });
};
let checkEmailPassenger = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(userEmail);
            let passenger = await db.Passenger.findOne({
                where: { email: userEmail },
            });
            console.log(passenger);
            if (passenger) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    });
};
let checkPhonePassenger = (phone) => {
    return new Promise(async (resolve, reject) => {
        try {
            let passenger = await db.Passenger.findOne({
                where: { phoneNumber: phone },
            });
            if (passenger) {
                resolve(true);
            } else {
                resolve(false);
            }
        } catch (e) {
            reject(e);
        }
    });
};
var emailRegex =
    /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

function isEmailValid(email) {
    if (!email) return false;

    if (email.length > 254) return false;

    var valid = emailRegex.test(email);
    if (!valid) return false;

    // Further checking of some things regex can't handle
    var parts = email.split("@");
    if (parts[0].length > 64) return false;

    var domainParts = parts[1].split(".");
    if (
        domainParts.some(function (part) {
            return part.length > 63;
        })
    )
        return false;

    return true;
}

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            var hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    });
};

let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let user = await db.User.findOne({
                attributes: ["id", "email", "roleID", "password", "name"],
                where: { [Op.or]: [{ email: email }, { phoneNumber: email }] },
                raw: true,
            });
            let passenger = await db.Passenger.findOne({
                where: { [Op.or]: [{ email: email }, { phoneNumber: email }] },
                attributes: ["id", "email", "roleID", "password", "name"],
                raw: true,
            });
            if (user) {
                let check = await bcrypt.compareSync(password, user.password); // false
                if (check) {
                    userData.errCode = 0;
                    userData.errMessage = "OK";
                    delete user.password;
                    userData.user = user;
                } else {
                    userData.errCode = 3;
                    userData.errMessage = "Wrong Password";
                }
            } else if (passenger) {
                let check = await bcrypt.compareSync(password, passenger.password); // false
                if (check) {
                    userData.errCode = 0;
                    userData.errMessage = "OK";
                    delete passenger.password;
                    userData.user = passenger;
                } else {
                    userData.errCode = 3;
                    userData.errMessage = "Wrong Password";
                }
            } else {
                //return error
                userData.errCode = 2;
                userData.errMessage = "User does not exist";
            }

            resolve(userData);
        } catch (e) {
            reject(e);
        }
    });
};

let createNewUserByRegister = (email, password, confirmPassword, phoneNumber) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let check = await checkEmailPassenger(email);
            let checkPhone = await checkPhonePassenger(phoneNumber);
            if (check) {
                resolve({
                    errCode: 1,
                    errMessage: "Your email already exists, please try another email",
                });
            } else if (checkPhone) {
                resolve({
                    errCode: 6,
                    errMessage: "Your email already exists, please try another email",
                });
            } else if (!email || !password || !confirmPassword) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing parameters",
                });
            } else if (password !== confirmPassword) {
                resolve({
                    errCode: 4,
                    errMessage: "Comfirm Passwords must be same as password",
                });
            } else if (password.trim().length < 8) {
                resolve({
                    errCode: 4,
                    errMessage: "Password must be at least 8 characters",
                });
            } else if (!isEmailValid(email)) {
                resolve({
                    errCode: 5,
                    errMessage: "Invalid mail address",
                });
            } else {
                let hashPasswordFromBcrypt = await hashUserPassword(password);
                let user = await db.Passenger.create({
                    email: email,
                    name: name,
                    password: hashPasswordFromBcrypt,
                    roleID: "R4",
                });
                userData.errCode = 0;
                userData.errMessage = "OK";
                delete user.password;
                userData.user = user;
            }

            resolve(userData);
        } catch (e) {
            reject(e);
        }
    });
};

let getAllPassengersTicket = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = "";
            let user = "";
            if (userId === "ALL") {
                user = await db.Passenger.findAll({
                    attributes: {
                        exclude: ["password", "image"],
                    },
                    include: [
                        {
                            model: db.Ticket,
                            include: [
                                {
                                    model: db.Trip,
                                },
                            ],
                        },
                    ],
                    raw: true,
                    nest: true,
                });
                users = _.sortBy(user, ["id"]);
            }
            if (userId && userId !== "ALL") {
                users = await db.Passenger.findAll({
                    where: { id: userId },
                    attributes: {
                        exclude: ["password", "image"],
                    },
                    include: [
                        {
                            model: db.Ticket,
                        },
                    ],
                    raw: true,
                    nest: true,
                });
            }
            resolve(users);
        } catch (e) {
            reject(e);
        }
    });
};
let getAllPassengers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = "";
            let user = "";
            if (userId === "ALL") {
                user = await db.Passenger.findAll({});
                users = _.sortBy(user, ["id"]);
            }
            if (userId && userId !== "ALL") {
                users = await db.Passenger.findAll({
                    where: { id: userId },
                });
            }
            resolve(users);
        } catch (e) {
            reject(e);
        }
    });
};
let getAllDrivers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = "";
            let user = "";
            if (userId === "ALL") {
                user = await db.Driver.findAll({
                    include: [
                        {
                            model: db.User,
                            attributes: ["email", "address", "phoneNumber", "gender"],
                        },
                    ],
                    raw: true,
                    nest: true,
                });
                users = _.sortBy(user, ["id"]);
            }
            if (userId && userId !== "ALL") {
                users = await db.Driver.findAll({
                    where: { id: userId },
                });
            }
            resolve(users);
        } catch (e) {
            reject(e);
        }
    });
};
let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = "";
            let user = "";
            if (userId === "ALL") {
                user = await db.User.findAll({
                    attributes: {
                        exclude: ["password"],
                    },
                    include: [
                        {
                            model: db.Driver,
                        },
                    ],
                    raw: true,
                    nest: true,
                });
                users = _.sortBy(user, ["id"]);
            }
            if (userId && userId !== "ALL") {
                users = await db.User.findAll({
                    where: { id: userId },
                    attributes: {
                        exclude: ["password"],
                    },
                    include: [
                        {
                            model: db.Trip,
                            attributes: ["id", "timeStart", "areaStart", "routeId", "busId", "busOwnerId"],
                            include: [
                                {
                                    model: db.Ticket,
                                },
                            ],
                        },
                        {
                            model: db.Driver,
                        },
                    ],
                    raw: true,
                    nest: true,
                });
            }
            resolve(users);
        } catch (e) {
            reject(e);
        }
    });
};

let getInfoDriverRoute = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = "";
            if (userId === "ALL") {
                users = await db.Driver.findAll({});
            } else {
                users = await db.Driver.findOne({
                    where: { driverId: userId },
                });
            }

            resolve(users);
        } catch (e) {
            reject(e);
        }
    });
};

let getUserTicket = (userId) => {
    return new Promise(async (resolve, reject) => {
        users = await db.User.findAll({
            where: { id: userId },
            include: [
                {
                    model: db.Ticket,
                },
                {
                    model: db.Driver,
                },
            ],
        });
    });
};

let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //check email exist
            console.log(data);
            let check = await checkUserEmailAdmin(data.email);
            let checkPhone = await checkPhoneAdmin(data.phoneNumber);
            console.log(checkPhone);
            if (check) {
                console.log(2);
                resolve({
                    errCode: 1,
                    errMessage: "Your email already exists, please try another email",
                });
            } else if (checkPhone) {
                console.log(3);
                resolve({
                    errCode: 8,
                    errMessage: "Your email already exists, please try another email",
                });
            } else if (data.password.trim().length < 8) {
                console.log(4);
                resolve({
                    errCode: 4,
                    errMessage: "Password must be at least 8 characters",
                });
            } else if (isNaN(data.phoneNumber)) {
                console.log(5);
                resolve({
                    errCode: 5,
                    errMessage: "Phone Number must be a number",
                });
            } else if (!isEmailValid(data.email)) {
                console.log(2);
                resolve({
                    errCode: 6,
                    errMessage: "Invalid mail address",
                });
            } else {
                console.log(1);
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                if (!data.avatar) {
                    await db.User.create({
                        email: data.email,
                        password: hashPasswordFromBcrypt,
                        name: data.name,
                        address: data.address,
                        phoneNumber: data.phoneNumber,
                        roleID: data.roleID,
                        busOwnerId: data.busOwnerId,
                        busOwner: data.busOwner,
                        gender: data.gender,
                    });
                } else {
                    await db.User.create({
                        email: data.email,
                        password: hashPasswordFromBcrypt,
                        name: data.name,
                        address: data.address,
                        phoneNumber: data.phoneNumber,
                        roleID: data.roleID,
                        busOwnerId: data.busOwnerId,
                        busOwner: data.busOwner,
                        gender: data.gender,
                        image: data.avatar,
                    });
                }

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
let createNewDriver = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: data.email },
            });
            console.log(user);
            await db.Driver.create({
                status: 1,
                name: data.name,
                driverId: user.id,
                busOwnerId: data.busOwnerId,
                busOwner: data.busOwner,
            });

            resolve({
                errCode: 0,
                errMessage: "OK",
            });
        } catch (e) {
            reject(e);
        }
    });
};

let deleteUser = async (userId) => {
    return new Promise(async (resolve, reject) => {
        let user = await db.User.findOne({
            where: { id: userId },
            // raw: false,
        });
        if (!user) {
            resolve({
                errCode: 2,
                errMessage: `The user isn't exist`,
            });
        }
        await db.User.destroy({
            where: { id: userId },
        }); // đây là thao tac dưới DB

        let driver = await db.Driver.findOne({
            where: { driverId: userId },
        });

        if (driver) {
            await db.Driver.destroy({
                where: { driverId: userId },
            });
        }
        resolve({
            errCode: 0,
            errMessage: "The user is delete",
        });
    });
};
let handEditPassenger = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing required parameter",
                });
            }
            let user = await db.Passenger.findOne({
                where: { id: data.id },
                raw: false,
            });

            if (user) {
                user.name = data.name;
                user.address = data.address;
                user.roleID = data.roleID;
                user.gender = data.gender;
                user.phoneNumber = data.phoneNumber;
                if (data.avatar) {
                    user.image = data.avatar;
                }
                await user.save();
                resolve({
                    errCode: 0,
                    message: "update user success",
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: "user not found",
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};
let updateUserData = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 2,
                    errMessage: "Missing required parameter",
                });
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false,
            });

            if (user) {
                user.name = data.name;
                user.address = data.address;
                user.gender = data.gender;
                user.phoneNumber = data.phoneNumber;
                if (data.avatar) {
                    user.image = data.avatar;
                }
                await user.save();
                resolve({
                    errCode: 0,
                    message: "update user success",
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: "user not found",
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let handleDriverStartTrip = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.Driver.findOne({
                where: {
                    driverId: data.id,
                    [Op.or]: [{ status: 1 }, { status: 3 }],
                },
                raw: false,
            });
            if (user) {
                user.status = 2;

                await user.save();
                resolve({
                    errCode: 0,
                    message: "update user success",
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: "user not found",
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};
let handleDriverEndTrip = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.Driver.findOne({
                where: {
                    driverId: data.id,
                    status: 2,
                },
                raw: false,
            });
            if (user) {
                user.status = 3;

                await user.save();
                resolve({
                    errCode: 0,
                    message: "update user success",
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: "user not found",
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};
let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter",
                });
            } else {
                let res = {};
                let allCode = await db.Allcode.findAll({
                    where: { type: typeInput },
                });
                res.errCode = 0;
                res.data = allCode;
                resolve(res);
            }
        } catch (e) {
            reject(e);
        } // khi lỗi sẽ nhảy vào catch này
    }); // sau đó nhảy vào userController và nhảy vào catch
};

let handleChangePasswordPassenger = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter",
                });
            }
            let user = await db.Passenger.findOne({
                where: { id: data.id },
                raw: false,
            });
            if (user) {
                let check = await bcrypt.compareSync(data.oldPass, user.password);
                if (check) {
                    let hashPasswordFromBcrypt = await hashUserPassword(data.newPass);
                    user.password = hashPasswordFromBcrypt;
                    await user.save();
                    resolve({
                        errCode: 0,
                        message: "update user success",
                    });
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: "user not found",
                    });
                }
            } else {
                resolve({
                    errCode: 1,
                    errMessage: "user not found",
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};
let changePassword = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter",
                });
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false,
            });
            if (user) {
                let check = await bcrypt.compareSync(data.oldPass, user.password);
                if (check) {
                    let hashPasswordFromBcrypt = await hashUserPassword(data.newPass);
                    user.password = hashPasswordFromBcrypt;
                    await user.save();
                    resolve({
                        errCode: 0,
                        message: "update user success",
                    });
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: "user not found",
                    });
                }
            } else {
                resolve({
                    errCode: 1,
                    errMessage: "user not found",
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let useCouponIsFirst = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter",
                });
            }
            let user = await db.Passenger.findOne({
                where: { id: data.id },
                raw: false,
            });
            if (user) {
                user.isFirst = data.isFirst;
                await user.save();
                resolve({
                    errCode: 0,
                    message: "update user success",
                });
            } else {
                resolve({
                    errCode: 1,
                    errMessage: "user not found",
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let handlePostForgotPassword = async (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: email },
            });
            if (!user)
                resolve({
                    errCode: 2,
                    errMessage: "OK",
                });
            else {
                await db.Resetpassword.update(
                    {
                        status: 1,
                    },
                    { where: { email: email } }
                );
                let token = uuidv4();
                let exp = new Date(new Date().getTime() + 10 * 60 * 1000);
                await db.Resetpassword.create({
                    email: email,
                    token: token,
                    exp: exp,
                    status: 0,
                });
                await emailService.sendEmailFrogotPassword({
                    receiversEmail: email,
                    redirectLink: `${process.env.URL_REACT}/reset-password?token=${token}&email=${email}`,
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
let handleGetForgotPassword = async (email, token) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: email },
            });
            if (!user)
                resolve({
                    errCode: 2,
                    errMessage: "OK",
                });
            else {
                await db.Resetpassword.destroy({
                    where: {
                        exp: { [Op.lt]: Sequelize.fn("CURDATE") },
                    },
                });
                var record = await db.Resetpassword.findOne({
                    where: {
                        email: email,
                        exp: { [Op.gt]: Sequelize.fn("CURDATE") },
                        token: token,
                        status: 0,
                    },
                });
                if (!record) {
                    resolve({
                        errCode: 3,
                        errMessage: "OK",
                    });
                } else {
                    resolve({
                        errCode: 0,
                        errMessage: "ok",
                        record,
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};
let handlePostResetPassword = async (email, token, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            var record = await db.Resetpassword.findOne({
                email: email,
                token: token,
                exp: { [Op.gt]: Sequelize.fn("CURDATE") },
                status: 0,
            });
            if (!record) {
                resolve({
                    errCode: 2,
                    errMessage: "OK",
                });
            } else {
                let upd = await db.Resetpassword.findOne({
                    where: { email: email },
                    raw: false,
                });
                if (upd) {
                    // upd.status = 1;
                    // await upd.save();
                    await db.Resetpassword.update(
                        {
                            status: 1,
                        },
                        { where: { email: email } }
                    );
                    let hashPasswordFromBcrypt = await hashUserPassword(password);
                    let user = await db.User.findOne({
                        where: { email: email },
                        raw: false,
                    });
                    if (user) {
                        user.password = hashPasswordFromBcrypt;
                        await user.save();
                        resolve({
                            errCode: 0,
                            message: "update user success",
                        });
                    } else {
                        resolve({
                            errCode: 1,
                            errMessage: "user not found",
                        });
                    }
                } else {
                    resolve({
                        errCode: 1,
                        errMessage: "user not found",
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};
module.exports = {
    handEditPassenger,
    getAllDrivers,
    getAllPassengersTicket,
    getAllPassengers,
    handleDriverStartTrip,
    handleDriverEndTrip,
    getInfoDriverRoute,
    createNewDriver,
    handlePostResetPassword,
    handleUserLogin,
    getAllUsers,
    createNewUser,
    deleteUser,
    updateUserData,
    getAllCodeService,
    createNewUserByRegister,
    getUserTicket,
    changePassword,
    useCouponIsFirst,
    handlePostForgotPassword,
    handleGetForgotPassword,
    handleChangePasswordPassenger,
};
