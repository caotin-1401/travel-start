import React, { Component, Suspense, lazy } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import "../style.scss";
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
import { toast } from "react-toastify";
import { getAllBlogsService, deleteBlogsService } from "../../../../services/userService";
import TablePaginationActions from "../../../../components/TablePaginationActions";
import { SkeletonEvent } from "../SkeletonComponent";
import Loading from "../../../../components/Loading";

const ModalAdd = lazy(() => import("./ModalAdd"));
const ModalEdit = lazy(() => import("./ModalEdit"));

class TableBlog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpenModel: false,
            isOpenModelEditUser: false,
            userEdit: {},
            listBlogs: [],
            page: 0,
            rowsPerPage: 5,
            loading: false,
        };
    }

    async componentDidMount() {
        await this.getAllBlogs();
    }

    getAllBlogs = async () => {
        let res = await getAllBlogsService("ALL");
        if (res && res.errCode === 0) {
            setTimeout(() => {
                this.setState({
                    loading: true,
                });
            }, 50);
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

    render() {
        let { page, rowsPerPage, listBlogs, loading } = this.state;
        let { language } = this.props;
        return (
            <div className="container form-redux">
                <div className="user-container">
                    <Suspense fallback={<Loading />}>
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
                    </Suspense>

                    <div className="title text-center">
                        <FormattedMessage id="menu.admin.listBlog.title" />
                    </div>
                    <div className="mx-5 my-3">
                        <button
                            className="btn btn-primary px-3"
                            style={{ width: "150px" }}
                            onClick={() => this.handleAddUser()}>
                            <i className="fas fa-plus px-1"></i>
                            <FormattedMessage id="menu.admin.listBlog.title3" />
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
                                            }}>
                                            Id
                                        </th>
                                        <th
                                            style={{
                                                width: "35%",
                                            }}>
                                            <div className="section-title">
                                                <FormattedMessage id="menu.admin.listBlog.name" />
                                            </div>
                                        </th>

                                        <th
                                            style={{
                                                width: "25%",
                                            }}>
                                            <div className="section-title">
                                                <FormattedMessage id="menu.admin.listBlog.timeCreated" />
                                            </div>
                                        </th>

                                        <th
                                            style={{
                                                width: "25%",
                                            }}>
                                            <div className="section-title">
                                                <FormattedMessage id="menu.admin.listBlog.personCreated" />
                                            </div>
                                        </th>

                                        <th style={{ width: "10%" }}></th>
                                    </tr>
                                    {loading === false && <SkeletonEvent />}

                                    {loading === true &&
                                        (rowsPerPage > 0 && listBlogs && listBlogs.length > 0
                                            ? listBlogs.slice(
                                                  page * rowsPerPage,
                                                  page * rowsPerPage + rowsPerPage
                                              )
                                            : listBlogs
                                        ).map((user, index) => {
                                            let start;
                                            if (language === "vi") {
                                                start = moment(user.createdAt).format(
                                                    "ddd DD/MM/YYYY HH:mm"
                                                );
                                            } else {
                                                start = `${moment(user.createdAt)
                                                    .locale("en")
                                                    .format("ddd MM/DD/YYYY")} ${" "} ${moment(
                                                    user.createdAt
                                                )
                                                    .locale("en")
                                                    .format("LT")}`;
                                            }

                                            return (
                                                <tr key={index}>
                                                    <td className="center">{user.id}</td>

                                                    <td>{user.description}</td>
                                                    <td>{start}</td>
                                                    <td>{user.author}</td>
                                                    <td className="center">
                                                        <button
                                                            className="btn-edit"
                                                            onClick={() =>
                                                                this.handleEditUser(user)
                                                            }>
                                                            <i className="fas fa-edit"></i>
                                                        </button>
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
                                            colSpan={5}
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
