import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { Paper, BottomNavigation, BottomNavigationAction } from "@mui/material";
import moment from "moment";
import { getUserTickets } from "../../../services/userService";
import RestoreIcon from "@mui/icons-material/Restore";
import CheckIcon from "@mui/icons-material/Check";
import { Link } from "react-router-dom";
import { cancelTicket } from "../../../services/userService";
import { toast } from "react-toastify";
class InfoTicket extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
            listTickets: [],
        };
    }
    async componentDidMount() {
        this.getAllTickets();
    }
    getAllTickets = async () => {
        let id = this.props.userInfo.id;
        let res = await getUserTickets(id);
        let tempUser = {};
        let resultUser;
        if (res && res.errCode === 0) {
            if (res.tickets.length > 0) {
                res.tickets.forEach((ticket) => {
                    if (ticket.status !== "S4")
                        if (tempUser[`${ticket.token}`]) {
                            tempUser[`${ticket.token}`].seatNo.push(ticket.seatNo);
                        } else {
                            tempUser[`${ticket.token}`] = {
                                Trip: ticket.Trip,
                                seatNo: [ticket.seatNo],
                                token: ticket.token,
                                phone: ticket.phone,
                                name: ticket.name,
                                totalPrice: ticket.totalPrice,
                                driverId: ticket.driverId,
                                status: ticket.status,
                                tripId: ticket.tripId,
                                description: ticket.description,
                                isPresent: ticket.isPresent,
                                dayStart: ticket.dayStart,
                            };
                        }
                });

                resultUser = Object.values(tempUser);
            }
            console.log(resultUser);
            this.setState({ listTickets: resultUser });
        }
    };
    handleStep = (event, step) => {
        this.setState({ step: step });
    };
    handleCancelTicket = async (data) => {
        let res = await cancelTicket({
            tripId: data.tripId,
            token: data.token,
        });
        res && res.errCode === 0 && toast.success("Huỷ vé thành công") && this.getAllTickets();
    };
    currencyFormat1(number) {
        const formatter = new Intl.NumberFormat("vi-VI", { style: "currency", currency: "VND" });
        return formatter.format(number);
    }
    render() {
        let { step, listTickets } = this.state;
        let { language } = this.props;
        let arrTicket = [];
        if (listTickets && listTickets.length > 0) {
            listTickets.forEach((item) => {
                if (+item.Trip.timeEnd > new Date().getTime() && item.status !== "S4") {
                    arrTicket.push(item.Trip.timeStart);
                }
            });
        }
        return (
            <div className="contentProfile" style={{ padding: 0 }}>
                <Paper sx={{ height: 75 }} elevation={4}>
                    <BottomNavigation
                        showLabels
                        value={step}
                        sx={{ height: 75 }}
                        onChange={this.handleStep}>
                        <BottomNavigationAction
                            label={language === "vi" ? "Đã đặt" : "Tickets already booked"}
                            sx={{
                                fontSize: "30px",
                            }}
                            icon={<CheckIcon sx={{ mb: 1.5, fontSize: "25px" }} />}
                        />
                        <BottomNavigationAction />
                        <BottomNavigationAction />
                        <BottomNavigationAction
                            label={language === "vi" ? "Hoàn thành" : "Done"}
                            sx={{ fontSize: "30px" }}
                            icon={<RestoreIcon sx={{ mb: 1.5, fontSize: "25px" }} />}
                        />
                    </BottomNavigation>
                </Paper>
                <div className="ticket-content">
                    {step === 0 &&
                        (arrTicket.length > 0 ? (
                            <table className="table table-striped table-hover table-responsive">
                                <thead style={{ borderBottom: "2px solid black" }}>
                                    <tr>
                                        <th scope="col">
                                            <FormattedMessage id="account.depart" />
                                        </th>
                                        <th scope="col">
                                            <FormattedMessage id="menu.busOwner.trips.time3" />
                                        </th>
                                        <th scope="col">
                                            <FormattedMessage id="menu.admin.listPassenger.seat" />
                                        </th>
                                        <th scope="col">
                                            <FormattedMessage id="menu.driver.total" />
                                        </th>
                                        <th scope="col">
                                            <FormattedMessage id="account.destroy" />
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listTickets &&
                                        listTickets.length > 0 &&
                                        listTickets.map((item, index) => {
                                            let time;
                                            if (language === "vi") {
                                                time = moment(+item.Trip.timeStart).format(
                                                    "DD/MM/YYYY HH:mm"
                                                );
                                            } else {
                                                time = `${moment(+item.Trip.timeStart)
                                                    .locale("en")
                                                    .format("L")} ${" "} ${moment(
                                                    +item.Trip.timeStart
                                                )
                                                    .locale("en")
                                                    .format("LT")}`;
                                            }
                                            let seatNO = item.seatNo.join(" - ");
                                            let timeStart = +item.Trip.timeEnd;
                                            if (timeStart > new Date().getTime()) {
                                                return (
                                                    <tr>
                                                        <td>{item.Trip.areaStart}</td>
                                                        <td>{time}</td>
                                                        <td>{seatNO}</td>
                                                        <td>
                                                            {this.currencyFormat1(item.totalPrice)}
                                                        </td>
                                                        <td>
                                                            <button
                                                                className="btn-delete"
                                                                onClick={() =>
                                                                    this.handleCancelTicket(item)
                                                                }>
                                                                <i className="fas fa-window-close"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        })}
                                </tbody>
                            </table>
                        ) : (
                            <div style={{ fontSize: "15px", fontWeight: "500" }}>
                                <FormattedMessage id="account.ticketTitle1" />{" "}
                                <Link to="/home">
                                    <FormattedMessage id="account.ticketTitle2" />
                                </Link>
                            </div>
                        ))}
                    {step === 3 && (
                        <table className="table table-striped table-hover table-responsive">
                            <thead style={{ borderBottom: "2px solid black" }}>
                                <tr>
                                    <th scope="col" className="w30">
                                        <FormattedMessage id="account.depart" />
                                    </th>
                                    <th scope="col" className="w30">
                                        <FormattedMessage id="menu.busOwner.trips.time3" />
                                    </th>
                                    <th scope="col" className="w20">
                                        <FormattedMessage id="menu.admin.listPassenger.seat" />
                                    </th>
                                    <th scope="col" className="w20">
                                        <FormattedMessage id="menu.driver.total" />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {listTickets &&
                                    listTickets.length > 0 &&
                                    listTickets.map((item, index) => {
                                        let time;
                                        if (language === "vi") {
                                            time = moment(+item.Trip.timeStart).format(
                                                "DD/MM/YYYY HH:mm"
                                            );
                                        } else {
                                            time = `${moment(+item.Trip.timeStart)
                                                .locale("en")
                                                .format("L")} ${" "} ${moment(+item.Trip.timeStart)
                                                .locale("en")
                                                .format("LT")}`;
                                        }
                                        let seatNO = item.seatNo.join(" - ");
                                        let timeEnd = +item.Trip.timeEnd;
                                        if (timeEnd < new Date().getTime()) {
                                            return (
                                                <tr>
                                                    <td>{item.Trip.areaStart}</td>
                                                    <td>{time}</td>
                                                    <td>{seatNO}</td>
                                                    <td>{this.currencyFormat1(item.totalPrice)}</td>
                                                </tr>
                                            );
                                        }
                                    })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(InfoTicket);
