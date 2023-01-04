import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "../style.scss";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import _ from "lodash";
import moment from "moment";
import localization from "moment/locale/vi";
import * as actions from "../../../../store/actions";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css"; // This only needs to be imported once in your app
import ModalAdd from "./ModalAdd";
import {
    TableBody,
    TableContainer,
    TableFooter,
    TablePagination,
    TableRow,
    Paper,
    Table,
} from "@mui/material";
import { Row, Col } from "reactstrap";
import { toast } from "react-toastify";
import {
    getAllCouponService,
    getAllEventsService,
    deleteCouponService,
} from "../../../../services/userService";
import ModalEdit from "./ModalEdit";
import Select from "react-select";

import TablePaginationActions from "../../../../components/TablePaginationActions";
class TableDiscount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenModel: false,
            isOpenModelEditUser: false,
            userEdit: {},
            listEvents: [],
            listCoupons: [],
            sortBy: "",
            sortField: "",
            keywordNumber: "",
            page: 0,
            rowsPerPage: 5,
            selectEvent: "",
        };
    }

    async componentDidMount() {
        await this.getAllCoupons();
        // let dataSelect = this.buildDataSelectEvents(this.props.events);
        // this.setState(
        //     {
        //         listEvents: dataSelect,
        //     },
        //     console.log(this.state)
        // );
        // console.log(this.state);
        // let objEvent = {};
        // objEvent.label = this.state.listEvents[0].label;
        // objEvent.value = this.state.listEvents[0].value;
        // console.log(objEvent);
        // this.setState(
        //     {
        //         selectEvent: objEvent,
        //     },
        //     console.log(this.state.selectEvent)
        // );
        // this.setState({
        //     selectEvent:
        // })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.events !== this.props.events) {
            let dataSelect = this.buildDataSelectEvents(this.props.events);
            this.setState({
                listEvents: dataSelect,
            });
        }
    }
    getAllCoupons = async () => {
        let res = await getAllCouponService("ALL");
        if (res && res.errCode === 0) {
            this.setState({
                listCoupons: res.coupons,
            });
        }
    };
    buildDataSelectEvents = (inputData) => {
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

    //open modal
    toggleUserModel = () => {
        this.setState({
            isOpenModel: !this.state.isOpenModel,
        });
    };
    toggleUserEditModel = () => {
        this.setState({
            isOpenModelEditUser: !this.state.isOpenModelEditUser,
        });
    };
    handleAddUser = () => {
        this.setState({
            isOpenModel: true,
        });
    };
    handleEditUser = (user) => {
        this.setState({
            isOpenModelEditUser: true,
            userEdit: user,
        });
    };

    handleDeleteUser = async (user) => {
        let res = await deleteCouponService(user.id);
        if (res && res.errCode === 0) {
            toast.success("xoa ma giam gia thanh cong");
            await this.getAllCoupons();
        }
    };

    doEditUser = async (user) => {
        await this.getAllCoupons();
        this.setState({
            isOpenModelEditUser: false,
        });
    };
    createNewUser1 = async (data) => {
        await this.getAllCoupons();
        this.setState({
            isOpenModel: false,
        });
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
    handleSort = (a, b) => {
        this.state.listCoupons = _.orderBy(this.state.listCoupons, [b], [a]);
        this.setState({
            sortBy: a,
            sortField: b,
            listCoupons: this.state.listCoupons,
        });
    };
    handleKeyword = (e, target) => {
        let term = e.target.value.toUpperCase();
        let clone = this.state.listCoupons;
        if (term) {
            clone = clone.filter((item) => item.number.includes(term));
            this.setState({
                listCoupons: clone,
            });
        } else {
            this.props.fetchAllVehicle();
        }
    };
    handleKeyword1 = (e) => {
        let term = e.target.value.toUpperCase();
        let clone = this.state.listCoupons;
        if (term) {
            clone = clone.filter((item) => item.BusType.typeName.includes(term));
            this.setState({
                listCoupons: clone,
            });
        } else {
            this.props.fetchAllVehicle();
        }
    };
    onChangeInputSelectEvent = async (selectEvent) => {
        let res = await getAllEventsService(selectEvent.value);
        console.log(res.events);
        let dataEvents = res.events;
        let data = [];
        dataEvents.forEach((item) => {
            data.push(item.Coupons);
        });
        console.log(data);
        this.setState({
            listCoupons: data,
            selectEvent,
        });
    };
    render() {
        let { page, rowsPerPage, listEvents, selectEvent, listCoupons } = this.state;
        if (listCoupons && listCoupons.length > 0 && listCoupons[0].id === null) {
            return (
                <div className="container form-redux">
                    <div className="user-container">
                        <ModalAdd
                            listCoupons={listCoupons}
                            isOpen={this.state.isOpenModel}
                            toggleFromParent={this.toggleUserModel}
                            createNewUser1={this.createNewUser1}
                        />
                        {this.state.isOpenModelEditUser && (
                            <ModalEdit
                                isOpen={this.state.isOpenModelEditUser}
                                toggleFromParent={this.toggleUserEditModel}
                                currentUser={this.state.userEdit}
                                doEditUser={this.doEditUser}
                            />
                        )}
                        <div className="title text-center">Quan ly ma giam gia</div>
                        <Row>
                            {" "}
                            <Col md={4} style={{ marginLeft: "15px" }}>
                                <label>Chọn sự kiện</label>
                                <Select
                                    className="mb-4"
                                    value={selectEvent}
                                    onChange={this.onChangeInputSelectEvent}
                                    options={listEvents}
                                />
                            </Col>
                            <Col md={3} style={{ marginTop: "8px" }}>
                                <div className="mx-5 my-3">
                                    <button
                                        className="btn btn-primary px-3"
                                        onClick={() => this.handleAddUser()}>
                                        <i className="fas fa-plus px-1"></i>
                                        Thêm mã giảm giá
                                    </button>
                                </div>
                            </Col>
                        </Row>

                        <div className="use-table m-3">
                            <TableContainer component={Paper} id="customers">
                                <Table>
                                    <TableBody>
                                        <tr>
                                            <th
                                                className="section-id"
                                                style={{
                                                    width: "5%",
                                                }}
                                                onClick={() => this.handleSort("asc", "id")}>
                                                Id
                                            </th>
                                            <th>
                                                <div className="section-title">
                                                    <div> Tên mã giảm giá </div>
                                                    <div>
                                                        <FaLongArrowAltDown
                                                            className="iconSortDown"
                                                            onClick={() =>
                                                                this.handleSort("asc", "name")
                                                            }
                                                        />
                                                        <FaLongArrowAltUp
                                                            className="iconSortDown"
                                                            onClick={() =>
                                                                this.handleSort("desc", "name")
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </th>
                                            <th>
                                                <div className="section-title">
                                                    <div> Tiền giảm </div>
                                                    <div>
                                                        {" "}
                                                        <FaLongArrowAltDown
                                                            className="iconSortDown"
                                                            onClick={() =>
                                                                this.handleSort("asc", "name")
                                                            }
                                                        />
                                                        <FaLongArrowAltUp
                                                            className="iconSortDown"
                                                            onClick={() =>
                                                                this.handleSort("desc", "name")
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </th>
                                            <th>
                                                <div className="section-title">
                                                    <div>Tổng số lượng </div>
                                                    <div>
                                                        {" "}
                                                        <FaLongArrowAltDown
                                                            className="iconSortDown"
                                                            onClick={() =>
                                                                this.handleSort("asc", "name")
                                                            }
                                                        />
                                                        <FaLongArrowAltUp
                                                            className="iconSortDown"
                                                            onClick={() =>
                                                                this.handleSort("desc", "name")
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </th>
                                            <th>
                                                <div className="section-title">
                                                    <div> Số lượng đã dùng </div>
                                                </div>
                                            </th>
                                            <th>
                                                <div className="section-title">
                                                    <div> Ngày bắt đầuy </div>
                                                    <div>
                                                        {" "}
                                                        <FaLongArrowAltDown
                                                            className="iconSortDown"
                                                            onClick={() =>
                                                                this.handleSort("asc", "startDate")
                                                            }
                                                        />
                                                        <FaLongArrowAltUp
                                                            className="iconSortDown"
                                                            onClick={() =>
                                                                this.handleSort("desc", "startDate")
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </th>
                                            <th>
                                                <div className="section-title">
                                                    <div> Ngày kết thúc </div>
                                                    <div>
                                                        {" "}
                                                        <FaLongArrowAltDown
                                                            className="iconSortDown"
                                                            onClick={() =>
                                                                this.handleSort("asc", "endDate")
                                                            }
                                                        />
                                                        <FaLongArrowAltUp
                                                            className="iconSortDown"
                                                            onClick={() =>
                                                                this.handleSort("desc", "endDate")
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </th>

                                            <th style={{ width: "15%" }}>Hành động</th>
                                        </tr>

                                        {listCoupons &&
                                            listCoupons.length > 0 &&
                                            listCoupons[0].id === null && (
                                                <div
                                                    style={{
                                                        height: "40px",
                                                        fontSize: "15px",
                                                        margin: "10px 0 0 10px",
                                                    }}>
                                                    No data
                                                </div>
                                            )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="container form-redux">
                    <div className="user-container">
                        <ModalAdd
                            listCoupons={listCoupons}
                            isOpen={this.state.isOpenModel}
                            toggleFromParent={this.toggleUserModel}
                            createNewUser1={this.createNewUser1}
                        />
                        {this.state.isOpenModelEditUser && (
                            <ModalEdit
                                isOpen={this.state.isOpenModelEditUser}
                                toggleFromParent={this.toggleUserEditModel}
                                currentUser={this.state.userEdit}
                                doEditUser={this.doEditUser}
                            />
                        )}
                        <div className="title text-center">Quản lý mã giảm giá</div>
                        <Row>
                            {" "}
                            <Col md={4} style={{ marginLeft: "15px" }}>
                                <label>Chọn sự kiện</label>
                                <Select
                                    className="mb-4"
                                    value={selectEvent}
                                    onChange={this.onChangeInputSelectEvent}
                                    options={listEvents}
                                />
                            </Col>
                            <Col md={3} style={{ marginTop: "8px" }}>
                                <div className="mx-5 my-3">
                                    <button
                                        className="btn btn-primary px-3"
                                        onClick={() => this.handleAddUser()}>
                                        <i className="fas fa-plus px-1"></i>
                                        Thêm mã giảm giá
                                    </button>
                                </div>
                            </Col>
                        </Row>

                        <div className="use-table m-3">
                            <TableContainer component={Paper} id="customers">
                                <Table>
                                    <TableBody>
                                        <tr>
                                            <th
                                                className="section-id"
                                                style={{
                                                    width: "5%",
                                                }}
                                                onClick={() => this.handleSort("asc", "id")}>
                                                Id
                                            </th>
                                            <th>
                                                <div className="section-title">
                                                    <div> Tên mã giảm giá </div>
                                                    <div>
                                                        {" "}
                                                        <FaLongArrowAltDown
                                                            className="iconSortDown"
                                                            onClick={() =>
                                                                this.handleSort("asc", "name")
                                                            }
                                                        />
                                                        <FaLongArrowAltUp
                                                            className="iconSortDown"
                                                            onClick={() =>
                                                                this.handleSort("desc", "name")
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </th>
                                            <th>
                                                <div className="section-title">
                                                    <div>Tiền giảm </div>
                                                    <div>
                                                        {" "}
                                                        <FaLongArrowAltDown
                                                            className="iconSortDown"
                                                            onClick={() =>
                                                                this.handleSort("asc", "name")
                                                            }
                                                        />
                                                        <FaLongArrowAltUp
                                                            className="iconSortDown"
                                                            onClick={() =>
                                                                this.handleSort("desc", "name")
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </th>
                                            <th>
                                                <div className="section-title">
                                                    <div>Tổng số lượng </div>
                                                    <div>
                                                        {" "}
                                                        <FaLongArrowAltDown
                                                            className="iconSortDown"
                                                            onClick={() =>
                                                                this.handleSort("asc", "name")
                                                            }
                                                        />
                                                        <FaLongArrowAltUp
                                                            className="iconSortDown"
                                                            onClick={() =>
                                                                this.handleSort("desc", "name")
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </th>
                                            <th>
                                                <div className="section-title">
                                                    <div> Số lượng đã dùng </div>
                                                </div>
                                            </th>
                                            <th>
                                                <div className="section-title">
                                                    <div> Ngày bắt đầu </div>
                                                    <div>
                                                        {" "}
                                                        <FaLongArrowAltDown
                                                            className="iconSortDown"
                                                            onClick={() =>
                                                                this.handleSort("asc", "startDate")
                                                            }
                                                        />
                                                        <FaLongArrowAltUp
                                                            className="iconSortDown"
                                                            onClick={() =>
                                                                this.handleSort("desc", "startDate")
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </th>
                                            <th>
                                                <div className="section-title">
                                                    <div> Ngày kết thúc</div>
                                                    <div>
                                                        {" "}
                                                        <FaLongArrowAltDown
                                                            className="iconSortDown"
                                                            onClick={() =>
                                                                this.handleSort("asc", "endDate")
                                                            }
                                                        />
                                                        <FaLongArrowAltUp
                                                            className="iconSortDown"
                                                            onClick={() =>
                                                                this.handleSort("desc", "endDate")
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </th>

                                            <th style={{ width: "15%" }}>Hành động</th>
                                        </tr>

                                        <tr style={{ height: "50px" }}>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>
                                            <td></td>

                                            <td>
                                                <input
                                                    className="form-control"
                                                    onChange={(e) => this.handleKeyword(e)}
                                                />
                                            </td>
                                            <td>
                                                <input
                                                    className="form-control"
                                                    onChange={(e) => this.handleKeyword1(e)}
                                                />
                                            </td>

                                            <td></td>
                                        </tr>
                                        {listCoupons &&
                                            listCoupons.length > 0 &&
                                            listCoupons[0].id !== null &&
                                            (rowsPerPage > 0 &&
                                            listCoupons &&
                                            listCoupons.length > 0
                                                ? listCoupons.slice(
                                                      page * rowsPerPage,
                                                      page * rowsPerPage + rowsPerPage
                                                  )
                                                : listCoupons
                                            ).map((user, index) => {
                                                let start = moment(+user.startDate).format(
                                                    " DD-MM-YYYY HH:mm"
                                                );
                                                let end = moment(new Date(+user.endDate)).format(
                                                    "  DD-MM-YYYY  HH:mm"
                                                );
                                                let price;

                                                if (user.type === 1) price = "đ";
                                                else price = "%";
                                                return (
                                                    <tr key={index}>
                                                        <td>{user.id}</td>

                                                        <td>{user.name}</td>
                                                        <td>
                                                            {user.discount} {price}
                                                        </td>
                                                        <td>{user.count}</td>
                                                        <td>{user.use}</td>
                                                        <td>{start}</td>
                                                        <td>{end}</td>
                                                        <td>
                                                            {/* <button
                                                                className="  btn-info"
                                                                onClick={() =>
                                                                    this.handleEditUser(
                                                                        user
                                                                    )
                                                                }>
                                                                <i className="fas fa-info-circle"></i>
                                                            </button> */}
                                                            <button
                                                                className="btn-edit"
                                                                onClick={() =>
                                                                    this.handleEditUser(user)
                                                                }>
                                                                <i className="fas fa-edit"></i>
                                                            </button>
                                                            <button
                                                                className="btn-delete"
                                                                onClick={() =>
                                                                    this.handleDeleteUser(user)
                                                                }>
                                                                <i className="fas fa-trash-alt"></i>
                                                            </button>
                                                        </td>
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
                                                colSpan={8}
                                                count={listEvents.length}
                                                rowsPerPage={rowsPerPage}
                                                page={page}
                                                onPageChange={this.handleChangePage}
                                                onRowsPerPageChange={this.handleChangeRowsPerPage}
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
                        </div>
                    </div>
                </div>
            );
        }
        // console.log(listCoupons[0].Coupons.id);
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        events: state.admin.events,
        coupons: state.admin.coupons,
        userInfo: state.user.userInfo,
        // user: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllEvents: () => dispatch(actions.fetchAllEvents()),
        fetchAllCoupon: () => dispatch(actions.fetchAllCoupon()),
        deleteSchedule: (id) => dispatch(actions.deleteSchedule(id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableDiscount);
