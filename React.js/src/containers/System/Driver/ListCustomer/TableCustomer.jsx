import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import {
    TableBody,
    TableContainer,
    TableFooter,
    TablePagination,
    TableRow,
    Paper,
    Table,
} from "@mui/material";
import localization from "moment/locale/vi";
import moment from "moment";
import DatePicker from "../../../../components/DatePicker";
import { Row, Col } from "reactstrap";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import TablePaginationActions from "../../../../components/TablePaginationActions";
import _ from "lodash";
import Select from "react-select";
import ModalInfo from "./ModalInfo";
import {
    getDriverTickets,
    getDriverTicketsRoute,
    getAllRouteFromDateDriver,
} from "../../../../services/userService";
class TableCustomer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            idDriver: "",
            time: "",
            listRoute: [],
            isCheckPresent: false,
            selectRoute: "",
            isOpenModel: false,
            listUser: {},
            dateStartTrip: "",
        };
    }

    async componentDidMount() {
        this.setState({ idDriver: this.props.userInfo.id });
        this.getAllTickets();
    }

    getAllTickets = async () => {
        let id = this.props.userInfo.id;
        let date = moment(new Date().getTime()).format("L");
        let str = "00:00";
        let [day, month, year] = date.split("/");
        let [hours, minutes] = str.split(":");
        let date1 = new Date(+year, month - 1, +day, +hours, +minutes);
        let res = await getAllRouteFromDateDriver(id, date1.getTime());
        res &&
            res.tickets &&
            this.setState({
                listRoute: res.tickets,
                time: moment(new Date()).format("L"),
            });
    };

    handleOnChange = async (data) => {
        if (data.length === 1) {
            console.log(1);
            console.log(data);
            this.setState({
                listRoute: [],
                selectRoute: "",
                time: data[0].getTime(),
            });
            let test;
            data && (test = data[0].getTime());
            let id = this.props.userInfo.id;
            let res = await getAllRouteFromDateDriver(id, test);
            res &&
                res.tickets &&
                this.setState({
                    listRoute: res.tickets,
                    time: data[0].getTime(),
                });
        }
        this.setState({
            dateStartTrip: data[0].getTime(),
        });
    };

    handleCheck = async (item) => {
        let { dateStartTrip, time, idDriver } = this.state;
        console.log(item);
        console.log(dateStartTrip);
        console.log(idDriver);
        let res;
        if (!dateStartTrip) {
            let test = moment(new Date().getTime()).format("L");
            let str = "00:00";
            let [day, month, year] = test.split("/");
            let [hours, minutes] = str.split(":");
            let date1 = new Date(+year, month - 1, +day, +hours, +minutes);
            res = await getDriverTicketsRoute(
                idDriver,
                date1.getTime(),
                item.id
            );
        } else {
            res = await getDriverTicketsRoute(idDriver, dateStartTrip, item.id);
        }
        console.log(res);
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
        console.log(resultUser);
        this.setState({
            isOpenModel: true,
            listUser: resultUser,
        });
    };
    handleSort = (a, b) => {
        this.state.listRoute = _.orderBy(this.state.listRoute, [b], [a]);
        this.setState({
            sortBy: a,
            sortField: b,
            listRoute: this.state.listRoute,
        });
    };
    toggleUserModel = () => {
        this.setState({
            isOpenModel: !this.state.isOpenModel,
        });
    };

    render() {
        let { time, listRoute, isOpenModel, listUser } = this.state;
        return (
            <div className="user-redux-container">
                {isOpenModel && (
                    <ModalInfo
                        isOpen={this.state.isOpenModel}
                        toggleFromParent={this.toggleUserModel}
                        listUser={listUser}
                    />
                )}
                <div className="title">
                    <p style={{ marginBottom: "20px" }}>Quản lý vé</p>
                </div>
                <div className="container form-reux">
                    <Row>
                        <Col md={3}>
                            <label htmlFor="schedule1">Chọn ngày chạy</label>
                            <span
                                className="form-control mb-4"
                                style={{ height: "38px" }}
                                htmlFor="schedule1">
                                <DatePicker
                                    locale="vi"
                                    style={{ border: "none" }}
                                    onChange={this.handleOnChange}
                                    id="schedule1"
                                    value={time}
                                    selected={time}
                                />
                                <label
                                    htmlFor="schedule1"
                                    style={{ float: "right" }}>
                                    <i
                                        className="far fa-calendar-alt"
                                        style={{
                                            fontSize: "20px",
                                        }}></i>
                                </label>
                            </span>
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
                                            }}
                                            onClick={() =>
                                                this.handleSort("asc", "id")
                                            }>
                                            Id
                                        </th>
                                        <th
                                            className="section-id-list"
                                            style={{
                                                width: "45%",
                                            }}>
                                            <div className="section-title">
                                                <div> Tuyến đường</div>
                                                <div>
                                                    <FaLongArrowAltDown
                                                        className="iconSortDown"
                                                        onClick={() =>
                                                            this.handleSort(
                                                                "asc",
                                                                "number"
                                                            )
                                                        }
                                                    />
                                                    <FaLongArrowAltUp
                                                        className="iconSortDown"
                                                        onClick={() =>
                                                            this.handleSort(
                                                                "desc",
                                                                "number"
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </th>
                                        <th
                                            className="section-id-list"
                                            style={{
                                                width: "23%",
                                            }}>
                                            Thời gian chạy
                                        </th>

                                        <th
                                            className="section-id-list"
                                            style={{
                                                width: "12%",
                                            }}>
                                            Biển số xe
                                        </th>

                                        <th
                                            style={{
                                                width: "15%",
                                            }}
                                            className="section-id-list">
                                            Danh sách hành khách
                                        </th>
                                    </tr>
                                    <tr>
                                        {listRoute &&
                                            listRoute.length === 0 && (
                                                <td
                                                    colSpan="8"
                                                    style={{
                                                        textAlign: "center",
                                                    }}>
                                                    No data
                                                </td>
                                            )}
                                    </tr>
                                    {listRoute.map((item, index) => {
                                        let time = ` ${moment(
                                            +item.timeStart
                                        ).format("LT")}${" - "} ${moment(
                                            +item.timeEnd
                                        ).format("LT")}`;
                                        return (
                                            <tr key={index}>
                                                <td className="section-id-list">
                                                    {index + 1}
                                                </td>
                                                <td>
                                                    {item.areaStart} {" - "}
                                                    {item.areaEnd}
                                                </td>
                                                <td>{time}</td>
                                                <td>{item.Vehicle.number}</td>
                                                <td
                                                    style={{
                                                        textAlign: "center",
                                                    }}>
                                                    <button
                                                        className="btn btn-primary"
                                                        onClick={() =>
                                                            this.handleCheck(
                                                                item
                                                            )
                                                        }>
                                                        Danh sashc
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(TableCustomer);
