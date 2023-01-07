import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import _ from "lodash";
import { TableBody, TableContainer, Paper, Table } from "@mui/material";
import { getAllVehicleFromStation } from "../../../../services/userService";
import { withRouter } from "react-router";

class TableStation1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listLocations: [],
        };
    }

    async componentDidMount() {
        await this.getAllLocations();
    }

    getAllLocations = async () => {
        let res = await getAllVehicleFromStation("ALL");
        if (res && res.errCode === 0) {
            this.setState({
                listLocations: res.vehicles,
            });
        }
    };
    handleVehicle = (item) => {
        console.log(item);
        if (this.props.history) {
            this.props.history.push(`/system/stationId=${item.id}`);
        }
    };

    render() {
        let { listLocations } = this.state;
        listLocations = _.sortBy(listLocations, ["id"]);
        return (
            <div className="container form-redux">
                <div className="user-container">
                    <div style={{ marginTop: "30px" }}></div>
                    <div className="title text-center">
                        <FormattedMessage id="menu.admin.listLocations.title" />
                    </div>
                    <div style={{ marginTop: "30px" }}></div>
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
                                        <th className="w30">
                                            <FormattedMessage id="menu.admin.listLocations.name" />
                                        </th>

                                        <th className="w35">
                                            <FormattedMessage id="menu.admin.listLocations.count" />
                                        </th>

                                        <th className="section-id-list w30">
                                            <FormattedMessage id="menu.admin.listLocations.list" />
                                        </th>
                                    </tr>

                                    {listLocations &&
                                        listLocations.length > 0 &&
                                        listLocations.map((user, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td className="center">{user.id}</td>
                                                    <td>{user.name}</td>
                                                    <td>{user.tovehicle.length}</td>
                                                    <td className="center">
                                                        <button
                                                            className="btn btn-info w170"
                                                            onClick={() =>
                                                                this.handleVehicle(user)
                                                            }>
                                                            <FormattedMessage id="menu.admin.listLocations.list" />
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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(TableStation1));
