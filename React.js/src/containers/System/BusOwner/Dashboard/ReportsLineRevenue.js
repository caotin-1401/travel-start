import React, { Component } from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Select from "react-select";
import { connect } from "react-redux";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";
ChartJS.register(...registerables);

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
const arr1 = ["Nov 2022", "Dec 2022", "Jan - 2023"];
const arr2 = ["Tháng 11 -2022", "Tháng 12 -2022", "Tháng 1 - 2023"];

const time1 = [1671987600000 - 60 * 60 * 24 * 1000 * 7 * 2, 1672592399000 - 60 * 60 * 24 * 1000 * 7 * 2];
const time2 = [1671987600000 - 60 * 60 * 24 * 1000 * 7, 1672592399000 - 60 * 60 * 24 * 1000 * 7];
const time3 = [1671987600000, 1672592399000];
const time4 = [1672592400000, 1673197199000];
const time5 = [1673197200000, 1673283599000];

const month11 = [1667235600000, 1669827599000];
const month12 = [1669827600000, 1672505990000];
const month01 = [1672506000000, 1675184390000];

const handleArrWeek = [time1, time2, time3, time4, time5];
const handleArrMonth = [month11, month12, month01];

class ReportsLineRevenue extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectMonth: "",
            time: [],
            listWeek: [],
            listMonths: [],
            Trips: [],
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
        if (prevProps.Trips !== this.props.Trips) {
            this.setState({ Trips: this.props.Trips });
            this.handleChart();
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
    handleChart = () => {
        let trip = this.props.Trips;
        let week, month;
        let arrRevenueWeek = [];
        let arrRevenueMonth = [];
        handleArrWeek.map((item) => {
            let temp = 0;
            week = trip.filter((i) => {
                return +i.timeEnd > item[0] && item[1] > +i.timeEnd;
            });
            if (week.length === 1) {
                temp = week[0].total;
            } else if (week.length > 1) {
                week.map((trip) => (temp = temp + trip.total));
            }
            arrRevenueWeek.push(temp);
        });
        handleArrMonth.map((item) => {
            let temp = 0;
            month = trip.filter((i) => {
                return +i.timeEnd > item[0] && item[1] > +i.timeEnd;
            });
            if (month.length === 1) {
                temp = month[0].total;
            } else if (month.length > 1) {
                month.map((trip) => (temp = temp + trip.total));
            }
            arrRevenueMonth.push(temp);
        });
        this.setState({ listWeek: arrRevenueWeek, listMonths: arrRevenueMonth });
    };
    render() {
        let { language } = this.props;
        let { selectMonth, listWeek, listMonths } = this.state;

        let chooseSelect, arr, mes;

        if (language === "vi") {
            chooseSelect = chooseSelect1;
            arr = arr2;
            mes = "Doanh thu";
        } else {
            chooseSelect = chooseSelect2;
            arr = arr1;
            mes = "Revenue";
        }
        const data1 = {
            labels: ["12/12 - 18/12", "19/12 - 25/12", "26/12 - 1/1", "2/1 - 8/1", "9/1 - 15/1"],
            datasets: [
                {
                    label: mes,
                    data: listWeek,
                    fill: true,
                    backgroundColor: "rgba(75,192,192,0.2)",
                    borderColor: "rgba(75,192,192,1)",
                },
            ],
        };

        const data2 = {
            labels: arr,
            datasets: [
                {
                    label: mes,
                    data: listMonths,
                    fill: true,
                    backgroundColor: "rgba(75,192,192,0.2)",
                    borderColor: "rgba(75,192,192,1)",
                },
            ],
        };
        return (
            <Card sx={{ height: "100%" }}>
                <div className="chart_title">
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
                        {selectMonth.value === 1 ? <Line data={data1} /> : <Line data={data2} />}
                    </Box>
                </Box>
            </Card>
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

export default connect(mapStateToProps, mapDispatchToProps)(ReportsLineRevenue);
