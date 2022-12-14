import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "./BusType.scss";
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
    getAllBusTypesService,
    deleteBusTypeService,
} from "../../../../services/userService";
import TablePaginationActions from "../../../../components/TablePaginationActions";

class BusType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenModel: false,
            listBusType: [],
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
        await this.getAllBusType();
    }

    getAllBusType = async () => {
        let res = await getAllBusTypesService("ALL");
        if (res && res.errCode === 0) {
            this.setState({
                listBusType: res.busTypes,
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
        let res = await deleteBusTypeService(user.id);
        if (res && res.errCode === 0) {
            if (language === LANGUAGES.VI) {
                toast.success("Xóa thành công");
            } else {
                toast.success("Delete successful");
            }
            await this.getAllBusType();
        }
    };

    createLocation = async (data) => {
        await this.getAllBusType();
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
        this.state.listBusType = _.orderBy(this.state.listBusType, [b], [a]);
        this.setState({
            sortBy: a,
            sortField: b,
            listBusType: this.state.listBusType,
        });
    };
    handleKeyword = (e) => {
        let term = e.target.value.toUpperCase();
        let clone = this.state.listBusType;

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
            this.getAllBusType();
        }
    };

    render() {
        let { page, rowsPerPage, listBusType, test, test1, isTest } =
            this.state;
        isTest === true ? (test = test1) : (test = listBusType);
        return (
            <div className="container form-redux">
                <div className="user-container">
                    <ModalAdd
                        listBusType={listBusType}
                        isOpen={this.state.isOpenModel}
                        toggleFromParent={this.toggleModel}
                        createLocation={this.createLocation}
                    />

                    <div className="title text-center">
                        <FormattedMessage id="menu.admin.listBusType.title" />
                    </div>
                    <div className="mx-5 my-3">
                        <button
                            className="btn btn-primary px-3 w130"
                            onClick={() => this.handleAddLocation()}>
                            <i className="fas fa-plus px-1 "></i>
                            <FormattedMessage id="menu.admin.listBusType.add" />
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
                                                width: "10%",
                                            }}
                                            onClick={() =>
                                                this.handleSort("asc", "id")
                                            }>
                                            Id
                                        </th>
                                        <th
                                            style={{
                                                width: "45%",
                                            }}>
                                            <div className="section-title">
                                                <div>
                                                    <FormattedMessage id="menu.admin.listBusType.name" />
                                                </div>
                                            </div>
                                        </th>
                                        <th
                                            style={{
                                                width: "30%",
                                            }}>
                                            <div className="section-title">
                                                <div>
                                                    <FormattedMessage id="menu.admin.listBusType.num" />
                                                </div>
                                                <div>
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
                                            }}
                                            className="section-id-list">
                                            <FormattedMessage id="menu.admin.listBusType.action" />
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

                                                <td>{user.typeName}</td>
                                                <td>{user.numOfSeat}</td>
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
                                            count={listBusType.length}
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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(BusType);