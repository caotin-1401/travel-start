import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import Header from "../containers/Header/Header";
import UserManage from "../containers/System/Admin/ManageUser/UserManage";
import TableEvent from "../containers/System/Admin/Event/TableEvent";
import TableDiscount from "../containers/System/Admin/Discount/TableDiscount";
import TableBlog from "../containers/System/Admin/Blog/TableBlog";
import Dashboard from "../containers/System/Admin/Dashboard/Dashboard";
import TableStation1 from "./../containers/System/Admin/Station/TableStation";
import TableStation from "./../containers/System/Admin/ListStation/TableStation";
import BusType from "./../containers/System/Admin/BusType/TableType";
import TableRoutes from "./../containers/System/Admin/ListRoute/TableRoutes";
import TablePassenger from "./../containers/System/Admin/ManagePassenger/TablePassenger";
import ManageOwner from "./../containers/System/Admin/manageOwner/UserManage";
import ListDriver from "./../containers/System/Admin/manageOwner/ListDriver";
import ListVehicleOfAdmin from "./../containers/System/Admin/manageOwner/ListVehicle";

class System extends Component {
    render() {
        const { systemMenuPath, isLoggedIn } = this.props;
        return (
            <React.Fragment>
                {this.props.isLoggedIn && <Header />}
                <div className="system-container">
                    <div className="system-list">
                        <Switch>
                            <Route
                                path="/system/dashboard"
                                component={Dashboard}
                            />

                            <Route
                                path="/system/admin-manage"
                                component={UserManage}
                            />
                            <Route
                                path="/system/busOnwer-manage"
                                component={ManageOwner}
                            />
                            <Route
                                path="/system/busOnwer/driver_busOnwer=:id"
                                component={ListDriver}
                            />
                            <Route
                                path="/system/busOnwer/vehicle_busOnwer=:id"
                                component={ListVehicleOfAdmin}
                            />
                            <Route
                                path="/system/passenger-manage"
                                component={TablePassenger}
                            />
                            <Route
                                path="/system/list-bus"
                                component={BusType}
                            />
                            <Route
                                path="/system/list-route"
                                component={TableRoutes}
                            />

                            <Route
                                path="/system/list-location"
                                component={TableStation}
                            />
                            <Route
                                path="/system/parking-lot"
                                component={TableStation1}
                            />

                            <Route
                                path="/system/event"
                                component={TableEvent}
                            />
                            <Route
                                path="/system/discount"
                                component={TableDiscount}
                            />
                            <Route path="/system/blog" component={TableBlog} />
                            <Route
                                component={() => {
                                    return <Redirect to={systemMenuPath} />;
                                }}
                            />
                        </Switch>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        systemMenuPath: state.app.systemMenuPath,
        isLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(System);
