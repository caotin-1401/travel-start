import userService from "../services/userService";

let handleLogin = async (req, res) => {
    try {
        let email = req.body.email;
        let password = req.body.password;

        //check email exist
        // com password
        //return userInfo
        // access token

        // 1. check email
        if (!email || !password) {
            return res.status(500).json({
                errCode: 1,
                message: "Missing inputs parameter",
            });
        }

        let userData = await userService.handleUserLogin(email, password);

        return res.status(200).json({
            errCode: userData.errCode,
            message: userData.errMessage,
            user: userData.user ? userData.user : {},
        });
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};

let handleRegister = async (req, res) => {
    try {
        let email = req.body.email;
        let password = req.body.password;
        let confirmPassword = req.body.confirmPassword;
        let phoneNumber = req.body.phoneNumber;

        if (!phoneNumber || !password || !confirmPassword) {
            return res.status(500).json({
                errCode: 1,
                message: "Missing inputs parameter",
            });
        }

        let userData = await userService.createNewUserByRegister(email, password, confirmPassword, phoneNumber);

        return res.status(200).json({
            errCode: userData.errCode,
            message: userData.errMessage,
            user: userData.user ? userData.user : {},
        });
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};
let getAllPassengers = async (req, res) => {
    try {
        let id = req.query.id; //ALL, id

        if (!id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameters",
                users: [],
            });
        }

        let users = await userService.getAllPassengers(id);
        return res.status(200).json({
            errCode: 0,
            errMessage: "OK",
            users,
        });
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};
let getAllDrivers = async (req, res) => {
    try {
        let id = req.query.id; //ALL, id

        if (!id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameters",
                users: [],
            });
        }

        let users = await userService.getAllDrivers(id);
        return res.status(200).json({
            errCode: 0,
            errMessage: "OK",
            users,
        });
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};
let getAllPassengersTicket = async (req, res) => {
    try {
        let id = req.query.id; //ALL, id

        if (!id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameters",
                users: [],
            });
        }

        let users = await userService.getAllPassengersTicket(id);
        return res.status(200).json({
            errCode: 0,
            errMessage: "OK",
            users,
        });
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};
let handleGetAllUsers = async (req, res) => {
    try {
        let id = req.query.id; //ALL, id

        if (!id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameters",
                users: [],
            });
        }

        let users = await userService.getAllUsers(id);
        return res.status(200).json({
            errCode: 0,
            errMessage: "OK",
            users,
        });
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};
let getInfoDriverRoute = async (req, res) => {
    try {
        let id = req.query.id; //ALL, id

        if (!id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameters",
                users: [],
            });
        }

        let users = await userService.getInfoDriverRoute(id);
        return res.status(200).json({
            errCode: 0,
            errMessage: "OK",
            users,
        });
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};

let handleCreateNewUser = async (req, res) => {
    try {
        let message = await userService.createNewUser(req.body);
        if (req.body.roleID === "R3") {
            let message1 = await userService.createNewDriver(req.body);
        }
        return res.status(200).json(message);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};

let handleEditUser = async (req, res) => {
    let data = req.body;
    let message = await userService.updateUserData(data);
    return res.status(200).json(message);
};
let handEditPassenger = async (req, res) => {
    let data = req.body;
    let message = await userService.handEditPassenger(data);
    return res.status(200).json(message);
};
let handleDriverStartTrip = async (req, res) => {
    try {
        let id = req.body.id;
        let data = req.body;
        if (!id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameter",
            });
        }
        let message = await userService.handleDriverStartTrip(data);
        return res.status(200).json(message);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};
let handleDriverEndTrip = async (req, res) => {
    try {
        let id = req.body.id;
        let data = req.body;
        if (!id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameter",
            });
        }
        let message = await userService.handleDriverEndTrip(data);
        return res.status(200).json(message);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};

let handleDeleteUser = async (req, res) => {
    try {
        if (!req.body.id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameter",
            });
        }
        let message = await userService.deleteUser(req.body.id);
        return res.status(200).json(message);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};

let getAllCode = async (req, res) => {
    try {
        let data = await userService.getAllCodeService(req.query.type);
        return res.status(200).json(data);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};

let getUserTicket = async (req, res) => {
    try {
        let id = req.query.id; //ALL, id

        if (!id) {
            return res.status(200).json({
                errCode: 1,
                errMessage: "Missing required parameters",
                users: [],
            });
        }

        let users = await userService.getUserTicket(id);
        return res.status(200).json({
            errCode: 0,
            errMessage: "OK",
            users,
        });
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};
let handleChangePassword = async (req, res) => {
    let data = req.body;
    let message = await userService.changePassword(data);
    return res.status(200).json(message);
};
let handleChangePasswordPassenger = async (req, res) => {
    let data = req.body;
    let message = await userService.handleChangePasswordPassenger(data);
    return res.status(200).json(message);
};
let useCouponIsFirst = async (req, res) => {
    try {
        let data = req.body;
        let message = await userService.useCouponIsFirst(data);
        return res.status(200).json(message);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};

let handlePostForgotPassword = async (req, res) => {
    try {
        let email = req.body.email;

        if (!email) {
            return res.status(500).json({
                errCode: 1,
                message: "Missing inputs parameter",
            });
        }

        let userData = await userService.handlePostForgotPassword(email);

        return res.status(200).json({
            errCode: userData.errCode,
            message: userData.errMessage,
        });
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};
let handleGetForgotPassword = async (req, res) => {
    try {
        let email = req.query.email;
        let token = req.query.token;
        if (!email) {
            return res.status(500).json({
                errCode: 1,
                message: "Missing inputs parameter",
            });
        }

        let userData = await userService.handleGetForgotPassword(email, token);

        return res.status(200).json({
            errCode: userData.errCode,
            errMessage: userData.errMessage,
        });
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};
let handlePostResetPassword = async (req, res) => {
    try {
        let email = req.body.email;

        if (!email) {
            return res.status(500).json({
                errCode: 1,
                message: "Missing inputs parameter",
            });
        }

        let userData = await userService.handlePostResetPassword(email, req.body.token, req.body.password);

        return res.status(200).json({
            errCode: 0,
            message: "OK",
        });
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            errMessage: "Error from server",
        });
    }
};
module.exports = {
    getAllPassengersTicket,
    handleChangePasswordPassenger,
    handEditPassenger,
    getAllPassengers,
    handleDriverStartTrip,
    handleDriverEndTrip,
    handlePostResetPassword,
    handleLogin,
    handleGetAllUsers,
    handleCreateNewUser,
    handleEditUser,
    handleDeleteUser,
    getAllCode,
    handleRegister,
    getUserTicket,
    handleChangePassword,
    useCouponIsFirst,
    handlePostForgotPassword,
    handleGetForgotPassword,
    getInfoDriverRoute,
    getAllDrivers,
};
