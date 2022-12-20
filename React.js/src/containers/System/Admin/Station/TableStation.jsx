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
import { getAllVehicleFromStation } from "../../../../services/userService";
import TablePaginationActions from "../../../../components/TablePaginationActions";
import { withRouter } from "react-router";

class TableStation1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
        let res = await getAllVehicleFromStation("ALL");
        if (res && res.errCode === 0) {
            this.setState({
                listLocations: res.vehicles,
            });
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
    handleVehicle = (item) => {
        console.log(item);
        if (this.props.history) {
            this.props.history.push(`/system/stationId=${item.id}`);
        }
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

    render() {
        let { page, rowsPerPage, listLocations, test, test1, isTest } =
            this.state;
        isTest === true ? (test = test1) : (test = listLocations);
        return (
            <div className="container form-redux">
                <div className="user-container">
                    <div className="title text-center">
                        <FormattedMessage id="menu.admin.listLocations.title" />
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
                                        <th>
                                            <div className="section-title">
                                                <FormattedMessage id="menu.admin.listLocations.name" />
                                            </div>
                                        </th>

                                        <th>Tổng phương tiện trong bến</th>

                                        <th className="section-id-list">
                                            Danh sách phương tiện
                                        </th>
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
                                                <td>{user.tovehicle.length}</td>
                                                <td className="center">
                                                    {" "}
                                                    <button
                                                        className="btn btn-info"
                                                        onClick={() =>
                                                            this.handleVehicle(
                                                                user
                                                            )
                                                        }>
                                                        Danh sách phương tiện
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

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(TableStation1)
);
