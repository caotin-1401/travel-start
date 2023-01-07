import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import _ from "lodash";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import * as actions from "../../../../store/actions";
import { LANGUAGES } from "../../../../utils";
import { withRouter } from "react-router";
import { changeLanguageApp } from "../../../../store/actions/appActions";
import moment from "moment";
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
import { getAllVehicleFromStation, getNextTrip } from "../../../../services/userService";
import ModalInfo from "./ModalInfo";

class ListVehicleOfStation extends Component {
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
            nameStation: "",
            isOpenModel: false,
            DetailVehicle: [],
            info: [],
        };
    }

    async componentDidMount() {
        await this.getAllvehicle();
    }

    getAllvehicle = async () => {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let driverId = this.props.match.params.id;
            let resStation = await getAllVehicleFromStation(driverId);

            this.setState({
                nameStation: resStation.vehicles[0].name,
            });
            resStation &&
                resStation.vehicles[0].tovehicle.length > 0 &&
                this.setState({
                    listVehicles: resStation.vehicles[0].tovehicle,
                });
        }
    };
    handleDeleteUser = (user) => {
        this.props.deleteVehicle(user.id);
    };
    toggleOpenModel = () => {
        this.setState({
            isOpenModel: !this.state.isOpenModel,
        });
    };

    handleDetailInfo = async (item) => {
        let res = await getNextTrip(this.state.nameStation, item.id);
        this.setState({
            isOpenModel: true,
            DetailVehicle: item,
            info: res.vehicles,
        });
    };
    handleSort = (a, b) => {
        let clone = this.state.listVehicles;
        clone = _.orderBy(clone, [b], [a]);
        this.setState({
            sortBy: a,
            sortField: b,
            listVehicles: clone,
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
        if (this.props.history) {
            this.props.history.push(`/system/parking-lot`);
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
        let { page, rowsPerPage, listVehicles, test, test1, isTest, nameStation, info } =
            this.state;
        isTest === true ? (test = test1) : (test = listVehicles);
        let { language } = this.props;

        let title, mes;
        if (language === LANGUAGES.VI) {
            title = `Danh sách phương tiện giao thông trong  ${nameStation}`;
            mes = "TÌm phương tiện vận tải ";
        } else {
            title = `List of vehicles in ${nameStation}`;
            mes = "Search vehicles";
        }

        return (
            <>
                {this.state.isOpenModel && (
                    <ModalInfo
                        isOpen={this.state.isOpenModel}
                        toggleFromParent={this.toggleOpenModel}
                        currentUser={this.state.DetailVehicle}
                        info={info}
                    />
                )}
                <div onClick={() => this.handleBack()} className="backsystem">
                    <i className="fas fa-arrow-left"></i>
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
                                            className="section-id w5"
                                            onClick={() => this.handleSort("asc", "id")}>
                                            Id
                                        </th>
                                        <th className="w20">
                                            <div className="section-title">
                                                <div>
                                                    <FormattedMessage id="menu.busOwner.vehicle.bsx" />
                                                </div>
                                                <div>
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

                                        <th className="w20">
                                            <div className="section-title">
                                                <div>
                                                    <FormattedMessage id="menu.busOwner.vehicle.seat" />
                                                </div>
                                                <div>
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
                                        <th className="w15">
                                            <FormattedMessage id="menu.admin.listLocations.time" />
                                        </th>
                                        <th className="w20">
                                            <FormattedMessage id="menu.admin.listLocations.bus" />
                                        </th>
                                        <th className="section-id-list w20">
                                            <FormattedMessage id="menu.admin.listLocations.detail" />
                                        </th>
                                    </tr>
                                    <tr style={{ height: "50px" }}>
                                        <td></td>

                                        <td>
                                            <input
                                                placeholder={mes}
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
                                        let time;
                                        if (language === "vi") {
                                            time = moment(+item.arrivalTime).format(
                                                " DD/MM/YYYY HH:mm"
                                            );
                                        } else {
                                            time = `${moment(+item.arrivalTime)
                                                .locale("en")
                                                .format("L")} ${" "} ${moment(+item.arrivalTime)
                                                .locale("en")
                                                .format("LT")}`;
                                        }

                                        return (
                                            <tr key={index}>
                                                <td className="section-id-list">{item.id}</td>
                                                <td>{item.number}</td>
                                                <td>{item.BusType.numOfSeat}</td>
                                                <td>{time}</td>
                                                <td>{item.User.name}</td>
                                                <td className="center">
                                                    <button
                                                        title="Infomation Detail"
                                                        className="btn-edit"
                                                        onClick={() => this.handleDetailInfo(item)}>
                                                        <i className="fas fa-info-circle"></i>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListVehicleOfStation));
