import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import _ from "lodash";
import * as actions from "../../../../store/actions";
import { LANGUAGES } from "../../../../utils";
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
import { toast } from "react-toastify";
import {
    getAllRoutesService,
    deleteRouteService,
} from "../../../../services/userService";
import TablePaginationActions from "../../../../components/TablePaginationActions";

class TableRoutes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenModel: false,
            ListRoutes: [],
            sortBy: "",
            sortField: "",
            page: 0,
            rowsPerPage: 5,

            isTest: false,
            test: [],
            test1: [],
        };
    }

    async componentDidMount() {
        await this.getAllRoutes();
        this.props.fetchAllLocation();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log(this.props.locations);
    }
    getAllRoutes = async () => {
        let res = await getAllRoutesService("ALL");
        if (res && res.errCode === 0) {
            this.setState({
                ListRoutes: res.routes,
            });
        }
    };

    toggleModel = () => {
        this.setState({
            isOpenModel: !this.state.isOpenModel,
        });
    };

    handleAddLocation = () => {
        this.setState({
            isOpenModel: true,
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
            await this.getAllRoutes();
        }
    };

    createLocation = async (data) => {
        await this.getAllRoutes();
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
        this.state.ListRoutes = _.orderBy(this.state.ListRoutes, [b], [a]);
        this.setState({
            sortBy: a,
            sortField: b,
            ListRoutes: this.state.ListRoutes,
        });
    };
    handleKeyword = (e) => {
        let term = e.target.value.toUpperCase();
        let clone = this.state.ListRoutes;

        if (term) {
            clone = clone.filter((item) => item.from.name.includes(term));
            this.setState({
                test1: clone,
                isTest: true,
            });
        } else {
            this.setState({
                isTest: false,
            });
            this.getAllRoutes();
        }
    };
    handleKeyword1 = (e) => {
        let term = e.target.value.toUpperCase();
        let clone = this.state.ListRoutes;

        if (term) {
            clone = clone.filter((item) => item.to.name.includes(term));
            this.setState({
                test1: clone,
                isTest: true,
            });
        } else {
            this.setState({
                isTest: false,
            });
            this.getAllRoutes();
        }
    };
    render() {
        let { page, rowsPerPage, ListRoutes, test, test1, isTest } = this.state;
        isTest === true ? (test = test1) : (test = ListRoutes);
        return (
            <div className="container form-redux">
                <div className="user-container">
                    <ModalAdd
                        ListRoutes={ListRoutes}
                        isOpen={this.state.isOpenModel}
                        toggleFromParent={this.toggleModel}
                        createLocation={this.createLocation}
                    />

                    <div className="title text-center">
                        <FormattedMessage id="menu.admin.listRoute.title" />
                    </div>
                    <div className="mx-5 my-3">
                        <button
                            className="btn btn-primary px-3 w130"
                            onClick={() => this.handleAddLocation()}>
                            <i className="fas fa-plus px-1 "></i>
                            <FormattedMessage id="menu.admin.listBusType.add" />
                        </button>
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
                                        <th style={{ width: "35%" }}>
                                            <FormattedMessage id="menu.admin.listRoute.name" />
                                        </th>
                                        <th style={{ width: "25%" }}>
                                            <div className="section-title">
                                                <div>
                                                    <FormattedMessage id="menu.admin.listRoute.start" />
                                                </div>
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
                                        <th style={{ width: "25%" }}>
                                            <div className="section-title">
                                                <div>
                                                    <FormattedMessage id="menu.admin.listRoute.end" />
                                                </div>
                                                <div>
                                                    {" "}
                                                    <FaLongArrowAltDown
                                                        className="iconSortDown"
                                                        onClick={() =>
                                                            this.handleSort(
                                                                "asc",
                                                                "to.name"
                                                            )
                                                        }
                                                    />
                                                    <FaLongArrowAltUp
                                                        className="iconSortDown"
                                                        onClick={() =>
                                                            this.handleSort(
                                                                "desc",
                                                                "to.name"
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
                                    <tr style={{ height: "50px" }}>
                                        <td></td>
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
                                    </tr>
                                    {(rowsPerPage > 0 && test && test.length > 0
                                        ? test.slice(
                                              page * rowsPerPage,
                                              page * rowsPerPage + rowsPerPage
                                          )
                                        : test
                                    ).map((user, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{user.id}</td>

                                                <td>{user.name}</td>
                                                <td>{`${user.from.name} (${user.from.city})`}</td>
                                                <td>{`${user.to.name} (${user.to.city})`}</td>
                                                <td className="center">
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
                                            colSpan={7}
                                            count={ListRoutes.length}
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
        locations: state.admin.locations,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllLocation: () => dispatch(actions.fetchAllLocation()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableRoutes);
