import React, { Component } from "react";

import { connect } from "react-redux";
import "../style.scss";
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
class TableStation1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listLocations: [],

            isTest: false,
            test: [],
            test1: [],
        };
    }

    componentDidMount() {
        console.log(this.props.listLocations);
        this.props.fetchAllLocation();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log(this.props.listLocations);
        if (prevProps.listLocations !== this.props.listLocations) {
            this.setState({
                listLocations: this.props.listLocations,
            });
        }
    }

    render() {
        let { listLocations, test, test1, isTest } = this.state;
        console.log(listLocations);
        return (
            <div className="user-redux-container">
                <div className="title">
                    <p style={{ marginBottom: "20px" }}>Quản lý</p>
                </div>
                <div className="container form-reux">
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
                                        <th>
                                            <div className="section-title">
                                                <div> Tên</div>
                                                <div>
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
                                        <th>Số điện thoại</th>
                                        <th
                                            className="section-id-list"
                                            style={{
                                                width: "15%",
                                            }}>
                                            Chỗ ngồi
                                        </th>
                                        <th className="section-id-list">
                                            Thanh toán
                                        </th>
                                    </tr>

                                    {listLocations &&
                                        listLocations.length > 0 &&
                                        listLocations.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td className="section-id-list">
                                                        {item.id}
                                                    </td>
                                                    <td>{item.name}</td>
                                                    <td>{item.phone}</td>
                                                    <td>{test}</td>
                                                    <td>{item.totalPrice}</td>
                                                </tr>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {/* </div> */}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userInfo: state.user.userInfo,
        listLocations: state.admin.locations,

        listLocations: state.admin.users,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllLocation: () => dispatch(actions.fetchAllLocation()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TableStation1);
