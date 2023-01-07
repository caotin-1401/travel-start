import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from "reactstrap";
import Select from "react-select";
import "../style.scss";
import * as actions from "../../../../store/actions";
import { toast } from "react-toastify";
import _ from "lodash";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "dayjs/locale/vi";
import Checkbox from "@mui/material/Checkbox";
import { createNewTrip } from "../../../../services/userService";
class ModalUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listRoutes: [],
            listVehicles: [],
            listDrivers: [],
            allRoutes: [],
            selectRoute: "",
            selectVehicle: "",
            selectDriver: "",
            currentDateStart: "",
            currentDateEnd: "",
            timeStart: "",
            timeEnd: "",
            busOwnerId: "",
            price: "",
            checked: false,
        };
    }
    componentDidMount() {
        this.props.fetchAllRoute();
        this.props.fetchAllVehicle();
        this.props.fetchUserRedux();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.vehicles !== this.props.vehicles) {
            let test = this.props.vehicles.filter(
                (item) => item.busOwnerId === this.props.userInfo.id
            );
            let dataSelect = this.buildDataSelectVehicles(test);
            this.setState({
                listVehicles: dataSelect,
            });
        }
        if (prevProps.routes !== this.props.routes) {
            let dataSelect1 = this.buildDataSelectRoutes(this.props.routes);
            this.setState({
                listRoutes: dataSelect1,
                allRoutes: this.props.routes,
            });
        }
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
        if (prevProps.listTrips !== this.props.listTrips) {
            this.setState({
                selectRoute: "",
                selectVehicle: "",
                selectDriver: "",
                currentDateStart: "",
                currentDateEnd: "",
                timeStart: "",
                timeEnd: "",
                price: "",
            });
        }
    }
    buildDataSelectRoutes = (inputData) => {
        let result = [];
        if (inputData && inputData.length > 0) {
            inputData.map((item, key) => {
                let obj = {};
                obj.label = `${item.from.name} (${item.from.city}) - ${item.to.name} (${item.to.city})`;
                obj.value = item.id;
                result.push(obj);
                return result;
            });
        }
        return result;
    };
    buildDataSelectVehicles = (inputData) => {
        let result = [];
        if (inputData && inputData.length > 0) {
            inputData.map((item, key) => {
                let obj = {};
                obj.label = `${item.number} - ${item.BusType.numOfSeat} chỗ`;
                obj.value = item.id;
                result.push(obj);
                return result;
            });
        }
        return result;
    };
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
    toggle = () => {
        this.props.toggleFromParent();
    };
    handleOnChange1 = (data) => {
        this.setState({
            currentDateStart: data.$d,
        });
    };
    handleOnChange2 = (data) => {
        this.setState({
            currentDateEnd: data.$d,
        });
    };
    changeTime1 = (value) => {
        this.setState({
            timeStart: value.$d,
        });
    };
    changeTime2 = (value) => {
        this.setState({
            timeEnd: value.$d,
        });
    };
    onChangeInput1 = (selectRoute) => {
        this.setState({ selectRoute });
    };
    onChangeInput2 = (selectVehicle) => {
        this.setState({ selectVehicle });
    };
    onChangeInput3 = (selectDriver) => {
        this.setState({ selectDriver });
    };
    handleSave = async () => {
        let {
            selectRoute,
            selectVehicle,
            selectDriver,
            currentDateStart,
            currentDateEnd,
            timeStart,
            timeEnd,
            price,
            allRoutes,
            checked,
        } = this.state;
        console.log(selectDriver);
        let { language } = this.props;
        if (!selectRoute && _.isEmpty(selectRoute)) {
            if (language === "vi") {
                toast.error("Vui lòng chọn tuyến đường!");
            } else toast.error("Invalid select Route!");
            return;
        } else if (!selectVehicle && _.isEmpty(selectVehicle)) {
            if (language === "vi") {
                toast.error("Vui lòng chọn phương tiện vận tải!");
            } else toast.error("Invalid select Vehicle!");
            return;
        } else if (!price) {
            if (language === "vi") {
                toast.error("Vui lòng điền giá vé!");
            } else toast.error("Please enter the pricce ticket!");
            return;
        } else if (!selectDriver && _.isEmpty(selectDriver)) {
            if (language === "vi") {
                toast.error("Vui lòng chọn tài xế điền giá vé!");
            } else toast.error("Please select driver!");
            return;
        } else if (!currentDateStart || !timeStart) {
            if (language === "vi") {
                toast.error("Vui lòng chọn thời gian khởi hành!");
            } else toast.error("Please select departure time!");
            return;
        } else if (!currentDateEnd || !timeEnd) {
            if (language === "vi") {
                toast.error("Vui lòng chọn thời gian về bến!");
            } else toast.error("Please choose your arrival time!");
            return;
        }
        let a = allRoutes;
        a = a.filter((item) => item.id === selectRoute.value);
        let areaStartId = a[0].from.name;
        let areaEndId = a[0].to.name;
        // let result = [];
        let dateUnixTime1 = moment(new Date(currentDateStart).getTime()).format("L");
        let timeUnixTime1 = moment(new Date(timeStart).getTime()).format("LT");
        let dateUnixTime2 = moment(new Date(currentDateEnd).getTime()).format("L");
        let timeUnixTime2 = moment(new Date(timeEnd).getTime()).format("LT");
        console.log(dateUnixTime1, timeUnixTime1);
        let [day1, month1, year1] = dateUnixTime1.split("/");
        let [hours1, minutes1] = timeUnixTime1.split(":");

        let [day2, month2, year2] = dateUnixTime2.split("/");
        let [hours2, minutes2] = timeUnixTime2.split(":");

        let date1 = new Date(+year1, month1 - 1, +day1, +hours1, +minutes1);
        let date2 = new Date(+year2, month2 - 1, +day2, +hours2, +minutes2);
        let unixTimestamp1 = Math.floor(date1.getTime());
        let unixTimestamp2 = Math.floor(date2.getTime());

        let dayStart = new Date(currentDateStart).getTime();
        let dayEnd = new Date(currentDateEnd).getTime();

        if (new Date(currentDateStart).getTime() > new Date(currentDateEnd).getTime()) {
            if (language === "vi") {
                toast.error("Thời gian không hợp lệ!");
            } else toast.error("Invalid time!");
            return;
        } else if (new Date(currentDateStart).getTime() === new Date(currentDateEnd).getTime()) {
            if (new Date(timeStart).getTime() > new Date(timeEnd).getTime()) {
                if (language === "vi") {
                    toast.error("Thời gian không hợp lệ!");
                } else toast.error("Invalid time!");
                return;
            }
        }
        if (checked === false) {
            let res = await createNewTrip({
                routeId: selectRoute.value,
                driverId: selectDriver.value,
                busId: selectVehicle.value,
                dayStart: dayStart,
                dayEnd: dayEnd,
                unixTimestamp1,
                unixTimestamp2,
                busOwnerId: this.props.userInfo.id,
                price: price,
                areaStartId,
                areaEndId,
            });
            if (res && res.errCode === 0) {
                if (language === "vi") {
                    toast.success("Tạo chuyến đi thành công !");
                } else toast.success("Create a successful trip!");
                this.props.createTripSuccess(this.state);
            } else if (res && res.errCode === 1) {
                if (language === "vi") {
                    toast.error("Phương tiện lúc đó không có ở điểm xuất phát!");
                } else toast.error("Create a new successful trip!");
            } else if (res && res.errCode === 2) {
                if (language === "vi") {
                    toast.error("Tạo mới chuyến đi thành công!");
                } else toast.error("The current vehicle is not available at the starting point!");
            } else if (res && res.errCode === 3) {
                if (language === "vi") {
                    toast.error("Phương tiện đang trong chuyến khác!");
                } else toast.error("Vehicle in operation!");
            } else if (res && res.errCode === 4) {
                if (language === "vi") {
                    toast.error("Tài xế đang trong chuyến khác!");
                } else toast.error("driver is running!");
            }
        } else if (checked === true) {
        }
    };

    theme = createTheme({
        components: {
            MuiInputBase: {
                styleOverrides: {
                    root: {
                        height: 38,
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
            MuiPickersDay: {
                styleOverrides: {
                    root: {
                        fontSize: "15px",
                    },
                },
            },
        },
    });
    onChangeInput = (event) => {
        this.setState({
            price: event.target.value,
        });
    };
    handleChange = (event) => {
        console.log(event.target.checked);
        this.setState({
            checked: event.target.checked,
        });
    };
    render() {
        let language = this.props.language;
        let {
            listRoutes,
            selectRoute,
            listVehicles,
            selectVehicle,
            listDrivers,
            selectDriver,
            currentDateStart,
            currentDateEnd,
            price,
            timeStart,
            timeEnd,
            checked,
        } = this.state;
        return (
            <div>
                <Modal
                    isOpen={this.props.isOpen}
                    toggle={() => {
                        this.toggle();
                    }}
                    size="lg">
                    <ModalHeader
                        toggle={() => {
                            this.toggle();
                        }}>
                        <FormattedMessage id="menu.busOwner.trips.title2" />
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <label htmlFor="exampleEmail">
                                <FormattedMessage id="menu.busOwner.trips.selectRoute" />
                            </label>
                            <Select
                                className="mb-4"
                                value={selectRoute}
                                onChange={this.onChangeInput1}
                                options={listRoutes}
                            />
                        </Row>

                        <Row>
                            <Col md={4}>
                                <label>
                                    <FormattedMessage id="menu.busOwner.trips.selectVehicle" />
                                </label>
                                <Select
                                    className="mb-4"
                                    value={selectVehicle}
                                    onChange={this.onChangeInput2}
                                    options={listVehicles}
                                />
                            </Col>
                            <Col md={4}>
                                <label>
                                    <FormattedMessage id="menu.busOwner.trips.selectDriver" />
                                </label>
                                <Select
                                    className="mb-4"
                                    value={selectDriver}
                                    onChange={this.onChangeInput3}
                                    options={listDrivers}
                                />
                            </Col>
                            <Col md={4}>
                                <label>
                                    <FormattedMessage id="menu.busOwner.trips.prices" />
                                </label>
                                <input
                                    style={{ height: "38px" }}
                                    className="form-control mb-4 h-38"
                                    id="name"
                                    value={price}
                                    onChange={(event) => {
                                        this.onChangeInput(event, "number");
                                    }}
                                />
                            </Col>
                        </Row>
                        {language === "vi" ? (
                            <Row>
                                <Col md={6}>
                                    <label htmlFor="schedule1">
                                        <FormattedMessage id="menu.busOwner.trips.time1" />
                                    </label>

                                    <div className=" mb-2">
                                        <ThemeProvider theme={this.theme}>
                                            <LocalizationProvider
                                                dateAdapter={AdapterDayjs}
                                                adapterLocale="vi">
                                                <Stack>
                                                    <DatePicker
                                                        value={currentDateStart}
                                                        onChange={this.handleOnChange1}
                                                        renderInput={(params) => (
                                                            <TextField {...params} />
                                                        )}
                                                        minDate={new Date()}
                                                        dayOfWeekFormatter={(day) => `${day}.`}
                                                    />
                                                </Stack>
                                            </LocalizationProvider>
                                        </ThemeProvider>
                                    </div>

                                    <ThemeProvider theme={this.theme}>
                                        <LocalizationProvider
                                            dateAdapter={AdapterDayjs}
                                            locale="vi">
                                            <Stack>
                                                <TimePicker
                                                    value={timeStart}
                                                    onChange={this.changeTime1}
                                                    renderInput={(params) => (
                                                        <TextField {...params} />
                                                    )}
                                                />
                                            </Stack>
                                        </LocalizationProvider>
                                    </ThemeProvider>
                                </Col>
                                <Col md={6}>
                                    <label htmlFor="schedule2">
                                        <FormattedMessage id="menu.busOwner.trips.time2" />
                                    </label>
                                    <div className=" mb-2">
                                        <ThemeProvider theme={this.theme}>
                                            <LocalizationProvider
                                                dateAdapter={AdapterDayjs}
                                                adapterLocale="vi">
                                                <Stack>
                                                    <DatePicker
                                                        value={currentDateEnd}
                                                        onChange={this.handleOnChange2}
                                                        renderInput={(params) => (
                                                            <TextField {...params} />
                                                        )}
                                                        minDate={new Date()}
                                                        dayOfWeekFormatter={(day) => `${day}.`}
                                                    />
                                                </Stack>
                                            </LocalizationProvider>
                                        </ThemeProvider>
                                    </div>
                                    <ThemeProvider theme={this.theme}>
                                        <LocalizationProvider
                                            dateAdapter={AdapterDayjs}
                                            locale="vi">
                                            <Stack>
                                                <TimePicker
                                                    value={timeEnd}
                                                    onChange={this.changeTime2}
                                                    renderInput={(params) => (
                                                        <TextField {...params} />
                                                    )}
                                                />
                                            </Stack>
                                        </LocalizationProvider>
                                    </ThemeProvider>
                                </Col>
                            </Row>
                        ) : (
                            <Row>
                                <Col md={6}>
                                    <label htmlFor="schedule1">
                                        <FormattedMessage id="menu.busOwner.trips.time1" />
                                    </label>

                                    <div className=" mb-2">
                                        <ThemeProvider theme={this.theme}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <Stack>
                                                    <DatePicker
                                                        value={currentDateStart}
                                                        onChange={this.handleOnChange1}
                                                        renderInput={(params) => (
                                                            <TextField {...params} />
                                                        )}
                                                        minDate={new Date()}
                                                        dayOfWeekFormatter={(day) => `${day}.`}
                                                    />
                                                </Stack>
                                            </LocalizationProvider>
                                        </ThemeProvider>
                                    </div>

                                    <ThemeProvider theme={this.theme}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <Stack>
                                                <TimePicker
                                                    value={timeStart}
                                                    onChange={this.changeTime1}
                                                    renderInput={(params) => (
                                                        <TextField {...params} />
                                                    )}
                                                />
                                            </Stack>
                                        </LocalizationProvider>
                                    </ThemeProvider>
                                </Col>
                                <Col md={6}>
                                    <label htmlFor="schedule2">
                                        <FormattedMessage id="menu.busOwner.trips.time2" />
                                    </label>
                                    <div className=" mb-2">
                                        <ThemeProvider theme={this.theme}>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <Stack>
                                                    <DatePicker
                                                        value={currentDateEnd}
                                                        onChange={this.handleOnChange2}
                                                        renderInput={(params) => (
                                                            <TextField {...params} />
                                                        )}
                                                        minDate={new Date()}
                                                        dayOfWeekFormatter={(day) => `${day}.`}
                                                    />
                                                </Stack>
                                            </LocalizationProvider>
                                        </ThemeProvider>
                                    </div>
                                    <ThemeProvider theme={this.theme}>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <Stack>
                                                <TimePicker
                                                    value={timeEnd}
                                                    onChange={this.changeTime2}
                                                    renderInput={(params) => (
                                                        <TextField {...params} />
                                                    )}
                                                />
                                            </Stack>
                                        </LocalizationProvider>
                                    </ThemeProvider>
                                </Col>
                            </Row>
                        )}
                        <Row>
                            <Col>
                                <Checkbox
                                    // type="checkbox"
                                    checked={checked}
                                    onChange={this.handleChange}
                                />
                                Tạo lịch chạy cố định cho 7 ngày tiếp theo
                            </Col>
                        </Row>
                    </ModalBody>

                    <ModalFooter>
                        <button
                            onClick={() => {
                                this.toggle();
                            }}
                            className=" btn btn-secondary">
                            <FormattedMessage id="account.cancel" />
                        </button>
                        <button
                            onClick={() => {
                                this.handleSave();
                            }}
                            className=" btn btn-primary">
                            <FormattedMessage id="account.save" />
                        </button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        routes: state.admin.routes,
        vehicles: state.admin.vehicles,
        userInfo: state.user.userInfo,
        listUsers: state.admin.users,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllRoute: () => dispatch(actions.fetchAllRoute()),
        fetchAllVehicle: () => dispatch(actions.fetchAllVehicle()),
        fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);
