import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import locationController from "../controllers/locationController";
import busTypeController from "../controllers/busTypeController";
import routeController from "../controllers/routeController";
import busController from "../controllers/busController";
import scheduleController from "../controllers/scheduleController";
import ticketController from "../controllers/ticketController";
import couponController from "../controllers/couponController";
import eventController from "../controllers/eventController";

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

    router.get("/api/get-all-users", userController.handleGetAllUsers);
    router.post("/api/create-new-user", userController.handleCreateNewUser);
    router.put("/api/edit-user", userController.handleEditUser);
    router.put("/api/use-coupon-isFirst", userController.useCouponIsFirst);
    router.put("/api/change-password", userController.handleChangePassword);
    router.delete("/api/delete-user", userController.handleDeleteUser);
    router.get("/api/allcode", userController.getAllCode);

    router.get("/api/get-all-locations", locationController.getAllLocations);
    router.post(
        "/api/create-new-locations",
        locationController.handleCreateNewLocations
    );
    router.put("/api/edit-locations", locationController.handleEditLocations);
    router.delete("/api/delete-locations", locationController.deleteLocations);

    router.get("/api/get-all-bustypes", busTypeController.getAllBusTypes);
    router.post("/api/create-new-bustype", busTypeController.createNewBusTypes);
    router.put("/api/edit-bustype", busTypeController.editBusTypes);
    router.delete("/api/delete-bustype", busTypeController.deleteBusTypes);

    router.get("/api/get-all-routes", routeController.getAllRoutes);
    router.post("/api/create-new-route", routeController.createNewRoute);
    router.put("/api/edit-route", routeController.editRoute);
    router.delete("/api/delete-route", routeController.deleteRoute);

    router.get("/api/get-all-bus", busController.getAllBus);
    router.post("/api/create-new-bus", busController.createNewBus);
    router.put("/api/edit-bus", busController.editBus);
    router.delete("/api/delete-bus", busController.deleteBus);

    router.get("/api/get-all-schedule", scheduleController.getAllSchedule);
    router.get("/api/show-all-schedule", scheduleController.shouldAllSchedule);
    router.post("/api/create-new-schedule", scheduleController.createSchedule);
    router.delete("/api/delete-schedule", scheduleController.deleteSchedule);

    router.get("/api/get-all-ticket", ticketController.getAllTickets);
    router.get("/api/get-driver-ticket", ticketController.getDriverTicket);
    router.get(
        "/api/get-driver-ticket-route",
        ticketController.getDriverTicketRoute
    );
    router.post("/api/create-new-ticket", ticketController.createTicket);
    router.post("/api/verify-ticket", ticketController.verifyTicket);
    router.put("/api/check-customer", ticketController.checkCustomerIsPresent);

    router.get("/api/get-all-coupons", couponController.getAllCoupons);
    router.post("/api/create-new-coupon", couponController.createCoupon);
    router.delete("/api/delete-coupon", couponController.deleteCoupon);
    router.put("/api/edit-coupon", couponController.editCoupon);
    router.get("/api/get-use-coupon", couponController.getUseCoupons);
    router.put("/api/use-coupon", couponController.useCoupon);

    router.get("/api/get-all-events", eventController.getAllEvents);
    router.post("/api/create-new-event", eventController.createNewEvent);
    router.put("/api/edit-event", eventController.editEvent);
    router.delete("/api/delete-event", eventController.deleteEvent);

    // router.delete("/api/delete-ticket", scheduleController.deleteSchedule);
    return app.use("/", router);
};

module.exports = initWebRoutes;
