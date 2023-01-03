import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "../style.scss";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import _ from "lodash";
import moment from "moment";
import * as actions from "../../../../store/actions";
import ModalAdd from "./ModalAdd";
import { TableBody, TableContainer, TableFooter, TablePagination, TableRow, Paper, Table } from "@mui/material";
import { Row, Col } from "reactstrap";
import { toast } from "react-toastify";
import { getAllCouponService, deleteCouponService } from "../../../../services/userService";
import ModalEdit from "./ModalEdit";

import TablePaginationActions from "../../../../components/TablePaginationActions";
class TableDiscount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenModel: false,
            isOpenModelEditUser: false,
            userEdit: {},
            listCoupons: [],
            listCouponsAll: [],
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
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.listCouponsAll !== this.state.listCouponsAll) {
            console.log(this.state.listCouponsAll);
            let test = this.state.listCouponsAll.filter(
                (item) => item.pointCondition && item.pointCondition == this.props.userInfo.id
            );
            this.setState({
                listCoupons: test,
            });
        }
    }
    getAllCoupons = async () => {
        let res = await getAllCouponService("ALL");
        if (res && res.errCode === 0) {
            this.setState({
                listCouponsAll: res.coupons,
            });
        }
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
    currencyFormat(num) {
        return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") + " đ";
    }
    render() {
        let { page, rowsPerPage, listCoupons } = this.state;
        let { language } = this.props;
        let noCoupons;
        if (language === "vi") {
            noCoupons = "Nhà xe hiện tại chưa có mã giảm giá...";
        } else {
            noCoupons = "No discount found...";
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
                        <FormattedMessage id="menu.busOwner.discount.title1" />
                    </div>
                    <Row>
                        <Col md={3} style={{ marginTop: "8px" }}>
                            <div className="mx-5 my-3">
                                <button className="btn btn-primary px-3" onClick={() => this.handleAddUser()}>
                                    <i className="fas fa-plus px-1"></i>
                                    <FormattedMessage id="menu.busOwner.discount.add" />
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
                                                width: "6%",
                                            }}
                                            onClick={() => this.handleSort("asc", "id")}>
                                            Id
                                        </th>
                                        <th
                                            style={{
                                                width: "13%",
                                            }}>
                                            <div className="section-title">
                                                <FormattedMessage id="menu.busOwner.discount.name" />
                                            </div>
                                        </th>
                                        <th
                                            style={{
                                                width: "13%",
                                            }}>
                                            <div className="section-title">
                                                <FormattedMessage id="menu.busOwner.discount.discount" />
                                            </div>
                                        </th>
                                        <th
                                            style={{
                                                width: "13%",
                                            }}>
                                            <div className="section-title">
                                                <FormattedMessage id="menu.busOwner.discount.count" />
                                            </div>
                                        </th>
                                        <th
                                            style={{
                                                width: "13%",
                                            }}>
                                            <div className="section-title">
                                                <div>
                                                    <FormattedMessage id="menu.busOwner.discount.use" />
                                                </div>
                                            </div>
                                        </th>
                                        <th
                                            style={{
                                                width: "16%",
                                            }}>
                                            <div className="section-title">
                                                <div>
                                                    {" "}
                                                    <FormattedMessage id="menu.busOwner.discount.start" />
                                                </div>
                                                <div>
                                                    <FaLongArrowAltDown
                                                        className="iconSortDown"
                                                        onClick={() => this.handleSort("asc", "startDate")}
                                                    />
                                                    <FaLongArrowAltUp
                                                        className="iconSortDown"
                                                        onClick={() => this.handleSort("desc", "startDate")}
                                                    />
                                                </div>
                                            </div>
                                        </th>
                                        <th
                                            style={{
                                                width: "16%",
                                            }}>
                                            <div className="section-title">
                                                <div>
                                                    {" "}
                                                    <FormattedMessage id="menu.busOwner.discount.end" />
                                                </div>
                                                <div>
                                                    <FaLongArrowAltDown
                                                        className="iconSortDown"
                                                        onClick={() => this.handleSort("asc", "endDate")}
                                                    />
                                                    <FaLongArrowAltUp
                                                        className="iconSortDown"
                                                        onClick={() => this.handleSort("desc", "endDate")}
                                                    />
                                                </div>
                                            </div>
                                        </th>

                                        <th style={{ width: "10%" }}></th>
                                    </tr>

                                    {listCoupons &&
                                        listCoupons.length > 0 &&
                                        listCoupons[0].id !== null &&
                                        (rowsPerPage > 0 && listCoupons && listCoupons.length > 0
                                            ? listCoupons.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            : listCoupons
                                        ).map((user, index) => {
                                            let start, end;
                                            if (language === "vi") {
                                                start = moment(+user.startDate).format(" DD/MM/YYYY HH:mm");
                                                end = moment(new Date(+user.endDate)).format("  DD/MM/YYYY  HH:mm");
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

                                            if (user.type == 1) price = "đ";
                                            else price = "%";
                                            let time = `${user.discount} ${price}`;
                                            return (
                                                <tr key={index}>
                                                    <td className="center">{user.id}</td>

                                                    <td>{user.name}</td>
                                                    <td>
                                                        {user.type === "1" && this.currencyFormat(+user.discount)}
                                                        {user.type === "2" && time}
                                                    </td>
                                                    <td>{user.count}</td>
                                                    <td>{user.use}</td>
                                                    <td>{start}</td>
                                                    <td>{end}</td>
                                                    <td className="center">
                                                        <button
                                                            className="btn-edit"
                                                            onClick={() => this.handleEditUser(user)}>
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                        <button
                                                            className="btn-delete"
                                                            onClick={() => this.handleDeleteUser(user)}>
                                                            <i className="fas fa-trash-alt"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    {listCoupons.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan="8"
                                                style={{
                                                    fontSize: "18px",
                                                    textAlign: "center",
                                                }}>
                                                {noCoupons}
                                            </td>
                                        </tr>
                                    )}
                                </TableBody>
                                {listCoupons && listCoupons.length > 0 && (
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
                                                    "& .css-194a1fa-MuiSelect-select-MuiInputBase-input  ": {
                                                        fontSize: "15px",
                                                    },
                                                }}
                                                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                                                colSpan={8}
                                                count={listCoupons.length}
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

        // console.log(listCoupons[0].Coupons.id);
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        coupons: state.admin.coupons,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllCoupon: () => dispatch(actions.fetchAllCoupon()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableDiscount);
