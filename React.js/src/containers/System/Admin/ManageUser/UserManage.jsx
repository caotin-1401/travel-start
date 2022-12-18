import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./UserManage.scss";
import {
    getAllUsers,
    deleteUserService,
} from "../../../../services/userService";
import _ from "lodash";

import * as actions from "../../../../store/actions";
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
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import { toast } from "react-toastify";
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
            sortBy: "",
            sortField: "",
            keywordNumber: "",
            page: 0,
            rowsPerPage: 5,
            isTest: false,
            test: [],
            test1: [],
        };
    }

    async componentDidMount() {
        await this.getAllAdmin();
    }

    getAllAdmin = async () => {
        let res = await getAllUsers("ALL");
        let listAdmin;
        if (res) {
            if (res.errCode === 0) {
                listAdmin = res.users.filter((item) => item.roleID === "R1");
                this.setState({
                    usersRedux: listAdmin,
                });
            }
        }
    };
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

    handleDeleteUser = async (user) => {
        let res = await deleteUserService(user.id);
        if (res && res.errCode === 0) {
            toast.success("xoa thanh cong");
            await this.getAllAdmin();
        } else {
            toast.error("xoa that bai");
            await this.getAllAdmin();
        }
    };

    createNewUser1 = async (data) => {
        await this.getAllAdmin();
        this.setState({
            isOpenModel: false,
        });
    };
    handleSort = (a, b) => {
        this.state.usersRedux = _.orderBy(this.state.usersRedux, [b], [a]);
        this.setState({
            sortBy: a,
            sortField: b,
            usersRedux: this.state.usersRedux,
        });
    };
    handleKeyword = (e) => {
        let term = e.target.value;
        let clone = this.state.usersRedux;
        if (term) {
            clone = clone.filter((item) => item.email.includes(term));
            this.setState({
                test1: clone,
                isTest: true,
            });
        } else {
            this.setState({
                isTest: false,
            });
            this.getAllAdmin();
        }
    };
    handleKeyword1 = async (e) => {
        let term = e.target.value;
        let clone = this.state.usersRedux;

        if (term) {
            clone = clone.filter((item) => item.phoneNumber.includes(term));
            this.setState({
                test1: clone,
                isTest: true,
            });
        } else {
            this.setState({
                isTest: false,
            });
            await this.getAllAdmin();
        }
    };
    render() {
        let { usersRedux, rowsPerPage, page, test, test1, isTest } = this.state;
        isTest === true ? (test = test1) : (test = usersRedux);

        return (
            <div className="container form-redux">
                <div className="user-container">
                    <ModalUser
                        usersRedux={usersRedux}
                        isOpen={this.state.isOpenModel}
                        toggleFromParent={this.toggleUserModel}
                        createNewUser1={this.createNewUser1}
                    />
                    {this.state.isOpenModelEditUser && (
                        <ModalEditUser
                            isOpen={this.state.isOpenModelEditUser}
                            toggleFromParent={this.toggleUserEditModel}
                            currentUser={this.state.userEdit}
                        />
                    )}
                    <div className="title text-center">
                        <FormattedMessage id="menu.admin.listAdmin.title" />
                    </div>
                    <div className="mx-5 my-3">
                        <button
                            className="btn btn-primary px-3"
                            onClick={() => this.handleAddUser()}>
                            <i className="fas fa-plus px-1"></i>
                            <FormattedMessage id="menu.admin.listAdmin.add" />
                        </button>
                    </div>
                    <div className="use-table m-3">
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
                                                width: "34%",
                                            }}>
                                            <div className="section-title">
                                                <div>
                                                    <FormattedMessage id="menu.admin.listAdmin.name" />
                                                </div>
                                                <div>
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

                                        <th>
                                            <div className="section-title">
                                                Email
                                            </div>
                                        </th>
                                        <th>
                                            <div className="section-title">
                                                <FormattedMessage id="menu.admin.listAdmin.phone" />
                                            </div>
                                        </th>

                                        <th style={{ width: "10%" }}>
                                            <FormattedMessage id="menu.admin.listAdmin.action" />
                                        </th>
                                    </tr>
                                    <tr style={{ height: "50px" }}>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            <input
                                                className="form-control"
                                                onChange={(e) =>
                                                    this.handleKeyword(e)
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className="form-control"
                                                onChange={(e) =>
                                                    this.handleKeyword1(e)
                                                }
                                            />
                                        </td>

                                        <td></td>
                                    </tr>
                                    {(rowsPerPage > 0 && test && test.length > 0
                                        ? test.slice(
                                              page * rowsPerPage,
                                              page * rowsPerPage + rowsPerPage
                                          )
                                        : test
                                    ).map((user, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{user.id}</td>

                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>{user.phoneNumber}</td>
                                                <td>
                                                    <button
                                                        title="Infomation Detail"
                                                        className="btn-edit"
                                                        onClick={() =>
                                                            this.handleEditUser(
                                                                user
                                                            )
                                                        }>
                                                        <i className="fas fa-info-circle"></i>
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
                                            sx={{
                                                "& .MuiTablePagination-selectLabel ":
                                                    {
                                                        display: "None",
                                                    },
                                                "& .MuiTablePagination-displayedRows  ":
                                                    {
                                                        marginTop: "10px",
                                                        fontSize: "15px",
                                                    },
                                                "& .css-194a1fa-MuiSelect-select-MuiInputBase-input  ":
                                                    {
                                                        fontSize: "15px",
                                                    },
                                            }}
                                            rowsPerPageOptions={[
                                                5,
                                                10,
                                                25,
                                                { label: "All", value: -1 },
                                            ]}
                                            colSpan={7}
                                            count={usersRedux.length}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            onPageChange={this.handleChangePage}
                                            onRowsPerPageChange={
                                                this.handleChangeRowsPerPage
                                            }
                                            ActionsComponent={(subProps) => (
                                                <TablePaginationActions
                                                    style={{
                                                        marginBottom: "12px",
                                                    }}
                                                    {...subProps}
                                                />
                                            )}
                                        />
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        // genderRedux: state.admin.gender,
        listUsers: state.admin.users,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
        deleteUser: (id) => dispatch(actions.deleteUser(id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
