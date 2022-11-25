import db from "../models/index";
import { reject } from "bcrypt/promises";
import bcrypt from "bcryptjs";

var salt = bcrypt.genSaltSync(10);
let checkUserEmail = (userEmail) => {
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
            let isExist = await checkUserEmail(email);
            console.log(1);
            if (isExist) {
                //User already exist
                //compare password
                console.log(2);
                let user = await db.User.findOne({
                    attributes: ["id", "email", "roleID", "password", "name"],
                    where: { email: email },
                    raw: true,
                });
                console.log(3);
                if (user) {
                    let check = await bcrypt.compareSync(
                        password,
                        user.password
                    ); // false
                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = "OK";
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = "Wrong Password";
                    }
                } else {
                    //return error
                    userData.errCode = 2;
                    userData.errMessage = "User does not exist";
                }
            } else {
                //return error
                userData.errCode = 1;
                userData.errMessage = `Your's Email does not exist. Please try other Email`;
            }

            resolve(userData);
        } catch (e) {
            reject(e);
        }
    });
};

let createNewUserByRegister = (email, password, confirmPassword, name) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};
            let check = await checkUserEmail(email);
            if (check) {
                resolve({
                    errCode: 1,
                    errMessage:
                        "Your email already exists, please try another email",
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
                let user = await db.User.create({
                    email: email,
                    name: name,
                    password: hashPasswordFromBcrypt,
                    roleID: "R4",
                });
                userData.errCode = 0;
                userData.errMessage = "OK";
                delete user.password;
                userData.user = user;
                // resolve({
                //     errCode: 0,
                //     errMessage: "OK",
                //     userData.user = user
                // });
            }

            resolve(userData);
        } catch (e) {
            reject(e);
        }
    });
};

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = "";
            if (userId === "ALL") {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ["password"],
                    },
                });
            }
            if (userId && userId !== "ALL") {
                //console.log(userId);
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ["password"],
                    },
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
            ],
        });
    });
};

let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            //check email exist
            let check = await checkUserEmail(data.email);
            console.log(data);
            if (check) {
                resolve({
                    errCode: 1,
                    errMessage:
                        "Your email already exists, please try another email",
                });
            } else if (data.password.trim().length < 8) {
                resolve({
                    errCode: 4,
                    errMessage: "Password must be at least 8 characters",
                });
            } else if (isNaN(data.phoneNumber)) {
                resolve({
                    errCode: 5,
                    errMessage: "Phone Number must be a number",
                });
            } else if (!isEmailValid(data.email)) {
                resolve({
                    errCode: 6,
                    errMessage: "Invalid mail address",
                });
            } else {
                let hashPasswordFromBcrypt = await hashUserPassword(
                    data.password
                );
                console.log(hashPasswordFromBcrypt);
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

        resolve({
            errCode: 0,
            errMessage: "The user is delete",
        });
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
let changePassword = async (data) => {
    return new Promise(async (resolve, reject) => {
        console.log(data);
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
            console.log(user);
            if (user) {
                let check = await bcrypt.compareSync(
                    data.oldPass,
                    user.password
                );
                if (check) {
                    let hashPasswordFromBcrypt = await hashUserPassword(
                        data.newPass
                    );
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
        console.log(data);
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
            console.log(user);
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
module.exports = {
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
};
