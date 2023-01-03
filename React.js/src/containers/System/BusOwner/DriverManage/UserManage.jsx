import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "../style.scss";
import _ from "lodash";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import * as actions from "../../../../store/actions";
import ModalUser from "./ModalUser";
import ModalEditUser from "./ModalEditUser";
import { TableBody, TableContainer, TableFooter, TablePagination, TableRow, Paper, Table } from "@mui/material";
import TablePaginationActions from "../../../../components/TablePaginationActions";
import { withRouter } from "react-router";
import "../style.scss";

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
                (item) => item.Driver.busOwnerId && item.Driver.busOwnerId === this.props.userInfo.id
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
    handleChangePage = (event, newPage) => {
        this.setState({
            page: newPage,
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
        this.props.fetchUserRedux();
        this.setState({
            isOpenModel: false,
        });
    };

    handleSort = (a, b) => {
        let clone = this.state.arrUsers;
        clone = _.orderBy(clone, [b], [a]);
        this.setState({
            sortBy: a,
            sortField: b,
            arrUsers: clone,
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

    handleDriver = (item) => {
        if (this.props.history) {
            this.props.history.push(`/busOwner/history-driver=${item.id}`);
        }
    };
    render() {
        let { page, rowsPerPage, arrUsers } = this.state;
        let { language } = this.props;
        let mes1, mes2, mes3, mes4, mes5;
        if (language === "vi") {
            mes1 = "Tìm tài xế";
            mes2 = "Không chạy";
            mes3 = "Đang chạy";
            mes4 = "Xem thông tin cá nhân";
            mes5 = "Xóa tài xế";
        } else {
            mes1 = "Search driver";
            mes2 = "Inactive";
            mes3 = "On trip";
            mes4 = "Detail infomation";
            mes5 = "Delete";
        }
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

                    <div className="title text-center">
                        <FormattedMessage id="menu.busOwner.manageDriver.title" />
                    </div>
                    <div className="chart_title">
                        <div className="chart_item-left">
                            <div className="mx-5 my-3">
                                <button className="btn btn-primary px-3 w130" onClick={() => this.handleAddUser()}>
                                    <i className="fas fa-plus px-1 "></i>{" "}
                                    <FormattedMessage id="menu.busOwner.manageDriver.add" />
                                </button>
                            </div>
                        </div>
                        <div className="chart_item">
                            <input
                                placeholder={mes1}
                                className="form-control"
                                style={{ width: "280px", height: "38px" }}
                                onChange={(e) => this.handleKeyword(e)}
                            />
                        </div>
                    </div>

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
                                            width: "20%",
                                        }}>
                                        <div className="section-title">
                                            <div>
                                                <FormattedMessage id="account.Name" />
                                            </div>
                                            <div>
                                                <FaLongArrowAltDown
                                                    className="iconSortDown"
                                                    onClick={() => this.handleSort("asc", "name")}
                                                />
                                                <FaLongArrowAltUp
                                                    className="iconSortDown"
                                                    onClick={() => this.handleSort("desc", "name")}
                                                />
                                            </div>
                                        </div>
                                    </th>
                                    <th
                                        style={{
                                            width: "20%",
                                        }}>
                                        <div className="section-title">
                                            <div>
                                                {" "}
                                                <FormattedMessage id="account.phone" />{" "}
                                            </div>
                                        </div>
                                    </th>
                                    <th
                                        style={{
                                            width: "20%",
                                        }}>
                                        <FormattedMessage id="account.email" />
                                    </th>

                                    <th
                                        style={{
                                            width: "10%",
                                        }}
                                        className="section-id-list">
                                        <FormattedMessage id="menu.busOwner.manageDriver.status" />
                                    </th>
                                    <th
                                        className="section-id-list"
                                        style={{
                                            width: "15%",
                                        }}>
                                        <FormattedMessage id="menu.busOwner.manageDriver.history" />
                                    </th>
                                    <th></th>
                                </tr>

                                {arrUsers &&
                                    arrUsers.map((user, index) => {
                                        return (
                                            <tr key={index}>
                                                <td className="center">{user.id}</td>
                                                <td>{user.name}</td>
                                                <td>{user.phoneNumber}</td>
                                                <td>{user.email}</td>

                                                <td
                                                    style={{
                                                        textAlign: "center",
                                                    }}>
                                                    {user.Driver.status === 2 ? (
                                                        <div className="driver-run">{mes3}</div>
                                                    ) : (
                                                        <div className="driver-not-run">{mes2}</div>
                                                    )}
                                                </td>
                                                <td className="center">
                                                    <button
                                                        style={{
                                                            width: "100px",
                                                        }}
                                                        onClick={() => this.handleDriver(user)}
                                                        className="btn btn-primary">
                                                        <FormattedMessage id="menu.busOwner.manageDriver.history" />
                                                    </button>
                                                </td>
                                                <td className="center">
                                                    <button
                                                        title={mes4}
                                                        className="btn-edit"
                                                        onClick={() => this.handleEditUser(user)}>
                                                        <i className="fas fa-info-circle"></i>
                                                    </button>
                                                    <button
                                                        title={mes5}
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
                                            "& .css-194a1fa-MuiSelect-select-MuiInputBase-input  ": {
                                                fontSize: "15px",
                                            },
                                        }}
                                        rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                                        colSpan={7}
                                        count={arrUsers.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={this.handleChangePage}
                                        onRowsPerPageChange={this.handleChangeRowsPerPage}
                                        ActionsComponent={(subProps) => (
                                            <TablePaginationActions style={{ marginBottom: "12px" }} {...subProps} />
                                        )}
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        listUsers: state.admin.users,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
        deleteUser: (id) => dispatch(actions.deleteUser(id)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserManage));
