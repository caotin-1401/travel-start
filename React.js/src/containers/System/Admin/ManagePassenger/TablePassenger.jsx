import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import _ from "lodash";
import * as actions from "../../../../store/actions";
import { LANGUAGES } from "../../../../utils";
import {
    TableBody,
    TableContainer,
    TableFooter,
    TablePagination,
    TableRow,
    Paper,
    Table,
} from "@mui/material";
import { toast } from "react-toastify";
import {
    getAllPassengersTicket,
    getAllPassengers,
    deleteRouteService,
} from "../../../../services/userService";
import TablePaginationActions from "../../../../components/TablePaginationActions";
import ModalInfo from "./ModalInfo";

class TablePassenger extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenModel: false,
            listPassenger: [],
            userEdit: {},

            sortBy: "",
            sortField: "",
            page: 0,
            rowsPerPage: 5,
        };
    }

    async componentDidMount() {
        await this.getAllPassengers();
    }

    getAllPassengers = async () => {
        let res = await getAllPassengersTicket("ALL");
        if (res && res.errCode === 0) {
            let tempUser = {};
            let arr = res.users;
            arr &&
                arr.length > 0 &&
                arr.forEach((ticket) => {
                    if (tempUser[`${ticket.id}`]) {
                        tempUser[`${ticket.id}`].Tickets.push(ticket.Tickets);
                    } else {
                        tempUser[`${ticket.id}`] = {
                            Tickets: [ticket.Tickets],
                            email: ticket.email,
                            name: ticket.name,
                            phoneNumber: ticket.phoneNumber,
                            id: ticket.id,
                            address: ticket.address,
                            gender: ticket.gender,
                        };
                    }
                });
            let result = Object.values(tempUser);

            this.setState({
                listPassenger: result,
            });
        }
    };

    toggleOpenModel = () => {
        this.setState({
            isOpenModel: !this.state.isOpenModel,
        });
    };

    handleDetailInfo = (item) => {
        console.log(item);
        this.setState({
            isOpenModel: true,
            userEdit: item,
        });
    };

    handleDeleteUser = async (user) => {
        let { language } = this.props;
        let res = await deleteRouteService(user.id);
        if (res && res.errCode === 0) {
            if (language === LANGUAGES.VI) {
                toast.success("Xóa tuyến đường  thành công");
            } else {
                toast.success("Delete successful routes");
            }
            await this.getAllPassengers();
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
    handleSort = (a, b) => {
        this.state.listPassenger = _.orderBy(
            this.state.listPassenger,
            [b],
            [a]
        );
        this.setState({
            sortBy: a,
            sortField: b,
            listPassenger: this.state.listPassenger,
        });
    };
    currencyFormat(num) {
        return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") + " đ";
    }
    render() {
        let { page, rowsPerPage, listPassenger } = this.state;
        console.log(listPassenger);
        return (
            <div className="container form-redux">
                {this.state.isOpenModel && (
                    <ModalInfo
                        isOpen={this.state.isOpenModel}
                        toggleFromParent={this.toggleOpenModel}
                        currentUser={this.state.userEdit}
                    />
                )}
                <div className="user-container">
                    <div className="title text-center">
                        <FormattedMessage id="menu.admin.listPassenger.title" />
                    </div>

                    <div className="use-table m-3">
                        <TableContainer component={Paper} id="customers">
                            <Table>
                                <TableBody>
                                    <tr>
                                        <th
                                            className="section-id"
                                            style={{ width: "5%" }}
                                            onClick={() =>
                                                this.handleSort("asc", "id")
                                            }>
                                            Id
                                        </th>
                                        <th>
                                            <FormattedMessage id="menu.admin.listPassenger.name" />
                                        </th>
                                        <th>Email</th>
                                        <th>
                                            <FormattedMessage id="menu.admin.listPassenger.phone" />
                                        </th>
                                        <th>
                                            <div className="section-title">
                                                <div>
                                                    <FormattedMessage id="menu.admin.listPassenger.totalmoney" />
                                                </div>
                                                <div>
                                                    <FaLongArrowAltDown
                                                        className="iconSortDown"
                                                        onClick={() =>
                                                            this.handleSort(
                                                                "asc",
                                                                "from.name"
                                                            )
                                                        }
                                                    />
                                                    <FaLongArrowAltUp
                                                        className="iconSortDown"
                                                        onClick={() =>
                                                            this.handleSort(
                                                                "desc",
                                                                "from.name"
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </th>

                                        <th
                                            style={{ width: "15%" }}
                                            className="section-id-list">
                                            <FormattedMessage id="menu.admin.listLocations.action" />
                                        </th>
                                    </tr>

                                    {(rowsPerPage > 0 &&
                                    listPassenger &&
                                    listPassenger.length > 0
                                        ? listPassenger.slice(
                                              page * rowsPerPage,
                                              page * rowsPerPage + rowsPerPage
                                          )
                                        : listPassenger
                                    ).map((user, index) => {
                                        let arrTickets = user.Tickets;
                                        let tempUser = {};
                                        let resultUser;
                                        arrTickets.forEach((ticket) => {
                                            if (tempUser[`${ticket.token}`]) {
                                                tempUser[
                                                    `${ticket.token}`
                                                ].seatNo.push(ticket.seatNo);
                                            } else {
                                                tempUser[`${ticket.token}`] = {
                                                    seatNo: [ticket.seatNo],
                                                    token: ticket.token,
                                                    phone: ticket.phone,
                                                    name: ticket.name,
                                                    totalPrice:
                                                        ticket.totalPrice,
                                                    tripId: ticket.tripId,
                                                    description:
                                                        ticket.description,
                                                    dayStart: ticket.dayStart,
                                                };
                                            }
                                        });
                                        resultUser = Object.values(tempUser);
                                        let totalPrice = 0;
                                        if (resultUser.length === 1)
                                            if (resultUser[0].token)
                                                totalPrice =
                                                    resultUser[0].totalPrice;
                                            else totalPrice = 0;
                                        else {
                                            resultUser.forEach((item) => {
                                                totalPrice =
                                                    totalPrice +
                                                    item.totalPrice;
                                            });
                                        }
                                        return (
                                            <tr key={index}>
                                                <td>{user.id}</td>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>{user.phoneNumber}</td>
                                                <td>
                                                    {this.currencyFormat(
                                                        totalPrice
                                                    )}
                                                </td>
                                                <td className="center">
                                                    <button
                                                        title="Infomation Detail"
                                                        className="btn-edit"
                                                        onClick={() =>
                                                            this.handleDetailInfo(
                                                                user
                                                            )
                                                        }>
                                                        <i className="fas fa-info-circle"></i>
                                                    </button>

                                                    <button
                                                        title="Delete Passenger"
                                                        className="btn-delete"
                                                        onClick={() =>
                                                            this.handleDeleteUser(
                                                                user
                                                            )
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
                                            sx={{
                                                "& .MuiTablePagination-selectLabel ":
                                                    {
                                                        display: "None",
                                                    },
                                                "& .MuiTablePagination-displayedRows  ":
                                                    {
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
                                            colSpan={6}
                                            count={listPassenger.length}
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
                    </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(TablePassenger);
