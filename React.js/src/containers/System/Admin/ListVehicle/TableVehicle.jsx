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
class TableVehicle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listVehicles: [],
            sortBy: "",
            sortField: "",

            page: 0,
            rowsPerPage: 5,
            image: "",
        };
    }
    componentDidMount() {
        this.props.fetchAllVehicle();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listVehicle !== this.props.listVehicle) {
            this.setState({
                listVehicles: this.props.listVehicle,
            });
        }
    }

    handleDeleteUser = (user) => {
        this.props.deleteVehicle(user.id);
    };
    handleEditUser = (user) => {
        this.props.handleEditUserFromParentKey(user);
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
                listVehicles: clone,
            });
        } else {
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
                listVehicles: clone,
            });
        } else {
            this.props.fetchAllVehicle();
        }
    };
    handleKeyword2 = (e) => {
        let term = e.target.value;
        let clone = this.state.listVehicles;
        if (term) {
            clone = clone.filter((item) => item.User.name.includes(term));
            this.setState({
                listVehicles: clone,
            });
        } else {
            this.props.fetchAllVehicle();
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
        let { page, rowsPerPage, listVehicles } = this.state;
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
                                            width: "15%",
                                            // backgroundColor: "#f5f5f5",
                                            // color: "black",
                                        }}>
                                        {" "}
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
                                            width: "15%",
                                            // backgroundColor: "#f5f5f5",
                                            // color: "black",
                                        }}>
                                        <div className="section-title">
                                            <div>
                                                <FormattedMessage id="menu.busOwner.vehicle.type" />
                                            </div>
                                        </div>
                                    </th>

                                    <th
                                        style={{
                                            width: "15%",
                                            // backgroundColor: "#f5f5f5",
                                            // color: "black",
                                        }}>
                                        <div className="section-title">
                                            <div>
                                                {/* <FormattedMessage id="menu.admin.listVehicle.end" />{" "} */}
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
                                            // backgroundColor: "#f5f5f5",
                                            // color: "black",
                                        }}>
                                        <div className="section-title">
                                            <div>
                                                <FormattedMessage id="menu.busOwner.vehicle.name" />
                                            </div>
                                            <div>
                                                {" "}
                                                <FaLongArrowAltDown
                                                    className="iconSortDown"
                                                    onClick={() =>
                                                        this.handleSort(
                                                            "asc",
                                                            "User.name"
                                                        )
                                                    }
                                                />
                                                <FaLongArrowAltUp
                                                    className="iconSortDown"
                                                    onClick={() =>
                                                        this.handleSort(
                                                            "desc",
                                                            "User.name"
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    </th>
                                    <th
                                        style={{
                                            width: "20%",
                                            // backgroundColor: "#f5f5f5",
                                            // color: "black",
                                        }}
                                        className="section-id-list">
                                        <FormattedMessage id="menu.busOwner.vehicle.img" />
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
                                    <td>
                                        <input
                                            className="form-control"
                                            // value={this.state.keywordNumber}
                                            onChange={(e) =>
                                                this.handleKeyword2(e)
                                            }
                                        />
                                    </td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                {(rowsPerPage > 0
                                    ? listVehicles.slice(
                                          page * rowsPerPage,
                                          page * rowsPerPage + rowsPerPage
                                      )
                                    : listVehicles
                                ).map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td className="section-id-list">
                                                {item.id}
                                            </td>
                                            <td>{item.number}</td>
                                            <td>{item.BusType.typeName}</td>
                                            <td>{item.BusType.numOfSeat}</td>
                                            <td>{item.User.name}</td>
                                            <td
                                                className="content-left"
                                                style={{
                                                    backgroundImage: `url(${
                                                        item && item.image
                                                            ? item.image
                                                            : ""
                                                    })`,
                                                }}>
                                                {/* {item.image} */}
                                            </td>
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
                                        rowsPerPageOptions={[
                                            5,
                                            10,
                                            25,
                                            { label: "All", value: -1 },
                                        ]}
                                        colSpan={7}
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
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        listVehicle: state.admin.vehicles,
        language: state.app.language,
        // userInfo: state.user.userInfo,
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
