import actionTypes from "./actionTypes";
import {
    getAllCity,
    createNewUserService,
    getAllCodeService,
    getAllUsers,
    deleteUserService,
    editUserService,
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
    deleteScheduleService,
    saveBulkScheduleTrip,
    getAllTickets,
    getAllEventsService,
    getAllCouponService,
    getAllPassengers,
} from "../../services/userService";
import { toast } from "react-toastify";

export const fetchRoleStart = () => {
    return async (dispatch, getState) => {
        try {
            dispatch({ type: actionTypes.FETCH_ROLE_START });
            let res = await getAllCodeService("ROLE");
            if (res && res.errCode === 0) {
                dispatch(fetchRoleSuccess(res.data));
            } else {
                dispatch(fetchRoleFailed());
            }
        } catch (e) {
            dispatch(fetchRoleFailed());
        }
    };
};

export const fetchRoleSuccess = (roleData) => ({
    type: actionTypes.FETCH_ROLE_SUCCESS,
    data: roleData,
});

export const fetchRoleFailed = () => ({
    type: actionTypes.FETCH_ROLE_FAILED,
});

export const fetchGenderStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService("GENDER");
            if (res && res.errCode === 0) {
                dispatch(fetchGenderSuccess(res.data));
            } else {
                dispatch(fetchGenderFailed());
            }
        } catch (e) {
            dispatch(fetchGenderFailed());
        }
    };
};
export const fetchGenderSuccess = (genderData) => ({
    type: actionTypes.FETCH_GENDER_SUCCESS,
    data: genderData,
});

export const fetchGenderFailed = () => ({
    type: actionTypes.FETCH_GENDER_FAILED,
});

export const createNewUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await createNewUserService(data);

            if (res && res.errCode === 0) {
                toast.success("Create a new user success!");
                dispatch(saveUserSuccess());
                dispatch(fetchAllUsersStart());
            } else {
                alert(res.errMessage);
                dispatch(saveUserFailed());
            }
        } catch (e) {
            dispatch(saveUserFailed());
        }
    };
};

export const saveUserSuccess = (data) => ({
    type: actionTypes.CREATE_USER_SUCCESS,
    data,
});

export const saveUserFailed = () => ({
    type: actionTypes.CREATE_USER_FAILED,
});
export const fetchAllPassenger = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllPassengers("ALL");
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ALL_PASSENGERS_SUCCESS,
                    users: res.users,
                }); // trong cai dispatch la action truyen di
            } else {
                dispatch({
                    type: actionTypes.FETCH_ALL_PASSENGERS_FAILED,
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.FETCH_ALL_PASSENGERS_FAILED,
            });
        }
    };
};
export const fetchAllUsersStart = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllUsers("ALL");
            if (res && res.errCode === 0) {
                // let users = res.users.reverse()
                dispatch(fetchAllUsersSuccess(res.users));
            } else {
                alert(res.errMessage);
                dispatch(fetchAllUsersFailed());
            }
        } catch (e) {
            dispatch(fetchAllUsersFailed());
        }
    };
};
export const fetchAllUsersSuccess = (data) => ({
    type: actionTypes.FETCH_ALL_USERS_SUCCESS,
    users: data,
});

export const fetchAllUsersFailed = () => ({
    type: actionTypes.FETCH_ALL_USERS_FAILED,
});

export const deleteUser = (userId) => {
    return async (dispatch, getState) => {
        try {
            let res = await deleteUserService(userId);
            if (res && res.errCode === 0) {
                toast.success("Delete the user success!");
                dispatch(delateUserSuccess());
                dispatch(fetchAllUsersStart());
            } else {
                alert(res.errMessage);
                dispatch(delateUserFailed());
            }
        } catch (e) {
            dispatch(delateUserFailed());
        }
    };
};

export const delateUserSuccess = (userId) => ({
    type: actionTypes.DELETE_USER_SUCCESS,
    users: userId,
});

export const delateUserFailed = () => ({
    type: actionTypes.DELETE_USER_FAILED,
});

export const EditUser = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await editUserService(data);
            if (res && res.errCode === 0) {
                toast.success("Update the user success!");
                dispatch(editUserSuccess());
                dispatch(fetchAllUsersStart());
            } else {
                alert(res.errMessage);
                dispatch(editUserFailed());
            }
        } catch (e) {
            dispatch(editUserFailed());
        }
    };
};

export const editUserSuccess = (data) => ({
    type: actionTypes.EDIT_USER_SUCCESS,
    users: data,
});

export const editUserFailed = () => ({
    type: actionTypes.EDIT_USER_FAILED,
});

//locaton
export const createNewLocation = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await createNewLocationService(data);
            if (res && res.errCode === 0) {
                toast.success("Create a new location success!");
                dispatch({
                    type: actionTypes.CREATE_LOCATION_SUCCESS,
                    locations: res.data,
                });
                dispatch(fetchAllLocation());
            } else {
                alert(res.errMessage);
                dispatch({
                    type: actionTypes.CREATE_LOCATION_FAILED,
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.CREATE_LOCATION_FAILED,
            });
        }
    };
};
export const fetchAllCity = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCity("ALL");
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_CITY_SUCCESS,
                    city: res.city,
                }); // trong cai dispatch la action truyen di
            } else {
                dispatch({
                    type: actionTypes.FETCH_CITY_FAILED,
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.FETCH_CITY_FAILED,
            });
        }
    };
};
export const fetchAllLocation = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllLocationService("ALL");
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_LOCATION_SUCCESS,
                    locations: res.locations,
                }); // trong cai dispatch la action truyen di
            } else {
                dispatch({
                    type: actionTypes.FETCH_LOCATION_FAILED,
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.FETCH_LOCATION_FAILED,
            });
        }
    };
};

export const deleteLocation = (userId) => {
    return async (dispatch, getState) => {
        try {
            let res = await deleteLocationService(userId);
            if (res && res.errCode === 0) {
                toast.success("Delete the location success!");
                dispatch({
                    type: actionTypes.DELETE_LOCATION_SUCCESS,
                    location: res.userId,
                });
                dispatch(fetchAllLocation());
            } else {
                alert(res.errMessage);
                dispatch({
                    type: actionTypes.DELETE_LOCATION_FAILED,
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_LOCATION_FAILED,
            });
        }
    };
};

export const EditLocation = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await editLocationService(data);
            if (res && res.errCode === 0) {
                toast.success("Update the user success!");
                dispatch({
                    type: actionTypes.EDIT_LOCATION_SUCCESS,
                    locations: res.data,
                });
                dispatch(fetchAllLocation());
            } else {
                alert(res.errMessage);
                dispatch({
                    type: actionTypes.EDIT_LOCATION_FAILED,
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.EDIT_LOCATION_FAILED,
            });
        }
    };
};

//BusType
export const createNewBusType = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await createNewBusTypeService(data);
            if (res && res.errCode === 0) {
                toast.success("Create a new bus type success!");
                dispatch({
                    type: actionTypes.CREATE_BUS_TYPE_SUCCESS,
                    busTypes: res.data,
                });
                dispatch(fetchAllBusType());
            } else {
                alert(res.errMessage);
                dispatch({
                    type: actionTypes.CREATE_BUS_TYPE_FAILED,
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.CREATE_BUS_TYPE_FAILED,
            });
        }
    };
};

export const fetchAllBusType = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllBusTypesService("ALL");
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_BUS_TYPES_SUCCESS,
                    busTypes: res.busTypes,
                }); // trong cai dispatch la action truyen di
            } else {
                dispatch({
                    type: actionTypes.FETCH_BUS_TYPES_FAILED,
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.FETCH_BUS_TYPES_FAILED,
            });
        }
    };
};

export const deleteBusType = (userId) => {
    return async (dispatch, getState) => {
        try {
            let res = await deleteBusTypeService(userId);
            if (res && res.errCode === 0) {
                toast.success("Delete the bus type success!");
                dispatch({
                    type: actionTypes.DELETE_BUS_TYPE_SUCCESS,
                    busTypes: res.userId,
                });
                dispatch(fetchAllBusType());
            } else {
                alert(res.errMessage);
                dispatch({
                    type: actionTypes.DELETE_BUS_TYPE_FAILED,
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_BUS_TYPE_FAILED,
            });
        }
    };
};

export const EditBusType = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await editBusTypeService(data);
            if (res && res.errCode === 0) {
                toast.success("Update the bus type success!");
                dispatch({
                    type: actionTypes.EDIT_BUS_TYPE_SUCCESS,
                    busTypes: res.data,
                });
                dispatch(fetchAllBusType());
            } else {
                alert(res.errMessage);
                dispatch({
                    type: actionTypes.EDIT_BUS_TYPE_FAILED,
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.EDIT_LOCATION_FAILED,
            });
        }
    };
};

//Route
export const createNewRoute = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await createNewRouteService(data);
            if (res && res.errCode === 0) {
                toast.success("Create a new route success!");
                dispatch({
                    type: actionTypes.CREATE_ROUTE_SUCCESS,
                    routes: res.data,
                });
                dispatch(fetchAllRoute());
            } else {
                alert(res.errMessage);
                dispatch({
                    type: actionTypes.CREATE_ROUTE_FAILED,
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.CREATE_ROUTE_FAILED,
            });
        }
    };
};

export const fetchAllRoute = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllRoutesService("ALL");
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ROUTES_SUCCESS,
                    routes: res.routes,
                }); // trong cai dispatch la action truyen di
            } else {
                dispatch({
                    type: actionTypes.FETCH_ROUTES_FAILED,
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.FETCH_ROUTES_FAILED,
            });
        }
    };
};

export const deleteRoute = (userId) => {
    return async (dispatch, getState) => {
        try {
            let res = await deleteRouteService(userId);
            if (res && res.errCode === 0) {
                toast.success("Delete the bus type success!");
                dispatch({
                    type: actionTypes.DELETE_ROUTE_SUCCESS,
                    routes: res.userId,
                });
                dispatch(fetchAllRoute());
            } else {
                alert(res.errMessage);
                dispatch({
                    type: actionTypes.DELETE_ROUTE_FAILED,
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_ROUTE_FAILED,
            });
        }
    };
};

export const EditRoute = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await editRouteService(data);
            if (res && res.errCode === 0) {
                toast.success("Update the bus type success!");
                dispatch({
                    type: actionTypes.EDIT_ROUTE_SUCCESS,
                    routes: res.data,
                });
                dispatch(fetchAllRoute());
            } else {
                alert(res.errMessage);
                dispatch({
                    type: actionTypes.EDIT_ROUTE_FAILED,
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.EDIT_ROUTE_FAILED,
            });
        }
    };
};

//Vehicle
export const createNewVehicle = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await createNewVehicleService(data);
            if (res && res.errCode === 0) {
                toast.success("Create a new vehicle success!");
                dispatch({
                    type: actionTypes.CREATE_VEHICLE_SUCCESS,
                    vehicles: res.data,
                });
                dispatch(fetchAllVehicle());
            } else {
                alert(res.errMessage);
                dispatch({
                    type: actionTypes.CREATE_VEHICLE_FAILED,
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.CREATE_VEHICLE_FAILED,
            });
        }
    };
};

export const fetchAllVehicle = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllVehiclesService("ALL");
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_VEHICLES_SUCCESS,
                    vehicles: res.vehicles,
                }); // trong cai dispatch la action truyen di
            } else {
                dispatch({
                    type: actionTypes.FETCH_VEHICLES_FAILED,
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.FETCH_VEHICLES_FAILED,
            });
        }
    };
};

export const deleteVehicle = (userId) => {
    return async (dispatch, getState) => {
        try {
            let res = await deleteVehicleService(userId);
            if (res && res.errCode === 0) {
                toast.success("Delete the vehicle success!");
                dispatch({
                    type: actionTypes.DELETE_VEHICLE_SUCCESS,
                    vehicles: res.userId,
                });
                dispatch(fetchAllVehicle());
            } else {
                // alert(res.errMessage);
                dispatch({
                    type: actionTypes.DELETE_VEHICLE_FAILED,
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_VEHICLE_FAILED,
            });
        }
    };
};

export const EditVehicle = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await editVehicleService(data);
            if (res && res.errCode === 0) {
                toast.success("Update the vehicle success!");
                dispatch({
                    type: actionTypes.EDIT_VEHICLE_SUCCESS,
                    vehicles: res.data,
                });
                dispatch(fetchAllVehicle());
            } else {
                // alert(res.errMessage);
                dispatch({
                    type: actionTypes.EDIT_VEHICLE_FAILED,
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.EDIT_VEHICLE_FAILED,
            });
        }
    };
};

//schedule

export const createNewSchedule = (data) => {
    return async (dispatch, getState) => {
        try {
            let res = await saveBulkScheduleTrip(data);
            if (res && res.errCode === 0) {
                toast.success("Create a new vehicle success!");
                dispatch({
                    type: actionTypes.CREATE_SCHEDULES_SUCCESS,
                    trips: res.data,
                });
                dispatch(fetchAllScheduleTrip());
            } else {
                alert(res.errMessage);
                dispatch({
                    type: actionTypes.CREATE_SCHEDULES_FAILED,
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.CREATE_SCHEDULES_FAILED,
            });
        }
    };
};
export const fetchAllScheduleTrip = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllScheduleService("ALL");
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_SCHEDULES_SUCCESS,
                    trips: res.trips,
                }); // trong cai dispatch la action truyen di
            } else {
                console.log("FETCH_SCHEDULES_FAILED");
                dispatch({
                    type: actionTypes.FETCH_SCHEDULES_FAILED,
                });
            }
        } catch (e) {
            console.log("FETCH_SCHEDULES_FAILED: ", e);
            dispatch({
                type: actionTypes.FETCH_SCHEDULES_FAILED,
            });
        }
    };
};
export const deleteSchedule = (userId) => {
    return async (dispatch, getState) => {
        try {
            let res = await deleteScheduleService(userId);
            if (res && res.errCode === 0) {
                toast.success("Delete the bus type success!");
                dispatch({
                    type: actionTypes.DELETE_SCHEDULES_SUCCESS,
                    trips: res.userId,
                });
                dispatch(fetchAllScheduleTrip());
            } else {
                alert(res.errMessage);
                dispatch({
                    type: actionTypes.DELETE_SCHEDULES_FAILED,
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.DELETE_SCHEDULES_FAILED,
            });
        }
    };
};

export const fetchAllArrSeat = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCodeService("SEAT");
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_ARR_SEAT_SUCCESS,
                    dataSeat: res.data,
                }); // trong cai dispatch la action truyen di
            } else {
                console.log("FETCH_ARR_SEAT_FAILED");
                dispatch({
                    type: actionTypes.FETCH_ARR_SEAT_FAILED,
                });
            }
        } catch (e) {
            console.log("FETCH_ARR_SEAT_FAILED: ", e);
            dispatch({
                type: actionTypes.FETCH_ARR_SEAT_FAILED,
            });
        }
    };
};

export const fetchAllTickets = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllTickets("ALL");
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_TICKET_SUCCESS,
                    tickets: res.tickets,
                }); // trong cai dispatch la action truyen di
            } else {
                console.log("FETCH_TICKET_FAILED");
                dispatch({
                    type: actionTypes.FETCH_TICKET_FAILED,
                });
            }
        } catch (e) {
            console.log("FETCH_TICKET_FAILED: ", e);
            dispatch({
                type: actionTypes.FETCH_TICKET_FAILED,
            });
        }
    };
};

///events
export const fetchAllEvents = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllEventsService("ALL");
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_EVENT_SUCCESS,
                    events: res.events,
                }); // trong cai dispatch la action truyen di
            } else {
                console.log("FETCH_EVENT_FAILED");
                dispatch({
                    type: actionTypes.FETCH_EVENT_FAILED,
                });
            }
        } catch (e) {
            console.log("FETCH_EVENT_FAILED: ", e);
            dispatch({
                type: actionTypes.FETCH_EVENT_FAILED,
            });
        }
    };
};

///coupon
export const fetchAllCoupon = () => {
    return async (dispatch, getState) => {
        try {
            let res = await getAllCouponService("ALL");
            if (res && res.errCode === 0) {
                dispatch({
                    type: actionTypes.FETCH_COUPON_SUCCESS,
                    coupons: res.coupons,
                });
            } else {
                dispatch({
                    type: actionTypes.FETCH_COUPON_FAILED,
                });
            }
        } catch (e) {
            dispatch({
                type: actionTypes.FETCH_COUPON_FAILED,
            });
        }
    };
};
