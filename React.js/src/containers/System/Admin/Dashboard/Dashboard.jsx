import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import "./Dashboard.scss";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import CommuteIcon from "@mui/icons-material/Commute";
import * as actions from "../../../../store/actions";
import DashboardComponent from "./DashboardComponent";
import TableDriver from "./TableDriver";
import { getTripsFromBusCompany } from "../../../../services/userService";

import EmojiTransportationIcon from "@mui/icons-material/EmojiTransportation";
class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            counterUser: 0,
            lengthUser: 0,
            arrDrivers: [],
            arrBusCompany: [],
        };
    }
    async componentDidMount() {
        this.props.fetchAllLocation();
        this.props.fetchAllVehicle();
        this.props.fetchUserRedux();
        this.props.fetchAllPassenger();
        await this.getTicket();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listUsers !== this.props.listUsers) {
            let busOner = this.props.listUsers.filter((item) => item.roleID === "R2");
            this.setState({ arrBusCompany: busOner });
        }
    }
    getTicket = async () => {
        let res = await getTripsFromBusCompany("ALL");
        this.setState({
            arrDrivers: res.trips,
        });
    };
    render() {
        let locations = this.props.listLocations;
        let vehicles = this.props.listVehicle;
        let users = this.props.listUsers;
        let passengers = this.props.passengers;
        let listBusOwner;
        users && users.length && (listBusOwner = users.filter((item) => item.roleID === "R2"));
        let { language } = this.props;
        return (
            <React.Fragment>
                <div className="container-dashboard">
                    <div className="container form-redux">
                        <div>
                            <div className="titleD text-center">
                                <FormattedMessage id="menu.busOwner.dashboard" />
                            </div>
                            <Row>
                                <Col md={3}>
                                    <div className="card">
                                        <div className="card-content_1 ">
                                            <div>
                                                <div className="icon-wrapper">
                                                    <i className="fas fa-users"></i>
                                                </div>
                                                {users && passengers && (
                                                    <h3>{users.length + passengers.length}</h3>
                                                )}
                                                <h3>
                                                    {" "}
                                                    <FormattedMessage id="menu.admin.dashboards.users" />
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="card">
                                        <div className="card-content_2 ">
                                            <div>
                                                <div className="icon-wrapper">
                                                    <i className="fas fa-map-marked"></i>
                                                    <FmdGoodIcon
                                                        sx={{
                                                            fontSize: "45px",
                                                        }}
                                                    />{" "}
                                                </div>{" "}
                                                {locations && locations.length > 0 && (
                                                    <h3>{locations.length}</h3>
                                                )}
                                                <h3>
                                                    {" "}
                                                    <FormattedMessage id="menu.admin.dashboards.stations" />
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="card">
                                        <div className="card-content_3 text-white">
                                            <div>
                                                <div className="icon-wrapper">
                                                    <EmojiTransportationIcon
                                                        sx={{
                                                            fontSize: "50px",
                                                        }}
                                                    />
                                                </div>
                                                {listBusOwner && listBusOwner.length > 0 && (
                                                    <h3>{listBusOwner.length}</h3>
                                                )}
                                                <h3>
                                                    {" "}
                                                    <FormattedMessage id="menu.admin.dashboards.busCompany" />
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col md={3}>
                                    <div className="card">
                                        <div className="card-content_4 text-white">
                                            <div>
                                                <div className="icon-wrapper">
                                                    <CommuteIcon
                                                        sx={{
                                                            fontSize: "50px",
                                                        }}
                                                    />
                                                </div>{" "}
                                                {vehicles && vehicles.length > 0 && (
                                                    <h3>{vehicles.length}</h3>
                                                )}
                                                <h3>
                                                    {" "}
                                                    <FormattedMessage id="menu.admin.dashboards.vehicle" />
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                {" "}
                                <DashboardComponent language={language} />{" "}
                            </Row>
                            <Row style={{ height: "50px" }}> </Row>

                            <Row>
                                <Col md={6}>
                                    <TableDriver
                                        arrBusCompany={this.state.arrBusCompany}
                                        arrDrivers={this.state.arrDrivers}
                                        language={language}
                                    />
                                </Col>
                            </Row>
                            <Row style={{ height: "250px" }}> </Row>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        listLocations: state.admin.locations,
        listVehicle: state.admin.vehicles,
        listUsers: state.admin.users,
        passengers: state.admin.passengers,
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllLocation: () => dispatch(actions.fetchAllLocation()),
        fetchAllVehicle: () => dispatch(actions.fetchAllVehicle()),
        fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
        fetchAllPassenger: () => dispatch(actions.fetchAllPassenger()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
