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
import {
    getDriverTickets,
    checkCustomerPresent,
    getDriverTicketsRoute,
} from "../../../../services/userService";
class TableCustomer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listUser: [],
            sortBy: "",
            sortField: "",
            keywordNumber: "",
            page: 0,
            rowsPerPage: 5,
            isTest: false,
            test: [],
            test1: [],
            time: "",
            listRoute: [],
            isCheckPresent: false,
            selectRoute: "",
        };
    }

    async componentDidMount() {
        this.getAllTickets();
    }

    buildDataSelect = (inputData) => {
        let result = [];
        if (inputData && inputData.length > 0) {
            inputData.map((item, key) => {
                let obj = {};
                obj.label = `${item.from.name} (${item.from.city}) - ${item.to.name} (${item.to.city})`;
                obj.value = item.id;
                result.push(obj);
            });
        }
        return result;
    };
    getAllTickets = async () => {
        let id = this.props.userInfo.id;
        let date = moment(new Date().getTime()).format("L");
        let str = "00:00";
        let [day, month, year] = date.split("/");
        let [hours, minutes] = str.split(":");
        let date1 = new Date(+year, month - 1, +day, +hours, +minutes);
        let res = await getDriverTickets(id, date1.getTime());
        if (res) {
            if (res && res.tickets) {
                let raw = res.tickets;
                let temp = {};
                raw.forEach((ticket) => {
                    if (temp[`${ticket.tripId}`]) {
                        temp[`${ticket.tripId}`].seatNo.push(ticket.seatNo);
                    } else {
                        temp[`${ticket.tripId}`] = {
                            Trip: ticket.Trip,
                            seatNo: [ticket.seatNo],
                        };
                    }
                });
                let result = Object.values(temp);
                let listRoute = [];
                if (result && result.length > 0) {
                    result.map((item) => {
                        let obj = {};
                        obj.value = item.Trip.id;
                        obj.label = `${item.Trip.areaStart} - ${moment(
                            +item.Trip.timeStart
                        ).format("LT")} - Biển số xe: ${
                            item.Trip.Vehicle.number
                        }`;
                        listRoute.push(obj);
                    });
                }
                this.setState({
                    listRoute: listRoute,
                    time: moment(new Date()).format("L"),
                });
            }
        }
    };
    handleChangePage = (event, newPage) => {
        this.setState({
            page: newPage,
        });
    };
    handleChangeRowsPerPage = (event) => {
        this.setState({
            rowsPerPage: parseInt(event.target.value),
            page: 0,
        });
    };
    handleOnChange = async (data) => {
        this.setState({
            listRoute: [],
            selectRoute: "",
            time: data[0].getTime(),
        });
        let test;
        data && (test = data[0].getTime());
        let id = this.props.userInfo.id;
        let res = await getDriverTickets(id, test);
        if (res) {
            if (res && res.tickets) {
                let raw = res.tickets;

                let temp = {};
                raw.forEach((ticket) => {
                    if (temp[`${ticket.tripId}`]) {
                        temp[`${ticket.tripId}`].seatNo.push(ticket.seatNo);
                    } else {
                        temp[`${ticket.tripId}`] = {
                            Trip: ticket.Trip,
                            seatNo: [ticket.seatNo],
                        };
                    }
                });

                let result = Object.values(temp);

                let listRoute = [];
                if (result && result.length > 0) {
                    result.map((item) => {
                        let obj = {};
                        obj.value = item.Trip.id;
                        obj.label = `${item.Trip.areaStart} - ${moment(
                            +item.Trip.timeStart
                        ).format("LT")} - Biển số xe: ${
                            item.Trip.Vehicle.number
                        }`;
                        listRoute.push(obj);
                    });
                }
                this.setState({
                    listRoute: listRoute,
                    time: data[0].getTime(),
                });
            }
        }
    };
    handleCheck = async (item) => {
        console.log(this.state.selectRoute);
        console.log(item);
        let token = item.token;
        let tripId = item.tripId;
        let res = await checkCustomerPresent({ token, tripId });
        let driverId = this.props.userInfo.id;
        let day = item.dayStart;
        let resUser;
        if (res && res.errCode === 0) {
            resUser = await getDriverTicketsRoute(driverId, day, tripId);
            let tempUser = {};
            let resultUser;
            if (resUser && resUser.errCode === 0) {
                if (resUser.tickets.length > 0) {
                    resUser.tickets.forEach((ticket) => {
                        if (tempUser[`${ticket.userId}`]) {
                            tempUser[`${ticket.userId}`].seatNo.push(
                                ticket.seatNo
                            );
                        } else {
                            tempUser[`${ticket.userId}`] = {
                                userId: ticket.userId,
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
            }
            console.log(resultUser);
            this.setState({ listUser: resultUser });
        }
    };
    onChangeInputSelect = async (selectRoute) => {
        let { time } = this.state;
        let id = this.props.userInfo.id;

        let test = moment(new Date().getTime()).format("L");
        let str = "00:00";
        let [day, month, year] = test.split("/");
        let [hours, minutes] = str.split(":");
        let date1 = new Date(+year, month - 1, +day, +hours, +minutes);

        let res;
        console.log(time);
        console.log(test);
        if (time === test) {
            res = await getDriverTicketsRoute(
                id,
                date1.getTime(),
                selectRoute.value
            );
        } else {
            res = await getDriverTicketsRoute(id, time, selectRoute.value);
        }

        let tempUser = {};
        let resultUser;
        if (res && res.errCode === 0) {
            if (res.tickets.length > 0) {
                res.tickets.forEach((ticket) => {
                    if (tempUser[`${ticket.userId}`]) {
                        tempUser[`${ticket.userId}`].seatNo.push(ticket.seatNo);
                    } else {
                        tempUser[`${ticket.userId}`] = {
                            userId: ticket.userId,
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
        }
        console.log(resultUser);
        this.setState({ listUser: resultUser });

        // this.setState({ listUser: res.tickets });
        this.setState({ selectRoute: selectRoute });
    };
    render() {
        let {
            page,
            rowsPerPage,
            listVehicles,
            listUser,
            test,
            test1,
            isTest,
            time,
            isCheckPresent,
            listRoute,
            selectRoute,
        } = this.state;
        return (
            <div className="user-redux-container">
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
                        <Col md={6}>
                            <label>Chọn địa điểm /thời gian xuất phát:</label>
                            <Select
                                className="mb-4"
                                value={selectRoute}
                                onChange={this.onChangeInputSelect}
                                options={listRoute}
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
                                            }}
                                            onClick={() =>
                                                this.handleSort("asc", "id")
                                            }>
                                            Id
                                        </th>
                                        <th>
                                            <div className="section-title">
                                                <div> Tên</div>
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
                                            style={{
                                                width: "10%",
                                            }}>
                                            Số điện thoại
                                        </th>
                                        <th
                                            className="section-id-list"
                                            style={{
                                                width: "15%",
                                            }}>
                                            Chỗ ngồi
                                        </th>
                                        <th className="section-id-list">
                                            Thanh toán
                                        </th>

                                        <th>
                                            <div className="section-title">
                                                <div>Yeu cau them</div>
                                            </div>
                                        </th>
                                        <th
                                            style={{
                                                width: "10%",
                                            }}
                                            className="section-id-list">
                                            Da len xe
                                        </th>
                                    </tr>
                                    {/* <tr style={{ height: "50px" }}>
                                        <td></td>
                                        <td>
                                            <input
                                                className="form-control"
                                                onChange={(e) =>
                                                    this.handleKeyword(e)
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                className="form-control"
                                                onChange={(e) =>
                                                    this.handleKeyword1(e)
                                                }
                                            />
                                        </td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr> */}
                                    <tr>
                                        {listUser && listUser.length === 0 && (
                                            <td
                                                colSpan="8"
                                                style={{ textAlign: "center" }}>
                                                No data
                                            </td>
                                        )}
                                    </tr>
                                    {(rowsPerPage > 0
                                        ? listUser.slice(
                                              page * rowsPerPage,
                                              page * rowsPerPage + rowsPerPage
                                          )
                                        : listUser
                                    ).map((item, index) => {
                                        let test = item.seatNo.join(" - ");
                                        return (
                                            <tr key={index}>
                                                <td className="section-id-list">
                                                    {index + 1}
                                                </td>
                                                <td>{item.name}</td>
                                                <td>{item.phone}</td>
                                                <td>{test}</td>
                                                <td>{item.totalPrice}</td>
                                                <td>{item.description}</td>
                                                {!item.isPresent ? (
                                                    <>
                                                        <button
                                                            className="btn-delete"
                                                            onClick={() =>
                                                                this.handleEditUser(
                                                                    item
                                                                )
                                                            }>
                                                            <i className="fas fa-window-close"></i>
                                                        </button>
                                                        <button
                                                            className="btn-edit"
                                                            onClick={() =>
                                                                this.handleCheck(
                                                                    item
                                                                )
                                                            }>
                                                            <i className="fas fa-check"></i>
                                                        </button>
                                                    </>
                                                ) : (
                                                    "Da co mawt"
                                                )}
                                            </tr>
                                        );
                                    })}
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TablePagination
                                            rowsPerPageOptions={[
                                                5,
                                                10,
                                                25,
                                                { label: "All", value: -1 },
                                            ]}
                                            colSpan={7}
                                            count={listUser.length}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            onPageChange={this.handleChangePage}
                                            onRowsPerPageChange={
                                                this.handleChangeRowsPerPage
                                            }
                                            ActionsComponent={(subProps) => (
                                                <TablePaginationActions
                                                    style={{
                                                        marginBottom: "12px",
                                                    }}
                                                    {...subProps}
                                                />
                                            )}
                                        />
                                    </TableRow>
                                </TableFooter>
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
