import React, { Component } from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Select from "react-select";
import moment from "moment";
import { FormattedMessage } from "react-intl";
const chooseSelect1 = [
    {
        value: 1,
        label: "Tuần",
    },
    {
        value: 2,
        label: "Tháng",
    },
];
const chooseSelect2 = [
    {
        value: 1,
        label: "Week",
    },
    {
        value: 2,
        label: "Month",
    },
];

const time2 = [1671987600000 - 60 * 60 * 24 * 1000 * 7, 1672592399000 - 60 * 60 * 24 * 1000 * 7];
const time3 = [1671987600000, 1672592399000];
const time4 = [1672592400000, 1673197199000];
const time5 = [1673197200000, 1673283599000];

const month12 = [1669827600000, 1672505990000];
const month01 = [1672506000000, 1675184390000];
export default class TableDriver extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listDrivers: [],
            selectMonth: "",
            time: [],
        };
    }
    componentDidMount() {
        this.autoChooseMonth();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.language !== this.props.language) {
            let chooseSelect;
            if (this.props.language === "en") {
                if (this.state.selectMonth.value === 1) {
                    chooseSelect = {
                        value: 1,
                        label: "Week",
                    };
                } else
                    chooseSelect = {
                        value: 2,
                        label: "Month",
                    };
            } else {
                if (this.state.selectMonth.value === 1) {
                    chooseSelect = {
                        value: 1,
                        label: "Tuần",
                    };
                } else
                    chooseSelect = {
                        value: 2,
                        label: "Tháng",
                    };
            }
            this.setState({ selectMonth: chooseSelect });
        }
        if (prevProps.arrDrivers !== this.props.arrDrivers) {
            let { arrDrivers } = this.props;
            this.setState({
                listDrivers: arrDrivers,
            });
            this.filterTickets();
        }
        if (prevState.selectMonth !== this.state.selectMonth) {
            this.filterTickets();
        }
    }
    onChangeInput = (selectMonth) => {
        this.setState({ selectMonth });
    };
    autoChooseMonth = () => {
        let { language } = this.props;
        let chooseSelect;
        if (language === "vi") {
            chooseSelect = {
                value: 1,
                label: "Tuần",
            };
        } else {
            chooseSelect = {
                value: 1,
                label: "Week",
            };
        }
        this.setState({ selectMonth: chooseSelect });
    };
    filterTickets = () => {
        let { arrDrivers } = this.props;
        let { selectMonth } = this.state;
        let resultUser, listTickets, time, arr;
        let current = new Date().getTime();
        if (selectMonth.value === 1) {
            if (current > time2[0] && current < time2[1]) {
                time = time2;
            } else if (current > time3[0] && current < time3[1]) {
                time = time3;
            } else if (current > time4[0] && current < time4[1]) {
                time = time5;
            } else {
                time = time5;
            }
        } else {
            if (current > month12[0] && current < month12[1]) {
                time = month12;
            } else {
                time = month01;
            }
        }

        if (arrDrivers && arrDrivers.length > 0) {
            arrDrivers.forEach((item) => {
                listTickets = item.User.Trips;

                if (listTickets && listTickets.length > 0) {
                    listTickets.forEach((ticket) => {
                        let temp = ticket.Tickets;
                        if (temp.length > 0) {
                            let tempUser = {};
                            temp.forEach((i) => {
                                if (tempUser[`${i.token}`]) {
                                } else {
                                    tempUser[`${i.token}`] = {
                                        token: i.token,
                                        totalPrice: i.totalPrice,
                                    };
                                }
                            });
                            resultUser = Object.values(tempUser);
                        } else {
                            resultUser = [];
                        }
                        let arrPrice = [];
                        if (resultUser.length === 1) {
                            arrPrice.push(resultUser[0].totalPrice);
                        } else if (resultUser.length > 1) {
                            resultUser.map((item) => arrPrice.push(item.totalPrice));
                        }
                        let final = 0;
                        arrPrice.map((a) => (final = final + a));
                        ticket.total = final;
                    });
                }
            });
        }

        arr = arrDrivers;
        arr.forEach((item) => {
            let test = item.User.Trips.filter((i) => {
                return time[0] <= +i.timeStart && +i.timeEnd <= time[1];
            });
            item.test = test;
        });
        this.setState({
            listDrivers: arrDrivers,
            time,
        });
    };
    currencyFormat(num) {
        return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") + " đ";
    }
    render() {
        let { listDrivers, selectMonth, time } = this.state;
        let { language } = this.props;

        let chooseSelect, mes;

        let timeStart = moment(time[0]).format(" DD.MM.YYYY ");
        let timeEnd = moment(time[1]).format(" DD.MM.YYYY ");
        if (language === "vi") {
            chooseSelect = chooseSelect1;
            mes = `Thời gian : Từ ${timeStart} đến ${timeEnd}`;
        } else {
            chooseSelect = chooseSelect2;
            mes = `Time : From ${timeStart} to ${timeEnd}`;
        }
        return (
            <Card sx={{ height: "100%" }}>
                <div className="chart_title">
                    <div className="chart_item-left">{mes}</div>
                    <div className="chart_item">
                        <Select
                            className="mb-4"
                            value={selectMonth}
                            onChange={this.onChangeInput}
                            options={chooseSelect}
                        />
                    </div>
                </div>
                <Box padding="1rem">
                    <Box
                        sx={{
                            height: "25rem",
                            borderRadius: "10px",
                            mt: "30px",
                        }}>
                        <table className="table table-striped table-hover table-responsive">
                            <thead style={{ borderBottom: "2px solid black" }}>
                                <tr>
                                    <th scope="col">Id</th>
                                    <th scope="col">
                                        <FormattedMessage id="menu.busOwner.dashboards.name" />
                                    </th>
                                    <th scope="col">
                                        {" "}
                                        <FormattedMessage id="menu.busOwner.dashboards.trips" />
                                    </th>
                                    <th scope="col">
                                        {" "}
                                        <FormattedMessage id="menu.busOwner.dashboards.total" />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {listDrivers &&
                                    listDrivers.length > 0 &&
                                    listDrivers.map((item, index) => {
                                        let totalPrice = 0;
                                        let tickets = item.test;
                                        tickets.length > 0 &&
                                            tickets.map((item) => (totalPrice = totalPrice + item.total));
                                        return (
                                            <tr>
                                                <td>{item.driverId}</td>
                                                <td>{item.name}</td>
                                                <td>{item.test.length}</td>
                                                <td>{this.currencyFormat(totalPrice)}</td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>{" "}
                    </Box>
                </Box>
            </Card>
        );
    }
}
