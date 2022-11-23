export const adminMenu = [
    {
        //dashboard
        name: "menu.admin.dashboard",
        menus: [
            {
                name: "menu.admin.dashboard",
                link: "/system/dashboard",
            },
        ],
    },
    {
        //quản lý người dùng
        name: "menu.admin.manage-user",
        menus: [
            {
                name: "menu.admin.user-manage",
                link: "/system/user-manage",
            },
            {
                name: "menu.admin.crud-redux",
                link: "/system/user-redux",
            },
            {
                name: "menu.admin.manage-admin",
                link: "/system/admin-manage",
            },
            {
                name: "menu.admin.manage-busOnwer",
                link: "/system/busOnwer-manage",
            },
            {
                name: "menu.admin.manage-driver",
                link: "/system/driver-manage",
                // subMenus: [
                //     { name: 'menu.system.system-administrator.dashboard', link: '/system/dashboard' },
                //     { name: 'menu.system.system-administrator.user-manage', link: '/system/user-manage' },
                //     { name: 'menu.system.system-administrator.user-redux', link: '/system/user-redux' },
                // ]
            },
        ],
    },
    {
        //quản lý dich vu
        name: "menu.admin.services",
        menus: [
            { name: "menu.admin.list-bus", link: "/system/list-bus" },
            { name: "menu.admin.location", link: "/system/list-location" },
            { name: "menu.admin.route", link: "/system/list-route" },
        ],
    },
    {
        //quản lý khu vuc do xe
        name: "menu.admin.parking",
        menus: [
            {
                name: "menu.admin.parking-lot",
                link: "/system/parking-lot",
            },
            {
                name: "menu.admin.list-vehicle",
                link: "/system/list-vehicle",
            },
        ],
    },
    {
        //quản lý khu vuc do xe
        name: "menu.admin.promotions",
        menus: [
            {
                name: "menu.admin.event",
                link: "/system/event",
            },
            {
                name: "menu.admin.discount",
                link: "/system/discount",
            },
        ],
    },
    {
        //quản lý cẩm nang
        name: "menu.admin.handbook",
        menus: [
            {
                name: "menu.admin.blog",
                link: "/system/blog",
            },
        ],
    },
];

export const busOwnerMenu = [
    {
        //dashboard
        name: "menu.busOwner.dashboard",
        menus: [
            {
                name: "menu.busOwner.dashboard",
                link: "/busOwner/dashboard",
            },
        ],
    },
    {
        //quản lý tài nguyên
        name: "menu.busOwner.manage-bus",
        menus: [
            {
                name: "menu.busOwner.bus",
                link: "/busOwner/bus-manage",
            },
            {
                name: "menu.busOwner.driver",
                link: "/busOwner/driver-manage",
            },
        ],
    },
    {
        //quản lý sự kiện
        name: "menu.busOwner.events",
        menus: [
            { name: "menu.busOwner.event", link: "/busOwner/event-manage" },
        ],
    },
    {
        //quản lý khu vuc do xe
        name: "menu.busOwner.parking",
        menus: [
            {
                name: "menu.busOwner.parking-lot",
                link: "/busOwner/parking-lot",
            },
        ],
    },
    {
        //quản lý tueyens đường
        name: "menu.busOwner.routes",
        menus: [
            {
                name: "menu.busOwner.route",
                link: "/busOwner/manage-routes",
            },
        ],
    },
];

export const driverMenu = [
    {
        //quản lý khu vuc do xe
        name: "menu.admin.parking",
        menus: [
            {
                name: "menu.admin.parking-lot",
                link: "/driver/manage-parking",
            },
        ],
    },
    {
        //quản lý hanh khach
        name: "menu.admin.services",
        menus: [
            { name: "menu.admin.list-bus", link: "/driver/seatNo" },
            // { name: "menu.admin.location", link: "/driver/dashboard" },
        ],
    },
];
