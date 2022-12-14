import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import {
    Paper,
    Box,
    BottomNavigation,
    BottomNavigationAction,
} from "@mui/material";
import localization from "moment/locale/vi";
import moment from "moment";
import { getUserTickets } from "../../../services/userService";
import RestoreIcon from "@mui/icons-material/Restore";
import CheckIcon from "@mui/icons-material/Check";
import { Link } from "react-router-dom";
import CancelIcon from "@mui/icons-material/Cancel";
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
    componentDidUpdate(prevProps, prevState, snapshot) {}
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
                            tempUser[`${ticket.token}`].seatNo.push(
                                ticket.seatNo
                            );
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
        res &&
            res.errCode === 0 &&
            toast.success("Huỷ vé thành công") &&
            this.getAllTickets();
    };
    render() {
        let { step, listTickets } = this.state;
        let arrTicket = [];
        console.log(listTickets);
        if (listTickets && listTickets.length > 0) {
            listTickets.forEach((item) => {
                if (
                    +item.Trip.timeEnd > new Date().getTime() &&
                    item.status !== "S4"
                ) {
                    arrTicket.push(item.Trip.timeStart);
                }
            });
        }
        console.log(listTickets);
        console.log(arrTicket);
        return (
            <div className="contentProfile" style={{ padding: 0 }}>
                <Paper sx={{ height: 75 }} elevation={4}>
                    <BottomNavigation
                        showLabels
                        value={step}
                        sx={{ height: 75 }}
                        onChange={this.handleStep}>
                        <BottomNavigationAction
                            label="Đã đặt"
                            sx={{
                                fontSize: "30px",
                            }}
                            icon={
                                <CheckIcon sx={{ mb: 1.5, fontSize: "25px" }} />
                            }
                        />
                        <BottomNavigationAction />
                        <BottomNavigationAction />
                        <BottomNavigationAction
                            label="Hoàn thành"
                            sx={{ fontSize: "30px" }}
                            icon={
                                <RestoreIcon
                                    sx={{ mb: 1.5, fontSize: "25px" }}
                                />
                            }
                        />
                    </BottomNavigation>
                </Paper>
                <div className="ticket-content">
                    {step === 0 &&
                        (arrTicket.length > 0 ? (
                            <table class="table table-striped table-hover table-responsive">
                                <thead
                                    style={{ borderBottom: "2px solid black" }}>
                                    <tr>
                                        <th scope="col">Nơi xuất phát</th>
                                        <th scope="col">Thoi gian chay</th>
                                        <th scope="col">Vi tri ngoi</th>
                                        <th scope="col">Tong tien</th>
                                        <th scope="col">Hủy vé</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listTickets &&
                                        listTickets.length > 0 &&
                                        listTickets.map((item, index) => {
                                            let time = moment(
                                                +item.Trip.timeStart
                                            ).format("llll");
                                            let seatNO =
                                                item.seatNo.join(" - ");
                                            let timeStart = +item.Trip.timeEnd;
                                            if (
                                                timeStart > new Date().getTime()
                                            ) {
                                                return (
                                                    <tr>
                                                        <td>
                                                            {
                                                                item.Trip
                                                                    .areaStart
                                                            }
                                                        </td>
                                                        <td>{time}</td>
                                                        <td>{seatNO}</td>
                                                        <td>
                                                            {item.totalPrice}
                                                        </td>
                                                        <td>
                                                            <button
                                                                className="btn-delete"
                                                                onClick={() =>
                                                                    this.handleCancelTicket(
                                                                        item
                                                                    )
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
                            <div>
                                Bạn chưa có chuyến sắp đi nào{" "}
                                <Link to="/home">Đặt vé ngay</Link>
                            </div>
                        ))}
                    {step === 3 && (
                        <table class="table table-striped table-hover table-responsive">
                            <thead style={{ borderBottom: "2px solid black" }}>
                                <tr>
                                    <th scope="col">Nơi xuất phát</th>
                                    <th scope="col">Thoi gian chay</th>
                                    <th scope="col">Vi tri ngoi</th>
                                    <th scope="col">Tong tien</th>
                                </tr>
                            </thead>
                            <tbody>
                                {listTickets &&
                                    listTickets.length > 0 &&
                                    listTickets.map((item, index) => {
                                        let time = moment(
                                            +item.Trip.timeStart
                                        ).format("llll");
                                        let seatNO = item.seatNo.join(" - ");
                                        let timeEnd = +item.Trip.timeEnd;
                                        if (timeEnd < new Date().getTime()) {
                                            return (
                                                <tr>
                                                    <td>
                                                        {item.Trip.areaStart}
                                                    </td>
                                                    <td>{time}</td>
                                                    <td>{seatNO}</td>
                                                    <td>{item.totalPrice}</td>
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
