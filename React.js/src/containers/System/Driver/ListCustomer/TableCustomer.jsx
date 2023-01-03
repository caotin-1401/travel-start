import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { TableBody, TableContainer, Paper, Table, Stack, TextField } from "@mui/material";
import moment from "moment";
import { Row, Col } from "reactstrap";
import ModalInfo from "./ModalInfo";
import { toast } from "react-toastify";
import { LANGUAGES } from "../../../../utils";
import {
    handleVehicleStartTrip,
    handleVehicleEndTrip,
    handleStartTrip,
    handleEndTrip,
    handleDriverEndTrip,
    handleDriverStartTrip,
    getDriverTicketsRoute,
    getAllRouteFromDateDriver,
} from "../../../../services/userService";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "dayjs/locale/vi";
class TableCustomer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            idDriver: "",
            time: "",
            listRoute: [],
            isOpenModel: false,
            listUser: {},
            dateStartTrip: "",
            tripId: "",
        };
    }

    async componentDidMount() {
        this.setState({ idDriver: this.props.userInfo.id });
        await this.getAllTickets();
    }

    getAllTickets = async () => {
        let id = this.props.userInfo.id;
        let date = moment(new Date().getTime()).format("MM/DD/YYYY");
        let str = "00:00";
        let [month, day, year] = date.split("/");
        let [hours, minutes] = str.split(":");
        let date1 = new Date(+year, month - 1, +day, +hours, +minutes);
        let res = await getAllRouteFromDateDriver(id, date1.getTime());
        res &&
            res.tickets &&
            this.setState({
                listRoute: res.tickets,
                time: moment(new Date()).format("MM/DD/YYYY"),
                dateStartTrip: date1.getTime(),
            });
    };

    handleOnChange = async (data) => {
        this.setState({
            listRoute: [],
            time: data.$d.getTime(),
        });
        let test;
        data && (test = data.$d.getTime());
        let id = this.props.userInfo.id;
        let res = await getAllRouteFromDateDriver(id, test);
        res &&
            res.tickets &&
            this.setState({
                listRoute: res.tickets,
                time: data.$d.getTime(),
            });

        this.setState({
            dateStartTrip: data.$d.getTime(),
        });
    };
    handleBeginTrip = async (item) => {
        let { idDriver, time } = this.state;
        let { language } = this.props;
        let vehicleId = item.Vehicle.id;
        let resTrip = await handleDriverStartTrip({ id: idDriver });
        if (resTrip && resTrip.errCode === 0) {
            let resDriver = await handleStartTrip({ id: item.id });
            if (resDriver && resDriver.errCode !== 0) {
                return;
            }
            let resVehicle = await handleVehicleStartTrip({
                id: vehicleId,
                idDriver,
            });
            if (resVehicle && resVehicle.errCode !== 0) {
                if (language === LANGUAGES.VI) {
                    toast.error("Phương tiện hiện đang trong chuyến khác");
                } else {
                    toast.error("The vehivle is currently on another trip");
                }
                return;
            }
            let res = await getAllRouteFromDateDriver(idDriver, time);
            this.setState({
                listRoute: res.tickets,
            });
            if (language === LANGUAGES.VI) {
                toast.success("Bắt đầu chuyến xe");
            } else {
                toast.success("Start the trip");
            }
        } else {
            if (language === LANGUAGES.VI) {
                toast.error("Tài xế hiện đang trong chuyến khác");
            } else {
                toast.error("The driver is currently on another trip");
            }
            return;
        }
    };
    handleEndTrip = async (item) => {
        let { idDriver, time } = this.state;
        let { language } = this.props;
        let vehicleId = item.Vehicle.id;
        let station = item.areaEnd;
        let resTrip = await handleEndTrip({ id: item.id });
        if (resTrip && resTrip.errCode === 0) {
            await handleDriverEndTrip({ id: idDriver });
            await handleVehicleEndTrip({
                id: vehicleId,
                areaEndId: station,
            });
            let res = await getAllRouteFromDateDriver(idDriver, time);
            this.setState({
                listRoute: res.tickets,
            });
            if (language === LANGUAGES.VI) {
                toast.success("Kết thúc chuyến xe");
            } else {
                toast.success("End the trip");
            }
        }
    };
    handleCheck = async (item) => {
        let { dateStartTrip, idDriver } = this.state;
        let res;
        if (dateStartTrip.length === 10) {
            let test = moment(new Date().getTime()).format("DD/MM/YYYY");
            let str = "00:00";
            let [day, month, year] = test.split("/");
            let [hours, minutes] = str.split(":");
            let date1 = new Date(+year, month - 1, +day, +hours, +minutes);
            res = await getDriverTicketsRoute(idDriver, date1.getTime(), item.id);
        } else {
            res = await getDriverTicketsRoute(idDriver, dateStartTrip, item.id);
        }
        let tempUser = {};
        let resultUser;
        if (res && res.errCode === 0) {
            if (res.tickets.length > 0) {
                res.tickets.forEach((ticket) => {
                    if (ticket.status !== "S4")
                        if (tempUser[`${ticket.token}`]) {
                            tempUser[`${ticket.token}`].seatNo.push(ticket.seatNo);
                        } else {
                            tempUser[`${ticket.token}`] = {
                                Trip: ticket.Trip,
                                userId: ticket.userId,
                                seatNo: [ticket.seatNo],
                                token: ticket.token,
                                phone: ticket.phone,
                                name: ticket.name,
                                totalPrice: ticket.totalPrice,
                                driverId: ticket.driverId,
                                status: ticket.status,
                                email: ticket.email,
                                tripId: ticket.tripId,
                                description: ticket.description,
                                isPresent: ticket.isPresent,
                                dayStart: ticket.dayStart,
                            };
                        }
                });

                resultUser = Object.values(tempUser);
            }
        }
        this.setState({
            isOpenModel: true,
            listUser: resultUser,
        });
    };
    toggleUserModel = () => {
        this.setState({
            isOpenModel: !this.state.isOpenModel,
        });
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
    render() {
        let { language } = this.props;
        let { time, listRoute, isOpenModel, listUser } = this.state;
        return (
            <div className="user-redux-container">
                {isOpenModel && (
                    <ModalInfo
                        isOpen={this.state.isOpenModel}
                        toggleFromParent={this.toggleUserModel}
                        listUser={listUser}
                    />
                )}
                <div className="title">
                    <p style={{ marginBottom: "20px" }}>
                        <FormattedMessage id="menu.driver.title1" />
                    </p>
                </div>
                <div className="container form-reux">
                    <Row>
                        <Col md={3}>
                            <label htmlFor="schedule1">
                                <FormattedMessage id="menu.driver.selectday" />
                            </label>
                            <ThemeProvider theme={this.theme}>
                                {language === "vi" ? (
                                    <LocalizationProvider
                                        dateAdapter={AdapterDayjs}
                                        adapterLocale="vi">
                                        <Stack>
                                            <DatePicker
                                                value={time}
                                                onChange={this.handleOnChange}
                                                renderInput={(params) => <TextField {...params} />}
                                                dayOfWeekFormatter={(day) => `${day}.`}
                                            />
                                        </Stack>
                                    </LocalizationProvider>
                                ) : (
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <Stack>
                                            <DatePicker
                                                value={time}
                                                onChange={this.handleOnChange}
                                                renderInput={(params) => <TextField {...params} />}
                                                dayOfWeekFormatter={(day) => `${day}.`}
                                            />
                                        </Stack>
                                    </LocalizationProvider>
                                )}
                            </ThemeProvider>
                        </Col>
                    </Row>
                    <div className="user-container">
                        <TableContainer component={Paper} id="customers">
                            <Table>
                                <TableBody>
                                    <tr>
                                        <th
                                            className="section-id"
                                            style={{
                                                width: "5%",
                                            }}>
                                            Id
                                        </th>
                                        <th
                                            className="section-id-list"
                                            style={{
                                                width: "35%",
                                            }}>
                                            <FormattedMessage id="menu.driver.route" />
                                        </th>
                                        <th
                                            className="section-id-list"
                                            style={{
                                                width: "12%",
                                            }}>
                                            <FormattedMessage id="menu.driver.time" />
                                        </th>
                                        <th
                                            className="section-id-list"
                                            style={{
                                                width: "12%",
                                            }}>
                                            <FormattedMessage id="menu.driver.number" />
                                        </th>
                                        <th
                                            className="section-id-list"
                                            style={{
                                                width: "18%",
                                            }}>
                                            <FormattedMessage id="menu.driver.status" />
                                        </th>
                                        <th
                                            className="section-id-list"
                                            style={{
                                                width: "18%",
                                            }}>
                                            <FormattedMessage id="menu.driver.list_passenger" />
                                        </th>
                                    </tr>
                                    <tr>
                                        {listRoute && listRoute.length === 0 && (
                                            <td
                                                colSpan="8"
                                                style={{
                                                    fontSize: "18px",
                                                    textAlign: "center",
                                                }}>
                                                <FormattedMessage id="menu.driver.noData" />
                                            </td>
                                        )}
                                    </tr>
                                    {listRoute.map((item, index) => {
                                        let time;
                                        if (language === "vi") {
                                            time = ` ${moment(+item.timeStart).format(
                                                "HH:mm"
                                            )}${" - "} ${moment(+item.timeEnd).format("HH:mm")}`;
                                        } else {
                                            time = ` ${moment(+item.timeStart)
                                                .locale("en")
                                                .format("LT")}${" - "} ${moment(+item.timeEnd)
                                                .locale("en")
                                                .format("LT")}`;
                                        }
                                        return (
                                            <tr key={index}>
                                                <td className="section-id-list">{item.id}</td>
                                                <td>
                                                    {item.areaStart} {" - "}
                                                    {item.areaEnd}
                                                </td>
                                                <td>{time}</td>
                                                <td>{item.Vehicle.number}</td>
                                                <td
                                                    style={{
                                                        textAlign: "center",
                                                    }}>
                                                    {+item.status === 1 ? (
                                                        <button
                                                            style={{
                                                                width: "100px",
                                                            }}
                                                            className="btn btn-primary"
                                                            onClick={() =>
                                                                this.handleBeginTrip(item)
                                                            }>
                                                            <FormattedMessage id="menu.driver.start" />
                                                        </button>
                                                    ) : +item.status === 2 ? (
                                                        <button
                                                            style={{
                                                                width: "100px",
                                                            }}
                                                            className="btn btn-warning"
                                                            onClick={() =>
                                                                this.handleEndTrip(item)
                                                            }>
                                                            <FormattedMessage id="menu.driver.end" />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            style={{
                                                                width: "100px",
                                                            }}
                                                            className="btn btn-primary"
                                                            disabled>
                                                            <FormattedMessage id="menu.driver.finished" />
                                                        </button>
                                                    )}
                                                </td>
                                                <td
                                                    style={{
                                                        textAlign: "center",
                                                    }}>
                                                    <button
                                                        style={{
                                                            width: "100px",
                                                        }}
                                                        className="btn btn-primary"
                                                        onClick={() => this.handleCheck(item)}>
                                                        <FormattedMessage id="menu.driver.list" />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </TableBody>
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
        userInfo: state.user.userInfo,
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(TableCustomer);
