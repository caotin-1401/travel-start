import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./RouteManage.scss";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import _ from "lodash";
import moment from "moment";
import localization from "moment/locale/vi";
import * as actions from "../../../../store/actions";
import { LANGUAGES } from "../../../../utils";
import ModalAdd from "./ModalAdd";
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
class RouteManage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenModel: false,
            isOpenModelEditUser: false,
            userEdit: {},
            listTrips: [],
            sortBy: "",
            sortField: "",
            keywordNumber: "",
            page: 0,
            rowsPerPage: 5,
        };
    }

    componentDidMount() {
        this.props.fetchAllScheduleTrip();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listSchedule !== this.props.listSchedule) {
            let test = this.props.listSchedule.filter(
                (item) => item.busOwnerId === this.props.userInfo.id
            );
            this.setState({
                listTrips: test,
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
        this.props.deleteSchedule(user.id);
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
    handleSort = (a, b) => {
        this.state.listTrips = _.orderBy(this.state.listTrips, [b], [a]);
        this.setState({
            sortBy: a,
            sortField: b,
            listTrips: this.state.listTrips,
        });
    };
    handleKeyword = (e, target) => {
        let term = e.target.value.toUpperCase();
        let clone = this.state.listTrips;
        if (term) {
            clone = clone.filter((item) => item.number.includes(term));
            this.setState({
                listTrips: clone,
            });
        } else {
            this.props.fetchAllVehicle();
        }
    };
    handleKeyword1 = (e) => {
        let term = e.target.value.toUpperCase();
        let clone = this.state.listTrips;
        if (term) {
            clone = clone.filter((item) =>
                item.BusType.typeName.includes(term)
            );
            this.setState({
                listTrips: clone,
            });
        } else {
            this.props.fetchAllVehicle();
        }
    };
    render() {
        let { page, rowsPerPage, listTrips } = this.state;
        return (
            <div className="container form-redux">
                <div className="user-container">
                    <ModalAdd
                        isOpen={this.state.isOpenModel}
                        toggleFromParent={this.toggleUserModel}
                        createNewUser1={this.createNewUser1}
                    />

                    <div className="title text-center">Quản lý chuyến đi</div>
                    <div className="mx-5 my-3">
                        <button
                            className="btn btn-primary px-3"
                            onClick={() => this.handleAddUser()}>
                            <i className="fas fa-plus px-1"></i>
                            Thêm
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
                                                <div> Tuyến đườnh </div>
                                                <div>
                                                    {" "}
                                                    <FaLongArrowAltDown
                                                        className="iconSortDown"
                                                        onClick={() =>
                                                            this.handleSort(
                                                                "asc",
                                                                "Route.name"
                                                            )
                                                        }
                                                    />
                                                    <FaLongArrowAltUp
                                                        className="iconSortDown"
                                                        onClick={() =>
                                                            this.handleSort(
                                                                "desc",
                                                                "Route.name"
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </th>
                                        <th
                                            style={{
                                                width: "12%",
                                            }}>
                                            <div className="section-title">
                                                <div>
                                                    {" "}
                                                    <FormattedMessage id="menu.busOwner.vehicle.bsx" />
                                                </div>
                                                <div>
                                                    {" "}
                                                    <FaLongArrowAltDown
                                                        className="iconSortDown"
                                                        onClick={() =>
                                                            this.handleSort(
                                                                "asc",
                                                                "Vehicle.number"
                                                            )
                                                        }
                                                    />
                                                    <FaLongArrowAltUp
                                                        className="iconSortDown"
                                                        onClick={() =>
                                                            this.handleSort(
                                                                "desc",
                                                                "Vehicle.number"
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </th>
                                        <th
                                            style={{
                                                width: "9%",
                                            }}>
                                            <div className="section-title">
                                                <div> Tai xế </div>
                                                <div>
                                                    {" "}
                                                    <FaLongArrowAltDown
                                                        className="iconSortDown"
                                                        onClick={() =>
                                                            this.handleSort(
                                                                "asc",
                                                                "User.name"
                                                            )
                                                        }
                                                    />
                                                    <FaLongArrowAltUp
                                                        className="iconSortDown"
                                                        onClick={() =>
                                                            this.handleSort(
                                                                "desc",
                                                                "User.name"
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </th>
                                        <th>
                                            <div
                                                className="section-title"
                                                // style={{
                                                //     width: "16%",
                                                // }}
                                            >
                                                <div> Ngay xuat phat </div>
                                                <div>
                                                    {" "}
                                                    <FaLongArrowAltDown
                                                        className="iconSortDown"
                                                        onClick={() =>
                                                            this.handleSort(
                                                                "asc",
                                                                "date"
                                                            )
                                                        }
                                                    />
                                                    <FaLongArrowAltUp
                                                        className="iconSortDown"
                                                        onClick={() =>
                                                            this.handleSort(
                                                                "desc",
                                                                "date"
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </th>
                                        <th
                                            style={{
                                                width: "15%",
                                            }}>
                                            <div className="section-title">
                                                <div> giờ xuất phát </div>
                                                <div>
                                                    {" "}
                                                    <FaLongArrowAltDown
                                                        className="iconSortDown"
                                                        onClick={() =>
                                                            this.handleSort(
                                                                "asc",
                                                                "timeType"
                                                            )
                                                        }
                                                    />
                                                    <FaLongArrowAltUp
                                                        className="iconSortDown"
                                                        onClick={() =>
                                                            this.handleSort(
                                                                "desc",
                                                                "timeType"
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </th>

                                        <th style={{ width: "10%" }}>Action</th>
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
                                        <td>
                                            <input
                                                className="form-control"
                                                onChange={(e) =>
                                                    this.handleKeyword2(e)
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className="form-control"
                                                onChange={(e) =>
                                                    this.handleKeyword3(e)
                                                }
                                            />
                                        </td>
                                        <td></td>
                                    </tr>
                                    {(rowsPerPage > 0
                                        ? listTrips.slice(
                                              page * rowsPerPage,
                                              page * rowsPerPage + rowsPerPage
                                          )
                                        : listTrips
                                    ).map((user, index) => {
                                        let start = moment(
                                            +user.timeStart
                                        ).format("ddd DD-MM-YYYY HH:mm");
                                        let end = moment(
                                            new Date(+user.timeEnd)
                                        ).format("ddd  DD-MM-YYYY  HH:mm");
                                        return (
                                            <tr key={index}>
                                                <td>{user.id}</td>

                                                <td>{user.Route.name}</td>
                                                <td>{user.Vehicle.number}</td>
                                                <td>{user.User.name}</td>
                                                <td>{start}</td>
                                                <td>{end}</td>
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
                                            colSpan={7}
                                            count={listTrips.length}
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
        listUsers: state.admin.users,
        listSchedule: state.admin.trips,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllScheduleTrip: () => dispatch(actions.fetchAllScheduleTrip()),
        deleteSchedule: (id) => dispatch(actions.deleteSchedule(id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RouteManage);
