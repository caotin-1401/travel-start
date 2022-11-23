import actionTypes from "../actions/actionTypes";

const initialState = {
    isLoadingRoles: false,
    roles: [],
    gender: [],
    listOfSeat: [],
    listOfTicketDisabled: [],
};

const adminReducer = (state = initialState, action) => {
    switch (action.type) {
        //role
        case actionTypes.FETCH_ROLE_START:
            let copyState = { ...state };
            copyState.isLoadingRoles = true;
            return {
                ...copyState,
            };
        case actionTypes.FETCH_ROLE_SUCCESS:
            state.roles = action.data;
            state.isLoadingRoles = false;
            return {
                ...state,
            };
        case actionTypes.FETCH_ROLE_FAILED:
            state.roles = [];
            state.isLoadingRoles = false;
            return {
                ...state,
            };

        //gender
        case actionTypes.FETCH_GENDER_SUCCESS:
            state.gender = action.data;
            return {
                ...state,
            };
        case actionTypes.FETCH_GENDER_FAILED:
            state.gender = [];
            return {
                ...state,
            };

        case actionTypes.FETCH_ALL_USERS_SUCCESS:
            state.users = action.users;
            return {
                ...state,
            };

        case actionTypes.FETCH_ALL_USERS_FAILED:
            state.users = [];
            return {
                ...state,
            };

        case actionTypes.FETCH_LOCATION_SUCCESS:
            state.locations = action.locations;
            return {
                ...state,
            };

        case actionTypes.FETCH_LOCATION_FAILED:
            state.locations = [];
            return {
                ...state,
            };

        case actionTypes.FETCH_BUS_TYPES_SUCCESS:
            state.busTypes = action.busTypes;
            return {
                ...state,
            };

        case actionTypes.FETCH_BUS_TYPES_FAILED:
            state.busTypes = [];
            return {
                ...state,
            };

        case actionTypes.FETCH_ROUTES_SUCCESS:
            state.routes = action.routes;
            return {
                ...state,
            };

        case actionTypes.FETCH_ROUTES_FAILED:
            state.routes = [];
            return {
                ...state,
            };

        case actionTypes.FETCH_VEHICLES_SUCCESS:
            state.vehicles = action.vehicles;
            return {
                ...state,
            };

        case actionTypes.FETCH_VEHICLES_FAILED:
            state.vehicles = [];
            return {
                ...state,
            };

        //schedule
        case actionTypes.FETCH_SCHEDULES_SUCCESS:
            state.trips = action.trips;
            console.log(action.trips);
            return {
                ...state,
            };

        case actionTypes.FETCH_SCHEDULES_FAILED:
            state.trips = [];
            return {
                ...state,
            };
        case actionTypes.FETCH_ARR_SEAT_SUCCESS:
            //topDoctors la state khai bao o tren
            //dataDoctors laf cai nhan dc tu adminActions
            state.listOfSeat = action.dataSeat;
            return {
                ...state,
            };

        case actionTypes.FETCH_ARR_SEAT_FAILED:
            state.listOfSeat = [];
            return {
                ...state,
            };
        case actionTypes.FETCH_TICKET_SUCCESS:
            state.listOfTicketDisabled = action.tickets;
            return {
                ...state,
            };

        case actionTypes.FETCH_TICKET_FAILED:
            state.listOfTicketDisabled = [];
            return {
                ...state,
            };

        //event
        case actionTypes.FETCH_EVENT_SUCCESS:
            state.events = action.events;
            return {
                ...state,
            };

        case actionTypes.FETCH_EVENT_FAILED:
            state.events = [];
            return {
                ...state,
            };

        //coupon
        case actionTypes.FETCH_COUPON_SUCCESS:
            state.coupons = action.coupons;
            return {
                ...state,
            };

        case actionTypes.FETCH_COUPON_FAILED:
            state.coupons = [];
            return {
                ...state,
            };
        default:
            return state;
    }
};

export default adminReducer;
