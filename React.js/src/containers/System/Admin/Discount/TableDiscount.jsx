import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "../style.scss";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import _ from "lodash";
import moment from "moment";
import * as actions from "../../../../store/actions";
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
import { getAllCouponService, deleteCouponService } from "../../../../services/userService";
import ModalEdit from "./ModalEdit";
import Select from "react-select";
import { SkeletonEvent } from "../SkeletonComponent";
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
            listCouponsEvent: [],
            isEvent: false,
            sortBy: "",
            sortField: "",
            page: 0,
            rowsPerPage: 5,
            selectEvent: "",
            loading: false,
        };
    }

    async componentDidMount() {
        await this.getAllCoupons();
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
            setTimeout(() => {
                this.setState({
                    loading: true,
                });
            }, 50);
            let test = res.coupons.filter((item) => {
                return item.eventId;
            });
            this.setState({
                listCoupons: test,
            });
        }
    };
    buildDataSelectEvents = (inputData) => {
        let result = [{ value: 0, label: "Tất cả mã giảm gía" }];
        if (inputData && inputData.length > 0) {
            inputData.map((item, key) => {
                let obj = {};
                obj.label = item.name;
                obj.value = item.id;
                result.push(obj);
                return result;
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
        let clone = this.state.listCoupons;
        clone = _.orderBy(clone, [b], [a]);
        this.setState({
            sortBy: a,
            sortField: b,
            listCoupons: clone,
        });
    };

    onChangeInputSelectEvent = async (selectEvent) => {
        let { listCoupons } = this.state;
        if (selectEvent.value !== 0) {
            let data = listCoupons.filter((item) => {
                return item.eventId === selectEvent.value;
            });

            this.setState({
                listCouponsEvent: data,
                selectEvent,
                isEvent: true,
            });
        } else {
            this.setState({
                selectEvent,
                isEvent: false,
            });
        }
    };
    currencyFormat(number) {
        const formatter = new Intl.NumberFormat("vi-VI", { style: "currency", currency: "VND" });
        return formatter.format(number);
    }
    currencyFormat1(number) {
        const formatter = new Intl.NumberFormat("vi-VI", { maximumSignificantDigits: 3 });
        return formatter.format(number);
    }
    render() {
        let {
            page,
            rowsPerPage,
            listEvents,
            selectEvent,
            listCoupons,
            listCouponsEvent,
            isEvent,
            loading,
        } = this.state;
        let { language } = this.props;
        let clone = [];
        if (isEvent === true) {
            clone = listCouponsEvent;
        } else {
            clone = listCoupons;
        }
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
                    <div className="title text-center">
                        <FormattedMessage id="menu.admin.listCoupons.title" />
                    </div>
                    <Row>
                        {" "}
                        <Col md={4} style={{ marginLeft: "15px" }}>
                            <label>
                                {" "}
                                <FormattedMessage id="menu.admin.listCoupons.selectEvent" />
                            </label>
                            <Select
                                className="mb-4"
                                value={selectEvent}
                                onChange={this.onChangeInputSelectEvent}
                                options={listEvents}
                            />
                        </Col>
                        <Col md={3} style={{ marginTop: "14px" }}>
                            <div className="mx-5 my-3">
                                <button
                                    className="btn btn-primary px-3"
                                    onClick={() => this.handleAddUser()}>
                                    <i className="fas fa-plus px-1"></i>
                                    <FormattedMessage id="menu.busOwner.discount.title2" />
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
                                            className="section-id w5"
                                            onClick={() => this.handleSort("asc", "id")}>
                                            Id
                                        </th>
                                        <th className=" w15">
                                            <div className="section-title">
                                                <FormattedMessage id="menu.busOwner.discount.name" />
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
                                        <th className=" w10">
                                            <div className="section-title">
                                                <FormattedMessage id="menu.busOwner.discount.discount" />
                                            </div>
                                        </th>
                                        <th className=" w15">
                                            <div className="section-title">
                                                <FormattedMessage id="menu.busOwner.discount.count" />
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
                                        <th className=" w15">
                                            <div className="section-title">
                                                <FormattedMessage id="menu.busOwner.discount.use" />
                                            </div>
                                        </th>
                                        <th className=" w15">
                                            <div className="section-title">
                                                <div>
                                                    {" "}
                                                    <FormattedMessage id="menu.busOwner.discount.start" />
                                                </div>
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
                                        <th className=" w15">
                                            <div className="section-title">
                                                <FormattedMessage id="menu.busOwner.discount.end" />
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

                                        <th style={{ width: "10%" }}></th>
                                    </tr>
                                    {loading === false && <SkeletonEvent />}
                                    {loading === true &&
                                        (rowsPerPage > 0 && clone && clone.length > 0
                                            ? clone.slice(
                                                  page * rowsPerPage,
                                                  page * rowsPerPage + rowsPerPage
                                              )
                                            : clone
                                        ).map((user, index) => {
                                            let start, end;
                                            if (language === "vi") {
                                                start = moment(+user.startDate).format(
                                                    " DD/MM/YYYY HH:mm"
                                                );
                                                end = moment(new Date(+user.endDate)).format(
                                                    "  DD/MM/YYYY  HH:mm"
                                                );
                                            } else {
                                                start = `${moment(+user.startDate)
                                                    .locale("en")
                                                    .format("L")} ${" "} ${moment(+user.startDate)
                                                    .locale("en")
                                                    .format("LT")}`;
                                                end = `${moment(new Date(+user.endDate))
                                                    .locale("en")
                                                    .format("L")} ${" "} ${moment(+user.endDate)
                                                    .locale("en")
                                                    .format("LT")}`;
                                            }
                                            let price;

                                            if (user.type === "2") price = "%";
                                            return (
                                                <tr key={index}>
                                                    <td className="center">{user.id}</td>

                                                    <td>{user.name}</td>
                                                    <td>
                                                        {user.type === "1" &&
                                                            this.currencyFormat(user.discount)}
                                                        {user.type === "2" &&
                                                            `${user.discount} ${price}`}
                                                    </td>
                                                    <td>{this.currencyFormat1(user.count)}</td>
                                                    <td>{user.use}</td>
                                                    <td>{start}</td>
                                                    <td>{end}</td>
                                                    <td className="center">
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
                                    {loading === true && clone && clone.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan="8"
                                                style={{
                                                    height: "50px",
                                                    fontSize: "18px",
                                                    textAlign: "center",
                                                }}>
                                                <FormattedMessage id="menu.admin.listCoupons.title4" />
                                            </td>
                                        </tr>
                                    )}
                                </TableBody>
                                {loading === true && clone && clone.length !== 0 && (
                                    <TableFooter>
                                        <TableRow>
                                            <TablePagination
                                                sx={{
                                                    "& .MuiTablePagination-selectLabel ": {
                                                        display: "None",
                                                    },
                                                    "& .MuiTablePagination-displayedRows  ": {
                                                        marginTop: "10px",
                                                        fontSize: "15px",
                                                    },
                                                    "& .css-194a1fa-MuiSelect-select-MuiInputBase-input  ":
                                                        {
                                                            fontSize: "15px",
                                                        },
                                                }}
                                                rowsPerPageOptions={[
                                                    5,
                                                    10,
                                                    25,
                                                    { label: "All", value: -1 },
                                                ]}
                                                colSpan={8}
                                                count={clone.length}
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
                                )}
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </div>
        );
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableDiscount);
