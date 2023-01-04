import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import _ from "lodash";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import * as actions from "../../../../store/actions";
import { LANGUAGES } from "../../../../utils";
import { getAllDrivers } from "../../../../services/userService";
import { withRouter } from "react-router";
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
import "../style.scss";
import TablePaginationActions from "../../../../components/TablePaginationActions";
class ListVehicleOfAdmin extends Component {
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
            if (this.props.match && this.props.match.params && this.props.match.params.id) {
                let driverId = this.props.match.params.id;
                console.log(driverId);
                let test = this.props.listVehicle.filter((item) => item.busOwnerId == driverId);
                this.setState({
                    listVehicles: test,
                });
                // let test = [];
                // console.log("listDrivers >>:", listDrivers);
                // listDrivers &&
                //     listDrivers.length > 0 &&
                //     (test = listDrivers.filter(
                //         (item) => item.busOwnerId && item.busOwnerId == driverId
                //     ));
                // this.setState({ arrUsers: test });
            }
        }
    }

    handleDeleteUser = (user) => {
        this.props.deleteVehicle(user.id);
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
            clone = clone.filter((item) => item.BusType.typeName.includes(term));
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
    handleBack = () => {
        console.log(2);
        console.log(this.props.history);
        if (this.props.history) {
            this.props.history.push(`/system/busOnwer-manage`);
        }
    };
    render() {
        let { page, rowsPerPage, listVehicles, test, test1, isTest } = this.state;
        isTest === true ? (test = test1) : (test = listVehicles);
        let { language } = this.props;
        let title;
        if (test.length > 0) {
            if (language === LANGUAGES.VI) {
                title = `Danh sách phương tiện giao thông của ${listVehicles[0].User.name}`;
            } else {
                title = `List of vehicles of ${listVehicles[0].User.name}`;
            }
        }
        return (
            <>
                <div onClick={() => this.handleBack()} className="backsystem">
                    <i className="fas fa-arrow-left"></i>{" "}
                    <FormattedMessage id="menu.admin.listDriver.back" />
                </div>
                <div className="container form-redux">
                    <div className="user-container">
                        <div className="title text-center">{title}</div>

                        <div style={{ marginTop: "50px" }}></div>
                        <TableContainer component={Paper} id="customers">
                            <Table>
                                <TableBody>
                                    <tr>
                                        <th
                                            className="section-id"
                                            style={{
                                                width: "5%",
                                            }}
                                            onClick={() => this.handleSort("asc", "id")}>
                                            Id
                                        </th>
                                        <th
                                            style={{
                                                width: "20%",
                                            }}>
                                            <div className="section-title">
                                                <div>
                                                    <FormattedMessage id="menu.busOwner.vehicle.bsx" />
                                                </div>
                                                <div>
                                                    {" "}
                                                    <FaLongArrowAltDown
                                                        className="iconSortDown"
                                                        onClick={() =>
                                                            this.handleSort("asc", "number")
                                                        }
                                                    />
                                                    <FaLongArrowAltUp
                                                        className="iconSortDown"
                                                        onClick={() =>
                                                            this.handleSort("desc", "number")
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </th>
                                        <th
                                            style={{
                                                width: "20%",
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
                                                width: "15%",
                                            }}
                                            className="section-id-list">
                                            <FormattedMessage id="menu.busOwner.vehicle.img" />
                                        </th>
                                        <th
                                            style={{
                                                width: "10%",
                                            }}
                                            className="section-id-list">
                                            <FormattedMessage id="menu.busOwner.vehicle.status" />
                                        </th>
                                        <th
                                            style={{
                                                width: "10%",
                                            }}
                                            className="section-id-list">
                                            <FormattedMessage id="menu.admin.listDriver.action" />
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
                                                <td className="section-id-list">{item.id}</td>
                                                <td>{item.number}</td>
                                                <td>{item.BusType.typeName}</td>
                                                <td>{item.BusType.numOfSeat}</td>
                                                <td
                                                    style={{
                                                        height: "100px",
                                                        textAlign: "center",
                                                        display: "flex",
                                                    }}>
                                                    {item.status === 2 ? (
                                                        <div className="vehicle-run">Đang chạy</div>
                                                    ) : (
                                                        <div className="vehicle-not-run">
                                                            Trong ben
                                                        </div>
                                                    )}
                                                </td>
                                                <td
                                                    className="content-left"
                                                    style={{
                                                        backgroundImage: `url(${
                                                            item && item.image ? item.image : ""
                                                        })`,
                                                    }}></td>
                                                <td className="section-id-list">
                                                    <button
                                                        className="btn-delete"
                                                        onClick={() => this.handleDeleteUser(item)}>
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
                                            count={test.length}
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
                        {/* </div> */}
                    </div>
                </div>
            </>
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
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListVehicleOfAdmin));
