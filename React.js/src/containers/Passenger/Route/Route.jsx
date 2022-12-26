import React, { Component, Suspense, lazy } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { LANGUAGES } from "../../../utils";
import { changeLanguageApp } from "../../../store/actions/appActions";
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
import Header from "../../HomePage/Header";
import Loading from "../../../components/Loading";
import SkeletonLoading from "./SkeletonLoading";
import { Slider, Box } from "@mui/material";
import { Row, Col } from "reactstrap";
const HomeFooter = lazy(() => import("../../HomePage/Section/HomeFooter"));
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
            value: [0, 1000000],
            current: 0,
            selectButton1: false,
            selectButton2: false,
            selectButton3: false,
            selectButton4: false,
            arrTemp: [],
            arrMouse: [],
            isTemp: false,
            isMouse: false,
            isFirst: false,
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
                let [day, month, year] = this.state.dateStartTrip.split("/");
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
    compareTime = (dayChoose) => {
        let day = moment(new Date()).format("DD");
        let hour = moment(new Date()).format("HH");
        console.log("dayChoose, day,hour >>>", dayChoose, day, hour);

        if (+dayChoose === +day) {
            if (+hour >= 18) {
                this.setState({ current: 4 });
            } else if (+hour >= 12) {
                this.setState({ current: 3 });
            } else if (+hour >= 6) {
                console.log(1);
                this.setState({ current: 2 });
            } else {
                this.setState({ current: 1 });
            }
        } else this.setState({ current: 1 });
    };
    handleChange = (value) => {
        this.setState({ value: value.target.value });
    };
    handleMouseLeave = () => {
        this.setState({ isMouse: false });
        let { value, arrRoute, arrTemp, isTemp } = this.state;
        let arrMouse = [];
        if (arrTemp.length > 0 && arrRoute.length !== arrTemp.length) {
            arrTemp.length > 0 &&
                (arrMouse = arrTemp.filter((item) => {
                    return item.price <= value[1] && item.price >= value[0];
                }));
        } else {
            arrRoute.length > 0 &&
                (arrMouse = arrRoute.filter((item) => {
                    return item.price <= value[1] && item.price >= value[0];
                }));
        }
        console.log("arrMouse >>>:", arrMouse);
        if (isTemp === true && !(value[0] === 0 && value[1] === 1000000)) {
            console.log("1");
            this.setState({
                isMouse: true,
                arrMouse: arrMouse,
                isFirst: false,
            });
        } else if (value[0] === 0 && value[1] === 1000000) {
            console.log("2");
            this.setState({
                isMouse: false,
                arrMouse: arrRoute,
                isFirst: false,
            });
        } else {
            console.log("3");
            this.setState({
                isMouse: true,
                arrMouse: arrMouse,
                isFirst: false,
            });
        }
    };
    handleButton1 = () => {
        this.setState({ isTemp: false });
        let { selectButton1, selectButton2, selectButton3, selectButton4, arrRoute, arrMouse } = this.state;
        let arr = [];
        let temp = false;
        if (arrMouse.length > 0 && arrRoute.length !== arrMouse.length) {
            if (selectButton1 === false) {
                if (selectButton4 === true && selectButton2 === true && selectButton3 === true) {
                    arr = arrMouse;
                    temp = true;
                }
                if (selectButton2 === false && selectButton3 === false && selectButton4 === false) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 6;
                        }));
                }
                if (selectButton2 === false && selectButton3 === false && selectButton4 === true) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 6 || +time >= 18;
                        }));
                }
                if (selectButton2 === false && selectButton3 === true && selectButton4 === false) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 6 || (+time >= 12 && +time < 18);
                        }));
                }
                if (selectButton2 === true && selectButton3 === false && selectButton4 === false) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 12;
                        }));
                }
                if (selectButton2 === true && selectButton3 === true && selectButton4 === false) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 18;
                        }));
                }
                if (selectButton2 === true && selectButton3 === false && selectButton4 === true) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 12 || +time >= 18;
                        }));
                }
                if (selectButton2 === false && selectButton3 === true && selectButton4 === true) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 6 || +time >= 12;
                        }));
                }
            }
            if (selectButton1 === true) {
                if (selectButton2 === false && selectButton3 === false && selectButton4 === false) {
                    arr = arrMouse;
                    temp = true;
                }
                if (selectButton2 === false && selectButton3 === false && selectButton4 === true) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 18;
                        }));
                }
                if (selectButton2 === false && selectButton3 === true && selectButton4 === false) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 12 && +time < 18;
                        }));
                }
                if (selectButton2 === true && selectButton3 === false && selectButton4 === false) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 6 && +time < 12;
                        }));
                }
                if (selectButton2 === true && selectButton3 === true && selectButton4 === false) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 6 && +time < 18;
                        }));
                }
                if (selectButton2 === true && selectButton3 === false && selectButton4 === true) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return (+time >= 6 && +time < 12) || +time >= 18;
                        }));
                }
                if (selectButton2 === false && selectButton3 === true && selectButton4 === true) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 12;
                        }));
                }
                if (selectButton2 === true && selectButton3 === true && selectButton4 === true) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 6;
                        }));
                }
            }
        } else {
            if (selectButton1 === false) {
                if (selectButton4 === true && selectButton2 === true && selectButton3 === true) {
                    arr = arrRoute;
                    temp = true;
                }
                if (selectButton2 === false && selectButton3 === false && selectButton4 === false) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 6;
                        }));
                }
                if (selectButton2 === false && selectButton3 === false && selectButton4 === true) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 6 || +time >= 18;
                        }));
                }
                if (selectButton2 === false && selectButton3 === true && selectButton4 === false) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 6 || (+time >= 12 && +time < 18);
                        }));
                }
                if (selectButton2 === true && selectButton3 === false && selectButton4 === false) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 12;
                        }));
                }
                if (selectButton2 === true && selectButton3 === true && selectButton4 === false) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 18;
                        }));
                }
                if (selectButton2 === true && selectButton3 === false && selectButton4 === true) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 12 || +time >= 18;
                        }));
                }
                if (selectButton2 === false && selectButton3 === true && selectButton4 === true) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 6 || +time >= 12;
                        }));
                }
            }
            if (selectButton1 === true) {
                if (selectButton2 === false && selectButton3 === false && selectButton4 === false) {
                    arr = arrRoute;
                    temp = true;
                }
                if (selectButton2 === false && selectButton3 === false && selectButton4 === true) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 18;
                        }));
                }
                if (selectButton2 === false && selectButton3 === true && selectButton4 === false) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 12 && +time < 18;
                        }));
                }
                if (selectButton2 === true && selectButton3 === false && selectButton4 === false) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 6 && +time < 12;
                        }));
                }
                if (selectButton2 === true && selectButton3 === true && selectButton4 === false) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 6 && +time < 18;
                        }));
                }
                if (selectButton2 === true && selectButton3 === false && selectButton4 === true) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return (+time >= 6 && +time < 12) || +time >= 18;
                        }));
                }
                if (selectButton2 === false && selectButton3 === true && selectButton4 === true) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 12;
                        }));
                }
                if (selectButton2 === true && selectButton3 === true && selectButton4 === true) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 6;
                        }));
                }
            }
        }

        console.log(arr);
        if (temp === true) {
            this.setState({
                arrTemp: arr,
                isFirst: true,
                isTemp: false,
                selectButton1: !this.state.selectButton1,
            });
        } else
            this.setState({
                arrTemp: arr,
                isTemp: true,
                isFirst: true,
                selectButton1: !this.state.selectButton1,
            });
    };
    handleButton2 = () => {
        this.setState({ isTemp: false });
        let { selectButton1, selectButton2, selectButton3, selectButton4, arrRoute, arrMouse } = this.state;
        let arr = [];
        let temp = false;
        if (arrMouse.length > 0 && arrRoute.length !== arrMouse.length) {
            if (selectButton2 === false) {
                if (selectButton1 === true && selectButton4 === true && selectButton3 === true) {
                    arr = arrMouse;
                    temp = true;
                }
                if (selectButton1 === false && selectButton3 === false && selectButton4 === false) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 6 && +time < 12;
                        }));
                }
                if (selectButton1 === false && selectButton3 === false && selectButton4 === true) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return (+time >= 6 && +time < 12) || +time >= 18;
                        }));
                }
                if (selectButton1 === false && selectButton3 === true && selectButton4 === false) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 6 && +time < 18;
                        }));
                }
                if (selectButton1 === true && selectButton3 === false && selectButton4 === false) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 12;
                        }));
                }
                if (selectButton1 === true && selectButton3 === true && selectButton4 === false) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 18;
                        }));
                }
                if (selectButton1 === true && selectButton3 === false && selectButton4 === true) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 12 || +time >= 18;
                        }));
                }
                if (selectButton1 === false && selectButton3 === true && selectButton4 === true) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 6;
                        }));
                }
            }
            if (selectButton2 === true) {
                if (selectButton1 === false && selectButton3 === false && selectButton4 === false) {
                    arr = arrMouse;
                    temp = true;
                }
                if (selectButton1 === false && selectButton3 === false && selectButton4 === true) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 18;
                        }));
                }
                if (selectButton1 === false && selectButton3 === true && selectButton4 === false) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 12 && +time < 18;
                        }));
                }
                if (selectButton1 === true && selectButton3 === false && selectButton4 === false) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 6;
                        }));
                }
                if (selectButton1 === true && selectButton3 === true && selectButton4 === false) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 6 || (+time >= 12 && +time < 18);
                        }));
                }
                if (selectButton1 === true && selectButton3 === false && selectButton4 === true) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 12 || +time >= 18;
                        }));
                }
                if (selectButton1 === false && selectButton3 === true && selectButton4 === true) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 12;
                        }));
                }
                if (selectButton1 === true && selectButton3 === true && selectButton4 === true) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 6 || +time > 12;
                        }));
                }
            }
        } else {
            if (selectButton2 === false) {
                if (selectButton1 === true && selectButton4 === true && selectButton3 === true) {
                    arr = arrRoute;
                    temp = true;
                }
                if (selectButton1 === false && selectButton3 === false && selectButton4 === false) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 6 && +time < 12;
                        }));
                }
                if (selectButton1 === false && selectButton3 === false && selectButton4 === true) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return (+time >= 6 && +time < 12) || +time >= 18;
                        }));
                }
                if (selectButton1 === false && selectButton3 === true && selectButton4 === false) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 6 && +time < 18;
                        }));
                }
                if (selectButton1 === true && selectButton3 === false && selectButton4 === false) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 12;
                        }));
                }
                if (selectButton1 === true && selectButton3 === true && selectButton4 === false) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 18;
                        }));
                }
                if (selectButton1 === true && selectButton3 === false && selectButton4 === true) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 12 || +time >= 18;
                        }));
                }
                if (selectButton1 === false && selectButton3 === true && selectButton4 === true) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 6;
                        }));
                }
            }
            if (selectButton2 === true) {
                if (selectButton1 === false && selectButton3 === false && selectButton4 === false) {
                    arr = arrRoute;
                    temp = true;
                }
                if (selectButton1 === false && selectButton3 === false && selectButton4 === true) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 18;
                        }));
                }
                if (selectButton1 === false && selectButton3 === true && selectButton4 === false) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 12 && +time < 18;
                        }));
                }
                if (selectButton1 === true && selectButton3 === false && selectButton4 === false) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 6;
                        }));
                }
                if (selectButton1 === true && selectButton3 === true && selectButton4 === false) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 6 || (+time >= 12 && +time < 18);
                        }));
                }
                if (selectButton1 === true && selectButton3 === false && selectButton4 === true) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 12 || +time >= 18;
                        }));
                }
                if (selectButton1 === false && selectButton3 === true && selectButton4 === true) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 12;
                        }));
                }
                if (selectButton1 === true && selectButton3 === true && selectButton4 === true) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 6 || +time > 12;
                        }));
                }
            }
        }

        console.log(arr);
        if (temp === true) {
            this.setState({
                arrTemp: arr,
                isTemp: false,
                isFirst: true,
                selectButton2: !this.state.selectButton2,
            });
        } else
            this.setState({
                arrTemp: arr,
                isTemp: true,
                isFirst: true,
                selectButton2: !this.state.selectButton2,
            });
    };
    handleButton3 = () => {
        this.setState({ isTemp: false });
        let { selectButton1, selectButton2, selectButton3, selectButton4, arrRoute, arrMouse } = this.state;
        let arr = [];
        let temp = false;
        if (arrMouse.length > 0 && arrRoute.length !== arrMouse.length) {
            if (selectButton3 === false) {
                if (selectButton1 === false && selectButton2 === false && selectButton4 === false) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 12 && +time < 18;
                        }));
                }
                if (selectButton1 === false && selectButton2 === false && selectButton4 === true) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 12;
                        }));
                }
                if (selectButton1 === false && selectButton2 === true && selectButton4 === false) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 6 && +time < 18;
                        }));
                }
                if (selectButton1 === true && selectButton2 === false && selectButton4 === false) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 6 || (+time >= 12 && +time < 18);
                        }));
                }
                if (selectButton1 === true && selectButton2 === true && selectButton4 === false) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 18;
                        }));
                }
                if (selectButton1 === true && selectButton2 === false && selectButton4 === true) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 6 || +time >= 12;
                        }));
                }
                if (selectButton1 === false && selectButton2 === true && selectButton4 === true) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 6;
                        }));
                }
                if (selectButton1 === true && selectButton2 === true && selectButton4 === true) {
                    arr = arrMouse;
                    temp = true;
                }
            }
            if (selectButton3 === true) {
                if (selectButton1 === false && selectButton2 === false && selectButton4 === false) {
                    arr = arrMouse;
                    temp = true;
                }
                if (selectButton1 === false && selectButton2 === false && selectButton4 === true) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 18;
                        }));
                }
                if (selectButton1 === false && selectButton2 === true && selectButton4 === false) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 6 && +time < 12;
                        }));
                }
                if (selectButton1 === true && selectButton2 === false && selectButton4 === false) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 6;
                        }));
                } //err
                if (selectButton1 === true && selectButton2 === true && selectButton4 === false) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 12;
                        }));
                }
                if (selectButton1 === true && selectButton2 === false && selectButton4 === true) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 6 || +time >= 18;
                        }));
                }
                if (selectButton1 === false && selectButton2 === true && selectButton4 === true) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return (+time >= 6 && +time < 12) || +time >= 18;
                        }));
                }
                if (selectButton1 === true && selectButton2 === true && selectButton4 === true) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 12 || +time >= 18;
                        }));
                }
            }
        } else {
            if (selectButton3 === false) {
                if (selectButton1 === false && selectButton2 === false && selectButton4 === false) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 12 && +time < 18;
                        }));
                }
                if (selectButton1 === false && selectButton2 === false && selectButton4 === true) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 12;
                        }));
                }
                if (selectButton1 === false && selectButton2 === true && selectButton4 === false) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 6 && +time < 18;
                        }));
                }
                if (selectButton1 === true && selectButton2 === false && selectButton4 === false) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 6 || (+time >= 12 && +time < 18);
                        }));
                }
                if (selectButton1 === true && selectButton2 === true && selectButton4 === false) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 18;
                        }));
                }
                if (selectButton1 === true && selectButton2 === false && selectButton4 === true) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 6 || +time >= 12;
                        }));
                }
                if (selectButton1 === false && selectButton2 === true && selectButton4 === true) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 6;
                        }));
                }
                if (selectButton1 === true && selectButton2 === true && selectButton4 === true) {
                    arr = arrRoute;
                    temp = true;
                }
            }
            if (selectButton3 === true) {
                if (selectButton1 === false && selectButton2 === false && selectButton4 === false) {
                    arr = arrRoute;
                    temp = true;
                }
                if (selectButton1 === false && selectButton2 === false && selectButton4 === true) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 18;
                        }));
                }
                if (selectButton1 === false && selectButton2 === true && selectButton4 === false) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 6 && +time < 12;
                        }));
                }
                if (selectButton1 === true && selectButton2 === false && selectButton4 === false) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 6;
                        }));
                } //err
                if (selectButton1 === true && selectButton2 === true && selectButton4 === false) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 12;
                        }));
                }
                if (selectButton1 === true && selectButton2 === false && selectButton4 === true) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 6 || +time >= 18;
                        }));
                }
                if (selectButton1 === false && selectButton2 === true && selectButton4 === true) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return (+time >= 6 && +time < 12) || +time >= 18;
                        }));
                }
                if (selectButton1 === true && selectButton2 === true && selectButton4 === true) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 12 || +time >= 18;
                        }));
                }
            }
        }

        console.log(arr);
        if (temp === true) {
            this.setState({
                arrTemp: arr,
                isTemp: false,
                isFirst: true,
                selectButton3: !this.state.selectButton3,
            });
        } else
            this.setState({
                arrTemp: arr,
                isTemp: true,
                isFirst: true,
                selectButton3: !this.state.selectButton3,
            });
    };
    handleButton4 = () => {
        this.setState({ isTemp: false });
        let { selectButton1, selectButton2, selectButton3, selectButton4, arrRoute, arrMouse } = this.state;
        let arr = [];
        let temp = false;
        if (arrMouse.length > 0 && arrRoute.length !== arrMouse.length) {
            if (selectButton4 === false) {
                if (selectButton1 === false && selectButton2 === false && selectButton3 === false) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 18;
                        }));
                }
                if (selectButton1 === false && selectButton2 === false && selectButton3 === true) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 12;
                        }));
                }
                if (selectButton1 === false && selectButton2 === true && selectButton3 === false) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return (+time >= 6 && +time < 12) || +time >= 18;
                        }));
                }
                if (selectButton1 === true && selectButton2 === false && selectButton3 === false) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return (+time >= 0 && +time < 6) || +time >= 18;
                        }));
                }
                if (selectButton1 === true && selectButton2 === true && selectButton3 === false) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return (+time >= 0 && +time < 12) || +time >= 18;
                        }));
                }
                if (selectButton1 === true && selectButton2 === false && selectButton3 === true) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return (+time >= 0 && +time < 6) || +time >= 12;
                        }));
                }
                if (selectButton1 === false && selectButton2 === true && selectButton3 === true) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 6;
                        }));
                }
                if (selectButton1 === true && selectButton2 === true && selectButton3 === true) {
                    arr = arrMouse;
                    temp = true;
                }
            }
            if (selectButton4 === true) {
                if (selectButton1 === false && selectButton2 === false && selectButton3 === false) {
                    arr = arrMouse;
                    temp = true;
                }
                if (selectButton1 === false && selectButton2 === false && selectButton3 === true) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 12 && +time < 18;
                        }));
                }
                if (selectButton1 === false && selectButton2 === true && selectButton3 === false) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 6 && +time < 12;
                        }));
                }
                if (selectButton1 === true && selectButton2 === false && selectButton3 === false) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 6;
                        }));
                } //err
                if (selectButton1 === true && selectButton2 === true && selectButton3 === false) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 12;
                        }));
                }
                if (selectButton1 === true && selectButton2 === false && selectButton3 === true) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 6 || (+time >= 12 && +time < 18);
                        }));
                }
                if (selectButton1 === false && selectButton2 === true && selectButton3 === true) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 6 && +time < 18;
                        }));
                }
                if (selectButton2 === true && selectButton3 === true && selectButton1 === true) {
                    arrMouse.length > 0 &&
                        (arr = arrMouse.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 18;
                        }));
                }
            }
            console.log("arr >>:", arr);
        } else {
            if (selectButton4 === false) {
                if (selectButton1 === false && selectButton2 === false && selectButton3 === false) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 18;
                        }));
                }
                if (selectButton1 === false && selectButton2 === false && selectButton3 === true) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 12;
                        }));
                }
                if (selectButton1 === false && selectButton2 === true && selectButton3 === false) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return (+time >= 6 && +time < 12) || +time >= 18;
                        }));
                }
                if (selectButton1 === true && selectButton2 === false && selectButton3 === false) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return (+time >= 0 && +time < 6) || +time >= 18;
                        }));
                }
                if (selectButton1 === true && selectButton2 === true && selectButton3 === false) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return (+time >= 0 && +time < 12) || +time >= 18;
                        }));
                }
                if (selectButton1 === true && selectButton2 === false && selectButton3 === true) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return (+time >= 0 && +time < 6) || +time >= 12;
                        }));
                }
                if (selectButton1 === false && selectButton2 === true && selectButton3 === true) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 6;
                        }));
                }
                if (selectButton1 === true && selectButton2 === true && selectButton3 === true) {
                    arr = arrRoute;
                    temp = true;
                }
            }
            if (selectButton4 === true) {
                if (selectButton1 === false && selectButton2 === false && selectButton3 === false) {
                    arr = arrRoute;
                    temp = true;
                }
                if (selectButton1 === false && selectButton2 === false && selectButton3 === true) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 12 && +time < 18;
                        }));
                }
                if (selectButton1 === false && selectButton2 === true && selectButton3 === false) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 6 && +time < 12;
                        }));
                }
                if (selectButton1 === true && selectButton2 === false && selectButton3 === false) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 6;
                        }));
                } //err
                if (selectButton1 === true && selectButton2 === true && selectButton3 === false) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 12;
                        }));
                }
                if (selectButton1 === true && selectButton2 === false && selectButton3 === true) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 6 || (+time >= 12 && +time < 18);
                        }));
                }
                if (selectButton1 === false && selectButton2 === true && selectButton3 === true) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time >= 6 && +time < 18;
                        }));
                }
                if (selectButton2 === true && selectButton3 === true && selectButton1 === true) {
                    arrRoute.length > 0 &&
                        (arr = arrRoute.filter((item, index) => {
                            let time = moment(+item.timeStart).format("HH");
                            return +time < 18;
                        }));
                }
            }
        }

        console.log(arr);
        if (temp === true) {
            this.setState({
                arrTemp: arr,
                isFirst: true,
                isTemp: false,
                selectButton4: !this.state.selectButton4,
            });
        } else
            this.setState({
                arrTemp: arr,
                isTemp: true,
                isFirst: true,
                selectButton4: !this.state.selectButton4,
            });
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
        let { arrRoute, dateStartTrip, selectLocaion1, selectLocaion2, isSort, loading } = this.state;
        let {
            value,
            current,
            selectButton1,
            selectButton2,
            selectButton3,
            selectButton4,
            isTemp,
            isMouse,
            arrMouse,
            arrTemp,
            isFirst,
        } = this.state;
        let language = this.props.language;
        if (isTemp === true && isMouse === false) {
            arrRoute = arrTemp;
        } else if (isMouse === true && isTemp === false) {
            arrRoute = arrMouse;
        } else if (isMouse === true && isTemp === true && isFirst === false) {
            arrRoute = arrMouse;
        } else if (isMouse === true && isTemp === true && isFirst === true) {
            arrRoute = arrTemp;
        }
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
                                        <i className="far fa-calendar-alt" style={{ fontSize: "20px" }}></i>
                                    </label>
                                    <DatePicker
                                        placeholder={"Chọn ngày"}
                                        style={{ border: "none" }}
                                        onChange={this.handleOnChange1}
                                        id="schedule1"
                                        value={dateStartTrip}
                                        selected={this.state.dateStartTrip}
                                        minDate={new Date(new Date().setDate(new Date().getDate() - 1))}
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
                                                <span className="xoaloc float-right" onClick={() => this.handleReset()}>
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
                                                    <Row>
                                                        <Col md={6}>
                                                            <button
                                                                className="item_choose"
                                                                style={{
                                                                    borderColor: `${
                                                                        selectButton1 ? "#0B5ED8" : "#c0c0c0"
                                                                    }`,
                                                                    background: `${
                                                                        selectButton1 ? "#F0F0F0 " : "white"
                                                                    }`,
                                                                }}
                                                                onClick={() => this.handleButton1()}
                                                                disabled={current === 1 ? false : true}>
                                                                <div>
                                                                    <FormattedMessage id="routes.dawn" />
                                                                </div>
                                                                <div>00:00 - 05:59</div>
                                                            </button>
                                                        </Col>
                                                        <Col md={6}>
                                                            <button
                                                                style={{
                                                                    borderColor: `${
                                                                        selectButton2 ? "#0B5ED8" : "#c0c0c0"
                                                                    }`,
                                                                    background: `${
                                                                        selectButton2 ? "#F0F0F0 " : "white"
                                                                    }`,
                                                                }}
                                                                onClick={() => this.handleButton2()}
                                                                className="item_choose"
                                                                disabled={
                                                                    current === 2 || current === 1 ? false : true
                                                                }>
                                                                <div>
                                                                    <FormattedMessage id="routes.morning" />
                                                                </div>
                                                                <div>06:00 - 11:59</div>
                                                            </button>
                                                        </Col>
                                                    </Row>
                                                    <Row className="mt-3">
                                                        <Col md={6}>
                                                            <button
                                                                style={{
                                                                    borderColor: `${
                                                                        selectButton3 ? "#0B5ED8" : "#c0c0c0"
                                                                    }`,
                                                                    background: `${
                                                                        selectButton3 ? "#F0F0F0 " : "white"
                                                                    }`,
                                                                }}
                                                                onClick={() => this.handleButton3()}
                                                                className="item_choose"
                                                                disabled={
                                                                    current === 2 || current === 1 || current === 3
                                                                        ? false
                                                                        : true
                                                                }>
                                                                <div>
                                                                    <FormattedMessage id="routes.afternoon" />
                                                                </div>
                                                                <div>12:00 - 17:59</div>
                                                            </button>
                                                        </Col>
                                                        <Col md={6}>
                                                            <button
                                                                style={{
                                                                    borderColor: `${
                                                                        selectButton4 ? "#0B5ED8" : "#c0c0c0"
                                                                    }`,
                                                                    background: `${
                                                                        selectButton4 ? "#F0F0F0 " : "white"
                                                                    }`,
                                                                }}
                                                                onClick={() => this.handleButton4()}
                                                                className="item_choose">
                                                                <div>
                                                                    <FormattedMessage id="routes.evening" />
                                                                </div>
                                                                <div>18:00 - 23:59</div>
                                                            </button>
                                                        </Col>
                                                    </Row>
                                                    <h6 className="mt-3">
                                                        <FormattedMessage id="routes.price" />
                                                    </h6>
                                                    <Box sx={{ width: 280 }}>
                                                        <Slider
                                                            getAriaLabel={() => "Temperature range"}
                                                            value={value}
                                                            min={0}
                                                            max={1000000}
                                                            step={50000}
                                                            onMouseUp={this.handleMouseLeave}
                                                            onChange={(e) => this.handleChange(e)}
                                                            valueLabelDisplay="auto"
                                                        />
                                                    </Box>
                                                    {/* <Slider range min={0} max={2000000} defaultValue={[0, 2000000]} /> */}
                                                    <div className="filter_b">
                                                        <span>{this.currencyFormat(value[0])}</span>
                                                        <span className="float-end">
                                                            {this.currencyFormat(value[1])}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="filter_brand">
                                                    <h6 className="mt-3">
                                                        <FormattedMessage id="routes.oparator" />
                                                    </h6>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Tìm nhà xe"
                                                    />
                                                    <div className="listNhaXe mt-3">
                                                        <div className="d-flex align-items-center">
                                                            <input type="checkbox" name="nhaxe" id="nhaxe" />
                                                            <label className="nhaxe mb-0 ml-2" htmlFor="nhaxe">
                                                                Hoàng Long (3)
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-9 col-sm-12">
                                        <div className="route-result-count">
                                            {/* <div className="route-header"> */}
                                            <div className="route-sort">
                                                <div className="container-sub ">
                                                    <div className="w-30 fl">
                                                        {loading === false ? (
                                                            ""
                                                        ) : (
                                                            <>
                                                                <span>
                                                                    {" "}
                                                                    <FormattedMessage id="routes.has" />{" "}
                                                                </span>
                                                                <span className="f-bold">{arrRoute.length}</span>
                                                                <span className="f-bold">
                                                                    {" "}
                                                                    <FormattedMessage id="routes.trip" />{" "}
                                                                </span>
                                                                <span>
                                                                    {" "}
                                                                    <FormattedMessage id="routes.found" />{" "}
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                    <div className="w-70 fr">
                                                        <div
                                                            className="w-20"
                                                            onClick={() => this.handleSort("asc", "id")}>
                                                            <FormattedMessage id="routes.sort" />
                                                        </div>
                                                        <div
                                                            className="w-20"
                                                            style={{
                                                                backgroundColor: `${
                                                                    isSort === "ascprice" ? "#007BFF" : ""
                                                                }`,
                                                                color: `${isSort === "ascprice" ? "white" : "black"}`,
                                                            }}
                                                            onClick={() => this.handleSort("asc", "price")}>
                                                            <div className="test__">
                                                                <FormattedMessage id="routes.cheap" />
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="w-30"
                                                            style={{
                                                                backgroundColor: `${
                                                                    isSort === "asctimeStart" ? "#007BFF" : ""
                                                                }`,
                                                                color: `${
                                                                    isSort === "asctimeStart" ? "white" : "black"
                                                                }`,
                                                            }}
                                                            onClick={() => this.handleSort("asc", "timeStart")}>
                                                            {" "}
                                                            <div className="test__">
                                                                <FormattedMessage id="routes.earliest" />
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="w-30"
                                                            style={{
                                                                backgroundColor: `${
                                                                    isSort === "desctimeStart" ? "#007BFF" : ""
                                                                }`,
                                                                color: `${
                                                                    isSort === "desctimeStart" ? "white" : "black"
                                                                }`,
                                                            }}
                                                            onClick={() => this.handleSort("desc", "timeStart")}>
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
                                                ) : arrRoute && arrRoute.length > 0 ? (
                                                    arrRoute.map((item, index) => {
                                                        let start = moment(+item.timeStart).format("llll");
                                                        let end = moment(+item.timeEnd).format("llll");
                                                        let imageBase64 = "";
                                                        if (item.Vehicle.image) {
                                                            imageBase64 = Buffer.from(
                                                                item.Vehicle.image,
                                                                "base64"
                                                            ).toString("binary");
                                                        }
                                                        return (
                                                            <>
                                                                <div className="ticket">
                                                                    <div className="ticket-container">
                                                                        <div className="ticket-header">
                                                                            <div className="fl">
                                                                                <i className="fas fa-bus"></i>
                                                                                <span className="ml-5">
                                                                                    {item.User.Driver.busOwner}
                                                                                </span>
                                                                            </div>
                                                                            <div className="fr">
                                                                                {this.currencyFormat(item.price)}
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
                                                                                                {start}
                                                                                                {"  -  "}
                                                                                            </span>
                                                                                            <span className="pointStart">
                                                                                                {item.areaStart}
                                                                                            </span>
                                                                                        </div>
                                                                                        <div className="f-17">
                                                                                            <i className="fas fa-map-marker-alt"></i>
                                                                                            <span className="timeEnd">
                                                                                                {end}
                                                                                                {"  -  "}
                                                                                            </span>
                                                                                            <span className="pointEnd">
                                                                                                {item.areaEnd}
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
                                                                                            this.handleClickTicket(item)
                                                                                        }>
                                                                                        <FormattedMessage id="routes.select" />
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        );
                                                    })
                                                ) : (
                                                    <div className="detail_fail text-center">
                                                        <img width="70%" src={NotFoundTrip} alt="" />
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
                                                            Hiện tại hệ thống chưa có thông tin nhà xe đi từ{" "}
                                                            {selectLocaion1.label} đến {selectLocaion2.label} vào ngày{" "}
                                                            {moment(dateStartTrip).format("L")}
                                                        </p>
                                                        <span>
                                                            Xin quý khách vui lòng chọn ngày đi khác hoặc tuyến đường
                                                            khác.
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
                <Suspense fallback={<Loading />}>
                    <HomeFooter />
                </Suspense>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return { listRoutes: state.admin.routes, locations: state.admin.locations };
};

const mapDispatchToProps = (dispatch) => {
    return {
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language)),
        fetchAllRoute: () => dispatch(actions.fetchAllRoute()),
        fetchAllLocation: () => dispatch(actions.fetchAllLocation()),
    };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BusRoute));
