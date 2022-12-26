import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { TableBody, TableContainer, Paper, Table } from "@mui/material";
import moment from "moment";
import { Row, Col } from "reactstrap";
import Select from "react-select";
import "../style.scss";
import { getDriverTrips } from "../../../../services/userService";
const chooseSelect1 = [
    {
        value: 1,
        label: "Tháng 1 - 2023",
    },
    {
        value: 2,
        label: "Tháng 12 - 2022",
    },
    {
        value: 3,
        label: "Tháng 11 - 2022",
    },
];
const chooseSelect2 = [
    {
        value: 1,
        label: "January 2023",
    },
    {
        value: 2,
        label: "December 2022",
    },
    {
        value: 3,
        label: "November 2022",
    },
];
const mon11Vi = "01/11/2022 - 30/11/2022";
const mon11En = "11/01/2022 - 11/30/2022";
const mon12Vi = "01/12/2022 - 31/12/2022";
const mon12En = "12/01/2022 - 11/31/2022";
const mon01Vi = "01/01/2023 - 31/01/2023";
const mon01En = "01/01/2023 - 01/31/2023";

const startMonth11 = 1667235600000;
const startMonth12 = 1669827600000;
const startMonth01 = 1672506000000;
const endMonth11 = 1669827599000;
const endMonth12 = 1672505990000;
const endMonth01 = 1675184390000;
// cons;
class History extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectMonth: "",
            arrTrips: [],
            arrTripMonth: [],
        };
    }

    async componentDidMount() {
        this.autoChooseMonth();
        await this.getAllTrips();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
            let chooseSelect;
            if (this.props.language === "en") {
                if (this.state.selectMonth.value === 1) {
                    chooseSelect = {
                        value: 1,
                        label: "January 2023",
                    };
                } else if (this.state.selectMonth.value === 2)
                    chooseSelect = {
                        value: 2,
                        label: "December 2022",
                    };
                else
                    chooseSelect = {
                        value: 1,
                        label: "November 2023",
                    };
            } else {
                if (this.state.selectMonth.value === 1) {
                    chooseSelect = {
                        value: 1,
                        label: "Tháng 1 - 2023",
                    };
                } else if (this.state.selectMonth.value === 2)
                    chooseSelect = {
                        value: 2,
                        label: "Tháng 12 - 2022",
                    };
                else
                    chooseSelect = {
                        value: 1,
                        label: "Tháng 11 - 2022",
                    };
            }
            this.setState({ selectMonth: chooseSelect });
        }
    }
    onChangeInput = (selectMonth) => {
        let { arrTrips } = this.state;
        let arr;
        arr = arrTrips.filter((item) => {
            if (selectMonth.value === 1) {
                return +item.timeStart >= startMonth01 && +item.timeEnd <= endMonth01;
            } else if (selectMonth.value === 2) {
                return +item.timeStart >= startMonth12 && +item.timeEnd <= endMonth12;
            } else {
                return +item.timeStart >= startMonth11 && +item.timeEnd <= endMonth11;
            }
        });
        console.log(arr);
        this.setState({ selectMonth, arrTripMonth: arr });
    };
    autoChooseMonth = () => {
        let { language } = this.props;
        let chooseSelect;
        if (language === "vi") {
            chooseSelect = {
                value: 1,
                label: "Tháng 1 - 2023",
            };
        } else {
            chooseSelect = {
                value: 1,
                label: "January 2023",
            };
        }
        this.setState({ selectMonth: chooseSelect });
    };
    getAllTrips = async () => {
        let driverId = this.props.userInfo.id;
        let res = await getDriverTrips(driverId);
        res && res.errCode === 0 && this.setState({ arrTrips: res.trips });
        let arr;
        arr = res.trips.filter((item) => {
            return +item.timeStart >= startMonth01 && +item.timeEnd <= endMonth01;
        });
        console.log(arr);
        this.setState({ arrTripMonth: arr });
    };

    render() {
        let { language } = this.props;
        let { selectMonth, arrTripMonth } = this.state;
        let chooseSelect, NoData;
        let count = 0;
        if (language === "vi") {
            chooseSelect = chooseSelect1;
        } else {
            chooseSelect = chooseSelect2;
        }
        let month;
        if (language === "vi") {
            NoData = "Tháng này tài xế không chạy chuyến nào...";
            if (selectMonth.value === 1) month = mon01Vi;
            else if (selectMonth.value === 2) month = mon12Vi;
            else month = mon11Vi;
        } else {
            NoData = "The driver did not run any trips this month...";
            if (selectMonth.value === 1) month = mon01En;
            else if (selectMonth.value === 2) month = mon12En;
            else month = mon11En;
        }
        return (
            <div className="user-redux-container">
                <div className="title">
                    <p style={{ marginBottom: "20px" }}>
                        <FormattedMessage id="menu.driver.history" />
                    </p>
                </div>
                <div className="container form-reux">
                    <Row>
                        <Col md={3}>
                            <h5 htmlFor="schedule1">
                                <FormattedMessage id="menu.driver.month" />
                            </h5>
                            <Select
                                className="mb-4"
                                value={selectMonth}
                                onChange={this.onChangeInput}
                                options={chooseSelect}
                            />
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
                                                width: "30%",
                                            }}>
                                            <FormattedMessage id="menu.driver.timeDe" />
                                        </th>

                                        <th
                                            className="section-id-list"
                                            style={{
                                                width: "30%",
                                            }}>
                                            <div>
                                                {" "}
                                                <FormattedMessage id="menu.driver.route" />
                                            </div>
                                        </th>
                                        <th
                                            className="section-id-list"
                                            style={{
                                                width: "20%",
                                            }}>
                                            <FormattedMessage id="menu.driver.number" />
                                        </th>
                                    </tr>
                                    {arrTripMonth &&
                                        arrTripMonth.length > 0 &&
                                        arrTripMonth.map((item, index) => {
                                            let time;
                                            count = count + 1;
                                            if (language === "vi")
                                                time = moment(+item.timeStart).format("DD/MM/YYYY HH:mm");
                                            else
                                                time = ` ${moment(+item.timeStart).format(
                                                    "MM/DD/YYYY"
                                                )}${"  "} ${moment(+item.timeStart).locale("en").format("LT")}`;
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{time}</td>
                                                    <td>
                                                        {item.areaStart} -{">"} {"  "}
                                                        {item.areaEnd}
                                                    </td>
                                                    <td>{item.Vehicle.number}</td>
                                                </tr>
                                            );
                                        })}
                                    {arrTripMonth.length === 0 && (
                                        <tr>
                                            <td
                                                colspan="4"
                                                style={{
                                                    fontSize: "18px",
                                                    textAlign: "center",
                                                }}>
                                                {" "}
                                                {NoData}
                                            </td>
                                        </tr>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <div className="section-footer">
                            <div className="section-footer_item">
                                <Row>
                                    <Col md={2}>
                                        <FormattedMessage id="menu.driver.timeTotals" />
                                    </Col>
                                    <Col md={2}>{month}</Col>
                                </Row>
                            </div>
                            <div className="section-footer_item">
                                <Row>
                                    <Col md={2}>
                                        <FormattedMessage id="menu.driver.totalTrip" />
                                    </Col>
                                    <Col md={2}>{count}</Col>
                                </Row>
                            </div>
                        </div>
                        {/* </div> */}
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

export default connect(mapStateToProps, mapDispatchToProps)(History);
