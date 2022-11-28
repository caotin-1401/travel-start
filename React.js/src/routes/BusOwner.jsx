import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import Header from "../containers/Header/Header";

import Dashboard from "./../containers/System/BusOwner/Dashboard";
import ListVehicle from "./../containers/System/BusOwner/ListVehicle/ListVehicle";
import UserManage from "./../containers/System/BusOwner/DriverManage/UserManage";
import EventManage from "./../containers/System/BusOwner/EventManage";
import ParkingLot from "./../containers/System/BusOwner/ParkingLot";
import RouteManage from "./../containers/System/BusOwner/RouteManage/RouteManage";
import TableCustomer from "./../containers/System/BusOwner/ListCustomer/TableCustomer";
class BusOnwer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            link: "",
        };
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.systemMenuPath !== this.props.systemMenuPath) {
            this.setState({
                link: this.props.systemMenuPath,
            });
        }
    }
    render() {
        const { isLoggedIn } = this.props;
        return (
            <React.Fragment>
                {this.props.isLoggedIn && <Header />}
                <div className="system-container">
                    <div className="system-list">
                        <Switch>
                            <Route
                                path="/busOwner/dashboard"
                                component={Dashboard}
                            />
                            <Route
                                path="/busOwner/bus-manage"
                                component={ListVehicle}
                            />
                            <Route
                                path="/busOwner/driver-manage"
                                component={UserManage}
                            />
                            <Route
                                path="/busOwner/event-manage"
                                component={EventManage}
                            />
                            <Route
                                path="/busOwner/parking-lot"
                                component={ParkingLot}
                            />
                            <Route
                                path="/busOwner/manage-routes"
                                component={RouteManage}
                            />{" "}
                            <Route
                                path="/busOwner/manage-tickets"
                                component={TableCustomer}
                            />
                            <Route
                                component={() => {
                                    return <Redirect to={this.state.link} />;
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

export default connect(mapStateToProps, mapDispatchToProps)(BusOnwer);
