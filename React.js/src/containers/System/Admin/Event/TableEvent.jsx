import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "../style.scss";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import _ from "lodash";
import moment from "moment";
import * as actions from "../../../../store/actions";
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
import { getAllEventsService, deleteEventsService } from "../../../../services/userService";
import ModalEdit from "./ModalEdit";
import ModalAdd from "./ModalAdd";
import TablePaginationActions from "../../../../components/TablePaginationActions";
import { SkeletonEvent } from "../SkeletonComponent";
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
            loading: false,
        };
    }

    async componentDidMount() {
        await this.getAllEvents();
    }
    getAllEvents = async () => {
        let res = await getAllEventsService("ALL");
        if (res && res.errCode === 0) {
            setTimeout(() => {
                this.setState({
                    loading: true,
                });
            }, 50);
            let test = _.sortBy(res.events, ["id"], ["desc"]);
            test.reverse();
            this.setState({
                listEvents: test,
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
        let { language } = this.props;
        let res = await deleteEventsService(user.id);
        if (res && res.errCode === 0) {
            if (language === "vi") {
                toast.success("Xóa sự kiện thành công");
            } else toast.success("Delete successful event");
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
        let clone = this.state.listEvents;
        clone = _.orderBy(clone, [b], [a]);
        this.setState({
            sortBy: a,
            sortField: b,
            listEvents: clone,
        });
    };

    render() {
        let { page, rowsPerPage, listEvents, loading } = this.state;
        let { language } = this.props;

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
                    <div className="title text-center">
                        <FormattedMessage id="menu.admin.listEvents.title" />
                    </div>
                    <div className="mx-5 my-3">
                        <button
                            className="btn btn-primary px-3"
                            onClick={() => this.handleAddUser()}>
                            <i className="fas fa-plus px-1"></i>
                            <FormattedMessage id="menu.admin.listEvents.title1" />
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
                                            onClick={() => this.handleSort("desc", "id")}>
                                            Id
                                        </th>
                                        <th
                                            style={{
                                                width: "35%",
                                            }}>
                                            <div className="section-title">
                                                <FormattedMessage id="menu.admin.listEvents.name" />
                                            </div>
                                        </th>

                                        <th
                                            style={{
                                                width: "25%",
                                            }}>
                                            <div className="section-title">
                                                <div>
                                                    {" "}
                                                    <FormattedMessage id="menu.admin.listEvents.start" />{" "}
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
                                        <th
                                            style={{
                                                width: "25%",
                                            }}>
                                            <div className="section-title">
                                                <FormattedMessage id="menu.admin.listEvents.end" />
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
                                        (rowsPerPage > 0 && listEvents && listEvents.length > 0
                                            ? listEvents.slice(
                                                  page * rowsPerPage,
                                                  page * rowsPerPage + rowsPerPage
                                              )
                                            : listEvents
                                        ).map((user, index) => {
                                            let start, end;
                                            if (language === "vi") {
                                                start = moment(+user.startDate).format(
                                                    "ddd DD/MM/YYYY HH:mm"
                                                );
                                                end = moment(new Date(+user.endDate)).format(
                                                    "ddd DD/MM/YYYY HH:mm"
                                                );
                                            } else {
                                                start = `${moment(+user.startDate)
                                                    .locale("en")
                                                    .format("ddd MM/DD/YYYY")} ${" "} ${moment(
                                                    +user.startDate
                                                )
                                                    .locale("en")
                                                    .format("LT")}`;
                                                end = `${moment(+user.endDate)
                                                    .locale("en")
                                                    .format("ddd MM/DD/YYYY")} ${" "} ${moment(
                                                    +user.endDate
                                                )
                                                    .locale("en")
                                                    .format("LT")}`;
                                            }
                                            return (
                                                <tr key={index}>
                                                    <td className="center">{user.id}</td>

                                                    <td>{user.name}</td>
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
                                </TableBody>
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableEvent);
