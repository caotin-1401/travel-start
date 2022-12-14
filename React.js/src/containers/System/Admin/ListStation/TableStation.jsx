import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./TableStation.scss";
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
    getAllLocationService,
    deleteLocationService,
} from "../../../../services/userService";
import TablePaginationActions from "../../../../components/TablePaginationActions";

class TableStation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenModel: false,
            listLocations: [],
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
        await this.getAllLocations();
    }

    getAllLocations = async () => {
        let res = await getAllLocationService("ALL");
        if (res && res.errCode === 0) {
            this.setState({
                listLocations: res.locations,
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
        let res = await deleteLocationService(user.id);
        if (res && res.errCode === 0) {
            if (language === LANGUAGES.VI) {
                toast.success("Xóa bến xe thành công");
            } else {
                toast.success("Delete successful bus station");
            }
            await this.getAllLocations();
        }
    };

    createLocation = async (data) => {
        await this.getAllLocations();
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
        this.state.listLocations = _.orderBy(
            this.state.listLocations,
            [b],
            [a]
        );
        this.setState({
            sortBy: a,
            sortField: b,
            listLocations: this.state.listLocations,
        });
    };
    handleKeyword = (e) => {
        let term = e.target.value.toUpperCase();
        let clone = this.state.listLocations;
        console.log(term);
        console.log(clone);
        if (term) {
            clone = clone.filter((item) => item.name.includes(term));
            this.setState({
                test1: clone,
                isTest: true,
            });
        } else {
            this.setState({
                isTest: false,
            });
            this.getAllLocations();
        }
    };
    handleKeyword1 = (e) => {
        let term = e.target.value.toUpperCase();
        let clone = this.state.listLocations;

        if (term) {
            clone = clone.filter((item) => item.city.includes(term));
            this.setState({
                test1: clone,
                isTest: true,
            });
        } else {
            this.setState({
                isTest: false,
            });
            this.getAllLocations();
        }
    };
    render() {
        let { page, rowsPerPage, listLocations, test, test1, isTest } =
            this.state;
        isTest === true ? (test = test1) : (test = listLocations);
        return (
            <div className="container form-redux">
                <div className="user-container">
                    <ModalAdd
                        listLocations={listLocations}
                        isOpen={this.state.isOpenModel}
                        toggleFromParent={this.toggleModel}
                        createLocation={this.createLocation}
                    />

                    <div className="title text-center">
                        <FormattedMessage id="menu.admin.listLocations.title" />
                    </div>
                    <div className="mx-5 my-3">
                        <button
                            className="btn btn-primary px-3 w130"
                            onClick={() => this.handleAddLocation()}>
                            <i className="fas fa-plus px-1 "></i>
                            <FormattedMessage id="menu.admin.listLocations.add" />
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
                                            onClick={() =>
                                                this.handleSort("asc", "id")
                                            }>
                                            Id
                                        </th>
                                        <th
                                            style={{
                                                width: "25%",
                                            }}>
                                            <div className="section-title">
                                                <div>
                                                    <FormattedMessage id="menu.admin.listLocations.name" />
                                                </div>
                                                <div>
                                                    <FaLongArrowAltDown
                                                        className="iconSortDown"
                                                        onClick={() =>
                                                            this.handleSort(
                                                                "asc",
                                                                "name"
                                                            )
                                                        }
                                                    />
                                                    <FaLongArrowAltUp
                                                        className="iconSortDown"
                                                        onClick={() =>
                                                            this.handleSort(
                                                                "desc",
                                                                "name"
                                                            )
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
                                                <div>
                                                    <FormattedMessage id="menu.admin.listLocations.city" />
                                                </div>
                                                <div>
                                                    <FaLongArrowAltDown
                                                        className="iconSortDown"
                                                        onClick={() =>
                                                            this.handleSort(
                                                                "asc",
                                                                "city"
                                                            )
                                                        }
                                                    />
                                                    <FaLongArrowAltUp
                                                        className="iconSortDown"
                                                        onClick={() =>
                                                            this.handleSort(
                                                                "desc",
                                                                "city"
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </th>
                                        <th
                                            style={{
                                                width: "35%",
                                            }}>
                                            <FormattedMessage id="menu.admin.listLocations.address" />
                                        </th>

                                        <th
                                            style={{
                                                width: "10%",
                                            }}
                                            className="section-id-list">
                                            <FormattedMessage id="menu.admin.listLocations.action" />
                                        </th>
                                    </tr>
                                    <tr style={{ height: "50px" }}>
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
                                                <td>{user.city}</td>
                                                <td>{user.address}</td>
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
                                            count={listLocations.length}
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

export default connect(mapStateToProps, mapDispatchToProps)(TableStation);
