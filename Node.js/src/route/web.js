import express from "express";
import userController from "../controllers/userController";
import locationController from "../controllers/locationController";
import busTypeController from "../controllers/busTypeController";
import routeController from "../controllers/routeController";
import busController from "../controllers/busController";
import scheduleController from "../controllers/scheduleController";
import ticketController from "../controllers/ticketController";
import couponController from "../controllers/couponController";
import eventController from "../controllers/eventController";
import blogController from "../controllers/blogController";
import homeController from "../controllers/homeController";
import errController from "../controllers/errController";

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", homeController.getHomePage);

    router.get("/crud", homeController.getCRUD);

    router.post("/post-crud", homeController.postCRUD);
    router.get("/get-crud", homeController.displayGetCRUD);
    router.get("/edit-crud", homeController.getEditCRUD);
    router.post("/put-crud", homeController.putUserCRUD);
    router.get("/delete-crud", homeController.deleteUserCRUD);

    router.post("/api/login", userController.handleLogin);
    router.post("/api/register", userController.handleRegister);
    router.post("/api/post-forgot-password", userController.handlePostForgotPassword);
    router.get("/api/get-forgot-password", userController.handleGetForgotPassword);
    router.post("/api/post-reset-password", userController.handlePostResetPassword);
    router.get("/api/get-all-users", userController.handleGetAllUsers);
    router.get("/api/get-all-drivers", userController.getAllDrivers);
    router.get("/api/get-all-passengers", userController.getAllPassengers);
    router.get("/api/get-all-passengers-ticket", userController.getAllPassengersTicket);
    router.post("/api/create-new-user", userController.handleCreateNewUser);
    router.put("/api/edit-user", userController.handleEditUser);
    router.put("/api/edit-passenger", userController.handEditPassenger);
    router.put("/api/use-coupon-isFirst", userController.useCouponIsFirst);
    router.put("/api/change-password", userController.handleChangePassword);
    router.put("/api/change-password-passenger", userController.handleChangePasswordPassenger);
    router.delete("/api/delete-user", userController.handleDeleteUser);
    router.delete("/api/delete-passenger", userController.handleDeletePassenger);
    router.get("/api/allcode", userController.getAllCode);
    router.get("/api/get-info-driver-route", userController.getInfoDriverRoute);
    router.put("/api/handle-driver-start-trip", userController.handleDriverStartTrip);
    router.put("/api/handle-driver-end-trip", userController.handleDriverEndTrip);
    router.put("/api/handle-vehicle-start-trip", busController.handleVehicleStartTrip);
    router.put("/api/handle-vehicle-end-trip", busController.handleVehicleEndTrip);
    router.get("/api/get-driver-ticket-route", ticketController.getDriverTicketRoute);
    router.get("/api/get-all-route-from-date-driver", ticketController.getAllRouteFromDateDriver);
    router.get("/api/get-all-ticket-from-date-driver", ticketController.getAllTicketFromDateDriver);

    router.get("/api/get-all-locations", locationController.getAllLocations);
    router.post("/api/create-new-locations", locationController.handleCreateNewLocations);
    router.put("/api/edit-locations", locationController.handleEditLocations);
    router.delete("/api/delete-locations", locationController.deleteLocations);
    router.get("/api/get-all-vehicle-from-station", locationController.getAllVehicleFromStation);
    router.get(
        "/api/get-all-vehicle-from-one-station",
        locationController.getAllVehicleFromOneStation
    );
    router.get("/api/get-all-city", locationController.getAllCity);

    router.get("/api/get-all-bustypes", busTypeController.getAllBusTypes);
    router.post("/api/create-new-bustype", busTypeController.createNewBusTypes);
    router.put("/api/edit-bustype", busTypeController.editBusTypes);
    router.delete("/api/delete-bustype", busTypeController.deleteBusTypes);

    router.get("/api/get-all-routes", routeController.getAllRoutes);
    router.get("/api/get-all-routes-home", routeController.getAllRoutesHome);
    router.post("/api/create-new-route", routeController.createNewRoute);
    router.put("/api/edit-route", routeController.editRoute);
    router.delete("/api/delete-route", routeController.deleteRoute);

    router.get("/api/get-all-bus", busController.getAllBus);
    router.post("/api/create-new-bus", busController.createNewBus);
    router.put("/api/edit-bus", busController.editBus);
    router.delete("/api/delete-bus", busController.deleteBus);
    router.get("/api/get-next-trip", busController.getNextTrip);

    router.get("/api/get-all-schedule", scheduleController.getAllSchedule);
    router.get("/api/show-all-schedule", scheduleController.shouldAllSchedule);
    router.get("/api/get-driver-schedule", scheduleController.getDriverTrips);
    router.get("/api/get-schedule-from-bus-company", scheduleController.getTripsFromBusCompany);
    router.get("/api/get-trips-from-bus-company", scheduleController.getTripsFromCompany);
    router.post("/api/create-new-schedule", scheduleController.createSchedule);
    router.delete("/api/delete-schedule", scheduleController.deleteSchedule);
    router.put("/api/handle-start-trip", scheduleController.handleStartTrip);
    router.put("/api/handle-end-trip", scheduleController.handleEndTrip);

    router.get("/api/get-all-ticket", ticketController.getAllTickets);
    router.get("/api/get-user-ticket", ticketController.getUserTicket);
    router.get("/api/get-driver-ticket", ticketController.getDriverTicket);

    router.post("/api/create-new-ticket", ticketController.createTicket);
    router.post("/api/verify-ticket", ticketController.verifyTicket);
    router.post("/api/send-ticket", ticketController.sendTickets);
    router.post("/api/cancel-ticket", ticketController.cancelTicket);
    router.delete("/api/delete-ticket", ticketController.deleteTicket);
    router.put("/api/check-customer", ticketController.checkCustomerIsPresent);

    router.get("/api/get-all-coupons", couponController.getAllCoupons);
    router.post("/api/create-new-coupon", couponController.createCoupon);
    router.delete("/api/delete-coupon", couponController.deleteCoupon);
    router.put("/api/edit-coupon", couponController.editCoupon);
    router.get("/api/get-use-coupon", couponController.getUseCoupons);
    router.put("/api/use-coupon", couponController.useCoupon);

    router.get("/api/get-all-events", eventController.getAllEvents);
    router.get("/api/get-all-events-home", eventController.getAllEventsHome);
    router.post("/api/create-new-event", eventController.createNewEvent);
    router.put("/api/edit-event", eventController.editEvent);
    router.delete("/api/delete-event", eventController.deleteEvent);

    router.get("/api/get-all-blogs", blogController.getAllBlogs);
    router.post("/api/create-new-blog", blogController.createNewBlog);
    router.put("/api/edit-blog", blogController.editBlog);
    router.delete("/api/delete-blog", blogController.deleteBlog);

    router.get("/api/get-all-err", errController.getAllErr);
    router.post("/api/create-new-err", errController.createNewErr);
    router.delete("/api/delete-err", errController.deleteErr);

    return app.use("/", router);
};

module.exports = initWebRoutes;
