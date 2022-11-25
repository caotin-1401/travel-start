import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";
import { ConnectedRouter as Router } from "connected-react-router";
import { history } from "../redux";
import { ToastContainer } from "react-toastify";
import {
    userIsAuthenticated,
    userIsNotAuthenticated,
} from "../hoc/authentication";
import { path } from "../utils";
import BusRoute from "./Passenger/Route/Route";
import Home from "../routes/Home";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import Header from "./Header/Header";
import System from "../routes/system";
import HomePage from "./HomePage/HomePage";
import AdapterJalaali from "@date-io/jalaali";
import CustomScrollbars from "../components/CustomScrollbars";
import BusOnwer from "../routes/BusOwner";
import Driver from "../routes/Driver";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import VerifyEmail from "./Passenger/VerifyEmail";
import AllEvents from "./Passenger/Events/AllEvents";
import DetailEvent from "./Passenger/Events/DetailEvent";
import Profile from "./Passenger/Profile/Profile";
import ProfileAdmin from "../containers/System/Admin/Profile/Profile";
import ProfileBusOwner from "../containers/System/BusOwner/Profile/Profile";
import ProfileDriver from "../containers/System/Driver/Profile/Profile";
class App extends Component {
    handlePersistorState = () => {
        const { persistor } = this.props;
        let { bootstrapped } = persistor.getState();
        if (bootstrapped) {
            if (this.props.onBeforeLift) {
                Promise.resolve(this.props.onBeforeLift())
                    .then(() => this.setState({ bootstrapped: true }))
                    .catch(() => this.setState({ bootstrapped: true }));
            } else {
                this.setState({ bootstrapped: true });
            }
        }
    };

    componentDidMount() {
        this.handlePersistorState();
    }
    render() {
        return (
            <Fragment>
                <Router history={history}>
                    <LocalizationProvider dateAdapter={AdapterJalaali}>
                        <div className="main-container">
                            <div className="content-container">
                                <CustomScrollbars
                                    style={{ height: "100vh", with: "100%" }}>
                                    <Switch>
                                        <Route
                                            path={path.HOME}
                                            exact
                                            component={Home}
                                        />
                                        <Route
                                            path={path.LOGIN}
                                            component={userIsNotAuthenticated(
                                                Login
                                            )}
                                        />
                                        <Route
                                            path={path.REGISTER}
                                            component={userIsNotAuthenticated(
                                                Register
                                            )}
                                        />
                                        <Route
                                            path={path.HOMEPAGE}
                                            exact
                                            component={HomePage}
                                        />
                                        <Route
                                            path={path.SYSTEM}
                                            component={userIsAuthenticated(
                                                System
                                            )}
                                        />
                                        <Route
                                            path={path.BUSOWNER}
                                            component={userIsAuthenticated(
                                                BusOnwer
                                            )}
                                        />
                                        <Route
                                            path={path.DRIVER}
                                            component={userIsAuthenticated(
                                                Driver
                                            )}
                                        />
                                        <Route
                                            path={path.ROUTE}
                                            component={userIsAuthenticated(
                                                BusRoute
                                            )}
                                        />
                                        <Route
                                            path={path.VERIFY_EMAIL}
                                            component={VerifyEmail}
                                        />
                                        <Route
                                            path={path.EVENTS}
                                            component={AllEvents}
                                        />
                                        <Route
                                            path={path.EVENT}
                                            component={DetailEvent}
                                        />{" "}
                                        <Route
                                            path={path.PROFILE_ADMIN}
                                            component={userIsAuthenticated(
                                                ProfileAdmin
                                            )}
                                        />
                                        <Route
                                            path={path.PROFILE_BUS}
                                            component={userIsAuthenticated(
                                                ProfileBusOwner
                                            )}
                                        />
                                        <Route
                                            path={path.PROFILE_DRIVER}
                                            component={userIsAuthenticated(
                                                ProfileDriver
                                            )}
                                        />
                                        <Route
                                            path={path.PROFILE}
                                            component={userIsAuthenticated(
                                                Profile
                                            )}
                                        />
                                    </Switch>
                                </CustomScrollbars>
                            </div>
                            <ToastContainer
                                position="top-right"
                                autoClose={5000}
                                hideProgressBar={false}
                                newestOnTop={false}
                                closeOnClick
                                rtl={false}
                                pauseOnFocusLoss
                                draggable
                                pauseOnHover
                            />
                        </div>
                    </LocalizationProvider>
                </Router>
            </Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        started: state.app.started,
        isLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
