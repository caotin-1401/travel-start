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
import _, { isBuffer } from "lodash";
import Select from "react-select";
import {
    getDriverTickets,
    getDriverTicketsRoute,
    deleteTicket,
    getAllRouteFromDateDriver,
} from "../../../../services/userService";
import * as actions from "../../../../store/actions";
import ModalTicket from "./ModalTicket";
import { toast } from "react-toastify";
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
            listDrivers: [],
            selectDriver: "",
            isOpenModel: false,
            // dateStartTrip: "",
            listCoupons: [],
            userEdit: {},
        };
    }

    componentDidMount() {
        this.props.fetchUserRedux();
        this.setState({
            time: moment(new Date()).format("L"),
        });
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listUsers !== this.props.listUsers) {
            let test = this.props.listUsers.filter(
                (item) =>
                    item.Driver.busOwnerId &&
                    item.Driver.busOwnerId === this.props.userInfo.id
            );
            let dataSelect2 = this.buildDataSelectDrivers(test);
            this.setState({
                listDrivers: dataSelect2,
            });
        }
    }

    buildDataSelectDrivers = (inputData) => {
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
        console.log(data);
        if (data.length === 1) {
            this.setState({
                selectRoute: "",
                listUser: [],
            });
            let { selectDriver } = this.state;
            if (selectDriver.value) {
                let res = await getAllRouteFromDateDriver(
                    selectDriver.value,
                    data[0].getTime()
                );
                if (res && res.tickets && res.tickets.length > 0) {
                    let listRoute = [];
                    if (res.tickets && res.tickets.length > 0) {
                        res.tickets.map((item) => {
                            let obj = {};
                            obj.value = item.id;
                            obj.label = `${item.areaStart} - ${moment(
                                +item.timeStart
                            ).format("LT")} - Biển số xe: ${
                                item.Vehicle.number
                            }`;
                            listRoute.push(obj);
                        });
                    }
                    this.setState({
                        listRoute: listRoute,
                    });
                }
            }
            this.setState({
                dateStartTrip: data[0].getTime(),
            });
        }
    };
    onChangeInputDriver = async (selectDriver) => {
        let { dateStartTrip, time } = this.state;
        if (!dateStartTrip) {
            let date = moment(new Date().getTime()).format("L");
            let str = "00:00";
            let [day, month, year] = date.split("/");
            let [hours, minutes] = str.split(":");
            let date1 = new Date(+year, month - 1, +day, +hours, +minutes);
            dateStartTrip = date1.getTime();
        }
        let res = await getAllRouteFromDateDriver(
            selectDriver.value,
            dateStartTrip
        );
        if (res && res.tickets && res.tickets.length > 0) {
            let listRoute = [];
            if (res.tickets && res.tickets.length > 0) {
                res.tickets.map((item) => {
                    let obj = {};
                    obj.value = item.id;
                    obj.label = `${item.areaStart} - ${moment(
                        +item.timeStart
                    ).format("LT")} - Biển số xe: ${item.Vehicle.number}`;
                    listRoute.push(obj);
                });
            }
            this.setState({
                listRoute: listRoute,
            });
        }

        this.setState({ selectDriver });
    };
    onChangeInputStart = async (selectRoute) => {
        let { dateStartTrip, time, selectDriver } = this.state;
        let res;
        if (!dateStartTrip) {
            let test = moment(new Date().getTime()).format("L");
            let str = "00:00";
            let [day, month, year] = test.split("/");
            let [hours, minutes] = str.split(":");
            let date1 = new Date(+year, month - 1, +day, +hours, +minutes);
            res = await getDriverTicketsRoute(
                selectDriver.value,
                date1.getTime(),
                selectRoute.value
            );
        } else {
            res = await getDriverTicketsRoute(
                selectDriver.value,
                dateStartTrip,
                selectRoute.value
            );
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
                this.setState({ listUser: resultUser });
            }
        }

        this.setState({ selectRoute: selectRoute });
    };

    //open modal
    toggleUserModel = () => {
        this.setState({
            isOpenModel: !this.state.isOpenModel,
        });
    };
    sendEmail = async (data) => {
        this.setState({
            isOpenModel: false,
        });
    };
    handleEditUser = (item) => {
        this.setState({
            isOpenModel: true,
            userEdit: item,
        });
    };
    handleDeleteTicket = async (data) => {
        let token = data.token;
        let tripId = data.tripId;
        let { dateStartTrip, selectDriver, selectRoute } = this.state;
        let resDelete = await deleteTicket(tripId, token);
        if (resDelete && resDelete.errCode === 0) {
            let res;
            if (!dateStartTrip) {
                let test = moment(new Date().getTime()).format("L");
                let str = "00:00";
                let [day, month, year] = test.split("/");
                let [hours, minutes] = str.split(":");
                let date1 = new Date(+year, month - 1, +day, +hours, +minutes);
                res = await getDriverTicketsRoute(
                    selectDriver.value,
                    date1.getTime(),
                    selectRoute.value
                );
            } else {
                res = await getDriverTicketsRoute(
                    selectDriver.value,
                    dateStartTrip,
                    selectRoute.value
                );
            }
            let tempUser = {};
            let resultUser;
            if (res && res.errCode === 0) {
                if (res.tickets.length > 0) {
                    res.tickets.forEach((ticket) => {
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
            this.setState({ listUser: resultUser });
        } else {
            toast.error("Xoas ve thaats bai");
        }
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
            listDrivers,
            selectDriver,
            listCoupons,
            isOpenModel,
        } = this.state;
        return (
            <div className="user-redux-container">
                {isOpenModel && (
                    <ModalTicket
                        listCoupons={listCoupons}
                        isOpen={this.state.isOpenModel}
                        toggleFromParent={this.toggleUserModel}
                        sendEmail={this.sendEmail}
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
                        <Col md={3}>
                            <label>Chọn tài xế</label>
                            <Select
                                className="mb-4"
                                value={selectDriver}
                                onChange={this.onChangeInputDriver}
                                options={listDrivers}
                            />
                        </Col>
                        <Col md={6}>
                            <label>Chọn địa điểm /thời gian xuất phát:</label>
                            <Select
                                className="mb-4"
                                value={selectRoute}
                                onChange={this.onChangeInputStart}
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
                                        <th>
                                            <div className="section-title">
                                                <div>tinh trang</div>
                                            </div>
                                        </th>
                                        <th
                                            style={{
                                                width: "10%",
                                            }}
                                            className="section-id-list">
                                            Gui ve xe
                                        </th>
                                    </tr>

                                    {(listUser &&
                                    listUser.length > 0 &&
                                    rowsPerPage > 0
                                        ? listUser.slice(
                                              page * rowsPerPage,
                                              page * rowsPerPage + rowsPerPage
                                          )
                                        : listUser
                                    ).map((item, index) => {
                                        let test = item.seatNo.join(" - ");
                                        let statusSeat;
                                        if (item.status === "S1") {
                                            statusSeat = "Chưa xác nhận";
                                        } else if (item.status === "S2") {
                                            statusSeat = "Đã xác nhận";
                                        } else if (item.status === "S3") {
                                            statusSeat = "Đã gửi vé";
                                        } else if (item.status === "S4") {
                                            statusSeat = "Đã hủy vé";
                                        }
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
                                                <td>{statusSeat}</td>
                                                <td
                                                    style={{
                                                        textAlign: "center",
                                                    }}>
                                                    {item.status === "S4" ? (
                                                        <button
                                                            style={{
                                                                width: "80px",
                                                            }}
                                                            className="btn btn-danger"
                                                            onClick={() =>
                                                                this.handleDeleteTicket(
                                                                    item
                                                                )
                                                            }>
                                                            Hủy vé
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="btn btn-primary"
                                                            style={{
                                                                width: "80px",
                                                            }}
                                                            onClick={() =>
                                                                this.handleEditUser(
                                                                    item
                                                                )
                                                            }>
                                                            Gửi vé
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </TableBody>
                                {listUser && listUser.length === 0 ? (
                                    <td
                                        colSpan="8"
                                        style={{ textAlign: "center" }}>
                                        No data
                                    </td>
                                ) : (
                                    <TableFooter>
                                        <TableRow>
                                            <TablePagination
                                                rowsPerPageOptions={[
                                                    5,
                                                    10,
                                                    25,
                                                    { label: "All", value: -1 },
                                                ]}
                                                colSpan={8}
                                                count={listUser.length}
                                                rowsPerPage={rowsPerPage}
                                                page={page}
                                                onPageChange={
                                                    this.handleChangePage
                                                }
                                                onRowsPerPageChange={
                                                    this.handleChangeRowsPerPage
                                                }
                                                ActionsComponent={(
                                                    subProps
                                                ) => (
                                                    <TablePaginationActions
                                                        style={{
                                                            marginBottom:
                                                                "12px",
                                                        }}
                                                        {...subProps}
                                                    />
                                                )}
                                            />
                                        </TableRow>
                                    </TableFooter>
                                )}
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
        listUsers: state.admin.users,
    };
};

const mapDispatchToProps = (dispatch) => {
    return { fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()) };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableCustomer);
