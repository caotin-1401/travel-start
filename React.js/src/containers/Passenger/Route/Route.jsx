import React, { Component } from "react";
import { connect } from "react-redux";
import Header from "../../HomePage/Header";
import { FormattedMessage } from "react-intl";
import { LANGUAGES } from "../../../utils";
import { changeLanguageApp } from "../../../store/actions/appActions";
import "./Route.scss";
import {
    getAllRoutesService,
    getAllTripHomeService,
} from "../../../services/userService";
import dayjs from "dayjs";
import moment from "moment";
import localization from "moment/locale/vi";
import * as actions from "../../../store/actions";
import DatePicker from "../../../components/DatePicker";
import Select from "react-select";
import BookingModal from "./BookingModal";
import FilterComponent from "./FilterComponent";
import { withRouter } from "react-router";
import NotFoundTrip from "../../../assets/NotFoundTrip.png";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay";
import _ from "lodash";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
const customStyles = {
    control: () => ({
        border: "none",
        display: "flex",
        position: "relative",
        boxSizing: "border-box",
        flexWrap: "wrap",
        transition: "all 100ms",
        justifyContent: "space-between",
    }),
    valueContainer: () => ({
        width: 290,
        height: 27,
        alignItems: "center",
        flexWrap: "wrap",
        padding: "2px 10px",
        overflow: "hidden",
        position: "relative",
        boxSizing: "border-box",
        display: "grid",
    }),
    indicatorSeparator: () => ({
        display: "none",
    }),
    placeholder: () => ({
        display: "display",
    }),
};
class BusRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrRoute: [],
            dateStartTrip: "",
            listLocations: [],
            selectLocaion1: {},
            selectLocaion2: {},
            isOpenModel: false,
            parent: {},
            isActive: false,
            previewImgURL: "",
            isSort: "",
            loading: false,
        };
    }
    async componentDidMount() {
        setTimeout(() => {
            this.setState({
                loading: true,
            });
        }, 1000);
        this.props.fetchAllRoute();
        this.props.fetchAllLocation();
        if (
            this.props.match &&
            this.props.match.params &&
            this.props.match.params.date &&
            this.props.match.params.start &&
            this.props.match.params.end
        ) {
            let dateStar = this.props.match.params.date;
            let startLocation = this.props.match.params.start;
            let endLocation = this.props.match.params.end;
            let res = await getAllTripHomeService(
                startLocation,
                endLocation,
                dateStar
            );
            let current = new Date().getTime();
            let currentDate = moment(current).format("L");
            let [day, month, year] = currentDate.split("/");
            let date = new Date(+year, month - 1, +day);
            let unixTimestamp = Math.floor(date.getTime());
            let arr = res.trips;
            let arr1 = [];
            if (unixTimestamp === +dateStar) {
                arr &&
                    arr.length > 0 &&
                    (arr1 = arr.filter((item) => {
                        let days = moment(+item.dateStart).format("L");
                        let times = moment(+item.timeStart).format("LT");
                        let [day, month, year] = days.split("/");
                        let [hours, minutes] = times.split(":");
                        let date = new Date(
                            +year,
                            month - 1,
                            +day,
                            +hours,
                            +minutes
                        );
                        let unixTimestamp = Math.floor(date.getTime());
                        return unixTimestamp > current;
                    }));
            } else {
                arr1 = arr;
            }
            if (res && res.errCode === 0 && res.trips.length > 0) {
                this.setState({
                    arrRoute: arr1,
                });
            }
        }
        let clone = this.state.arrRoute;
        if (clone && clone.length > 0) {
            let test = clone[0].dateStart;
            let obj1 = {};
            obj1.label = clone[0].areaStart;
            obj1.value = clone[0].Route.areaStart;
            let obj2 = {};
            obj2.label = clone[0].areaEnd;
            obj2.value = clone[0].Route.areaEnd;
            this.setState({
                selectLocaion1: obj1,
                selectLocaion2: obj2,
                dateStartTrip: moment(new Date(+test)).format("L"),
            });
        } else {
            let startLocation = this.props.match.params.start;
            let endLocation = this.props.match.params.end;
            let dateStar = this.props.match.params.date;
            let obj1 = {};
            obj1.label = startLocation;
            let obj2 = {};
            obj2.label = endLocation;

            this.setState({
                selectLocaion1: obj1,
                selectLocaion2: obj2,
                dateStartTrip: moment(+dateStar).format("L"),
            });
        }
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.locations !== this.props.locations) {
            let dataSelect = this.buildDataSelect(this.props.locations);
            this.setState({
                listLocations: dataSelect,
            });
        }
    }
    buildDataSelect = (inputData) => {
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
    onChangeInput1 = (selectLocaion1) => {
        this.setState({ selectLocaion1 });
    };
    onChangeInput2 = (selectLocaion2) => {
        this.setState({ selectLocaion2 });
    };
    handleOnChange1 = (data) => {
        this.setState({
            dateStartTrip: data[0],
        });
    };
    changeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language);
    };
    toggleUserModel = () => {
        this.setState({
            isOpenModel: !this.state.isOpenModel,
        });
    };
    addTicket = (data) => {
        this.setState({
            isOpenModel: false,
        });
    };
    handleClickTicket = (data) => {
        this.setState({
            isOpenModel: true,
            parent: data,
        });
    };
    handleTrip = async (route) => {
        let { selectLocaion1, selectLocaion2, dateStartTrip } = this.state;
        let areaStart = selectLocaion1.label;
        let areaEnd = selectLocaion2.label;
        let dateStart = new Date(dateStartTrip).getTime();
        if (!areaStart) {
            toast.error("Please choose your departure point!");
        } else if (!areaEnd) {
            toast.error("Please choose your destination point!");
        } else if (!dateStart) {
            toast.error("Please select departure date!");
        } else {
            let res = await getAllTripHomeService(
                areaStart,
                areaEnd,
                dateStart
            );

            let arr = res.trips;
            let arr1 = [];
            let dateStar = this.props.match.params.date;
            let current = new Date().getTime();
            let currentDate = moment(current).format("L");
            let [day, month, year] = currentDate.split("/");
            let date = new Date(+year, month - 1, +day);
            let unixTimestamp = Math.floor(date.getTime());
            if (unixTimestamp === +dateStar) {
                arr &&
                    arr.length > 0 &&
                    (arr1 = arr.filter((item) => {
                        let days = moment(+item.dateStart).format("L");
                        let times = moment(+item.timeStart).format("LT");
                        let [day, month, year] = days.split("/");
                        let [hours, minutes] = times.split(":");
                        let date = new Date(
                            +year,
                            month - 1,
                            +day,
                            +hours,
                            +minutes
                        );
                        let unixTimestamp = Math.floor(date.getTime());
                        return unixTimestamp > current;
                    }));
            } else {
                arr1 = arr;
            }
            // if (this.props.history) {
            this.props.history.push(
                `/home/route/${areaStart}&${areaEnd}&${dateStart}`
            );
            // }
            if (res && res.errCode === 0 && !arr1.length) {
                toast.success(
                    `Hiện tại hệ thống chưa có thông tin nhà xe đi từ ${areaStart} đến ${areaEnd} vào ngày ${moment(
                        dateStart
                    ).format("L")}`
                );
                this.setState({
                    arrRoute: arr1,
                });
            } else if (res && res.errCode === 0 && arr1.length > 0) {
                if (arr1 && arr1.length === 0) {
                    toast.success(
                        `Hiện tại hệ thống chưa có thông tin nhà xe đi từ ${areaStart} đến ${areaEnd} vào ngày ${moment(
                            dateStart
                        ).format("L")}`
                    );
                }
                this.setState({
                    arrRoute: arr1,
                });
            }
        }
    };
    currencyFormat(num) {
        return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") + " đ";
    }
    callbackFunction1 = (isActive) => {
        this.setState({
            isActive: true,
        });
    };
    callbackFunction2 = (isActive) => {
        this.setState({
            isActive: false,
        });
    };
    handleSort = (a, b) => {
        this.state.arrRoute = _.orderBy(this.state.arrRoute, [b], [a]);
        let test = a + b;
        this.setState({
            sortBy: a,
            sortField: b,
            arrRoute: this.state.arrRoute,
            isSort: test,
        });
    };
    render() {
        let {
            arrRoute,
            dateStartTrip,
            selectLocaion1,
            selectLocaion2,
            isSort,
            loading,
        } = this.state;
        let imageBase64;
        let language = this.props.language;
        return (
            <React.Fragment>
                <LoadingOverlay
                    active={this.state.isActive}
                    spinner
                    text="Loading ...">
                    <Header />
                    <div className="route-header-banner">
                        <div className="searchGroup">
                            <div className="inputSearch ">
                                <div className="inputItem item1">
                                    <i className="fas fa-map-marker-alt"></i>
                                    <Select
                                        styles={customStyles}
                                        value={selectLocaion1}
                                        onChange={this.onChangeInput1}
                                        options={this.state.listLocations}
                                    />
                                </div>
                                <div className="inputItem">
                                    <i className="fas fa-map-marker-alt"></i>
                                    <Select
                                        styles={customStyles}
                                        placeholder={"Chọn điểm kết thúc"}
                                        value={selectLocaion2}
                                        onChange={this.onChangeInput2}
                                        options={this.state.listLocations}
                                    />
                                </div>
                                <div className="inputItem">
                                    <label
                                        htmlFor="schedule1"
                                        style={{ float: "right" }}>
                                        <i
                                            className="far fa-calendar-alt"
                                            style={{ fontSize: "20px" }}></i>
                                    </label>
                                    <DatePicker
                                        placeholder={"Chọn ngày"}
                                        style={{ border: "none" }}
                                        onChange={this.handleOnChange1}
                                        id="schedule1"
                                        value={dateStartTrip}
                                        selected={this.state.dateStartTrip}
                                        minDate={
                                            new Date(
                                                new Date().setDate(
                                                    new Date().getDate() - 1
                                                )
                                            )
                                        }
                                    />
                                </div>
                            </div>
                            <div className="search">
                                <button
                                    onClick={(item) => this.handleTrip(item)}>
                                    <FormattedMessage id="header.search" />
                                </button>
                            </div>
                        </div>
                    </div>{" "}
                    {/* <div className="detail_fail text-center">
                    <h4 className="mb-5 detail_title">
                        {arrRoute &&
                            arrRoute.length > 0 &&
                            `Vé xe đi từ ${selectLocaion1.label} đến
                            ${selectLocaion2.label}: ${arrRoute.length} chuyến được tìm thấy`}
                    </h4>
                </div> */}
                    <div className="route-container">
                        <div className="route-result">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-3 col-sm-0">
                                        <FilterComponent />
                                    </div>
                                    <div className="col-md-9 col-sm-12">
                                        <div className="route-result-count">
                                            {/* <div className="route-header"> */}
                                            <div className="route-sort">
                                                <div className="container-sub ">
                                                    <div className="w-30 fl">
                                                        <span className="f-bold">
                                                            {loading === false
                                                                ? ""
                                                                : arrRoute.length}
                                                        </span>
                                                        <span className="f-bold">
                                                            {" "}
                                                            tuyến{" "}
                                                        </span>
                                                        <span>
                                                            {" "}
                                                            được tìm thấy{" "}
                                                        </span>
                                                    </div>
                                                    <div className="w-70 fr">
                                                        <div
                                                            className="w-20"
                                                            onClick={() =>
                                                                this.handleSort(
                                                                    "asc",
                                                                    "id"
                                                                )
                                                            }>
                                                            Sắp xếp theo:{" "}
                                                        </div>
                                                        <div
                                                            className="w-20"
                                                            style={{
                                                                backgroundColor: `${
                                                                    isSort ===
                                                                    "ascprice"
                                                                        ? "#007BFF"
                                                                        : ""
                                                                }`,
                                                                color: `${
                                                                    isSort ===
                                                                    "ascprice"
                                                                        ? "white"
                                                                        : "black"
                                                                }`,
                                                            }}
                                                            onClick={() =>
                                                                this.handleSort(
                                                                    "asc",
                                                                    "price"
                                                                )
                                                            }>
                                                            <div className="test__">
                                                                Rẻ nhất
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="w-20"
                                                            style={{
                                                                backgroundColor: `${
                                                                    isSort ===
                                                                    "asctimeStart"
                                                                        ? "#007BFF"
                                                                        : ""
                                                                }`,
                                                                color: `${
                                                                    isSort ===
                                                                    "asctimeStart"
                                                                        ? "white"
                                                                        : "black"
                                                                }`,
                                                            }}
                                                            onClick={() =>
                                                                this.handleSort(
                                                                    "asc",
                                                                    "timeStart"
                                                                )
                                                            }>
                                                            {" "}
                                                            <div className="test__">
                                                                Sớm nhất
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="w-20"
                                                            style={{
                                                                backgroundColor: `${
                                                                    isSort ===
                                                                    "desctimeStart"
                                                                        ? "#007BFF"
                                                                        : ""
                                                                }`,
                                                                color: `${
                                                                    isSort ===
                                                                    "desctimeStart"
                                                                        ? "white"
                                                                        : "black"
                                                                }`,
                                                            }}
                                                            onClick={() =>
                                                                this.handleSort(
                                                                    "desc",
                                                                    "timeStart"
                                                                )
                                                            }>
                                                            <div className="test__">
                                                                Muộn nhất
                                                            </div>
                                                        </div>
                                                        <div className="w-20">
                                                            <div className="test__">
                                                                Xếp hạng
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* </div> */}

                                            <div className="route-result-body">
                                                {loading === false ? (
                                                    <>
                                                        {" "}
                                                        <div className="ticket">
                                                            <div className="ticket-container">
                                                                <Box
                                                                    sx={{
                                                                        width: "100%",
                                                                    }}>
                                                                    {loading ===
                                                                    false ? (
                                                                        <Skeleton
                                                                            width="100%"
                                                                            height={
                                                                                30
                                                                            }>
                                                                            <div className="ticket-header"></div>
                                                                        </Skeleton>
                                                                    ) : (
                                                                        <Typography>
                                                                            Ted
                                                                        </Typography>
                                                                    )}
                                                                </Box>

                                                                <div className="ticket-body row">
                                                                    <div className="col-3 ticket-img_ ">
                                                                        {" "}
                                                                        <Box
                                                                            sx={{
                                                                                width: "100%",
                                                                            }}>
                                                                            {loading ===
                                                                            false ? (
                                                                                <Skeleton
                                                                                    width="100%"
                                                                                    height={
                                                                                        120
                                                                                    }></Skeleton>
                                                                            ) : (
                                                                                <Typography>
                                                                                    Ted
                                                                                </Typography>
                                                                            )}
                                                                        </Box>
                                                                    </div>

                                                                    <div className="col-9">
                                                                        <div className="row">
                                                                            <Box
                                                                                sx={{
                                                                                    width: "100%",
                                                                                    mb: 2,
                                                                                }}>
                                                                                {loading ===
                                                                                false ? (
                                                                                    <Skeleton
                                                                                        width="100%"
                                                                                        height={
                                                                                            30
                                                                                        }>
                                                                                        <div className="ticket-header"></div>
                                                                                    </Skeleton>
                                                                                ) : (
                                                                                    <Typography>
                                                                                        Ted
                                                                                    </Typography>
                                                                                )}
                                                                            </Box>
                                                                            <Box
                                                                                sx={{
                                                                                    width: "100%",
                                                                                    mb: 2,
                                                                                }}>
                                                                                {loading ===
                                                                                false ? (
                                                                                    <Skeleton
                                                                                        width="100%"
                                                                                        height={
                                                                                            30
                                                                                        }>
                                                                                        <div className="ticket-header"></div>
                                                                                    </Skeleton>
                                                                                ) : (
                                                                                    <Typography>
                                                                                        Ted
                                                                                    </Typography>
                                                                                )}
                                                                            </Box>
                                                                            <Box
                                                                                sx={{
                                                                                    width: "100%",
                                                                                    mb: 2,
                                                                                }}>
                                                                                {loading ===
                                                                                false ? (
                                                                                    <Skeleton
                                                                                        width="100%"
                                                                                        height={
                                                                                            30
                                                                                        }>
                                                                                        <div className="ticket-header"></div>
                                                                                    </Skeleton>
                                                                                ) : (
                                                                                    <Typography>
                                                                                        Ted
                                                                                    </Typography>
                                                                                )}
                                                                            </Box>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="ticket-footer">
                                                                <Box
                                                                    sx={{
                                                                        width: "90%",
                                                                        ml: 3,
                                                                    }}>
                                                                    {loading ===
                                                                    false ? (
                                                                        <Skeleton
                                                                            width="100%"
                                                                            height={
                                                                                30
                                                                            }>
                                                                            <div className="ticket-header"></div>
                                                                        </Skeleton>
                                                                    ) : (
                                                                        <Typography>
                                                                            Ted
                                                                        </Typography>
                                                                    )}
                                                                </Box>
                                                            </div>
                                                        </div>{" "}
                                                        <div className="ticket">
                                                            <div className="ticket-container">
                                                                <Box
                                                                    sx={{
                                                                        width: "100%",
                                                                    }}>
                                                                    {loading ===
                                                                    false ? (
                                                                        <Skeleton
                                                                            width="100%"
                                                                            height={
                                                                                30
                                                                            }>
                                                                            <div className="ticket-header"></div>
                                                                        </Skeleton>
                                                                    ) : (
                                                                        <Typography>
                                                                            Ted
                                                                        </Typography>
                                                                    )}
                                                                </Box>

                                                                <div className="ticket-body row">
                                                                    <div className="col-3 ticket-img_ ">
                                                                        {" "}
                                                                        <Box
                                                                            sx={{
                                                                                width: "100%",
                                                                            }}>
                                                                            {loading ===
                                                                            false ? (
                                                                                <Skeleton
                                                                                    width="100%"
                                                                                    height={
                                                                                        120
                                                                                    }></Skeleton>
                                                                            ) : (
                                                                                <Typography>
                                                                                    Ted
                                                                                </Typography>
                                                                            )}
                                                                        </Box>
                                                                    </div>

                                                                    <div className="col-9">
                                                                        <div className="row">
                                                                            <Box
                                                                                sx={{
                                                                                    width: "100%",
                                                                                    mb: 2,
                                                                                }}>
                                                                                {loading ===
                                                                                false ? (
                                                                                    <Skeleton
                                                                                        width="100%"
                                                                                        height={
                                                                                            30
                                                                                        }>
                                                                                        <div className="ticket-header"></div>
                                                                                    </Skeleton>
                                                                                ) : (
                                                                                    <Typography>
                                                                                        Ted
                                                                                    </Typography>
                                                                                )}
                                                                            </Box>
                                                                            <Box
                                                                                sx={{
                                                                                    width: "100%",
                                                                                    mb: 2,
                                                                                }}>
                                                                                {loading ===
                                                                                false ? (
                                                                                    <Skeleton
                                                                                        width="100%"
                                                                                        height={
                                                                                            30
                                                                                        }>
                                                                                        <div className="ticket-header"></div>
                                                                                    </Skeleton>
                                                                                ) : (
                                                                                    <Typography>
                                                                                        Ted
                                                                                    </Typography>
                                                                                )}
                                                                            </Box>
                                                                            <Box
                                                                                sx={{
                                                                                    width: "100%",
                                                                                    mb: 2,
                                                                                }}>
                                                                                {loading ===
                                                                                false ? (
                                                                                    <Skeleton
                                                                                        width="100%"
                                                                                        height={
                                                                                            30
                                                                                        }>
                                                                                        <div className="ticket-header"></div>
                                                                                    </Skeleton>
                                                                                ) : (
                                                                                    <Typography>
                                                                                        Ted
                                                                                    </Typography>
                                                                                )}
                                                                            </Box>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="ticket-footer">
                                                                <Box
                                                                    sx={{
                                                                        width: "90%",
                                                                        ml: 3,
                                                                    }}>
                                                                    {loading ===
                                                                    false ? (
                                                                        <Skeleton
                                                                            width="100%"
                                                                            height={
                                                                                30
                                                                            }>
                                                                            <div className="ticket-header"></div>
                                                                        </Skeleton>
                                                                    ) : (
                                                                        <Typography>
                                                                            Ted
                                                                        </Typography>
                                                                    )}
                                                                </Box>
                                                            </div>
                                                        </div>{" "}
                                                        <div className="ticket">
                                                            <div className="ticket-container">
                                                                <Box
                                                                    sx={{
                                                                        width: "100%",
                                                                    }}>
                                                                    {loading ===
                                                                    false ? (
                                                                        <Skeleton
                                                                            width="100%"
                                                                            height={
                                                                                30
                                                                            }>
                                                                            <div className="ticket-header"></div>
                                                                        </Skeleton>
                                                                    ) : (
                                                                        <Typography>
                                                                            Ted
                                                                        </Typography>
                                                                    )}
                                                                </Box>

                                                                <div className="ticket-body row">
                                                                    <div className="col-3 ticket-img_ ">
                                                                        {" "}
                                                                        <Box
                                                                            sx={{
                                                                                width: "100%",
                                                                            }}>
                                                                            {loading ===
                                                                            false ? (
                                                                                <Skeleton
                                                                                    width="100%"
                                                                                    height={
                                                                                        120
                                                                                    }></Skeleton>
                                                                            ) : (
                                                                                <Typography>
                                                                                    Ted
                                                                                </Typography>
                                                                            )}
                                                                        </Box>
                                                                    </div>

                                                                    <div className="col-9">
                                                                        <div className="row">
                                                                            <Box
                                                                                sx={{
                                                                                    width: "100%",
                                                                                    mb: 2,
                                                                                }}>
                                                                                {loading ===
                                                                                false ? (
                                                                                    <Skeleton
                                                                                        width="100%"
                                                                                        height={
                                                                                            30
                                                                                        }>
                                                                                        <div className="ticket-header"></div>
                                                                                    </Skeleton>
                                                                                ) : (
                                                                                    <Typography>
                                                                                        Ted
                                                                                    </Typography>
                                                                                )}
                                                                            </Box>
                                                                            <Box
                                                                                sx={{
                                                                                    width: "100%",
                                                                                    mb: 2,
                                                                                }}>
                                                                                {loading ===
                                                                                false ? (
                                                                                    <Skeleton
                                                                                        width="100%"
                                                                                        height={
                                                                                            30
                                                                                        }>
                                                                                        <div className="ticket-header"></div>
                                                                                    </Skeleton>
                                                                                ) : (
                                                                                    <Typography>
                                                                                        Ted
                                                                                    </Typography>
                                                                                )}
                                                                            </Box>
                                                                            <Box
                                                                                sx={{
                                                                                    width: "100%",
                                                                                    mb: 2,
                                                                                }}>
                                                                                {loading ===
                                                                                false ? (
                                                                                    <Skeleton
                                                                                        width="100%"
                                                                                        height={
                                                                                            30
                                                                                        }>
                                                                                        <div className="ticket-header"></div>
                                                                                    </Skeleton>
                                                                                ) : (
                                                                                    <Typography>
                                                                                        Ted
                                                                                    </Typography>
                                                                                )}
                                                                            </Box>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="ticket-footer">
                                                                <Box
                                                                    sx={{
                                                                        width: "90%",
                                                                        ml: 3,
                                                                    }}>
                                                                    {loading ===
                                                                    false ? (
                                                                        <Skeleton
                                                                            width="100%"
                                                                            height={
                                                                                30
                                                                            }>
                                                                            <div className="ticket-header"></div>
                                                                        </Skeleton>
                                                                    ) : (
                                                                        <Typography>
                                                                            Ted
                                                                        </Typography>
                                                                    )}
                                                                </Box>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : arrRoute &&
                                                  arrRoute.length > 0 ? (
                                                    arrRoute.map(
                                                        (item, index) => {
                                                            let start = moment(
                                                                +item.timeStart
                                                            ).format("llll");
                                                            let end = moment(
                                                                +item.timeEnd
                                                            ).format("llll");
                                                            let imageBase64 =
                                                                "";
                                                            if (
                                                                item.Vehicle
                                                                    .image
                                                            ) {
                                                                imageBase64 =
                                                                    Buffer.from(
                                                                        item
                                                                            .Vehicle
                                                                            .image,
                                                                        "base64"
                                                                    ).toString(
                                                                        "binary"
                                                                    );
                                                            }
                                                            return (
                                                                <>
                                                                    <div className="ticket">
                                                                        <div className="ticket-container">
                                                                            <div className="ticket-header">
                                                                                <div className="fl">
                                                                                    <i className="fas fa-bus"></i>
                                                                                    <span className="ml-5">
                                                                                        {
                                                                                            item
                                                                                                .User
                                                                                                .Driver
                                                                                                .busOwner
                                                                                        }
                                                                                    </span>
                                                                                </div>
                                                                                <div className="fr">
                                                                                    {this.currencyFormat(
                                                                                        item.price
                                                                                    )}
                                                                                    {/* {`${item.price} đ `} */}
                                                                                </div>
                                                                            </div>
                                                                            <div className="ticket-body row">
                                                                                <div
                                                                                    className="col-3 ticket-img "
                                                                                    style={{
                                                                                        backgroundImage: `url(${imageBase64})`,
                                                                                    }}></div>
                                                                                <div className="col-9">
                                                                                    <div className="row">
                                                                                        <div className="col-9">
                                                                                            <div>
                                                                                                {`${item.Vehicle.BusType.typeName} ${item.Vehicle.BusType.numOfSeat} giường `}
                                                                                            </div>
                                                                                            <div className="f-17">
                                                                                                <i className="fas fa-dot-circle"></i>
                                                                                                <span className="timeStart">
                                                                                                    {
                                                                                                        start
                                                                                                    }
                                                                                                    {
                                                                                                        "  -  "
                                                                                                    }
                                                                                                </span>
                                                                                                <span className="pointStart">
                                                                                                    {
                                                                                                        item.areaStart
                                                                                                    }
                                                                                                </span>
                                                                                            </div>
                                                                                            <div className="f-17">
                                                                                                <i className="fas fa-map-marker-alt"></i>
                                                                                                <span className="timeEnd">
                                                                                                    {
                                                                                                        end
                                                                                                    }
                                                                                                    {
                                                                                                        "  -  "
                                                                                                    }
                                                                                                </span>
                                                                                                <span className="pointEnd">
                                                                                                    {
                                                                                                        item.areaEnd
                                                                                                    }
                                                                                                </span>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="col-3 fr">
                                                                                            Thong
                                                                                            tin
                                                                                            gif
                                                                                            do
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="ticket-footer">
                                                                                <div className="row">
                                                                                    <div className="w-50 fl">
                                                                                        Thông
                                                                                        tin
                                                                                        chi
                                                                                        tiết
                                                                                    </div>
                                                                                    <div className="w-50 ">
                                                                                        <button
                                                                                            className="btn btn-primary fr"
                                                                                            onClick={() =>
                                                                                                this.handleClickTicket(
                                                                                                    item
                                                                                                )
                                                                                            }>
                                                                                            Chọn
                                                                                            chuyến{" "}
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            );
                                                        }
                                                    )
                                                ) : (
                                                    <div className="detail_fail text-center">
                                                        <img
                                                            width="70%"
                                                            src={NotFoundTrip}
                                                            alt=""
                                                        />
                                                        <p
                                                            style={{
                                                                marginTop: 10,
                                                                fontSize:
                                                                    "25px",
                                                                fontWeight: 500,
                                                                marginBottom: 10,
                                                            }}>
                                                            Chuyến đang cập nhật
                                                        </p>
                                                        <p className="mb-0">
                                                            Hiện tại hệ thống
                                                            chưa có thông tin
                                                            nhà xe đi từ{" "}
                                                            {
                                                                selectLocaion1.label
                                                            }{" "}
                                                            đến{" "}
                                                            {
                                                                selectLocaion2.label
                                                            }{" "}
                                                            vào ngày{" "}
                                                            {moment(
                                                                dateStartTrip
                                                            ).format("L")}
                                                        </p>
                                                        <span>
                                                            Xin quý khách vui
                                                            lòng chọn ngày đi
                                                            khác hoặc tuyến
                                                            đường khác.
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <BookingModal
                        isOpen={this.state.isOpenModel}
                        dataFromParent={this.state.parent}
                        toggleFromParent={this.toggleUserModel}
                        addTicket={() => this.addTicket()}
                        parentCallback1={this.callbackFunction1}
                        parentCallback2={this.callbackFunction2}
                    />
                </LoadingOverlay>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return { listRoutes: state.admin.routes, locations: state.admin.locations };
};

const mapDispatchToProps = (dispatch) => {
    return {
        changeLanguageAppRedux: (language) =>
            dispatch(changeLanguageApp(language)),
        fetchAllRoute: () => dispatch(actions.fetchAllRoute()),
        fetchAllLocation: () => dispatch(actions.fetchAllLocation()),
    };
};
export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(BusRoute)
);
