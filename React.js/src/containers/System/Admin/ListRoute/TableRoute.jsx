import React, { Component } from "react";
import { connect } from "react-redux";
import "../style.scss";
import * as actions from "../../../../store/actions";
import _ from "lodash";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import { FormattedMessage } from "react-intl";
import { LANGUAGES } from "../../../../utils";
import { changeLanguageApp } from "../../../../store/actions/appActions";
import {
    TableBody,
    TableContainer,
    TableFooter,
    TablePagination,
    TableRow,
    Paper,
    Table,
} from "@mui/material";
import TablePaginationActions from "../../../../components/TablePaginationActions";
class TableRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listRoutes: [],
            sortBy: "",
            sortField: "",

            page: 0,
            rowsPerPage: 5,
        };
    }
    componentDidMount() {
        this.props.fetchAllRoute();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listRoute !== this.props.listRoute) {
            this.setState({
                listRoutes: this.props.listRoute,
            });
        }
    }

    handleDeleteUser = (user) => {
        this.props.deleteRoute(user.id);
    };
    handleEditUser = (user) => {
        this.props.handleEditUserFromParentKey(user);
    };
    handleSort = (a, b) => {
        this.state.listRoutes = _.orderBy(this.state.listRoutes, [b], [a]);
        this.setState({
            sortBy: a,
            sortField: b,
            listRoutes: this.state.listRoutes,
        });
    };
    handleKeyword = (e) => {
        let term = e.target.value.toUpperCase();
        let clone = this.state.listRoutes;
        if (term) {
            clone = clone.filter((item) => item.from.name.includes(term));
            this.setState({
                listRoutes: clone,
            });
        } else {
            this.props.fetchAllRoute();
        }
    };
    handleKeyword1 = (e) => {
        let term = e.target.value.toUpperCase();
        let clone = this.state.listRoutes;
        if (term) {
            clone = clone.filter((item) => item.to.name.includes(term));
            this.setState({
                listRoutes: clone,
            });
        } else {
            this.props.fetchAllRoute();
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
    render() {
        let { page, rowsPerPage, listRoutes } = this.state;

        let language = this.props.language;
        return (
            <div className="user-container">
                <div className="use-table ">
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
                                            // value={this.state.keywordNumber}
                                            onChange={(e) =>
                                                this.handleKeyword(e)
                                            }
                                        />
                                    </td>
                                    <td>
                                        <input
                                            className="form-control"
                                            // value={this.state.keywordNumber}
                                            onChange={(e) =>
                                                this.handleKeyword1(e)
                                            }
                                        />
                                    </td>

                                    <td></td>
                                </tr>
                                {(rowsPerPage > 0
                                    ? listRoutes.slice(
                                          page * rowsPerPage,
                                          page * rowsPerPage + rowsPerPage
                                      )
                                    : listRoutes
                                ).map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td className="section-id-list">
                                                {item.id}
                                            </td>
                                            <td>{`${item.from.name} (${item.from.city}) - ${item.to.name} (${item.to.city})`}</td>
                                            <td>{`${item.from.name} (${item.from.city})`}</td>
                                            <td>{`${item.to.name} (${item.to.city})`}</td>
                                            <td className="section-id-list">
                                                <button
                                                    className="btn-delete"
                                                    onClick={() =>
                                                        this.handleDeleteUser(
                                                            item
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
                                        rowsPerPageOptions={[
                                            5,
                                            10,
                                            25,
                                            { label: "All", value: -1 },
                                        ]}
                                        colSpan={5}
                                        count={listRoutes.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onPageChange={this.handleChangePage}
                                        onRowsPerPageChange={
                                            this.handleChangeRowsPerPage
                                        }
                                        ActionsComponent={(subProps) => (
                                            <TablePaginationActions
                                                style={{ marginBottom: "12px" }}
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
        );
    }
}

const mapStateToProps = (state) => {
    return {
        listRoute: state.admin.routes,
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllRoute: () => dispatch(actions.fetchAllRoute()),
        deleteRoute: (id) => dispatch(actions.deleteRoute(id)),
        changeLanguageAppRedux: (language) =>
            dispatch(changeLanguageApp(language)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableRoute);
