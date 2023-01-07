import React, { Component, Suspense, lazy } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import _ from "lodash";
import { LANGUAGES } from "../../../../utils";
import { TableBody, TableContainer, Paper, Table } from "@mui/material";
import { toast } from "react-toastify";
import { getAllBusTypesService, deleteBusTypeService } from "../../../../services/userService";

import Loading from "../../../../components/Loading";
const ModalAdd = lazy(() => import("./ModalAdd"));

class BusType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenModel: false,
            listBusType: [],
            sortBy: "",
            sortField: "",

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

    handleOpenModelAdd = () => {
        this.setState({
            isOpenModel: true,
        });
    };

    handleDelete = async (user) => {
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

    handleSort = (a, b) => {
        let clone = this.state.listBusType;
        clone = _.orderBy(clone, [b], [a]);
        this.setState({
            sortBy: a,
            sortField: b,
            listBusType: clone,
        });
    };

    render() {
        let { listBusType, test, test1, isTest } = this.state;
        isTest === true ? (test = test1) : (test = listBusType);
        return (
            <div className="container form-redux">
                <div className="user-container">
                    <Suspense fallback={<Loading />}>
                        <ModalAdd
                            listBusType={listBusType}
                            isOpen={this.state.isOpenModel}
                            toggleFromParent={this.toggleModel}
                            createLocation={this.createLocation}
                        />
                    </Suspense>

                    <div className="title text-center">
                        <FormattedMessage id="menu.admin.listBusType.title" />
                    </div>
                    <div className="mx-5 my-3">
                        <button
                            className="btn btn-primary px-3 w130"
                            onClick={() => this.handleOpenModelAdd()}>
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
                                            onClick={() => this.handleSort("asc", "id")}>
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
                                                            this.handleSort("asc", "numOfSeat")
                                                        }
                                                    />
                                                    <FaLongArrowAltUp
                                                        className="iconSortDown"
                                                        onClick={() =>
                                                            this.handleSort("desc", "numOfSeat")
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </th>
                                        <th
                                            style={{
                                                width: "15%",
                                            }}
                                            className="section-id-list"></th>
                                    </tr>

                                    {test &&
                                        test.length > 0 &&
                                        test.map((user, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td className="center">{user.id}</td>
                                                    <td>{user.typeName}</td>
                                                    <td>{user.numOfSeat}</td>
                                                    <td className="center">
                                                        <button
                                                            className="btn-delete"
                                                            onClick={() => this.handleDelete(user)}>
                                                            <i className="fas fa-trash-alt"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </TableBody>
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
