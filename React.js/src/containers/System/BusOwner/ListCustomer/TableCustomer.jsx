import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import moment from "moment";
import { Row, Col } from "reactstrap";
import Select from "react-select";
import {
    getAllRouteFromDateDriver,
    getAllTicketFromDateDriver,
} from "../../../../services/userService";
import * as actions from "../../../../store/actions";
import LoadingOverlay from "react-loading-overlay-ts";
import "../style.scss";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "dayjs/locale/vi";
import {
    TextField,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    Paper,
} from "@mui/material";

import RowBody from "./RowBody";

class TableCustomer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isCheckPresent: false,
            listDrivers: [],
            selectDriver: "",
            isActive: false,
            listPassengers: [],
            listTrips: [],
            dateStartTrip: "",
        };
    }

    componentDidMount() {
        this.props.fetchUserRedux();
        this.setState({
            dateStartTrip: moment(new Date()).format("MM/DD/YYYY"),
        });
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listUsers !== this.props.listUsers) {
            let test = this.props.listUsers.filter(
                (item) =>
                    item.Driver.busOwnerId && item.Driver.busOwnerId === this.props.userInfo.id
            );
            let dataSelect2 = this.buildDataSelectDrivers(test);
            this.setState({
                listDrivers: dataSelect2,
            });
        }
    }

    buildDataSelectDrivers = (inputData) => {
        let result = [];
        if (inputData && inputData.length > 0) {
            inputData.map((item, key) => {
                let obj = {};
                obj.label = item.name;
                obj.value = item.id;
                result.push(obj);
                return result;
            });
        }
        return result;
    };

    handleOnChange = async (data) => {
        let { selectDriver } = this.state;
        let res = await getAllRouteFromDateDriver(selectDriver.value, data.$d.getTime());
        let resTicket = await getAllTicketFromDateDriver(selectDriver.value, data.$d.getTime());

        this.setState({
            dateStartTrip: data.$d.getTime(),
            listPassengers: resTicket.tickets,
            listTrips: res.tickets,
        });
    };
    onChangeInputDriver = async (selectDriver) => {
        let { dateStartTrip } = this.state;
        let dateCurrent;
        if (dateStartTrip.length === 10) {
            let date = moment(new Date().getTime()).format("L");
            let str = "00:00";
            let [day, month, year] = date.split("/");
            let [hours, minutes] = str.split(":");
            let date1 = new Date(+year, month - 1, +day, +hours, +minutes);
            dateCurrent = date1.getTime();
        } else {
            dateCurrent = dateStartTrip;
        }
        console.log(selectDriver.value, dateCurrent, dateStartTrip);
        let res = await getAllRouteFromDateDriver(selectDriver.value, dateCurrent);
        let resTicket = await getAllTicketFromDateDriver(selectDriver.value, dateCurrent);

        this.setState({ selectDriver, listPassengers: resTicket.tickets, listTrips: res.tickets });
    };

    callbackFunction = (isActive) => {
        this.setState({
            isActive: isActive,
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
        let { listDrivers, selectDriver, dateStartTrip, listPassengers, listTrips } = this.state;
        return (
            <LoadingOverlay active={this.state.isActive} spinner text="Loading ...">
                <div className="user-redux-container height100vh">
                    <div className="title">
                        <p style={{ marginBottom: "20px" }}>
                            <FormattedMessage id="menu.busOwner.ticket.title1" />
                        </p>
                    </div>
                    <div className="container form-reux">
                        <Row>
                            <Col md={3}>
                                <label htmlFor="schedule1">
                                    <FormattedMessage id="menu.busOwner.ticket.chooseDay" />
                                </label>
                                <div className=" mb-2">
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
                                                        dayOfWeekFormatter={(day) => `${day}.`}
                                                    />
                                                </Stack>
                                            </LocalizationProvider>
                                        ) : (
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <Stack>
                                                    <DatePicker
                                                        value={dateStartTrip}
                                                        onChange={this.handleOnChange}
                                                        renderInput={(params) => (
                                                            <TextField {...params} />
                                                        )}
                                                        dayOfWeekFormatter={(day) => `${day}.`}
                                                    />
                                                </Stack>
                                            </LocalizationProvider>
                                        )}
                                    </ThemeProvider>
                                </div>
                            </Col>
                            <Col md={3}>
                                <label>
                                    <FormattedMessage id="menu.busOwner.ticket.chooseDriver" />
                                </label>
                                <Select
                                    className="mb-4"
                                    value={selectDriver}
                                    onChange={this.onChangeInputDriver}
                                    options={listDrivers}
                                />
                            </Col>
                        </Row>
                        <div className="user-container">
                            <TableContainer component={Paper} id="customers1">
                                <Table>
                                    <TableHead>
                                        <tr>
                                            <TableCell />
                                            <th className="w5">ID</th>
                                            <th className="w45">
                                                <FormattedMessage id="menu.busOwner.ticket.trips" />
                                            </th>
                                            <th className="w15">
                                                <FormattedMessage id="menu.busOwner.dashboards.name" />
                                            </th>
                                            <th className="w15">
                                                <FormattedMessage id="menu.driver.number" />
                                            </th>
                                            <th className="w20">
                                                <FormattedMessage id="menu.driver.timeDe" />
                                            </th>
                                        </tr>
                                    </TableHead>
                                    <TableBody>
                                        {listTrips &&
                                            listTrips.length > 0 &&
                                            listTrips.map((item, index) => {
                                                return (
                                                    <RowBody
                                                        key={item.id}
                                                        parentCallback1={this.callbackFunction}
                                                        item={item}
                                                        listPassengers={listPassengers}
                                                        selectDriver={selectDriver.value}
                                                        dateStartTrip={dateStartTrip}
                                                        language={language}
                                                    />
                                                );
                                            })}
                                        {listTrips && listTrips.length === 0 && (
                                            <tr style={{ height: "50px" }}>
                                                <td
                                                    style={{
                                                        fontSize: "18px",
                                                        textAlign: "center",
                                                    }}
                                                    colSpan="6"></td>
                                            </tr>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>
                    <div style={{ height: "200px" }}></div>
                </div>
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.user.userInfo,
        language: state.app.language,
        listUsers: state.admin.users,
    };
};

const mapDispatchToProps = (dispatch) => {
    return { fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()) };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableCustomer);
