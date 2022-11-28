import axios from "../axios";

const handleLogin = (yourEmail, yourPassword) => {
    return axios.post("/api/login", {
        email: yourEmail,
        password: yourPassword,
    });
};
const handleRegister = (email, password, confirmPassword, name) => {
    return axios.post("/api/register", {
        email,
        password,
        confirmPassword,
        name,
    });
};

const getAllUsers = (inputId) => {
    return axios.get(`/api/get-all-users?id=${inputId}`, {
        id: inputId,
    });
};

const createNewUserService = (data) => {
    return axios.post("/api/create-new-user", data);
};
const postForgotPasswordService = (data) => {
    return axios.post("/api/post-forgot-password", data);
};
const getForgotPasswordService = (data) => {
    return axios.get("/api/post-forgot-password", data);
};
const postResetPasswordService = (data) => {
    return axios.post("/api/post-reset-password", data);
};

const deleteUserService = (userId) => {
    return axios.delete("/api/delete-user", {
        data: {
            id: userId,
        },
    });
};

const editUserService = (inputData) => {
    return axios.put("/api/edit-user", inputData);
};
const changePasswordService = (inputData) => {
    return axios.put("/api/change-password", inputData);
};

const changeUserFirstCouponService = (inputData) => {
    return axios.put("/api/use-coupon-isFirst", inputData);
};

const getAllCodeService = (inputType) => {
    return axios.get(`/api/allcode?type=${inputType}`);
};
const getAllLocationService = (inputId) => {
    return axios.get(`/api/get-all-locations?id=${inputId}`, {
        id: inputId,
    });
};
const createNewLocationService = (data) => {
    return axios.post("/api/create-new-locations", data);
};

const deleteLocationService = (userId) => {
    return axios.delete("/api/delete-locations", {
        data: {
            id: userId,
        },
    });
};

const editLocationService = (inputData) => {
    return axios.put("/api/edit-locations", inputData);
};

//busType
const getAllBusTypesService = (inputId) => {
    return axios.get(`/api/get-all-bustypes?id=${inputId}`);
};

const createNewBusTypeService = (data) => {
    return axios.post("/api/create-new-bustype", data);
};

const deleteBusTypeService = (userId) => {
    return axios.delete("/api/delete-bustype", {
        data: {
            id: userId,
        },
    });
};

const editBusTypeService = (inputData) => {
    return axios.put("/api/edit-bustype", inputData);
};

//Route
const getAllRoutesService = (inputId) => {
    return axios.get(`/api/get-all-routes?id=${inputId}`);
};

const createNewRouteService = (data) => {
    return axios.post("/api/create-new-route", data);
};

const deleteRouteService = (userId) => {
    return axios.delete("/api/delete-route", {
        data: {
            id: userId,
        },
    });
};

const editRouteService = (inputData) => {
    return axios.put("/api/edit-route", inputData);
};

//Vehicle
const getAllVehiclesService = (inputId) => {
    return axios.get(`/api/get-all-bus?id=${inputId}`);
};

const createNewVehicleService = (data) => {
    return axios.post("/api/create-new-bus", data);
};

const deleteVehicleService = (userId) => {
    return axios.delete("/api/delete-bus", {
        data: {
            id: userId,
        },
    });
};

const editVehicleService = (inputData) => {
    return axios.put("/api/edit-bus", inputData);
};

//schedule trip
const getAllScheduleService = (inputId) => {
    return axios.get(`/api/get-all-schedule?id=${inputId}`);
};

const saveBulkScheduleTrip = (data) => {
    return axios.post("/api/create-new-schedule", data);
};

const deleteScheduleService = (userId) => {
    return axios.delete("/api/delete-schedule", {
        data: {
            id: userId,
        },
    });
};

const getAllTripHomeService = (areaStartId, areaEndId, dateStart) => {
    return axios.get(
        `/api/show-all-schedule?areaStartId=${areaStartId}&areaEndId=${areaEndId}&dateStart=${dateStart}`
    );
};

//tickets

const saveBulkTicket = (data) => {
    return axios.post("/api/create-new-ticket", data);
};
const getAllTickets = (inputId) => {
    return axios.get(`/api/get-all-ticket?id=${inputId}`);
};
const getDriverTickets = (inputId, dayStart) => {
    return axios.get(
        `/api/get-driver-ticket?driverId=${inputId}&dayStart=${dayStart}`
    );
};
const getDriverTicketsRoute = (inputId, dayStart, tripId) => {
    return axios.get(
        `/api/get-driver-ticket-route?driverId=${inputId}&dayStart=${dayStart}&tripId=${tripId}`
    );
};

//verify
const verifyEmail = (data) => {
    return axios.post("/api/verify-ticket", data);
};

//event
const getAllEventsService = (inputId) => {
    return axios.get(`/api/get-all-events?id=${inputId}`);
};

const createNewEventsService = (data) => {
    return axios.post("/api/create-new-event", data);
};

const deleteEventsService = (userId) => {
    return axios.delete("/api/delete-event", {
        data: {
            id: userId,
        },
    });
};

const editEventsService = (inputData) => {
    return axios.put("/api/edit-event", inputData);
};

//coupon
const getAllCouponService = (inputId) => {
    return axios.get(`/api/get-all-coupons?id=${inputId}`);
};

const createNewCouponService = (data) => {
    return axios.post("/api/create-new-coupon", data);
};

const deleteCouponService = (userId) => {
    return axios.delete("/api/delete-coupon", {
        data: {
            id: userId,
        },
    });
};

const editCouponService = (inputData) => {
    return axios.put("/api/edit-coupon", inputData);
};

const getUseCouponService = (inputId) => {
    return axios.get(`/api/get-use-coupon?name=${inputId}`);
};
const CouponService = (inputData) => {
    return axios.put("/api/use-coupon", inputData);
};
const checkCustomerPresent = (inputData) => {
    return axios.put("/api/check-customer", inputData);
};
export {
    getForgotPasswordService,
    postForgotPasswordService,
    postResetPasswordService,
    getDriverTicketsRoute,
    checkCustomerPresent,
    getDriverTickets,
    changeUserFirstCouponService,
    changePasswordService,
    CouponService,
    getUseCouponService,
    getAllCouponService,
    createNewCouponService,
    deleteCouponService,
    editCouponService,
    handleLogin,
    handleRegister,
    getAllUsers,
    createNewUserService,
    deleteUserService,
    editUserService,
    getAllCodeService,
    getAllLocationService,
    createNewLocationService,
    editLocationService,
    deleteLocationService,
    getAllBusTypesService,
    createNewBusTypeService,
    deleteBusTypeService,
    editBusTypeService,
    getAllRoutesService,
    createNewRouteService,
    deleteRouteService,
    editRouteService,
    getAllVehiclesService,
    createNewVehicleService,
    deleteVehicleService,
    editVehicleService,
    getAllScheduleService,
    saveBulkScheduleTrip,
    deleteScheduleService,
    getAllTripHomeService,
    saveBulkTicket,
    getAllTickets,
    verifyEmail,
    getAllEventsService,
    createNewEventsService,
    deleteEventsService,
    editEventsService,
};
