export const path = {
    HOME: "/",
    HOMEPAGE: "/home",
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
    LOG_OUT: "/logout",
    SYSTEM: "/system",
    BUSOWNER: "/busOwner",
    DRIVER: "/driver",
    ROUTE: `/home/route/:start&:end&:date`,
    VERIFY_EMAIL: `/verify-booking`,
    EVENTS: `/home/events`,
    EVENT: `/home/event/eventId=:id`,
    PROFILE: `/home/profile/userId=:id&:status`,
    PROFILE_ADMIN: `/profile/admin/userId=:id`,
    PROFILE_BUS: `/profile/busOwner/userId=:id`,
    PROFILE_DRIVER: `/profile/driver/userId=:id`,
};

export const LANGUAGES = {
    VI: "vi",
    EN: "en",
};

export const CRUD_ACTIONS = {
    CREATE: "CREATE",
    READ: "READ",
    EDIT: "EDIT",
    DELETE: "DELETE",
};

export const dateFormat = {
    SEND_TO_SERVER: "DD/MM/YYYY",
};

export const YesNoObj = {
    YES: "Y",
    NO: "N",
};

export const USER_ROLE = {
    ADMIN: "R1",
    BUSOWNER: "R2",
    DRIVER: "R3",
    PASSENGER: "R4",
};
