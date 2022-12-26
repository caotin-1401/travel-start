import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "../style.scss";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import _ from "lodash";
import moment from "moment";
import localization from "moment/locale/vi";
import * as actions from "../../../../store/actions";
import { LANGUAGES } from "../../../../utils";
import ModalAdd from "./ModalAdd";
import { TableBody, TableContainer, TableFooter, TablePagination, TableRow, Paper, Table } from "@mui/material";
import { toast } from "react-toastify";
import { getAllEventsService, deleteEventsService } from "../../../../services/userService";
import ModalEdit from "./ModalEdit";

import TablePaginationActions from "../../../../components/TablePaginationActions";
class TableEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenModel: false,
            isOpenModelEditUser: false,
            userEdit: {},
            listEvents: [],
            sortBy: "",
            sortField: "",
            keywordNumber: "",
            page: 0,
            rowsPerPage: 5,
        };
    }

    async componentDidMount() {
        // this.props.fetchAllEvents();
        await this.getAllEvents();
    }

    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     console.log(this.props.events);
    //     if (prevProps.events !== this.props.events) {
    //         this.setState({ listEvents: this.props.events });
    //     }
    // }
    getAllEvents = async () => {
        let res = await getAllEventsService("ALL");
        if (res && res.errCode === 0) {
            this.setState({
                listEvents: res.events,
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
        console.log(user);
        this.setState({
            isOpenModelEditUser: true,
            userEdit: user,
        });
    };

    handleDeleteUser = async (user) => {
        let res = await deleteEventsService(user.id);
        if (res && res.errCode === 0) {
            toast.success("xoa su kien thanh cong");
            await this.getAllEvents();
        }
    };

    doEditUser = async (user) => {
        await this.getAllEvents();
        this.setState({
            isOpenModelEditUser: false,
        });
    };
    createNewUser1 = async (data) => {
        await this.getAllEvents();
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
        this.state.listEvents = _.orderBy(this.state.listEvents, [b], [a]);
        this.setState({
            sortBy: a,
            sortField: b,
            listEvents: this.state.listEvents,
        });
    };
    handleKeyword = (e, target) => {
        let term = e.target.value.toUpperCase();
        let clone = this.state.listEvents;
        if (term) {
            clone = clone.filter((item) => item.number.includes(term));
            this.setState({
                listEvents: clone,
            });
        } else {
            this.props.fetchAllVehicle();
        }
    };
    handleKeyword1 = (e) => {
        let term = e.target.value.toUpperCase();
        let clone = this.state.listEvents;
        if (term) {
            clone = clone.filter((item) => item.BusType.typeName.includes(term));
            this.setState({
                listEvents: clone,
            });
        } else {
            this.props.fetchAllVehicle();
        }
    };
    render() {
        let { page, rowsPerPage, listEvents } = this.state;
        // listEvents.reverse();
        return (
            <div className="container form-redux">
                <div className="user-container">
                    <ModalAdd
                        listEvents={listEvents}
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
                    <div className="title text-center">Quan ly su kien</div>
                    <div className="mx-5 my-3">
                        <button className="btn btn-primary px-3" onClick={() => this.handleAddUser()}>
                            <i className="fas fa-plus px-1"></i>
                            Them su kien
                        </button>
                    </div>
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
                                        <th
                                            style={{
                                                width: "34%",
                                            }}>
                                            <div className="section-title">
                                                <div> Tên sự kiện</div>
                                                <div>
                                                    {" "}
                                                    <FaLongArrowAltDown
                                                        className="iconSortDown"
                                                        onClick={() => this.handleSort("asc", "name")}
                                                    />
                                                    <FaLongArrowAltUp
                                                        className="iconSortDown"
                                                        onClick={() => this.handleSort("desc", "name")}
                                                    />
                                                </div>
                                            </div>
                                        </th>

                                        <th>
                                            <div className="section-title">
                                                <div> Ngày bắt đầu </div>
                                                <div>
                                                    {" "}
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
                                        <th>
                                            <div className="section-title">
                                                <div> Ngày kết thúc </div>
                                                <div>
                                                    {" "}
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

                                        <th style={{ width: "10%" }}>Hành động</th>
                                    </tr>
                                    <tr style={{ height: "50px" }}>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            <input className="form-control" onChange={(e) => this.handleKeyword(e)} />
                                        </td>
                                        <td>
                                            <input className="form-control" onChange={(e) => this.handleKeyword1(e)} />
                                        </td>

                                        <td></td>
                                    </tr>
                                    {(rowsPerPage > 0 && listEvents && listEvents.length > 0
                                        ? listEvents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        : listEvents
                                    ).map((user, index) => {
                                        let start = moment(+user.startDate).format("ddd DD-MM-YYYY HH:mm");
                                        let end = moment(new Date(+user.endDate)).format("ddd  DD-MM-YYYY  HH:mm");
                                        return (
                                            <tr key={index}>
                                                <td>{user.id}</td>

                                                <td>{user.name}</td>
                                                <td>{start}</td>
                                                <td>{end}</td>
                                                <td>
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
                                </TableBody>
                                <TableFooter>
                                    <TableRow>
                                        <TablePagination
                                            rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                                            colSpan={7}
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
        deleteSchedule: (id) => dispatch(actions.deleteSchedule(id)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableEvent);
