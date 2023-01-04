import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "../style.scss";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import _ from "lodash";
import moment from "moment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "dayjs/locale/vi";
import localization from "moment/locale/vi";
import * as actions from "../../../../store/actions";
import { Row, Col } from "reactstrap";
import { getScheduleFromBusCompany } from "../../../../services/userService";
import ModalAdd from "./ModalAdd";
import {
    TableBody,
    TableContainer,
    TableFooter,
    TablePagination,
    TableRow,
    Paper,
    Table,
    Stack,
    TextField,
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
            rowsPerPage: 6,
            isAll: true,
            dateStartTrip: "",
            isTest: false,
            test: [],
            test1: [],
            listTripsFromDay: [],
        };
    }

    async componentDidMount() {
        this.setState({
            dateStartTrip: moment(new Date()).format("MM/DD/YYYY"),
        });
        await this.getAllTrips();
    }
    getAllTrips = async () => {
        let id = this.props.userInfo.id;
        let res = await getScheduleFromBusCompany(id);
        if (res && res.errCode === 0) {
            this.setState({ listTrips: res.trips });
        }
    };
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.listTrips !== this.state.listTrips) {
            let test1;
            if (this.state.dateStartTrip.length === 10) {
                let test2 = moment(new Date().getTime()).format("L");
                let str = "00:00";
                let [day, month, year] = test2.split("/");
                let [hours, minutes] = str.split(":");
                let date1 = new Date(+year, month - 1, +day, +hours, +minutes);
                console.log(date1.getTime());
                test1 = this.state.listTrips.filter((item) => +item.dateStart === date1.getTime());
            } else {
                test1 = this.state.listTrips.filter(
                    (item) => +item.dateStart === this.state.dateStartTrip
                );
            }
            this.setState({
                listTripsFromDay: test1,
            });
        }
    }

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
    createTripSuccess = async (data) => {
        await this.getAllTrips();
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
        let clone = this.state.listTrips;
        clone = _.orderBy(clone, [b], [a]);
        this.setState({
            sortBy: a,
            sortField: b,
            listTrips: clone,
        });
    };
    handleKeyword = (e) => {
        if (this.state.isAll === false) {
            let term = e.target.value.toUpperCase();
            let clone = this.state.listTrips;
            if (term) {
                clone = clone.filter((item) => item.Vehicle.number.includes(term));
                this.setState({
                    test1: clone,
                    isTest: true,
                });
            } else {
                this.setState({
                    isTest: false,
                });
                this.getAllTrips();
            }
        } else {
            let term = e.target.value.toUpperCase();
            let clone = this.state.listTripsFromDay;
            if (term) {
                clone = clone.filter((item) => item.Vehicle.number.includes(term));
                this.setState({
                    test1: clone,
                    isTest: true,
                });
            } else {
                this.setState({
                    isTest: false,
                });
                this.getAllTrips();
            }
        }
    };
    handleKeyword1 = (e) => {
        if (this.state.isAll === false) {
            let term = e.target.value;
            let clone = this.state.listTrips;
            if (term) {
                clone = clone.filter((item) => item.User.name.includes(term));
                this.setState({
                    test1: clone,
                    isTest: true,
                });
            } else {
                this.setState({
                    isTest: false,
                });
                this.getAllTrips();
            }
        } else {
            let term = e.target.value;
            let clone = this.state.listTripsFromDay;
            if (term) {
                clone = clone.filter((item) => item.User.name.includes(term));
                this.setState({
                    test1: clone,
                    isTest: true,
                });
            } else {
                this.setState({
                    isTest: false,
                });
                this.getAllTrips();
            }
        }
    };
    handleChoose = (isAll) => {
        this.setState({
            isAll: isAll,
        });
        if (isAll === false) {
            this.setState({
                listTripsFromDay: this.state.listTrips,
            });
        } else {
            let test1;
            if (this.state.dateStartTrip.length === 10) {
                let test2 = moment(new Date().getTime()).format("L");
                let str = "00:00";
                let [day, month, year] = test2.split("/");
                let [hours, minutes] = str.split(":");
                let date1 = new Date(+year, month - 1, +day, +hours, +minutes);
                console.log(date1.getTime());
                test1 = this.state.listTrips.filter((item) => +item.dateStart === date1.getTime());
            } else {
                test1 = this.state.listTrips.filter(
                    (item) => +item.dateStart === this.state.dateStartTrip
                );
            }
            this.setState({
                listTripsFromDay: test1,
            });
        }
    };
    theme = createTheme({
        components: {
            MuiInputBase: {
                styleOverrides: {
                    root: {
                        height: 38,
                        backgroundColor: "white",
                    },
                    input: {
                        height: 1.5,
                        padding: 0,
                    },
                },
            },
            MuiOutlinedInput: {
                styleOverrides: {
                    notchedOutline: {
                        borderColor: "#CED4DA!important",
                    },
                },
            },
            MuiButtonBase: {
                styleOverrides: {
                    root: {
                        color: "#000000!important",
                    },
                },
            },
            MuiPickersDay: {
                styleOverrides: {
                    root: {
                        fontSize: "14px",
                    },
                },
            },
        },
    });
    handleOnChange = async (data) => {
        let test1 = this.state.listTrips.filter((item) => +item.dateStart === data.$d.getTime());
        this.setState({
            listTripsFromDay: test1,
            dateStartTrip: data.$d.getTime(),
        });
    };
    render() {
        let {
            page,
            rowsPerPage,
            listTrips,
            dateStartTrip,
            test,
            test1,
            isTest,
            listTripsFromDay,
            isAll,
        } = this.state;
        let { language } = this.props;

        console.log(listTripsFromDay);
        if (isAll === true) {
            isTest === true ? (test = test1) : (test = listTripsFromDay);
            return (
                <div className="container form-redux">
                    <div className="user-container">
                        <ModalAdd
                            isOpen={this.state.isOpenModel}
                            listTrips={listTrips}
                            toggleFromParent={this.toggleUserModel}
                            createTripSuccess={this.createTripSuccess}
                        />

                        <div className="title text-center">
                            <FormattedMessage id="menu.busOwner.trips.title1" />
                        </div>

                        <Row>
                            <Col md={4}>
                                <div className="mx-5 my-3">
                                    <button
                                        style={{ margin: "20px 0" }}
                                        className="btn btn-primary px-3"
                                        onClick={() => this.handleAddUser()}>
                                        <i className="fas fa-plus px-1"></i>
                                        <FormattedMessage id="menu.busOwner.trips.add" />
                                    </button>
                                </div>
                            </Col>
                            <Col md={4}>
                                <div className="mx-5 my-3">
                                    {this.state.isAll === true && (
                                        <>
                                            <label htmlFor="schedule1">
                                                <FormattedMessage id="menu.busOwner.ticket.chooseDay" />
                                            </label>
                                            <ThemeProvider theme={this.theme}>
                                                {language === "vi" ? (
                                                    <LocalizationProvider
                                                        dateAdapter={AdapterDayjs}
                                                        adapterLocale="vi">
                                                        <Stack>
                                                            <DatePicker
                                                                value={dateStartTrip}
                                                                onChange={this.handleOnChange}
                                                                renderInput={(params) => (
                                                                    <TextField {...params} />
                                                                )}
                                                                dayOfWeekFormatter={(day) =>
                                                                    `${day}.`
                                                                }
                                                            />
                                                        </Stack>
                                                    </LocalizationProvider>
                                                ) : (
                                                    <LocalizationProvider
                                                        dateAdapter={AdapterDayjs}>
                                                        <Stack>
                                                            <DatePicker
                                                                value={dateStartTrip}
                                                                onChange={this.handleOnChange}
                                                                renderInput={(params) => (
                                                                    <TextField {...params} />
                                                                )}
                                                                dayOfWeekFormatter={(day) =>
                                                                    `${day}.`
                                                                }
                                                            />
                                                        </Stack>
                                                    </LocalizationProvider>
                                                )}
                                            </ThemeProvider>
                                        </>
                                    )}
                                </div>
                            </Col>
                            <Col md={4} style={{ marginBottom: "5px" }} className=" my-3">
                                <label htmlFor="schedule1">
                                    <FormattedMessage id="menu.busOwner.trips.title3" />
                                </label>
                                <div style={{ display: "flex" }}>
                                    {" "}
                                    <div
                                        className="w-30_admin  choose_left"
                                        style={{
                                            backgroundColor: `${
                                                this.state.isAll === false ? "#007BFF" : "white"
                                            }`,
                                            color: `${
                                                this.state.isAll === false ? "white" : "black"
                                            }`,
                                        }}
                                        onClick={() => this.handleChoose(false)}>
                                        <div className="test__">
                                            <FormattedMessage id="menu.busOwner.trips.all" />{" "}
                                        </div>
                                    </div>
                                    <div
                                        className="w-30_admin  choose_right"
                                        style={{
                                            backgroundColor: `${
                                                this.state.isAll === true ? "#007BFF" : "white"
                                            }`,
                                            color: `${
                                                this.state.isAll === true ? "white" : "black"
                                            }`,
                                        }}
                                        onClick={() => this.handleChoose(true)}>
                                        <div className="test__">
                                            <FormattedMessage id="menu.busOwner.trips.oneday" />
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>

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
                                                onClick={() => this.handleSort("desc", "id")}>
                                                Id
                                            </th>
                                            <th
                                                style={{
                                                    width: "30%",
                                                }}>
                                                <div className="section-title">
                                                    <FormattedMessage id="menu.busOwner.trips.route" />
                                                </div>
                                            </th>
                                            <th
                                                style={{
                                                    width: "12%",
                                                }}>
                                                <div className="section-title">
                                                    <FormattedMessage id="menu.busOwner.vehicle.bsx" />
                                                </div>
                                            </th>
                                            <th
                                                style={{
                                                    width: "13%",
                                                }}>
                                                <div className="section-title">
                                                    <FormattedMessage id="menu.busOwner.dashboards.name" />
                                                </div>
                                            </th>
                                            <th>
                                                <div className="section-title">
                                                    <FormattedMessage id="menu.busOwner.trips.time3" />
                                                    <div>
                                                        {" "}
                                                        <FaLongArrowAltDown
                                                            className="iconSortDown"
                                                            onClick={() =>
                                                                this.handleSort("asc", "timeStart")
                                                            }
                                                        />
                                                        <FaLongArrowAltUp
                                                            className="iconSortDown"
                                                            onClick={() =>
                                                                this.handleSort("desc", "timeStart")
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </th>
                                            <th
                                                style={{
                                                    width: "15%",
                                                }}>
                                                <div className="section-title ">
                                                    <div>
                                                        {" "}
                                                        <FormattedMessage id="menu.busOwner.trips.time4" />{" "}
                                                    </div>
                                                    <div>
                                                        {" "}
                                                        <FaLongArrowAltDown
                                                            className="iconSortDown"
                                                            onClick={() =>
                                                                this.handleSort("asc", "timeEnd")
                                                            }
                                                        />
                                                        <FaLongArrowAltUp
                                                            className="iconSortDown"
                                                            onClick={() =>
                                                                this.handleSort("desc", "timeEnd")
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </th>

                                            <th style={{ width: "10%" }}></th>
                                        </tr>
                                        <tr style={{ height: "50px" }}>
                                            <td></td>
                                            <td></td>
                                            <td>
                                                <input
                                                    className="form-control"
                                                    onChange={(e) => this.handleKeyword(e)}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    className="form-control"
                                                    onChange={(e) => this.handleKeyword1(e)}
                                                />
                                            </td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        {(rowsPerPage > 0
                                            ? test.slice(
                                                  page * rowsPerPage,
                                                  page * rowsPerPage + rowsPerPage
                                              )
                                            : test
                                        ).map((user, index) => {
                                            let start, end;
                                            if (language === "vi") {
                                                start = moment(+user.timeStart).format(
                                                    "ddd DD/MM/YYYY HH:mm"
                                                );
                                                end = moment(new Date(+user.timeEnd)).format(
                                                    "ddd DD/MM/YYYY HH:mm"
                                                );
                                            } else {
                                                start = `${moment(+user.timeStart)
                                                    .locale("en")
                                                    .format("ddd MM/DD/YYYY")} ${" "} ${moment(
                                                    +user.timeStart
                                                )
                                                    .locale("en")
                                                    .format("LT")}`;
                                                end = `${moment(+user.timeEnd)
                                                    .locale("en")
                                                    .format("ddd MM/DD/YYYY")} ${" "} ${moment(
                                                    +user.timeEnd
                                                )
                                                    .locale("en")
                                                    .format("LT")}`;
                                            }
                                            let current = new Date().getTime();
                                            return (
                                                <tr key={index}>
                                                    <td className="center">{user.id}</td>

                                                    <td>{user.Route.name}</td>
                                                    <td>{user.Vehicle.number}</td>
                                                    <td>{user.User.name}</td>
                                                    <td>{start}</td>
                                                    <td>{end}</td>
                                                    <td className="center">
                                                        {current < +user.timeStart && (
                                                            <button
                                                                className="btn-edit"
                                                                onClick={() =>
                                                                    this.handleEditUser(user)
                                                                }>
                                                                <i className=" fas fa-edit"></i>
                                                            </button>
                                                        )}

                                                        <button
                                                            className="btn-delete"
                                                            onClick={() =>
                                                                this.handleDeleteUser(user)
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
                                                    6,
                                                    15,
                                                    25,
                                                    { label: "All", value: -1 },
                                                ]}
                                                colSpan={7}
                                                count={listTrips.length}
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
        } else {
            isTest === true ? (test = test1) : (test = listTrips);
            return (
                <div className="container form-redux">
                    <div className="user-container">
                        <ModalAdd
                            isOpen={this.state.isOpenModel}
                            listTrips={listTrips}
                            toggleFromParent={this.toggleUserModel}
                            createTripSuccess={this.createTripSuccess}
                        />

                        <div className="title text-center">
                            <FormattedMessage id="menu.busOwner.trips.title1" />
                        </div>

                        <Row>
                            <Col md={4}>
                                <div className="mx-5 my-3">
                                    <button
                                        style={{ margin: "20px 0" }}
                                        className="btn btn-primary px-3"
                                        onClick={() => this.handleAddUser()}>
                                        <i className="fas fa-plus px-1"></i>
                                        <FormattedMessage id="menu.busOwner.trips.add" />
                                    </button>
                                </div>
                            </Col>
                            <Col md={4}>
                                <div className="mx-5 my-3">
                                    {this.state.isAll === true && (
                                        <>
                                            <label htmlFor="schedule1">
                                                <FormattedMessage id="menu.busOwner.ticket.chooseDay" />
                                            </label>
                                            <ThemeProvider theme={this.theme}>
                                                {language === "vi" ? (
                                                    <LocalizationProvider
                                                        dateAdapter={AdapterDayjs}
                                                        adapterLocale="vi">
                                                        <Stack>
                                                            <DatePicker
                                                                value={dateStartTrip}
                                                                onChange={this.handleOnChange}
                                                                renderInput={(params) => (
                                                                    <TextField {...params} />
                                                                )}
                                                                dayOfWeekFormatter={(day) =>
                                                                    `${day}.`
                                                                }
                                                            />
                                                        </Stack>
                                                    </LocalizationProvider>
                                                ) : (
                                                    <LocalizationProvider
                                                        dateAdapter={AdapterDayjs}>
                                                        <Stack>
                                                            <DatePicker
                                                                value={dateStartTrip}
                                                                onChange={this.handleOnChange}
                                                                renderInput={(params) => (
                                                                    <TextField {...params} />
                                                                )}
                                                                dayOfWeekFormatter={(day) =>
                                                                    `${day}.`
                                                                }
                                                            />
                                                        </Stack>
                                                    </LocalizationProvider>
                                                )}
                                            </ThemeProvider>
                                        </>
                                    )}
                                </div>
                            </Col>
                            <Col md={4} style={{ marginBottom: "5px" }} className=" my-3">
                                <label htmlFor="schedule1">
                                    <FormattedMessage id="menu.busOwner.trips.title3" />
                                </label>
                                <div style={{ display: "flex" }}>
                                    {" "}
                                    <div
                                        className="w-30_admin  choose_left"
                                        style={{
                                            backgroundColor: `${
                                                this.state.isAll === false ? "#007BFF" : "white"
                                            }`,
                                            color: `${
                                                this.state.isAll === false ? "white" : "black"
                                            }`,
                                        }}
                                        onClick={() => this.handleChoose(false)}>
                                        <div className="test__">
                                            <FormattedMessage id="menu.busOwner.trips.all" />{" "}
                                        </div>
                                    </div>
                                    <div
                                        className="w-30_admin  choose_right"
                                        style={{
                                            backgroundColor: `${
                                                this.state.isAll === true ? "#007BFF" : "white"
                                            }`,
                                            color: `${
                                                this.state.isAll === true ? "white" : "black"
                                            }`,
                                        }}
                                        onClick={() => this.handleChoose(true)}>
                                        <div className="test__">
                                            <FormattedMessage id="menu.busOwner.trips.oneday" />
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>

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
                                                onClick={() => this.handleSort("desc", "id")}>
                                                Id
                                            </th>
                                            <th
                                                style={{
                                                    width: "30%",
                                                }}>
                                                <div className="section-title">
                                                    <FormattedMessage id="menu.busOwner.trips.route" />
                                                </div>
                                            </th>
                                            <th
                                                style={{
                                                    width: "12%",
                                                }}>
                                                <div className="section-title">
                                                    <FormattedMessage id="menu.busOwner.vehicle.bsx" />
                                                </div>
                                            </th>
                                            <th
                                                style={{
                                                    width: "13%",
                                                }}>
                                                <div className="section-title">
                                                    <FormattedMessage id="menu.busOwner.dashboards.name" />
                                                </div>
                                            </th>
                                            <th>
                                                <div className="section-title">
                                                    <FormattedMessage id="menu.busOwner.trips.time3" />
                                                    <div>
                                                        {" "}
                                                        <FaLongArrowAltDown
                                                            className="iconSortDown"
                                                            onClick={() =>
                                                                this.handleSort("asc", "timeStart")
                                                            }
                                                        />
                                                        <FaLongArrowAltUp
                                                            className="iconSortDown"
                                                            onClick={() =>
                                                                this.handleSort("desc", "timeStart")
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </th>
                                            <th
                                                style={{
                                                    width: "15%",
                                                }}>
                                                <div className="section-title ">
                                                    <div>
                                                        {" "}
                                                        <FormattedMessage id="menu.busOwner.trips.time4" />{" "}
                                                    </div>
                                                    <div>
                                                        {" "}
                                                        <FaLongArrowAltDown
                                                            className="iconSortDown"
                                                            onClick={() =>
                                                                this.handleSort("asc", "timeEnd")
                                                            }
                                                        />
                                                        <FaLongArrowAltUp
                                                            className="iconSortDown"
                                                            onClick={() =>
                                                                this.handleSort("desc", "timeEnd")
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </th>

                                            <th style={{ width: "10%" }}></th>
                                        </tr>
                                        <tr style={{ height: "50px" }}>
                                            <td></td>
                                            <td></td>
                                            <td>
                                                <input
                                                    className="form-control"
                                                    onChange={(e) => this.handleKeyword(e)}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    className="form-control"
                                                    onChange={(e) => this.handleKeyword1(e)}
                                                />
                                            </td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                        </tr>
                                        {(rowsPerPage > 0
                                            ? test.slice(
                                                  page * rowsPerPage,
                                                  page * rowsPerPage + rowsPerPage
                                              )
                                            : test
                                        ).map((user, index) => {
                                            let start, end;
                                            if (language === "vi") {
                                                start = moment(+user.timeStart).format(
                                                    "ddd DD/MM/YYYY HH:mm"
                                                );
                                                end = moment(new Date(+user.timeEnd)).format(
                                                    "ddd DD/MM/YYYY HH:mm"
                                                );
                                            } else {
                                                start = `${moment(+user.timeStart)
                                                    .locale("en")
                                                    .format("ddd MM/DD/YYYY")} ${" "} ${moment(
                                                    +user.timeStart
                                                )
                                                    .locale("en")
                                                    .format("LT")}`;
                                                end = `${moment(+user.timeEnd)
                                                    .locale("en")
                                                    .format("ddd MM/DD/YYYY")} ${" "} ${moment(
                                                    +user.timeEnd
                                                )
                                                    .locale("en")
                                                    .format("LT")}`;
                                            }
                                            let current = new Date().getTime();
                                            return (
                                                <tr key={index}>
                                                    <td className="center">{user.id}</td>

                                                    <td>{user.Route.name}</td>
                                                    <td>{user.Vehicle.number}</td>
                                                    <td>{user.User.name}</td>
                                                    <td>{start}</td>
                                                    <td>{end}</td>
                                                    <td className="center">
                                                        {current < +user.timeStart && (
                                                            <button
                                                                className="btn-edit"
                                                                onClick={() =>
                                                                    this.handleEditUser(user)
                                                                }>
                                                                <i className=" fas fa-edit"></i>
                                                            </button>
                                                        )}

                                                        <button
                                                            className="btn-delete"
                                                            onClick={() =>
                                                                this.handleDeleteUser(user)
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
                                                    6,
                                                    15,
                                                    25,
                                                    { label: "All", value: -1 },
                                                ]}
                                                colSpan={7}
                                                count={listTrips.length}
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
        deleteSchedule: (id) => dispatch(actions.deleteSchedule(id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RouteManage);
