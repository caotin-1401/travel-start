import React, { Component } from "react";

import { connect } from "react-redux";
import "../style.scss";
import _ from "lodash";
import * as actions from "../../../../store/actions";
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

class TableLocation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            locationsRedux: [],
            sortBy: "",
            sortField: "",
            page: 0,
            rowsPerPage: 5,
        };
    }
    componentDidMount() {
        this.props.fetchAllLocation();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listLocations !== this.props.listLocations) {
            this.setState({
                locationsRedux: this.props.listLocations,
            });
        }
    }

    handleDeleteLocation = (user) => {
        this.props.deleteLocation(user.id);
    };
    handleEditUser = (user) => {
        this.props.handleEditUserFromParentKey(user);
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
        console.log(this.state);
    };
    handleSort = (a, b) => {
        this.state.locationsRedux = _.orderBy(
            this.state.locationsRedux,
            [b],
            [a]
        );
        this.setState({
            sortBy: a,
            sortField: b,
            locationsRedux: this.state.locationsRedux,
        });
    };
    handleKeyword = (e) => {
        let term = e.target.value.toUpperCase();
        let clone = this.state.locationsRedux;
        if (term) {
            clone = clone.filter((item) => item.name.includes(term));
            this.setState({
                locationsRedux: clone,
            });
        } else {
            this.props.fetchAllLocation();
        }
    };
    handleKeyword1 = (e) => {
        let term = e.target.value.toUpperCase();
        let clone = this.state.locationsRedux;
        if (term) {
            clone = clone.filter((item) => item.city.includes(term));
            this.setState({
                locationsRedux: clone,
            });
        } else {
            this.props.fetchAllLocation();
        }
    };
    render() {
        let { page, rowsPerPage, locationsRedux } = this.state;
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
                                        style={{
                                            width: "5%",
                                            // backgroundColor: "#f5f5f5",
                                            // color: "black",
                                        }}
                                        onClick={() =>
                                            this.handleSort("asc", "id")
                                        }>
                                        Id
                                    </th>
                                    <th
                                        style={{
                                            width: "25%",
                                            // backgroundColor: "#f5f5f5",
                                            // color: "black",
                                        }}>
                                        <div className="section-title">
                                            <div>
                                                <FormattedMessage id="menu.admin.listLocations.name" />
                                            </div>
                                            <div>
                                                {" "}
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
                                            // backgroundColor: "#f5f5f5",
                                            // color: "black",
                                        }}>
                                        <div className="section-title">
                                            <div>
                                                <FormattedMessage id="menu.admin.listLocations.city" />
                                            </div>
                                            <div>
                                                {" "}
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
                                            // backgroundColor: "#f5f5f5",
                                            // color: "black",
                                        }}>
                                        <FormattedMessage id="menu.admin.listLocations.address" />
                                    </th>

                                    <th
                                        style={{
                                            width: "10%",
                                            // backgroundColor: "#f5f5f5",
                                            // color: "black",
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
                                    <td></td>
                                </tr>
                                {(rowsPerPage > 0
                                    ? locationsRedux.slice(
                                          page * rowsPerPage,
                                          page * rowsPerPage + rowsPerPage
                                      )
                                    : locationsRedux
                                ).map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td className="section-id-list">
                                                {item.id}
                                            </td>
                                            <td>{item.name}</td>
                                            <td>{item.city}</td>
                                            <td>{item.address}</td>
                                            <td className="section-id-list">
                                                <button
                                                    className="btn-edit"
                                                    onClick={() =>
                                                        this.handleEditUser(
                                                            item
                                                        )
                                                    }>
                                                    <i className="fas fa-user-edit"></i>
                                                </button>
                                                <button
                                                    className="btn-delete"
                                                    onClick={() =>
                                                        this.handleDeleteLocation(
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
                                        count={locationsRedux.length}
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
        listLocations: state.admin.locations,
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllLocation: () => dispatch(actions.fetchAllLocation()),
        deleteLocation: (id) => dispatch(actions.deleteLocation(id)),
        changeLanguageAppRedux: (language) =>
            dispatch(changeLanguageApp(language)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableLocation);
