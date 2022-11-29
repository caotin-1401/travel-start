import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./UserManage.scss";
import _ from "lodash";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";

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
            sortBy: "",
            sortField: "",
            keywordNumber: "",
            page: 0,
            rowsPerPage: 5,
        };
    }

    componentDidMount() {
        this.props.fetchUserRedux();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listUsers !== this.props.listUsers) {
            let test = this.props.listUsers.filter(
                (item) => item.busOwnerId === this.props.userInfo.id
            );
            this.setState({
                arrUsers: test,
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

    handleSort = (a, b) => {
        this.state.arrUsers = _.orderBy(this.state.arrUsers, [b], [a]);
        this.setState({
            sortBy: a,
            sortField: b,
            arrUsers: this.state.arrUsers,
        });
    };
    handleKeyword = (e) => {
        let term = e.target.value;
        let clone = this.state.arrUsers;
        if (term) {
            clone = clone.filter((item) => item.name.includes(term));
            console.log(clone);
            this.setState({
                arrUsers: clone,
            });
        } else {
            this.props.fetchUserRedux();
        }
    };
    handleKeyword1 = (e) => {
        console.log(e);
        let term = e.target.value;
        let clone = this.state.arrUsers;
        if (term) {
            clone = clone.filter((item) => item.email.includes(term));
            this.setState({
                arrUsers: clone,
            });
        } else {
            this.props.fetchAllVehicle();
        }
    };
    render() {
        let { page, rowsPerPage, arrUsers } = this.state;

        return (
            <div className="container form-redux">
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
                    <div style={{ marginTop: "50px" }}></div>

                    {/* <div className="user-container m-3"> */}
                    <TableContainer component={Paper} id="customers">
                        <Table>
                            <TableBody>
                                <tr>
                                    <th
                                        className="section-id"
                                        style={{
                                            width: "5%",
                                        }}
                                        onClick={() =>
                                            this.handleSort("asc", "id")
                                        }>
                                        Id
                                    </th>
                                    <th
                                        style={{
                                            width: "20%",
                                        }}>
                                        <div className="section-title">
                                            <div> Tên </div>
                                            <div>
                                                {" "}
                                                <FaLongArrowAltDown
                                                    className="iconSortDown"
                                                    onClick={() =>
                                                        this.handleSort(
                                                            "asc",
                                                            "name"
                                                        )
                                                    }
                                                />
                                                <FaLongArrowAltUp
                                                    className="iconSortDown"
                                                    onClick={() =>
                                                        this.handleSort(
                                                            "desc",
                                                            "name"
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </th>
                                    <th
                                        style={{
                                            width: "20%",
                                        }}>
                                        <div className="section-title">
                                            <div> email </div>
                                            <div>
                                                {" "}
                                                <FaLongArrowAltDown
                                                    className="iconSortDown"
                                                    onClick={() =>
                                                        this.handleSort(
                                                            "asc",
                                                            "email"
                                                        )
                                                    }
                                                />
                                                <FaLongArrowAltUp
                                                    className="iconSortDown"
                                                    onClick={() =>
                                                        this.handleSort(
                                                            "desc",
                                                            "email"
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </th>
                                    <th
                                        style={{
                                            width: "45%",
                                        }}>
                                        Address
                                    </th>
                                    <th
                                        style={{
                                            width: "10%",
                                        }}
                                        className="section-id-list">
                                        <FormattedMessage id="menu.admin.listLocations.action" />
                                    </th>
                                </tr>
                                <tr style={{ height: "50px" }}>
                                    <td></td>
                                    <td>
                                        <input
                                            className="form-control"
                                            // value={this.state.keywordNumber}
                                            onChange={(e) =>
                                                this.handleKeyword(e)
                                            }
                                        />
                                    </td>
                                    <td>
                                        <input
                                            className="form-control"
                                            // value={this.state.keywordNumber}
                                            onChange={(e) =>
                                                this.handleKeyword1(e)
                                            }
                                        />
                                    </td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                {arrUsers &&
                                    arrUsers.map((user, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{user.id}</td>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>{user.address}</td>
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
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                        rowsPerPageOptions={[
                                            5,
                                            10,
                                            25,
                                            { label: "All", value: -1 },
                                        ]}
                                        colSpan={6}
                                        count={arrUsers.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={this.handleChangePage}
                                        onRowsPerPageChange={
                                            this.handleChangeRowsPerPage
                                        }
                                        ActionsComponent={(subProps) => (
                                            <TablePaginationActions
                                                style={{ marginBottom: "12px" }}
                                                {...subProps}
                                            />
                                        )}
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                    {/* </div> */}
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
        userInfo: state.user.userInfo,
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
