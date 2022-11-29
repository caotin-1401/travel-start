import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./UserManage.scss";

import { getAllCodeService } from "../../../../services/userService";
import * as actions from "../../../../store/actions";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../../utils";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css"; // This only needs to be imported once in your app
import ModalUser from "./ModalUser";
import ModalEditUser from "./ModalEditUser";
import {
    TableBody,
    TableContainer,
    TableFooter,
    TablePagination,
    TableRow,
    Paper,
    Table,
} from "@mui/material";
import TablePaginationActions from "../../../../components/TablePaginationActions";
class UserManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],
            isOpenModel: false,
            isOpenModelEditUser: false,
            userEdit: {},
            usersRedux: [],
        };
    }

    componentDidMount() {
        this.props.fetchUserRedux();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listUsers !== this.props.listUsers) {
            this.setState({
                usersRedux: this.props.listUsers,
            });
        }
    }

    //open modal
    toggleUserModel = () => {
        this.setState({
            isOpenModel: !this.state.isOpenModel,
        });
    };
    toggleUserEditModel = () => {
        this.setState({
            isOpenModelEditUser: !this.state.isOpenModelEditUser,
        });
    };
    handleAddUser = () => {
        this.setState({
            isOpenModel: true,
        });
    };
    handleEditUser = (user) => {
        this.setState({
            isOpenModelEditUser: true,
            userEdit: user,
        });
    };

    handleDeleteUser = (user) => {
        this.props.deleteUser(user.id);
    };

    doEditUser1 = (user) => {
        this.setState({
            isOpenModelEditUser: false,
        });
    };
    createNewUser1 = (data) => {
        this.setState({
            isOpenModel: false,
        });
    };

    render() {
        let arrUsers = this.state.usersRedux;

        return (
            <div className="user-container">
                <ModalUser
                    isOpen={this.state.isOpenModel}
                    toggleFromParent={this.toggleUserModel}
                    createNewUser1={this.createNewUser1}
                />
                {this.state.isOpenModelEditUser && (
                    <ModalEditUser
                        isOpen={this.state.isOpenModelEditUser}
                        toggleFromParent={this.toggleUserEditModel}
                        currentUser={this.state.userEdit}
                        doEditUser1={this.doEditUser1}
                    />
                )}

                <div className="title text-center">User manage</div>
                <div className="mx-5 my-3">
                    <button
                        className="btn btn-primary px-3"
                        onClick={() => this.handleAddUser()}>
                        <i className="fas fa-plus px-1"></i>
                        Add new user
                    </button>
                </div>
                <div className="use-table m-3">
                    <table id="customers">
                        <tbody>
                            <tr>
                                <th>Email</th>
                                <th>Name</th>
                                <th>Address</th>
                                <th>Role</th>
                                <th style={{ width: "15%" }}>Action</th>
                            </tr>
                            {arrUsers &&
                                arrUsers.map((user, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>{user.email}</td>
                                            <td>{user.name}</td>
                                            <td>{user.address}</td>
                                            <td>
                                                {user.roleID === "R1"
                                                    ? "Admin"
                                                    : user.roleID === "R2"
                                                    ? "Bus Owner"
                                                    : user.roleID === "R3"
                                                    ? "Driver"
                                                    : "Passenger"}
                                            </td>
                                            <td>
                                                <button
                                                    className="btn-edit"
                                                    onClick={() =>
                                                        this.handleEditUser(
                                                            user
                                                        )
                                                    }>
                                                    <i className="fas fa-user-edit"></i>
                                                </button>
                                                <button
                                                    className="btn-delete"
                                                    onClick={() =>
                                                        this.handleDeleteUser(
                                                            user
                                                        )
                                                    }>
                                                    <i className="fas fa-trash-alt"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        // roleRedux: state.admin.roles,
        // genderRedux: state.admin.gender,
        listUsers: state.admin.users,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
        deleteUser: (id) => dispatch(actions.deleteUser(id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
