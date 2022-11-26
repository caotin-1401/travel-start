import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import Header from "../containers/Header/Header";
import TableCustomer from "./../containers/System/Driver/ListCustomer/TableCustomer";
import ParkingLot from "./../containers/System/BusOwner/ParkingLot";
class Driver extends Component {
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
        const { systemMenuPath, isLoggedIn } = this.props;
        return (
            <React.Fragment>
                {this.props.isLoggedIn && <Header />}
                <div className="system-container">
                    <div className="system-list">
                        <Switch>
                            <Route
                                path="/driver/manage-parking"
                                component={ParkingLot}
                            />
                            <Route
                                path="/driver/seatNo"
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

export default connect(mapStateToProps, mapDispatchToProps)(Driver);
