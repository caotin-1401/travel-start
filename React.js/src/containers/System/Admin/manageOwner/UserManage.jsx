import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "../style.scss";
import { withRouter } from "react-router";
import { getAllUsers, deleteUserService } from "../../../../services/userService";
import ModalUser from "./ModalUser";
import {
    TableBody,
    TableContainer,
    TableFooter,
    TablePagination,
    TableRow,
    Paper,
    Table,
} from "@mui/material";
import { toast } from "react-toastify";
import TablePaginationActions from "../../../../components/TablePaginationActions";
class ManageOwner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],
            isOpenModel: false,
            userEdit: {},
            usersRedux: [],
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
                listAdmin = res.users.filter((item) => item.roleID === "R2");
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

    handleAddUser = () => {
        this.setState({
            isOpenModel: true,
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
    handleDriver = (item) => {
        console.log(item);
        if (this.props.history) {
            this.props.history.push(`/system/busOnwer/driver_busOnwer=${item.id}`);
        }
    };
    handleVehicle = (item) => {
        console.log(item);
        if (this.props.history) {
            this.props.history.push(`/system/busOnwer/vehicle_busOnwer=${item.id}`);
        }
    };
    handleKeyword = (e) => {
        let term = e.target.value;
        let clone = this.state.usersRedux;
        if (term) {
            clone = clone.filter((item) => item.name.includes(term));
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
        isTest === true ? (test = test1) : (test = usersRedux);
        let { language } = this.props;
        let mes;
        if (language === "vi") {
            mes = "Tìm nhà xe";
        } else {
            mes = "Search bus company";
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

                    <div className="title text-center">
                        <FormattedMessage id="menu.admin.listOwner.title" />
                    </div>
                    <div className="chart_title">
                        <div className="chart_item-left">
                            <div className="mx-5 my-3">
                                <button
                                    className="btn btn-primary px-3 w130"
                                    onClick={() => this.handleAddUser()}>
                                    <i className="fas fa-plus px-1"></i>
                                    <FormattedMessage id="menu.admin.listOwner.add" />
                                </button>
                            </div>
                        </div>
                        <div className="chart_item">
                            <input
                                placeholder={mes}
                                className="form-control"
                                style={{ width: "280px", height: "38px" }}
                                onChange={(e) => this.handleKeyword(e)}
                            />
                        </div>
                    </div>

                    <div className="use-table m-3">
                        <TableContainer component={Paper} id="customers">
                            <Table>
                                <TableBody>
                                    <tr>
                                        <th
                                            className="section-id w5"
                                            onClick={() => this.handleSort("asc", "id")}>
                                            Id
                                        </th>
                                        <th className="w20">
                                            <div className="section-title">
                                                <FormattedMessage id="menu.admin.listOwner.name" />
                                            </div>
                                        </th>
                                        <th className="w15">
                                            <div className="section-title">
                                                <FormattedMessage id="account.email" />
                                            </div>
                                        </th>
                                        <th className="w15">
                                            <div className="section-title">
                                                <FormattedMessage id="account.phone" />
                                            </div>
                                        </th>
                                        <th className="w15">
                                            <div className="section-title">
                                                <FormattedMessage id="menu.admin.listOwner.driver" />
                                            </div>
                                        </th>
                                        <th className="w20">
                                            <div className="section-title">
                                                <FormattedMessage id="menu.admin.listOwner.vehicle" />
                                            </div>
                                        </th>
                                        <th style={{ width: "10%" }} className="center">
                                            <FormattedMessage id="menu.admin.listOwner.action" />
                                        </th>
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
                                                        onClick={() => this.handleDriver(user)}
                                                        className="btn btn-primary w130">
                                                        <FormattedMessage id="menu.admin.listOwner.driver" />
                                                    </button>
                                                </td>
                                                <td className="center">
                                                    <button
                                                        className="btn btn-info w200"
                                                        onClick={() => this.handleVehicle(user)}>
                                                        <FormattedMessage id="menu.admin.listOwner.vehicle" />
                                                    </button>
                                                </td>
                                                <td className="center">
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
                                            colSpan={7}
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
    return {};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ManageOwner));
