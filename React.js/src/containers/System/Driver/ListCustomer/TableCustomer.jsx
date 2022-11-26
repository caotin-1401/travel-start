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
                    if (temp[`${ticket.userId}`]) {
                        temp[`${ticket.userId}`].seatNo.push(ticket.seatNo);
                    } else {
                        temp[`${ticket.userId}`] = {
                            Trip: ticket.Trip,
                            userId: ticket.userId,
                            seatNo: [ticket.seatNo],
                            tripId: ticket.tripId,
                            driverId: ticket.driverId,
                        };
                    }
                });

                let result = Object.values(temp);
                this.setState({
                    listUser: result,
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
        let { listUser } = this.state;
        let test;
        data && (test = data[0].getTime());
        let id = this.props.userInfo.id;
        let res = await getDriverTickets(id, test);
        if (res) {
            if (res && res.tickets) {
                let raw = res.tickets;

                let temp1 = {};
                raw.forEach((ticket) => {
                    if (temp1[`${ticket.tripId}`]) {
                        temp1[`${ticket.tripId}`].seatNo.push(ticket.seatNo);
                    } else {
                        temp1[`${ticket.tripId}`] = {
                            Trip: ticket.Trip,
                            seatNo: [ticket.seatNo],
                        };
                    }
                });

                let result1 = Object.values(temp1);

                let listRoute = [];
                if (result1 && result1.length > 0) {
                    result1.map((item) => {
                        let obj = {};
                        obj.value = item.Trip.id;
                        obj.label = `${item.Trip.areaStart} - ${moment(
                            +item.Trip.timeStart
                        ).format("LT")}`;
                        listRoute.push(obj);
                    });
                }
                console.log("listRoute>>>", listRoute);
                this.setState({ listRoute: listRoute });
            }
        }
    };
    handleCheck = async (item) => {
        let token = item.token;
        let tripId = item.tripId;
        let res = await checkCustomerPresent({ token, tripId });
        if (res && res.errCode === 0) {
            this.getAllTickets();
        }
    };
    onChangeInputSelect = (selectRoute) => {
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
                    <p style={{ marginBottom: "20px" }}>
                        <FormattedMessage id="menu.busOwner.vehicle.title" />
                    </p>
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
                                    {listUser && listUser.length === 0 && (
                                        <td
                                            colspan="8"
                                            style={{ textAlign: "center" }}>
                                            No data
                                        </td>
                                    )}
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

                                                {/* <td>{item.number}</td>
                                                <td>{item.BusType.typeName}</td>
                                                <td>
                                                    {item.BusType.numOfSeat}
                                                </td>
                                                <td
                                                    className="content-left"
                                                    style={{
                                                        backgroundImage: `url(${
                                                            item && item.image
                                                                ? item.image
                                                                : ""
                                                        })`,
                                                    }}></td> */}
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
