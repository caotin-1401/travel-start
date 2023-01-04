import React, { Component, Suspense, lazy } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import _ from "lodash";
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
import { toast } from "react-toastify";
import { getAllVehiclesService, deleteVehicleService } from "../../../../services/userService";
import TablePaginationActions from "../../../../components/TablePaginationActions";
import "../style.scss";

import Loading from "../../../../components/Loading";

const ModalAdd = lazy(() => import("./ModalAdd"));
const ModalEdit = lazy(() => import("./ModalEdit"));

class ListVehicles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenModel: false,
            isOpenModelEdit: false,
            ListVehicles: [],
            ListVehiclesALL: [],
            sortBy: "",
            sortField: "",
            page: 0,
            rowsPerPage: 5,
            userEdit: {},
            isTest: false,
            test: [],
            test1: [],
        };
    }

    async componentDidMount() {
        await this.getAllVehicles();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.ListVehiclesALL !== this.state.ListVehiclesALL) {
            let test = this.state.ListVehiclesALL.filter(
                (item) => item.busOwnerId && item.busOwnerId === this.props.userInfo.id
            );
            this.setState({
                ListVehicles: test,
            });
        }
    }
    getAllVehicles = async () => {
        let res = await getAllVehiclesService("ALL");
        if (res && res.errCode === 0) {
            this.setState({
                ListVehiclesALL: res.vehicles,
            });
        }
    };

    toggleModel = () => {
        this.setState({
            isOpenModel: !this.state.isOpenModel,
        });
    };
    toggleUserEditModel = () => {
        this.setState({
            isOpenModelEditUser: !this.state.isOpenModelEditUser,
        });
    };
    handleAddVehicle = () => {
        this.setState({
            isOpenModel: true,
        });
    };

    handleDeleteVehicle = async (user) => {
        let { language } = this.props;
        let res = await deleteVehicleService(user.id);
        if (res && res.errCode === 0) {
            if (language === LANGUAGES.VI) {
                toast.success("Xóa phương tiện ra khỏi hệ thống thành công");
            } else {
                toast.success("Remove the vehicle from the system successfully");
            }
            await this.getAllVehicles();
        }
    };
    handleEditUser = (user) => {
        this.setState({
            isOpenModelEditUser: true,
            userEdit: user,
        });
    };
    doEditUser = async (user) => {
        await this.getAllVehicles();
        this.setState({
            isOpenModelEditUser: false,
        });
    };
    createVehicle = async (data) => {
        await this.getAllVehicles();
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
        let clone = this.state.ListVehicles;
        clone = _.orderBy(clone, [b], [a]);
        this.setState({
            sortBy: a,
            sortField: b,
            ListVehicles: clone,
        });
    };

    handleKeyword = (e) => {
        let term = e.target.value.toUpperCase();
        let clone = this.state.ListVehicles;
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
            this.getAllVehicles();
        }
    };
    render() {
        let {
            page,
            rowsPerPage,
            ListVehicles,
            test,
            test1,
            isTest,
            isOpenModelEditUser,
            isOpenModel,
        } = this.state;
        isTest === true ? (test = test1) : (test = ListVehicles);
        let { language } = this.props;
        let mes1, mes2, mes, mes3, mes4;
        if (language === "vi") {
            mes1 = "Trong bến";
            mes2 = "Đang chạy";
            mes = "Tìm xe";
            mes3 = "Sửa thông tin";
            mes4 = "Xóa";
        } else {
            mes1 = "In the depot";
            mes2 = "Running...";
            mes = "Search vehicles";
            mes3 = "Edit";
            mes4 = "Delete";
        }
        return (
            <div className="container form-redux">
                <div className="user-container">
                    <Suspense fallback={<Loading />}>
                        <ModalAdd
                            ListVehicles={ListVehicles}
                            isOpen={isOpenModel}
                            toggleFromParent={this.toggleModel}
                            createVehicle={this.createVehicle}
                        />
                        {isOpenModelEditUser && (
                            <ModalEdit
                                isOpen={isOpenModelEditUser}
                                toggleFromParent={this.toggleUserEditModel}
                                currentUser={this.state.userEdit}
                                doEditUser={this.doEditUser}
                            />
                        )}
                    </Suspense>

                    <div className="title text-center">
                        <FormattedMessage id="menu.busOwner.vehicle.title" />
                    </div>
                    <div className="chart_title">
                        <div className="chart_item-left">
                            <div className="mx-5 my-3">
                                <button
                                    className="btn btn-primary px-3 w130"
                                    onClick={() => this.handleAddVehicle()}>
                                    <i className="fas fa-plus px-1 "></i>
                                    <FormattedMessage id="menu.admin.listBusType.add" />
                                </button>
                            </div>
                        </div>
                        <div className="chart_item">
                            <input
                                placeholder={mes}
                                className="form-control"
                                style={{ width: "280px", height: "38px" }}
                                onChange={(e) => this.handleKeyword(e)}
                            />
                        </div>
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
                                            onClick={() => this.handleSort("asc", "id")}>
                                            Id
                                        </th>
                                        <th
                                            style={{
                                                width: "20%",
                                            }}>
                                            <div className="section-title">
                                                <FormattedMessage id="menu.busOwner.vehicle.bsx" />
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
                                            <FormattedMessage id="menu.admin.listLocations.action" />{" "}
                                        </th>
                                        <th
                                            style={{
                                                width: "10%",
                                            }}
                                            className="section-id-list">
                                            <FormattedMessage id="menu.busOwner.vehicle.img" />
                                        </th>
                                        <th></th>
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
                                                        <div className="vehicle-run">{mes2}</div>
                                                    ) : (
                                                        <div className="vehicle-not-run">
                                                            {mes1}
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
                                                <td className="center">
                                                    <button
                                                        className="btn-edit"
                                                        title={mes3}
                                                        onClick={() => this.handleEditUser(item)}>
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button
                                                        className="btn-delete"
                                                        title={mes4}
                                                        onClick={() =>
                                                            this.handleDeleteVehicle(item)
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
                                            count={ListVehicles.length}
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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ListVehicles);
