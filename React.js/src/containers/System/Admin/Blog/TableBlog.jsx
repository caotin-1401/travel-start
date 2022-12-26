import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "../style.scss";
import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import _ from "lodash";
import moment from "moment";
import localization from "moment/locale/vi";
import * as actions from "../../../../store/actions";
import { LANGUAGES } from "../../../../utils";
import ModalAdd from "./ModalAdd";
import { TableBody, TableContainer, TableFooter, TablePagination, TableRow, Paper, Table } from "@mui/material";
import { toast } from "react-toastify";
import { getAllBlogsService, deleteBlogsService } from "../../../../services/userService";
import ModalEdit from "./ModalEdit";

import TablePaginationActions from "../../../../components/TablePaginationActions";
class TableBlog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenModel: false,
            isOpenModelEditUser: false,
            userEdit: {},
            listBlogs: [],
            sortBy: "",
            sortField: "",
            keywordNumber: "",
            page: 0,
            rowsPerPage: 5,
        };
    }

    async componentDidMount() {
        await this.getAllBlogs();
    }

    getAllBlogs = async () => {
        let res = await getAllBlogsService("ALL");
        if (res && res.errCode === 0) {
            this.setState({
                listBlogs: res.blogs,
            });
        }
    };
    //open modal
    toggleUserModel = () => {
        this.setState({
            isOpenModel: !this.state.isOpenModel,
        });
    };
    toggleUserEditModel = () => {
        this.setState({
            isOpenModelEditUser: !this.state.isOpenModelEditUser,
        });
    };
    handleAddUser = () => {
        this.setState({
            isOpenModel: true,
        });
    };
    handleEditUser = (user) => {
        console.log(user);
        this.setState({
            isOpenModelEditUser: true,
            userEdit: user,
        });
    };

    handleDeleteUser = async (user) => {
        let res = await deleteBlogsService(user.id);
        if (res && res.errCode === 0) {
            toast.success("xoa su kien thanh cong");
            await this.getAllBlogs();
        }
    };

    doEditUser = async (user) => {
        await this.getAllBlogs();
        this.setState({
            isOpenModelEditUser: false,
        });
    };
    createNewUser1 = async (data) => {
        await this.getAllBlogs();
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
        this.state.listBlogs = _.orderBy(this.state.listBlogs, [b], [a]);
        this.setState({
            sortBy: a,
            sortField: b,
            listBlogs: this.state.listBlogs,
        });
    };
    handleKeyword = (e) => {
        let term = e.target.value.toUpperCase();
        let clone = this.state.listBlogs;
        if (term) {
            clone = clone.filter((item) => item.number.includes(term));
            this.setState({
                listBlogs: clone,
            });
        } else {
            this.props.fetchAllVehicle();
        }
    };
    handleKeyword1 = (e) => {
        let term = e.target.value.toUpperCase();
        let clone = this.state.listBlogs;
        if (term) {
            clone = clone.filter((item) => item.BusType.typeName.includes(term));
            this.setState({
                listBlogs: clone,
            });
        } else {
            this.props.fetchAllVehicle();
        }
    };
    render() {
        let { page, rowsPerPage, listBlogs } = this.state;
        // listBlogs.reverse();
        return (
            <div className="container form-redux">
                <div className="user-container">
                    <ModalAdd
                        listBlogs={listBlogs}
                        isOpen={this.state.isOpenModel}
                        toggleFromParent={this.toggleUserModel}
                        createNewUser1={this.createNewUser1}
                    />
                    {this.state.isOpenModelEditUser && (
                        <ModalEdit
                            isOpen={this.state.isOpenModelEditUser}
                            toggleFromParent={this.toggleUserEditModel}
                            currentUser={this.state.userEdit}
                            doEditUser={this.doEditUser}
                        />
                    )}
                    <div className="title text-center">Quan ly su kien</div>
                    <div className="mx-5 my-3">
                        <button className="btn btn-primary px-3" onClick={() => this.handleAddUser()}>
                            <i className="fas fa-plus px-1"></i>
                            Them su kien
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
                                                width: "5%",
                                            }}
                                            onClick={() => this.handleSort("asc", "id")}>
                                            Id
                                        </th>
                                        <th
                                            style={{
                                                width: "34%",
                                            }}>
                                            <div className="section-title">
                                                <div> Tên sự kiện</div>
                                                <div>
                                                    {" "}
                                                    <FaLongArrowAltDown
                                                        className="iconSortDown"
                                                        onClick={() => this.handleSort("asc", "name")}
                                                    />
                                                    <FaLongArrowAltUp
                                                        className="iconSortDown"
                                                        onClick={() => this.handleSort("desc", "name")}
                                                    />
                                                </div>
                                            </div>
                                        </th>

                                        <th>
                                            <div className="section-title">Thời gian tạo bài viết</div>
                                        </th>

                                        <th>
                                            <div className="section-title">Người tạo bài viết</div>
                                        </th>

                                        <th style={{ width: "10%" }}>Hành động</th>
                                    </tr>

                                    {(rowsPerPage > 0 && listBlogs && listBlogs.length > 0
                                        ? listBlogs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        : listBlogs
                                    ).map((user, index) => {
                                        let start = moment(user.createdAt).format("ddd DD-MM-YYYY HH:mm:ss");
                                        return (
                                            <tr key={index}>
                                                <td>{user.id}</td>

                                                <td>{user.description}</td>
                                                <td>{start}</td>
                                                <td>{user.author}</td>
                                                <td>
                                                    <button
                                                        className="btn-edit"
                                                        onClick={() => this.handleEditUser(user)}>
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button
                                                        className="btn-delete"
                                                        onClick={() => this.handleDeleteUser(user)}>
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
                                            rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                                            colSpan={4}
                                            count={listBlogs.length}
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

export default connect(mapStateToProps, mapDispatchToProps)(TableBlog);
