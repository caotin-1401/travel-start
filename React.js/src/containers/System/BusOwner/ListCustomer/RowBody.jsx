import React, { Component } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    Box,
    Collapse,
    IconButton,
    TableRow,
    Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import moment from "moment";
import ModalTicket from "./ModalTicket";
import { toast } from "react-toastify";
import { FormattedMessage } from "react-intl";

import { deleteTicket, getAllTicketFromDateDriver } from "../../../../services/userService";
export default class RowBody extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            isOpenModel: false,
            userEdit: {},
            isActive: false,
            listPassenger: [],
        };
    }
    componentDidMount() {
        this.getAllPassenger();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.isActive !== this.state.isActive) {
            this.props.parentCallback1(this.state.isActive);
            if (this.state.isOpenModel === false) this.props.parentCallback1(false);
        }
    }
    getAllPassenger = () => {
        let { item, listPassengers } = this.props;
        let arr = [];
        arr = listPassengers.filter((i) => {
            return i.tripId === item.id;
        });
        let resultUser = [];
        let tempUser = {};
        if (arr.length > 0) {
            arr.forEach((ticket) => {
                if (tempUser[`${ticket.token}`]) {
                    tempUser[`${ticket.token}`].seatNo.push(ticket.seatNo);
                } else {
                    tempUser[`${ticket.token}`] = {
                        userId: ticket.userId,
                        seatNo: [ticket.seatNo],
                        token: ticket.token,
                        phone: ticket.phone,
                        name: ticket.name,
                        totalPrice: ticket.totalPrice,
                        driverId: ticket.driverId,
                        status: ticket.status,
                        email: ticket.email,
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
        this.setState({ listPassenger: resultUser });
    };
    toggleUserModel = () => {
        this.setState({
            isOpenModel: !this.state.isOpenModel,
        });
    };

    handle = () => {
        this.setState({ open: !this.state.open });
    };
    sendEmail = async (data) => {
        let { selectDriver, dateStartTrip } = this.props;
        let res;
        if (dateStartTrip.length === 10) {
            let test = moment(new Date().getTime()).format("L");
            let str = "00:00";
            let [day, month, year] = test.split("/");
            let [hours, minutes] = str.split(":");
            let date1 = new Date(+year, month - 1, +day, +hours, +minutes);
            res = await getAllTicketFromDateDriver(selectDriver, date1.getTime());
        } else {
            res = await getAllTicketFromDateDriver(selectDriver, dateStartTrip);
        }
        let tempUser = {};
        let resultUser;
        if (res && res.errCode === 0) {
            if (res.tickets.length > 0) {
                res.tickets.forEach((ticket) => {
                    if (tempUser[`${ticket.token}`]) {
                        tempUser[`${ticket.token}`].seatNo.push(ticket.seatNo);
                    } else {
                        tempUser[`${ticket.token}`] = {
                            userId: ticket.userId,
                            seatNo: [ticket.seatNo],
                            token: ticket.token,
                            phone: ticket.phone,
                            name: ticket.name,
                            totalPrice: ticket.totalPrice,
                            driverId: ticket.driverId,
                            status: ticket.status,
                            email: ticket.email,
                            tripId: ticket.tripId,
                            description: ticket.description,
                            isPresent: ticket.isPresent,
                            dayStart: ticket.dayStart,
                        };
                    }
                });

                resultUser = Object.values(tempUser);
                console.log(resultUser);
                this.setState({ listPassenger: resultUser });
            }
        }
        this.setState({
            isOpenModel: false,
        });
    };

    handleDeleteTicket = async (data) => {
        let token = data.token;
        let tripId = data.tripId;
        let { selectDriver, dateStartTrip } = this.props;
        let resDelete = await deleteTicket(tripId, token);
        if (resDelete && resDelete.errCode === 0) {
            let res;
            if (dateStartTrip.length === 10) {
                let test = moment(new Date().getTime()).format("L");
                let str = "00:00";
                let [day, month, year] = test.split("/");
                let [hours, minutes] = str.split(":");
                let date1 = new Date(+year, month - 1, +day, +hours, +minutes);
                res = await getAllTicketFromDateDriver(selectDriver, date1.getTime());
            } else {
                res = await getAllTicketFromDateDriver(selectDriver, dateStartTrip);
            }
            let tempUser = {};
            let resultUser;
            if (res && res.errCode === 0) {
                if (res.length > 0) {
                    res.forEach((ticket) => {
                        if (tempUser[`${ticket.token}`]) {
                            tempUser[`${ticket.token}`].seatNo.push(ticket.seatNo);
                        } else {
                            tempUser[`${ticket.token}`] = {
                                userId: ticket.userId,
                                seatNo: [ticket.seatNo],
                                token: ticket.token,
                                phone: ticket.phone,
                                name: ticket.name,
                                totalPrice: ticket.totalPrice,
                                driverId: ticket.driverId,
                                status: ticket.status,
                                email: ticket.email,
                                tripId: ticket.tripId,
                                description: ticket.description,
                                isPresent: ticket.isPresent,
                                dayStart: ticket.dayStart,
                            };
                        }
                    });

                    resultUser = Object.values(tempUser);
                }
            }
            this.setState({ listPassenger: resultUser });
        } else {
            toast.error("Xoas ve thaats bai");
        }
    };
    handleEditUser = (item) => {
        this.setState({
            isOpenModel: true,
            userEdit: item,
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
    currencyFormat(num) {
        return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") + " đ";
    }
    currencyFormatEn(num) {
        return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") + " VNĐ";
    }
    render() {
        let { open, isOpenModel, userEdit, listPassenger } = this.state;
        let { item, language } = this.props;
        let start;
        if (language === "vi") {
            start = moment(+item.timeStart).format(" DD/MM/YYYY HH:mm");
        } else {
            start = `${moment(+item.timeStart).locale("en").format("L")} ${" "} ${moment(
                +item.timeStart
            )
                .locale("en")
                .format("LT")}`;
        }
        return (
            <>
                {isOpenModel && (
                    <ModalTicket
                        style={{ zIndex: 10 }}
                        userEdit={userEdit}
                        isOpen={this.state.isOpenModel}
                        toggleFromParent={this.toggleUserModel}
                        sendEmail={this.sendEmail}
                        parentCallback1={this.callbackFunction1}
                        parentCallback2={this.callbackFunction2}
                    />
                )}
                <tr>
                    <td>
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => this.handle()}>
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </td>
                    <td>{item.id}</td>
                    <td>
                        {item.areaStart} {" -> "} {item.areaEnd}
                    </td>
                    <td>{item.User.name}</td>
                    <td>{item.Vehicle.number}</td>
                    <td>{start}</td>
                </tr>
                <tr>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                        <Collapse in={open} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 1 }}>
                                <Typography variant="h6" gutterBottom component="div">
                                    <FormattedMessage id="menu.driver.list_passenger" />
                                </Typography>
                                <Table aria-label="purchases">
                                    <TableHead>
                                        <TableRow>
                                            <th
                                                className="section-id sub_table w5"
                                                onClick={() => this.handleSort("asc", "id")}>
                                                Id
                                            </th>
                                            <th className="sub_table w10">
                                                <div className="section-title">
                                                    <FormattedMessage id="menu.driver.name" />
                                                </div>
                                            </th>
                                            <th className="sub_table w10">
                                                <FormattedMessage id="menu.driver.phone" />
                                            </th>
                                            <th className="w10 sub_table">
                                                <FormattedMessage id="menu.driver.seat" />
                                            </th>
                                            <th className="w18 sub_table">
                                                <FormattedMessage id="menu.driver.pay" />
                                            </th>

                                            <th className="w20 sub_table">
                                                <div>
                                                    <FormattedMessage id="menu.driver.description" />
                                                </div>
                                            </th>
                                            <th className="w10 sub_table">
                                                <div>
                                                    <FormattedMessage id="menu.admin.listDriver.status" />
                                                </div>
                                            </th>
                                            <th className="sub_table w17"></th>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {listPassenger &&
                                            listPassenger.length > 0 &&
                                            listPassenger.map((historyRow, index) => {
                                                let test = historyRow.seatNo.join(" - ");
                                                let statusSeat;
                                                if (historyRow.status === "S1") {
                                                    statusSeat = "Chưa xác nhận";
                                                } else if (historyRow.status === "S2") {
                                                    statusSeat = "Đã xác nhận";
                                                } else if (historyRow.status === "S3") {
                                                    statusSeat = "Đã gửi vé";
                                                } else if (historyRow.status === "S4") {
                                                    statusSeat = "Đã hủy vé";
                                                }
                                                return (
                                                    <tr key={index}>
                                                        <td className="section-id-list  sub_table-body">
                                                            {index + 1}
                                                        </td>
                                                        <td className=" sub_table-body">
                                                            {historyRow.name}
                                                        </td>
                                                        <td className=" sub_table-body">
                                                            {historyRow.phone}
                                                        </td>
                                                        <td className=" sub_table-body">{test}</td>
                                                        <td className=" sub_table-body">
                                                            {language === "vi"
                                                                ? this.currencyFormat(
                                                                      historyRow.totalPrice
                                                                  )
                                                                : this.currencyFormatEn(
                                                                      historyRow.totalPrice
                                                                  )}
                                                        </td>
                                                        <td className=" sub_table-body">
                                                            {historyRow.description}
                                                        </td>
                                                        <td className=" sub_table-body">
                                                            {statusSeat}
                                                        </td>
                                                        <td
                                                            className=" sub_table-body "
                                                            style={{
                                                                textAlign: "center",
                                                            }}>
                                                            {historyRow.status === "S4" ? (
                                                                <button
                                                                    style={{
                                                                        width: "80px",
                                                                    }}
                                                                    className="btn btn-danger"
                                                                    onClick={() =>
                                                                        this.handleDeleteTicket(
                                                                            historyRow
                                                                        )
                                                                    }>
                                                                    {language === "vi"
                                                                        ? "Hủy vé"
                                                                        : "Cancel"}
                                                                </button>
                                                            ) : historyRow.status === "S3" ? (
                                                                <button
                                                                    className="btn btn-primary"
                                                                    style={{
                                                                        width: "80px",
                                                                    }}
                                                                    disabled>
                                                                    {language === "vi"
                                                                        ? "Đã gửi"
                                                                        : "Sent"}
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    className="btn btn-primary"
                                                                    style={{
                                                                        width: "80px",
                                                                    }}
                                                                    onClick={() =>
                                                                        this.handleEditUser(
                                                                            historyRow
                                                                        )
                                                                    }>
                                                                    {language === "vi"
                                                                        ? "Gửi vé"
                                                                        : "Send"}
                                                                </button>
                                                            )}
                                                            <button
                                                                className="btn btn-secondary"
                                                                style={{
                                                                    width: "80px",
                                                                    marginLeft: "10px",
                                                                }}
                                                                onClick={() =>
                                                                    this.handleDeleteTicket(
                                                                        historyRow
                                                                    )
                                                                }>
                                                                {language === "vi"
                                                                    ? "Xóa vé"
                                                                    : "Delete"}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                    </TableBody>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </tr>
            </>
        );
    }
}
