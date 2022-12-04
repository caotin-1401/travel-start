import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Row,
    Col,
} from "reactstrap";
import Box from "@mui/material/Box";
import * as actions from "../../../../store/actions";
import { LANGUAGES, CommonUtils } from "../../../../utils";
import { toast } from "react-toastify";
import _ from "lodash";
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
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import TablePaginationActions from "../../../../components/TablePaginationActions";
import {
    getDriverTickets,
    checkCustomerPresent,
    getDriverTicketsRoute,
} from "../../../../services/userService";
class ModalInfo extends Component {
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
            isCheckPresent: false,
            selectRoute: "",
            listCoupons: [],
            isOpenModel: false,
        };
    }

    async componentDidMount() {
        let listUser = this.props.listUser;
        if (!listUser) {
            this.setState({ listUser: [] });
        } else this.setState({ listUser: listUser });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {}

    toggle = () => {
        this.props.toggleFromParent();
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

    handleCheck = async (item) => {
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
        }
    };

    handleSort = (a, b) => {
        this.state.listUser = _.orderBy(this.state.listUser, [b], [a]);
        this.setState({
            sortBy: a,
            sortField: b,
            listUser: this.state.listUser,
        });
    };
    render() {
        let language = this.props.language;
        let { page, rowsPerPage, listUser, test, test1, isTest } = this.state;
        return (
            <div>
                <Modal
                    isOpen={this.props.isOpen}
                    toggle={() => {
                        this.toggle();
                    }}
                    style={{ maxWidth: "90%" }}
                    fullscreen>
                    <ModalHeader
                        toggle={() => {
                            this.toggle();
                        }}>
                        Danh sách hành khách
                    </ModalHeader>

                    <ModalBody>
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
                                                width: "15%",
                                            }}>
                                            Số điện thoại
                                        </th>
                                        <th
                                            style={{
                                                width: "15%",
                                            }}>
                                            <div className="section-title">
                                                <div> Chỗ ngồi</div>
                                                <div>
                                                    <FaLongArrowAltDown
                                                        className="iconSortDown"
                                                        onClick={() =>
                                                            this.handleSort(
                                                                "asc",
                                                                "seatNo"
                                                            )
                                                        }
                                                    />
                                                    <FaLongArrowAltUp
                                                        className="iconSortDown"
                                                        onClick={() =>
                                                            this.handleSort(
                                                                "desc",
                                                                "seatNo"
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
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
                                                        <button className="btn-delete">
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
                                                colSpan={7}
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
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            color="primary"
                            onClick={() => {
                                this.toggle();
                            }}
                            className="btn-primary-modal">
                            OK
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        events: state.admin.events,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllEvents: () => dispatch(actions.fetchAllEvents()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalInfo);
