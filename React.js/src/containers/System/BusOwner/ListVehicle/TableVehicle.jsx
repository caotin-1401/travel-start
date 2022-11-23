import React, { Component } from "react";
import { connect } from "react-redux";
import "./style.scss";
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

class TableVehicle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listVehicles: [],
            sortBy: "",
            sortField: "",
            keywordNumber: "",
            page: 0,
            rowsPerPage: 5,
            image: "",
            isTest: false,
            test: [],
            test1: [],
        };
    }
    componentDidMount() {
        this.props.fetchAllVehicle();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listVehicle !== this.props.listVehicle) {
            let test = this.props.listVehicle.filter(
                (item) => item.busOwnerId === this.props.userInfo.id
            );
            this.setState({
                listVehicles: test,
            });
        }
    }

    handleDeleteUser = (user) => {
        this.props.deleteVehicle(user.id);
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
    };
    handleSort = (a, b) => {
        this.state.listVehicles = _.orderBy(this.state.listVehicles, [b], [a]);
        this.setState({
            sortBy: a,
            sortField: b,
            listVehicles: this.state.listVehicles,
        });
    };
    handleKeyword = (e) => {
        let term = e.target.value.toUpperCase();
        let clone = this.state.listVehicles;
        if (term) {
            clone = clone.filter((item) => item.number.includes(term));
            this.setState({
                test1: clone,
                isTest: true,
            });
        } else {
            this.setState({
                isTest: false,
            });
            this.props.fetchAllVehicle();
        }
    };
    handleKeyword1 = (e) => {
        let term = e.target.value.toUpperCase();
        let clone = this.state.listVehicles;

        if (term) {
            clone = clone.filter((item) =>
                item.BusType.typeName.includes(term)
            );
            this.setState({
                test1: clone,
                isTest: true,
            });
        } else {
            this.setState({
                isTest: false,
            });
            this.props.fetchAllVehicle();
        }
    };
    render() {
        let { page, rowsPerPage, listVehicles, test, test1, isTest } =
            this.state;
        isTest === true ? (test = test1) : (test = listVehicles);

        let language = this.props.language;
        return (
            <div className="user-container">
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
                                        width: "20%",
                                    }}>
                                    <div className="section-title">
                                        <div>
                                            {" "}
                                            <FormattedMessage id="menu.busOwner.vehicle.bsx" />
                                        </div>
                                        <div>
                                            {" "}
                                            <FaLongArrowAltDown
                                                className="iconSortDown"
                                                onClick={() =>
                                                    this.handleSort(
                                                        "asc",
                                                        "number"
                                                    )
                                                }
                                            />
                                            <FaLongArrowAltUp
                                                className="iconSortDown"
                                                onClick={() =>
                                                    this.handleSort(
                                                        "desc",
                                                        "number"
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
                                            <FormattedMessage id="menu.busOwner.vehicle.type" />
                                        </div>
                                    </div>
                                </th>
                                <th
                                    style={{
                                        width: "20%",
                                    }}>
                                    <div className="section-title">
                                        <div>
                                            <FormattedMessage id="menu.busOwner.vehicle.seat" />
                                        </div>
                                        <div>
                                            {" "}
                                            <FaLongArrowAltDown
                                                className="iconSortDown"
                                                onClick={() =>
                                                    this.handleSort(
                                                        "asc",
                                                        "BusType.numOfSeat"
                                                    )
                                                }
                                            />
                                            <FaLongArrowAltUp
                                                className="iconSortDown"
                                                onClick={() =>
                                                    this.handleSort(
                                                        "desc",
                                                        "BusType.numOfSeat"
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                </th>
                                <th
                                    style={{
                                        width: "20%",
                                    }}
                                    className="section-id-list">
                                    <FormattedMessage id="menu.busOwner.vehicle.img" />
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
                                        onChange={(e) => this.handleKeyword(e)}
                                    />
                                </td>
                                <td>
                                    <input
                                        className="form-control"
                                        onChange={(e) => this.handleKeyword1(e)}
                                    />
                                </td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            {(rowsPerPage > 0
                                ? test.slice(
                                      page * rowsPerPage,
                                      page * rowsPerPage + rowsPerPage
                                  )
                                : test
                            ).map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <td className="section-id-list">
                                            {item.id}
                                        </td>
                                        <td>{item.number}</td>
                                        <td>{item.BusType.typeName}</td>
                                        <td>{item.BusType.numOfSeat}</td>
                                        <td
                                            className="content-left"
                                            style={{
                                                backgroundImage: `url(${
                                                    item && item.image
                                                        ? item.image
                                                        : ""
                                                })`,
                                            }}></td>
                                        <td className="section-id-list">
                                            <button
                                                className="btn-edit"
                                                onClick={() =>
                                                    this.handleEditUser(item)
                                                }>
                                                <i className="fas fa-user-edit"></i>
                                            </button>
                                            <button
                                                className="btn-delete"
                                                onClick={() =>
                                                    this.handleDeleteUser(item)
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
                                    colSpan={6}
                                    count={listVehicles.length}
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
                {/* </div> */}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        listVehicle: state.admin.vehicles,
        language: state.app.language,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllVehicle: () => dispatch(actions.fetchAllVehicle()),
        deleteVehicle: (id) => dispatch(actions.deleteVehicle(id)),
        changeLanguageAppRedux: (language) =>
            dispatch(changeLanguageApp(language)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableVehicle);
