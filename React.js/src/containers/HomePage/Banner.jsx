import React, { Component } from "react";
import { connect } from "react-redux";
import "./Banner.scss";
import { FormattedMessage } from "react-intl";
import { changeLanguageApp } from "../../store/actions/appActions";
import Select from "react-select";
import moment from "moment";
import * as actions from "../../store/actions";
import { getAllTripHomeService } from "../../services/userService";
import { toast } from "react-toastify";
import { withRouter, Link } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "dayjs/locale/vi";
import { TextField, Stack } from "@mui/material";
import { customStylesBanner } from "../Passenger/Route/styleInput";
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
            inputData.map((item) => {
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

    changeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language);
    };
    handleOnChange1 = (data) => {
        this.setState({
            dateStartTrip: data.$d,
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
            let res = await getAllTripHomeService(areaStart, areaEnd, dateStart);
            let arr = res.trips;
            console.log(arr);
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
                if (this.props.history) {
                    this.props.history.push(`/home/route/${start}&${end}&${date}`);
                }
            }
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
                        border: "none",
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
    render() {
        let { selectLocaion1, selectLocaion2, info } = this.state;
        let { language } = this.props;
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
                                        styles={customStylesBanner}
                                        value={selectLocaion1}
                                        onChange={this.onChangeInput1}
                                        options={this.state.listLocations}
                                        placeholder={"Tỉnh/Thành phố nơi đi"}
                                    />
                                </div>
                                <div className="inputItem">
                                    <i className="fas fa-map-marker-alt"></i>
                                    <Select
                                        styles={customStylesBanner}
                                        placeholder={"Tỉnh/Thành phố nơi đến"}
                                        value={selectLocaion2}
                                        onChange={this.onChangeInput2}
                                        options={this.state.listLocations}
                                    />
                                </div>
                                <div className="inputItem">
                                    <ThemeProvider theme={this.theme}>
                                        {language === "vi" ? (
                                            <LocalizationProvider
                                                dateAdapter={AdapterDayjs}
                                                adapterLocale="vi">
                                                <Stack>
                                                    <DatePicker
                                                        sx={{
                                                            "& .css-z5fbbl-MuiInputBase-root-MuiOutlinedInput-root  ":
                                                                {
                                                                    fontSize: "14px",
                                                                },
                                                        }}
                                                        value={this.state.dateStartTrip}
                                                        onChange={this.handleOnChange1}
                                                        renderInput={(params) => (
                                                            <TextField {...params} />
                                                        )}
                                                        minDate={new Date()}
                                                        dayOfWeekFormatter={(day) => `${day}.`}
                                                    />
                                                </Stack>
                                            </LocalizationProvider>
                                        ) : (
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <Stack>
                                                    <DatePicker
                                                        value={this.state.dateStartTrip}
                                                        onChange={this.handleOnChange1}
                                                        renderInput={(params) => (
                                                            <TextField {...params} />
                                                        )}
                                                        minDate={new Date()}
                                                        dayOfWeekFormatter={(day) => `${day}.`}
                                                    />
                                                </Stack>
                                            </LocalizationProvider>
                                        )}
                                    </ThemeProvider>
                                </div>
                            </div>
                            <div className="search">
                                {info && info.roleID && info.roleID === "R4" ? (
                                    <button onClick={(item) => this.handleTrip(item)}>
                                        <FormattedMessage id="header.search" />
                                    </button>
                                ) : (
                                    <Link to="/login">
                                        <button onClick={(item) => this.handleTrip(item)}>
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
        locations: state.admin.locations,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language)),
        fetchAllLocation: () => dispatch(actions.fetchAllLocation()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Banner));
