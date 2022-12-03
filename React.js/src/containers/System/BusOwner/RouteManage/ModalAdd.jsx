import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Row,
    Col,
} from "reactstrap";
import Select from "react-select";
import "./RouteManage.scss";
import DatePicker from "../../../../components/DatePicker";
import * as actions from "../../../../store/actions";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../../utils";
import PropTypes from "prop-types";
import { emitter } from "../../../../utils/emitter";
import { toast } from "react-toastify";
import _ from "lodash";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import dayjs from "dayjs";
import localization from "moment/locale/vi";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import moment from "moment";
import { ThemeProvider, createTheme } from "@mui/material/styles";

class ModalUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listRoutes: [],
            listVehicles: [],
            listDrivers: [],
            allRoutes: [],
            selectRoute: {},
            selectVehicle: {},
            selectDriver: {},
            currentDateStart: "",
            currentDateEnd: "",
            timeStart: "",
            timeEnd: "",
            action: "",
            busOwnerId: "",
            price: "",
        };
    }
    componentDidMount() {
        this.props.fetchAllRoute();
        this.props.fetchAllVehicle();
        this.props.fetchUserRedux();
        this.props.fetchAllScheduleTrip();
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
                    item.Driver.busOwnerId &&
                    item.Driver.busOwnerId === this.props.userInfo.id
            );
            let dataSelect2 = this.buildDataSelectDrivers(test);
            this.setState({
                listDrivers: dataSelect2,
            });
        }
        if (prevProps.listSchedule !== this.props.listSchedule) {
            this.setState({
                selectRoute: "",
                selectVehicle: "",
                selectDriver: "",
                currentDateStart: "",
                currentDateEnd: "",
                timeStart: "",
                timeEnd: "",
                price: "",
                action: CRUD_ACTIONS.CREATE,
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
            });
        }
        return result;
    };
    toggle = () => {
        this.props.toggleFromParent();
    };
    handleOnChange1 = (data) => {
        this.setState({
            currentDateStart: data[0],
        });
    };
    handleOnChange2 = (data) => {
        this.setState({
            currentDateEnd: data[0],
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
        } = this.state;
        console.log(allRoutes);

        if (selectRoute && _.isEmpty(selectRoute)) {
            toast.error("Invalid select Route!");
            return;
        } else if (selectVehicle && _.isEmpty(selectVehicle)) {
            toast.error("Invalid select Vehicle!");
            return;
        } else if (!price) {
            toast.error("Invalid select price!");
            return;
        } else if (selectDriver && _.isEmpty(selectDriver)) {
            toast.error("Invalid select Driver!");
            return;
        } else if (!currentDateStart || !currentDateEnd) {
            toast.error("Invalid date!");
            return;
        } else if (!timeStart || !timeEnd) {
            toast.error("Invalid time!");
            return;
        }
        let a = allRoutes;
        a = a.filter((item) => item.id === selectRoute.value);
        let areaStartId = a[0].from.name;
        let areaEndId = a[0].to.name;
        // let result = [];
        let dateUnixTime1 = moment(new Date(currentDateStart).getTime()).format(
            "L"
        );
        let timeUnixTime1 = moment(new Date(timeStart).getTime()).format("LT");
        let dateUnixTime2 = moment(new Date(currentDateEnd).getTime()).format(
            "L"
        );
        let timeUnixTime2 = moment(new Date(timeEnd).getTime()).format("LT");

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
        // let timeScheduleStart = new Date(timeStart).getTime();
        // let timeScheduleEnd = new Date(timeEnd).getTime();

        if (
            new Date(currentDateStart).getTime() >
            new Date(currentDateEnd).getTime()
        ) {
            toast.error("date selection error!");
            return;
        } else if (
            new Date(currentDateStart).getTime() ==
            new Date(currentDateEnd).getTime()
        ) {
            if (new Date(timeStart).getTime() > new Date(timeEnd).getTime()) {
                toast.error("time selection error!");
                return;
            }
        }
        let { action } = this.state;
        this.props.createNewUser1(this.state);
        if (action === CRUD_ACTIONS.CREATE) {
            this.props.createNewSchedule({
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
                // maxNumber:
            });
        }
    };
    changeTime1 = (value) => {
        this.setState({
            timeStart: value.$d,
        });
    };
    changeTime2 = (value) => {
        console.log(value.$d);
        console.log(new Date(value.$d).valueOf());
        console.log(moment(new Date(value.$d).valueOf()).format("LT"));
        this.setState({
            timeEnd: value.$d,
        });
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
            MuiButtonBase: {
                styleOverrides: {
                    root: {
                        color: "#000000!important",
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
                        Create a new trip
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <label htmlFor="exampleEmail">Tuyến đường</label>
                            <Select
                                className="mb-4"
                                value={selectRoute}
                                onChange={this.onChangeInput1}
                                options={listRoutes}
                            />
                        </Row>

                        <Row>
                            <Col md={4}>
                                <label>Chọn xe</label>
                                <Select
                                    className="mb-4"
                                    value={selectVehicle}
                                    onChange={this.onChangeInput2}
                                    options={listVehicles}
                                />
                            </Col>
                            <Col md={4}>
                                <label>Chọn tài xế</label>
                                <Select
                                    className="mb-4"
                                    value={selectDriver}
                                    onChange={this.onChangeInput3}
                                    options={listDrivers}
                                />
                            </Col>
                            <Col md={4}>
                                <label>Gia</label>
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
                        <Row>
                            {" "}
                            <Col md={6}>
                                <label htmlFor="schedule1">
                                    Chọn ngày/giờ đi
                                </label>
                                <div
                                    className="form-control mb-2"
                                    style={{ height: "38px" }}
                                    htmlFor="schedule1">
                                    <DatePicker
                                        style={{ border: "none" }}
                                        onChange={this.handleOnChange1}
                                        id="schedule1"
                                        selected={currentDateStart}
                                        minDate={
                                            new Date(
                                                new Date().setDate(
                                                    new Date().getDate() - 1
                                                )
                                            )
                                        }
                                    />
                                    <label
                                        htmlFor="schedule1"
                                        style={{ float: "right" }}>
                                        <i
                                            className="far fa-calendar-alt"
                                            style={{ fontSize: "20px" }}></i>
                                    </label>
                                </div>
                                <ThemeProvider theme={this.theme}>
                                    <LocalizationProvider
                                        dateAdapter={AdapterDayjs}
                                        locale="vi">
                                        {" "}
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
                            </Col>{" "}
                            <Col md={6}>
                                <label htmlFor="schedule2">Chọn ngày đến</label>
                                <div
                                    className="form-control mb-2"
                                    style={{ height: "38px" }}
                                    htmlFor="schedule2">
                                    <DatePicker
                                        style={{ border: "none" }}
                                        onChange={this.handleOnChange2}
                                        id="schedule2"
                                        selected={currentDateEnd}
                                        minDate={
                                            new Date(
                                                new Date().setDate(
                                                    new Date().getDate() - 1
                                                )
                                            )
                                        }
                                    />
                                    <label
                                        htmlFor="schedule2"
                                        style={{ float: "right" }}>
                                        <i
                                            className="far fa-calendar-alt"
                                            style={{ fontSize: "20px" }}></i>
                                    </label>
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
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            color="secondary"
                            onClick={() => {
                                this.toggle();
                            }}
                            className="btn-primary-modal">
                            Cancel
                        </Button>{" "}
                        <Button
                            color="primary"
                            onClick={() => {
                                this.handleSave();
                            }}
                            className="btn-primary-modal">
                            Save
                        </Button>
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
        listSchedule: state.admin.trips,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllRoute: () => dispatch(actions.fetchAllRoute()),
        fetchAllVehicle: () => dispatch(actions.fetchAllVehicle()),
        fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
        createNewSchedule: (data) => dispatch(actions.createNewSchedule(data)),
        fetchAllScheduleTrip: () => dispatch(actions.fetchAllScheduleTrip()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);
