import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import _ from "lodash";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import * as actions from "../../../../store/actions";
import { LANGUAGES } from "../../../../utils";
import { getAllDrivers } from "../../../../services/userService";
import { withRouter } from "react-router";
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
class ListDriver extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],
            listDrivers: [],
            sortBy: "",
            sortField: "",
            keywordNumber: "",
            page: 0,
            rowsPerPage: 5,
            id: "",
        };
    }

    async componentDidMount() {
        await this.allDriver();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.listDrivers !== this.state.listDrivers) {
            let { listDrivers } = this.state;
            if (this.props.match && this.props.match.params && this.props.match.params.id) {
                let driverId = this.props.match.params.id;
                let test = [];
                console.log("listDrivers >>:", listDrivers);
                listDrivers &&
                    listDrivers.length > 0 &&
                    (test = listDrivers.filter(
                        (item) => item.busOwnerId && item.busOwnerId == driverId
                    ));
                this.setState({ arrUsers: test });
            }
        }
    }
    allDriver = async () => {
        let res = await getAllDrivers("ALL");
        res &&
            res.users &&
            res.users.length > 0 &&
            this.setState({
                listDrivers: res.users,
            });
    };
    handleDeleteUser = (user) => {
        this.props.deleteUser(user.id);
    };

    handleSort = (a, b) => {
        this.state.arrUsers = _.orderBy(this.state.arrUsers, [b], [a]);
        this.setState({
            sortBy: a,
            sortField: b,
            arrUsers: this.state.arrUsers,
        });
    };
    handleKeyword = (e) => {
        let term = e.target.value;
        let clone = this.state.arrUsers;
        if (term) {
            clone = clone.filter((item) => item.name.includes(term));
            console.log(clone);
            this.setState({
                arrUsers: clone,
            });
        } else {
            this.props.fetchUserRedux();
        }
    };
    handleKeyword1 = (e) => {
        console.log(e);
        let term = e.target.value;
        let clone = this.state.arrUsers;
        if (term) {
            clone = clone.filter((item) => item.email.includes(term));
            this.setState({
                arrUsers: clone,
            });
        } else {
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
        let { page, rowsPerPage, arrUsers } = this.state;
        console.log(arrUsers);
        let { language } = this.props;
        let title;
        if (arrUsers.length > 0) {
            if (language === LANGUAGES.VI) {
                title = `Danh sách tài xế của ${arrUsers[0].busOwner}`;
            } else {
                title = `List of drivers of ${arrUsers[0].busOwner}`;
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
                                                    {" "}
                                                    <FormattedMessage id="menu.admin.listDriver.name" />
                                                </div>
                                                <div>
                                                    <FaLongArrowAltDown
                                                        className="iconSortDown"
                                                        onClick={() =>
                                                            this.handleSort("asc", "name")
                                                        }
                                                    />
                                                    <FaLongArrowAltUp
                                                        className="iconSortDown"
                                                        onClick={() =>
                                                            this.handleSort("desc", "name")
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
                                                <div> email </div>
                                                <div>
                                                    <FaLongArrowAltDown
                                                        className="iconSortDown"
                                                        onClick={() =>
                                                            this.handleSort("asc", "email")
                                                        }
                                                    />
                                                    <FaLongArrowAltUp
                                                        className="iconSortDown"
                                                        onClick={() =>
                                                            this.handleSort("desc", "email")
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </th>
                                        <th
                                            style={{
                                                width: "35%",
                                            }}>
                                            <FormattedMessage id="menu.admin.listDriver.phone" />
                                        </th>
                                        <th
                                            style={{
                                                width: "10%",
                                            }}
                                            className="section-id-list">
                                            <FormattedMessage id="menu.admin.listDriver.status" />
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
                                    </tr>
                                    {arrUsers &&
                                        arrUsers.map((user, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{user.id}</td>
                                                    <td>{user.name}</td>
                                                    <td>{user.User.email}</td>
                                                    <td>{user.User.phoneNumber}</td>
                                                    <td
                                                        className="center"
                                                        style={{
                                                            textAlign: "center",
                                                        }}>
                                                        {user.status === 2 ? (
                                                            <div className="driver-run">
                                                                Đang chạy
                                                            </div>
                                                        ) : (
                                                            <div className="driver-not-run">
                                                                Không chạy
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="center">
                                                        <button
                                                            className="btn-delete"
                                                            onClick={() =>
                                                                this.handleDeleteUser(user)
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
                                            colSpan={6}
                                            count={arrUsers.length}
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
        language: state.app.language,
        listUsers: state.admin.users,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
        deleteUser: (id) => dispatch(actions.deleteUser(id)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListDriver));
