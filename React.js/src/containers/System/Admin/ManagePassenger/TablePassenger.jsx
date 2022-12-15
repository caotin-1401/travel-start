import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import _ from "lodash";
import * as actions from "../../../../store/actions";
import { LANGUAGES } from "../../../../utils";
// import ModalAdd from "./ModalAdd";
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
    getAllPassengers,
    deleteRouteService,
} from "../../../../services/userService";
import TablePaginationActions from "../../../../components/TablePaginationActions";

class TablePassenger extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenModel: false,
            listPassenger: [],
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
        let res = await getAllPassengers("ALL");
        if (res && res.errCode === 0) {
            this.setState({
                listPassenger: res.users,
            });
        }
    };

    toggleModel = () => {
        this.setState({
            isOpenModel: !this.state.isOpenModel,
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

    render() {
        let { page, rowsPerPage, listPassenger } = this.state;
        return (
            <div className="container form-redux">
                <div className="user-container">
                    {/* <ModalAdd
                        listPassenger={listPassenger}
                        isOpen={this.state.isOpenModel}
                        toggleFromParent={this.toggleModel}
                        createLocation={this.createLocation}
                    /> */}

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
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>
                                            <div className="section-title">
                                                <div>Tổng tiền vé đã đặt </div>
                                                <div>
                                                    {" "}
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
                                            style={{ width: "10%" }}
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
                                        return (
                                            <tr key={index}>
                                                <td>{user.id}</td>

                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td></td>
                                                <td className="center">
                                                    <button
                                                        className="btn-edit"
                                                        onClick={() =>
                                                            this.handleEditUser(
                                                                user
                                                            )
                                                        }>
                                                        <i className="fas fa-info-circle"></i>
                                                    </button>
                                                    <button
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
                                            colSpan={5}
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
