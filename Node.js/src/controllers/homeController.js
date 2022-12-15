import db from "../models/index";
import CRUDService from "../services/CRUDService";

let getHomePage = async (req, res) => {
    let data = await db.User.findAll();
    try {
        return res.render("homepage.ejs", {
            data: JSON.stringify({}),
        });
    } catch (e) {
        console.log(e);
    }
    return res.render("homepage.ejs");
};

let getCRUD = (req, res) => {
    return res.render("crud.ejs");
};

let postCRUD = async (req, res) => {
    let message = await CRUDService.createNewUser(req.body);
    return res.redirect("/get-crud");
};

let displayGetCRUD = async (req, res) => {
    let data = await CRUDService.getAllUser();
    console.log(data);
    return res.render("displayCRUD.ejs", {
        data,
    });
};

let getEditCRUD = async (req, res) => {
    let userId = req.query.id;
    if (userId) {
        let userData = await CRUDService.getUserInfoById(userId);
        return res.render("editCRUD.ejs", { userData });
    } else {
        console.log(req.query.id);
    }

    return res.send("User not found!");
};

let putUserCRUD = async (req, res) => {
    let data = req.body;
    let allUsers = await CRUDService.updateUserData(data);
    return res.render("displayCRUD.ejs", { data: allUsers });
};

let deleteUserCRUD = async (req, res) => {
    let id = req.query.id;
    if (id) {
        await CRUDService.deleteUserById(id);
        return res.redirect("/get-crud");
    } else {
        return res.send("fail");
    }
};

module.exports = {
    getHomePage,
    getCRUD,
    postCRUD,
    displayGetCRUD,
    getEditCRUD,
    putUserCRUD,
    deleteUserCRUD,
};
