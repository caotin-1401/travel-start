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
const getAllPassengers = (inputId) => {
    return axios.get(`/api/get-all-passengers?id=${inputId}`, {
        id: inputId,
    });
};
const getAllDrivers = (inputId) => {
    return axios.get(`/api/get-all-drivers?id=${inputId}`, {
        id: inputId,
    });
};
const getAllPassengersTicket = (inputId) => {
    return axios.get(`/api/get-all-passengers-ticket?id=${inputId}`, {
        id: inputId,
    });
};
const getInfoDriverRoute = (inputId) => {
    return axios.get(`/api/get-info-driver-route?id=${inputId}`, {
        id: inputId,
    });
};
const getAllVehicleFromStation = (inputId) => {
    return axios.get(`/api/get-all-vehicle-from-station?id=${inputId}`, {
        id: inputId,
    });
};
const getAllVehicleFromOneStation = (inputId) => {
    return axios.get(`/api/get-all-vehicle-from-one-station?id=${inputId}`, {
        id: inputId,
    });
};
const handleDriverStartTrip = (inputData) => {
    return axios.put("/api/handle-driver-start-trip", inputData);
};
const handleDriverEndTrip = (inputData) => {
    return axios.put("/api/handle-driver-end-trip", inputData);
};
const handleStartTrip = (inputData) => {
    return axios.put("/api/handle-start-trip", inputData);
};
const handleEndTrip = (inputData) => {
    return axios.put("/api/handle-end-trip", inputData);
};
const handleVehicleStartTrip = (inputData) => {
    return axios.put("/api/handle-vehicle-start-trip", inputData);
};
const handleVehicleEndTrip = (inputData) => {
    return axios.put("/api/handle-vehicle-end-trip", inputData);
};

const createNewUserService = (data) => {
    return axios.post("/api/create-new-user", data);
};
const postForgotPasswordService = (data) => {
    return axios.post("/api/post-forgot-password", data);
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
const deletePassengerService = (userId) => {
    return axios.delete("/api/delete-passenger", {
        data: {
            id: userId,
        },
    });
};

const editUserService = (inputData) => {
    return axios.put("/api/edit-user", inputData);
};
const handEditPassenger = (inputData) => {
    return axios.put("/api/edit-passenger", inputData);
};

const changePasswordService = (inputData) => {
    return axios.put("/api/change-password", inputData);
};
const handleChangePasswordPassenger = (inputData) => {
    return axios.put("/api/change-password-passenger", inputData);
};
const changeUserFirstCouponService = (inputData) => {
    return axios.put("/api/use-coupon-isFirst", inputData);
};

const getAllCodeService = (inputType) => {
    return axios.get(`/api/allcode?type=${inputType}`);
};

const getAllCity = (inputId) => {
    return axios.get(`/api/get-all-city?id=${inputId}`, {
        id: inputId,
    });
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

//Route
const getAllRoutesService = (inputId) => {
    return axios.get(`/api/get-all-routes?id=${inputId}`);
};
const getAllRoutesHomeService = (inputId) => {
    return axios.get(`/api/get-all-routes-home?id=${inputId}`);
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
const getDriverTrips = (inputId) => {
    return axios.get(`/api/get-driver-schedule?driverId=${inputId}`);
};
const getTripsFromBusCompany = (inputId) => {
    return axios.get(`/api/get-trips-from-bus-company?busOwnerId=${inputId}`);
};
const getScheduleFromBusCompany = (inputId) => {
    return axios.get(`/api/get-schedule-from-bus-company?busOwnerId=${inputId}`);
};
const createNewTrip = (data) => {
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
const getForgotPasswordService = (email, token) => {
    return axios.get(`/api/get-forgot-password?email=${email}&token=${token}`);
    // return axios.get("/api/get-forgot-password", {
    //     email: email,
    //     token: token,
    // });
};
//tickets
const getNextTrip = (areaStart, busId) => {
    return axios.get(`/api/get-next-trip?areaStart=${areaStart}&busId=${busId}`);
};
const saveBulkTicket = (data) => {
    return axios.post("/api/create-new-ticket", data);
};
const getAllTickets = (inputId) => {
    return axios.get(`/api/get-all-ticket?id=${inputId}`);
};
const getUserTickets = (inputId) => {
    return axios.get(`/api/get-user-ticket?id=${inputId}`);
};
const getDriverTickets = (inputId, dayStart) => {
    return axios.get(`/api/get-driver-ticket?driverId=${inputId}&dayStart=${dayStart}`);
};
const getDriverTicketsRoute = (inputId, dayStart, tripId) => {
    return axios.get(
        `/api/get-driver-ticket-route?driverId=${inputId}&dayStart=${dayStart}&tripId=${tripId}`
    );
};
const getAllRouteFromDateDriver = (inputId, dayStart) => {
    return axios.get(
        `/api/get-all-route-from-date-driver?driverId=${inputId}&dayStart=${dayStart}`
    );
};
const getAllTicketFromDateDriver = (inputId, dayStart) => {
    return axios.get(
        `/api/get-all-ticket-from-date-driver?driverId=${inputId}&dayStart=${dayStart}`
    );
};

//verify
const verifyEmail = (data) => {
    return axios.post("/api/verify-ticket", data);
};
const cancelTicket = (data) => {
    return axios.post("/api/cancel-ticket", data);
};
const sendTicket = (data) => {
    return axios.post("/api/send-ticket", data);
};
const deleteTicket = (tripId, token) => {
    return axios.delete("/api/delete-ticket", {
        data: {
            tripId: tripId,
            token: token,
        },
    });
};

//event
const getAllEventsService = (inputId) => {
    return axios.get(`/api/get-all-events?id=${inputId}`);
};
const getAllEventsHomeService = (inputId) => {
    return axios.get(`/api/get-all-events-home?id=${inputId}`);
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

//blog
const getAllBlogsService = (inputId) => {
    return axios.get(`/api/get-all-blogs?id=${inputId}`);
};

const createNewBlogsService = (data) => {
    return axios.post("/api/create-new-blog", data);
};

const deleteBlogsService = (userId) => {
    return axios.delete("/api/delete-blog", {
        data: {
            id: userId,
        },
    });
};

const editBlogsService = (inputData) => {
    return axios.put("/api/edit-blog", inputData);
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

//err
const getAllErrService = (inputId) => {
    return axios.get(`/api/get-all-err?id=${inputId}`);
};

const createNewErrService = (data) => {
    return axios.post("/api/create-new-err", data);
};

const deleteErrService = (userId) => {
    return axios.delete("/api/delete-err", {
        data: {
            id: userId,
        },
    });
};

export {
    getDriverTrips,
    deletePassengerService,
    getAllErrService,
    deleteErrService,
    createNewErrService,
    getAllVehicleFromStation,
    getAllBlogsService,
    createNewBlogsService,
    deleteBlogsService,
    editBlogsService,
    getAllCity,
    getAllPassengersTicket,
    handleChangePasswordPassenger,
    getAllPassengers,
    handleVehicleStartTrip,
    handleVehicleEndTrip,
    handleStartTrip,
    handleEndTrip,
    getInfoDriverRoute,
    handleDriverStartTrip,
    handleDriverEndTrip,
    sendTicket,
    getAllRouteFromDateDriver,
    getUserTickets,
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
    getAllDrivers,
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
    getAllRoutesService,
    createNewRouteService,
    deleteRouteService,
    getAllRoutesHomeService,
    getAllVehiclesService,
    createNewVehicleService,
    deleteVehicleService,
    editVehicleService,
    getAllScheduleService,
    createNewTrip,
    deleteScheduleService,
    getAllTripHomeService,
    saveBulkTicket,
    getAllTickets,
    verifyEmail,
    getAllEventsService,
    createNewEventsService,
    deleteEventsService,
    editEventsService,
    cancelTicket,
    deleteTicket,
    handEditPassenger,
    getAllVehicleFromOneStation,
    getTripsFromBusCompany,
    getAllTicketFromDateDriver,
    getScheduleFromBusCompany,
    getAllEventsHomeService,
    getNextTrip,
};
