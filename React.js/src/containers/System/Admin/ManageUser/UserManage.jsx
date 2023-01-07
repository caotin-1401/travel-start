import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "../style.scss";
import { getAllUsers, deleteUserService } from "../../../../services/userService";
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
        let { language } = this.props;
        if (res && res.errCode === 0) {
            if (language === "vi") toast.success("Xóa thành công");
            else toast.success("Delete successfully");
            await this.getAllAdmin();
        } else {
            if (language === "vi") toast.success("Xóa thất bại");
            else toast.success("Delete failed");
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
        let clone = this.state.usersRedux;
        clone = _.orderBy(clone, [b], [a]);
        this.setState({
            sortBy: a,
            sortField: b,
            usersRedux: clone,
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
    handleChangePage = (event, newPage) => {
        this.setState({
            page: newPage,
        });
    };
    handleChangeRowsPerPage = (event) => {
        this.setState({
            rowsPerPage: parseInt(event.target.value),
            page: 0,
        });
    };
    render() {
        let { usersRedux, rowsPerPage, page, test, test1, isTest } = this.state;
        let { language } = this.props;
        isTest === true ? (test = test1) : (test = usersRedux);
        let mes1, mes2;
        if (language === "vi") {
            mes1 = "Tìm người dùng";
            mes2 = "Tìm số điện thoại";
        } else {
            mes1 = "search user";
            mes2 = "search phone number";
        }
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
                                            onClick={() => this.handleSort("asc", "id")}>
                                            Id
                                        </th>
                                        <th
                                            style={{
                                                width: "34%",
                                            }}>
                                            <div className="section-title">
                                                <FormattedMessage id="menu.admin.listAdmin.name" />
                                                <div>
                                                    <FaLongArrowAltDown
                                                        className="iconSortDown"
                                                        onClick={() =>
                                                            this.handleSort("asc", "name")
                                                        }
                                                    />
                                                    <FaLongArrowAltUp
                                                        className="iconSortDown"
                                                        onClick={() =>
                                                            this.handleSort("desc", "name")
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </th>

                                        <th>
                                            <div className="section-title">
                                                <FormattedMessage id="account.email" />
                                            </div>
                                        </th>
                                        <th>
                                            <div className="section-title">
                                                <FormattedMessage id="menu.admin.listAdmin.phone" />
                                            </div>
                                        </th>

                                        <th style={{ width: "10%" }}></th>
                                    </tr>
                                    <tr style={{ height: "50px" }}>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            <input
                                                placeholder={mes1}
                                                className="form-control"
                                                onChange={(e) => this.handleKeyword(e)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                placeholder={mes2}
                                                className="form-control"
                                                onChange={(e) => this.handleKeyword1(e)}
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
                                                <td className="center">{user.id}</td>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>{user.phoneNumber}</td>
                                                <td className="center">
                                                    <button
                                                        title="Infomation Detail"
                                                        className="btn-edit"
                                                        onClick={() => this.handleEditUser(user)}>
                                                        <i className="fas fa-info-circle"></i>
                                                    </button>
                                                    <button
                                                        className="btn-delete"
                                                        onClick={() => this.handleDeleteUser(user)}>
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
                                                "& .MuiTablePagination-selectLabel ": {
                                                    display: "None",
                                                },
                                                "& .MuiTablePagination-displayedRows  ": {
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
                                            colSpan={5}
                                            count={usersRedux.length}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            onPageChange={this.handleChangePage}
                                            onRowsPerPageChange={this.handleChangeRowsPerPage}
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
        listUsers: state.admin.users,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
