import React, { Component } from "react";
import { connect } from "react-redux";
import "./Banner.scss";
import { FormattedMessage } from "react-intl";
import { LANGUAGES } from "../../utils";
import { changeLanguageApp } from "../../store/actions/appActions";
import Select from "react-select";
import DatePicker from "../../components/DatePicker";
import dayjs from "dayjs";
import moment from "moment";
import localization from "moment/locale/vi";
import * as actions from "../../store/actions";
import { getAllTripHomeService } from "../../services/userService";
import { toast } from "react-toastify";
import { withRouter, Link } from "react-router-dom";
import { push } from "connected-react-router";
const styles = {
    fontSize: 14,
    color: "blue",
};
const customStyles = {
    control: (base) => ({
        // ...base,
        border: "none",
        display: "flex",
        position: "relative",
        boxSizing: "border-box",
        flexWrap: "wrap",
        transition: "all 100ms",
        justifyContent: "space-between",
    }),
    valueContainer: (base) => ({
        // ...base,
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
    indicatorSeparator: (base) => ({
        ...base,
        display: "none",
    }),
    // placeholder: (base) => ({
    //     ...base,
    //     // backgroundColor: "black",
    //     fontSize: "2em",
    //     color: "black",
    //     fontWeight: 400,
    // }),
};
class Banner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dateStartTrip: "",
            listLocations: [],
            selectLocaion1: "",
            selectLocaion2: "",
            info: "",
        };
    }
    async componentDidMount() {
        this.props.fetchAllRoute();
        this.props.fetchAllLocation();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.locations !== this.props.locations) {
            let dataSelect = this.buildDataSelect(this.props.locations);
            this.setState({
                listLocations: dataSelect,
            });
        }
        if (prevProps.userInfo !== this.props.userInfo) {
            this.setState({ info: this.props.userInfo });
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

    changeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language);
    };
    handleOnChange1 = (data) => {
        this.setState({
            dateStartTrip: data[0],
        });
    };

    handleTrip = async (route) => {
        console.log(1);
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
            if (res && res.errCode === 0 && !arr.length) {
                toast.success(
                    `Hiện tại hệ thống chưa có thông tin nhà xe đi từ ${areaStart} đến ${areaEnd} vào ngày ${moment(
                        dateStart
                    ).format("L")}`
                );
            } else if (res && res.errCode === 0 && arr.length > 0) {
                let start = arr[0].areaStart;
                let end = arr[0].areaEnd;
                let date = arr[0].dateStart;
                console.log(this.props.history);
                if (this.props.history) {
                    this.props.history.push(
                        `/home/route/${start}&${end}&${date}`
                    );
                }
            }
        }
    };

    render() {
        let { selectLocaion1, selectLocaion2, info } = this.state;
        let language = this.props.language;
        console.log(12);
        return (
            <React.Fragment>
                <div className="home-header-banner">
                    <div className="banner">
                        <h1>TravelStart</h1>
                        <div />
                        <p>
                            <FormattedMessage id="header.sologan" />{" "}
                        </p>
                        <div className="searchGroup">
                            <div className="inputSearch">
                                <div className="inputItem item1">
                                    <i className="fas fa-map-marker-alt"></i>
                                    <Select
                                        styles={customStyles}
                                        value={selectLocaion1}
                                        onChange={this.onChangeInput1}
                                        options={this.state.listLocations}
                                        placeholder={"Tỉnh/Thành phố nơi đi"}
                                    />
                                </div>
                                <div className="inputItem">
                                    <i className="fas fa-map-marker-alt"></i>
                                    <Select
                                        styles={customStyles}
                                        placeholder={"Tỉnh/Thành phố nơi đến"}
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
                                {info && info.roleID && info.roleID === "R4" ? (
                                    <button
                                        onClick={(item) =>
                                            this.handleTrip(item)
                                        }>
                                        <FormattedMessage id="header.search" />
                                    </button>
                                ) : (
                                    <Link to="/login">
                                        <button
                                            onClick={(item) =>
                                                this.handleTrip(item)
                                            }>
                                            <FormattedMessage id="header.search" />
                                        </button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        language: state.app.language,
        listRoutes: state.admin.routes,
        locations: state.admin.locations,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        changeLanguageAppRedux: (language) =>
            dispatch(changeLanguageApp(language)),
        fetchAllRoute: () => dispatch(actions.fetchAllRoute()),
        fetchAllLocation: () => dispatch(actions.fetchAllLocation()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Banner));
