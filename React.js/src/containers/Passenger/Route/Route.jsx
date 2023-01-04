import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./Route.scss";
import { getAllTripHomeService } from "../../../services/userService";
import moment from "moment";
import localization from "moment/locale/vi";
import * as actions from "../../../store/actions";
import DatePicker from "../../../components/DatePicker";
import Select from "react-select";
import BookingModal from "./BookingModal";
import { withRouter } from "react-router";
import NotFoundTrip from "../../../assets/NotFoundTrip.png";
import { toast } from "react-toastify";
import LoadingOverlay from "react-loading-overlay-ts";
import _ from "lodash";
import { customStyles } from "./styleInput";
import Header from "../../HomePage/Header";
import HomeFooter from "../../HomePage/Section/HomeFooter";
import SkeletonLoading from "./SkeletonLoading";
import ChoosePrice from "./ChoosePrice";
import ChooseTime from "./ChooseTime";

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
            current: 0,
            value: [0, 1000000],
            selectButton1: false,
            selectButton2: false,
            selectButton3: false,
            selectButton4: false,
            arrTemp: [],
            arrMouse: [],
            isTemp: false,
            isMouse: false,
        };
    }
    async componentDidMount() {
        setTimeout(() => {
            this.setState({
                loading: true,
            });
        }, 800);
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
            let day1 = moment(+dateStar).format("DD");
            this.compareTime(day1);
            let startLocation = this.props.match.params.start;
            let endLocation = this.props.match.params.end;
            let res = await getAllTripHomeService(startLocation, endLocation, dateStar);
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
                        let date = new Date(+year, month - 1, +day, +hours, +minutes);
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
        if (prevState.dateStartTrip !== this.state.dateStartTrip) {
            let dayChoose;
            if (this.state.dateStartTrip.length === 10) {
                let [day] = this.state.dateStartTrip.split("/");
                dayChoose = day;
            } else {
                dayChoose = moment(this.state.dateStartTrip).format("DD");
            }
            this.compareTime(dayChoose);
        }
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
                return result;
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
        this.setState({
            loading: false,
        });
        setTimeout(() => {
            this.setState({
                loading: true,
            });
        }, 500);
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
            let res = await getAllTripHomeService(areaStart, areaEnd, dateStart);

            let arr = res.trips;
            let arr1 = [];
            let current = new Date().getTime();
            let currentDate = moment(current).format("L");
            let [day, month, year] = currentDate.split("/");
            let date = new Date(+year, month - 1, +day);
            let unixTimestamp = Math.floor(date.getTime());
            if (unixTimestamp === +dateStart) {
                arr &&
                    arr.length > 0 &&
                    (arr1 = arr.filter((item) => {
                        let days = moment(+item.dateStart).format("L");
                        let times = moment(+item.timeStart).format("LT");
                        let [day, month, year] = days.split("/");
                        let [hours, minutes] = times.split(":");
                        let date = new Date(+year, month - 1, +day, +hours, +minutes);
                        let unixTimestamp = Math.floor(date.getTime());
                        return unixTimestamp > current;
                    }));
            } else {
                arr1 = arr;
            }
            this.props.history.push(`/home/route/${areaStart}&${areaEnd}&${dateStart}`);
            if (res && res.errCode === 0 && !arr1.length) {
                this.setState({
                    arrRoute: arr1,
                });
            } else if (res && res.errCode === 0 && arr1.length > 0) {
                this.setState({
                    arrRoute: arr1,
                });
            }
        }
    };
    currencyFormat(num) {
        return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") + " đ";
    }
    callbackFunctionPrice = (arrMouse, isMouse) => {
        this.setState({ arrMouse: arrMouse, isMouse: isMouse });
    };
    callbackFunctionValue = (value) => {
        this.setState({ value: value });
    };
    callbackFunctionButton1 = (arrTemp, isTemp, selectButton1) => {
        this.setState({
            arrTemp: arrTemp,
            isTemp: isTemp,
            selectButton1: selectButton1,
        });
    };
    callbackFunctionButton2 = (arrTemp, isTemp, selectButton2) => {
        this.setState({
            arrTemp: arrTemp,
            isTemp: isTemp,
            selectButton2: selectButton2,
        });
    };
    callbackFunctionButton3 = (arrTemp, isTemp, selectButton3) => {
        this.setState({
            arrTemp: arrTemp,
            isTemp: isTemp,
            selectButton3: selectButton3,
        });
    };
    callbackFunctionButton4 = (arrTemp, isTemp, selectButton4) => {
        this.setState({
            arrTemp: arrTemp,
            isTemp: isTemp,
            selectButton4: selectButton4,
        });
    };
    callbackFunctionTemp = (isTemp) => {
        this.setState({
            isTemp: false,
        });
    };
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
        let test1 = this.state.arrRoute;
        test1 = _.orderBy(test1, [b], [a]);
        let test = a + b;
        this.setState({
            sortBy: a,
            sortField: b,
            arrRoute: test1,
            isSort: test,
        });
    };
    compareTime = (dayChoose) => {
        let day = moment(new Date()).format("DD");
        let hour = moment(new Date()).format("HH");

        if (+dayChoose === +day) {
            if (+hour >= 18) {
                this.setState({ current: 4 });
            } else if (+hour >= 12) {
                this.setState({ current: 3 });
            } else if (+hour >= 6) {
                this.setState({ current: 2 });
            } else {
                this.setState({ current: 1 });
            }
        } else this.setState({ current: 1 });
    };

    handleReset = () => {
        this.setState({
            value: [0, 1000000],
            selectButton1: false,
            selectButton2: false,
            selectButton3: false,
            selectButton4: false,
            isTemp: false,
            isMouse: false,
        });
    };

    render() {
        let { arrRoute, dateStartTrip, selectLocaion1, selectLocaion2, isSort, loading } =
            this.state;
        let { current, arrMouse, arrTemp, isMouse, isTemp } = this.state;
        let arr1 = [];
        let arr2 = [];
        let arrFinish = [];

        if (isMouse === false) arr1 = arrRoute;
        else if (isMouse === true) arr1 = arrMouse;
        if (isTemp === false) arr2 = arrRoute;
        else if (isTemp === true) arr2 = arrTemp;

        arrFinish = _.intersectionWith(arr1, arr2, _.isEqual);

        const commonProps = {
            selectButton1: this.state.selectButton1,
            selectButton2: this.state.selectButton2,
            selectButton3: this.state.selectButton3,
            selectButton4: this.state.selectButton4,
        };
        return (
            <div style={{ overflowX: "hidden" }}>
                <LoadingOverlay active={this.state.isActive} spinner text="Loading ...">
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
                                    <label htmlFor="schedule1" style={{ float: "right" }}>
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
                                            new Date(new Date().setDate(new Date().getDate() - 1))
                                        }
                                    />
                                </div>
                            </div>
                            <div className="search">
                                <button onClick={(item) => this.handleTrip(item)}>
                                    <FormattedMessage id="header.search" />
                                </button>
                            </div>
                        </div>
                    </div>{" "}
                    <div className="route-container">
                        <div className="route-result">
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-3 col-sm-0">
                                        <div className="filter">
                                            <div className="filter_a">
                                                <span className="boloctimkiem float-left">
                                                    <FormattedMessage id="routes.filter" />
                                                </span>
                                                <span
                                                    className="xoaloc float-right"
                                                    onClick={() => this.handleReset()}>
                                                    <FormattedMessage id="routes.clean" />
                                                </span>
                                            </div>
                                            <div className="filter_content">
                                                <h4>
                                                    <FormattedMessage id="routes.popular" />
                                                </h4>

                                                <div className="filter_antSlider">
                                                    <h6 className="mt-3">
                                                        <FormattedMessage id="routes.time" />
                                                    </h6>

                                                    <ChooseTime
                                                        arrRoute={arrRoute}
                                                        current={current}
                                                        test={commonProps}
                                                        parentCallback={this.callbackFunctionTemp}
                                                        parentCallback1={
                                                            this.callbackFunctionButton1
                                                        }
                                                        parentCallback2={
                                                            this.callbackFunctionButton2
                                                        }
                                                        parentCallback3={
                                                            this.callbackFunctionButton3
                                                        }
                                                        parentCallback4={
                                                            this.callbackFunctionButton4
                                                        }
                                                    />
                                                    <h6 className="mt-3">
                                                        <FormattedMessage id="routes.price" />
                                                    </h6>
                                                    <ChoosePrice
                                                        arrRoute={arrRoute}
                                                        value={this.state.value}
                                                        parentCallbackPrice={
                                                            this.callbackFunctionPrice
                                                        }
                                                        parentCallbackValue={
                                                            this.callbackFunctionValue
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-9 col-sm-12">
                                        <div className="route-result-count">
                                            <div className="route-sort">
                                                <div className="container-sub ">
                                                    <div className="w-30 fl">
                                                        {loading === false ? (
                                                            ""
                                                        ) : (
                                                            <>
                                                                <span>
                                                                    <FormattedMessage id="routes.has" />
                                                                </span>
                                                                <span className="f-bold">
                                                                    {arrFinish.length}
                                                                </span>
                                                                <span className="f-bold">
                                                                    <FormattedMessage id="routes.trip" />
                                                                </span>
                                                                <span>
                                                                    <FormattedMessage id="routes.found" />
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="w-70 fr">
                                                        <div
                                                            className="w-20"
                                                            onClick={() =>
                                                                this.handleSort("asc", "id")
                                                            }>
                                                            <FormattedMessage id="routes.sort" />
                                                        </div>
                                                        <div
                                                            className="w-20"
                                                            style={{
                                                                backgroundColor: `${
                                                                    isSort === "ascprice"
                                                                        ? "#007BFF"
                                                                        : ""
                                                                }`,
                                                                color: `${
                                                                    isSort === "ascprice"
                                                                        ? "white"
                                                                        : "black"
                                                                }`,
                                                            }}
                                                            onClick={() =>
                                                                this.handleSort("asc", "price")
                                                            }>
                                                            <div className="test__">
                                                                <FormattedMessage id="routes.cheap" />
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="w-30"
                                                            style={{
                                                                backgroundColor: `${
                                                                    isSort === "asctimeStart"
                                                                        ? "#007BFF"
                                                                        : ""
                                                                }`,
                                                                color: `${
                                                                    isSort === "asctimeStart"
                                                                        ? "white"
                                                                        : "black"
                                                                }`,
                                                            }}
                                                            onClick={() =>
                                                                this.handleSort("asc", "timeStart")
                                                            }>
                                                            <div className="test__">
                                                                <FormattedMessage id="routes.earliest" />
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="w-30"
                                                            style={{
                                                                backgroundColor: `${
                                                                    isSort === "desctimeStart"
                                                                        ? "#007BFF"
                                                                        : ""
                                                                }`,
                                                                color: `${
                                                                    isSort === "desctimeStart"
                                                                        ? "white"
                                                                        : "black"
                                                                }`,
                                                            }}
                                                            onClick={() =>
                                                                this.handleSort("desc", "timeStart")
                                                            }>
                                                            <div className="test__">
                                                                <FormattedMessage id="routes.late" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* </div> */}

                                            <div className="route-result-body">
                                                {loading === false ? (
                                                    <SkeletonLoading loading={loading} />
                                                ) : arrFinish && arrFinish.length > 0 ? (
                                                    arrFinish.map((item, index) => {
                                                        let start = moment(+item.timeStart).format(
                                                            "llll"
                                                        );
                                                        let end = moment(+item.timeEnd).format(
                                                            "llll"
                                                        );
                                                        let imageBase64 = "";
                                                        if (item.Vehicle.image) {
                                                            imageBase64 = Buffer.from(
                                                                item.Vehicle.image,
                                                                "base64"
                                                            ).toString("binary");
                                                        }
                                                        return (
                                                            <div key={index}>
                                                                <div className="ticket">
                                                                    <div className="ticket-container">
                                                                        <div className="ticket-header">
                                                                            <div className="fl">
                                                                                <i className="fas fa-bus"></i>
                                                                                <span className="ml-5">
                                                                                    {
                                                                                        item.User
                                                                                            .Driver
                                                                                            .busOwner
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                            <div className="fr">
                                                                                {this.currencyFormat(
                                                                                    item.price
                                                                                )}
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
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="ticket-footer">
                                                                            <div className="row">
                                                                                <div className="w-50 fl">
                                                                                    <FormattedMessage id="routes.info" />
                                                                                </div>
                                                                                <div className="w-50 ">
                                                                                    <button
                                                                                        className="btn btn-warning fr"
                                                                                        onClick={() =>
                                                                                            this.handleClickTicket(
                                                                                                item
                                                                                            )
                                                                                        }>
                                                                                        <FormattedMessage id="routes.select" />
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })
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
                                                                fontSize: "25px",
                                                                fontWeight: 500,
                                                                marginBottom: 10,
                                                            }}>
                                                            Chuyến đang cập nhật
                                                        </p>
                                                        <p className="mb-0">
                                                            Hiện tại hệ thống chưa có thông tin nhà
                                                            xe đi từ {selectLocaion1.label} đến{" "}
                                                            {selectLocaion2.label} vào ngày{" "}
                                                            {moment(dateStartTrip).format("L")}
                                                        </p>
                                                        <span>
                                                            Xin quý khách vui lòng chọn ngày đi khác
                                                            hoặc tuyến đường khác.
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
                    <HomeFooter />
                </LoadingOverlay>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return { listRoutes: state.admin.routes, locations: state.admin.locations };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllRoute: () => dispatch(actions.fetchAllRoute()),
        fetchAllLocation: () => dispatch(actions.fetchAllLocation()),
    };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BusRoute));
