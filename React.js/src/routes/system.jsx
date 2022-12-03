import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import UserRedux from "../containers/System/Admin/UserRedux";
import ListBusType from "../containers/System/Admin/BusType/BusType";
import Header from "../containers/Header/Header";
import UserManage from "../containers/System/Admin/ManageUser/UserManage";
import ListLocation from "../containers/System/Admin/ListLocation/ListLocation";
import ListRoute from "../containers/System/Admin/ListRoute/ListRoute";
import ListVehicle from "../containers/System/Admin/ListVehicle/ListVehicle";
import TableEvent from "../containers/System/Admin/Event/TableEvent";
import TableDiscount from "../containers/System/Admin/Discount/TableDiscount";
import TableBlog from "../containers/System/Admin/Blog/TableBlog";
import Dashboard from "../containers/System/Admin/Dashboard/Dashboard";

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
                                path="/system/user-manage"
                                component={UserManage}
                            />
                            <Route
                                path="/system/admin-manage"
                                component={UserManage}
                            />
                            <Route
                                path="/system/busOnwer-manage"
                                component={UserRedux}
                            />
                            <Route
                                path="/system/driver-manage"
                                component={UserRedux}
                            />
                            <Route
                                path="/system/list-bus"
                                component={ListBusType}
                            />
                            <Route
                                path="/system/list-route"
                                component={ListRoute}
                            />
                            <Route
                                path="/system/list-location"
                                component={ListLocation}
                            />
                            <Route
                                path="/system/parking-lot"
                                component={UserRedux}
                            />
                            <Route
                                path="/system/list-vehicle"
                                component={ListVehicle}
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
