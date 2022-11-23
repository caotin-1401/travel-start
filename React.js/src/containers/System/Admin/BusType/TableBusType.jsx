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

class TableBusType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listBusTypes: [],
            sortBy: "",
            sortField: "",

            page: 0,
            rowsPerPage: 5,
        };
    }
    componentDidMount() {
        this.props.fetchAllBusType();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listBusTypes !== this.props.listBusTypes) {
            this.setState({
                listBusTypes: this.props.listBusTypes,
            });
        }
    }

    handleDeleteUser = (user) => {
        this.props.deleteBusType(user.id);
    };
    handleEditUser = (user) => {
        this.props.handleEditUserFromParentKey(user);
    };

    //Rows per page

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
        this.state.listBusTypes = _.orderBy(this.state.listBusTypes, [b], [a]);
        this.setState({
            sortBy: a,
            sortField: b,
            listBusTypes: this.state.listBusTypes,
        });
    };

    handleKeyword = (e) => {
        let term = e.target.value.toUpperCase();
        let clone = this.state.listBusTypes;
        if (term) {
            clone = clone.filter((item) => item.typeName.includes(term));
            this.setState({
                listBusTypes: clone,
            });
        } else {
            this.props.fetchAllBusType();
        }
    };

    render() {
        let { page, rowsPerPage, listBusTypes } = this.state;

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
                                            width: "10%",
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
                                            width: "45%",
                                            // backgroundColor: "#f5f5f5",
                                            // color: "black",
                                        }}>
                                        <div className="section-title">
                                            <div>
                                                <FormattedMessage id="menu.admin.listBusType.name" />
                                            </div>
                                            <div>
                                                {" "}
                                                <FaLongArrowAltDown
                                                    className="iconSortDown"
                                                    onClick={() =>
                                                        this.handleSort(
                                                            "asc",
                                                            "typeName"
                                                        )
                                                    }
                                                />
                                                <FaLongArrowAltUp
                                                    className="iconSortDown"
                                                    onClick={() =>
                                                        this.handleSort(
                                                            "desc",
                                                            "typeName"
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </th>
                                    <th
                                        style={{
                                            width: "30%",
                                            // backgroundColor: "#f5f5f5",
                                            // color: "black",
                                        }}>
                                        <div className="section-title">
                                            <div>
                                                <FormattedMessage id="menu.admin.listBusType.num" />
                                            </div>
                                            <div>
                                                {" "}
                                                <FaLongArrowAltDown
                                                    className="iconSortDown"
                                                    onClick={() =>
                                                        this.handleSort(
                                                            "asc",
                                                            "numOfSeat"
                                                        )
                                                    }
                                                />
                                                <FaLongArrowAltUp
                                                    className="iconSortDown"
                                                    onClick={() =>
                                                        this.handleSort(
                                                            "desc",
                                                            "numOfSeat"
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </th>
                                    <th
                                        style={{
                                            width: "15%",
                                            // backgroundColor: "#f5f5f5",
                                            // color: "black",
                                        }}
                                        className="section-id-list">
                                        <FormattedMessage id="menu.admin.listBusType.action" />
                                    </th>
                                </tr>
                                <tr
                                    style={{
                                        height: "50px",
                                        borderBottom: "1px solid black",
                                    }}>
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

                                    <td></td>
                                    <td></td>
                                </tr>
                                {(rowsPerPage > 0
                                    ? listBusTypes.slice(
                                          page * rowsPerPage,
                                          page * rowsPerPage + rowsPerPage
                                      )
                                    : listBusTypes
                                ).map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td className="section-id-list">
                                                {item.id}
                                            </td>
                                            <td>{item.typeName}</td>
                                            <td>{item.numOfSeat}</td>
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
                                        style={{ marginTop: "12px" }}
                                        rowsPerPageOptions={[
                                            5,
                                            10,
                                            25,
                                            { label: "All", value: -1 },
                                        ]}
                                        colSpan={4}
                                        count={listBusTypes.length}
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
        listBusTypes: state.admin.busTypes,
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllBusType: () => dispatch(actions.fetchAllBusType()),
        deleteBusType: (id) => dispatch(actions.deleteBusType(id)),
        changeLanguageAppRedux: (language) =>
            dispatch(changeLanguageApp(language)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableBusType);
