import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import "./Dashboard.scss";
import FmdGoodIcon from "@mui/icons-material/FmdGood";
import CommuteIcon from "@mui/icons-material/Commute";
import * as actions from "../../../../store/actions";
import DashboardComponent from "./DashboardComponent";
class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            counterUser: 0,
            lengthUser: 0,
        };
    }
    componentDidMount() {
        this.props.fetchAllLocation();
        this.props.fetchAllVehicle();
        this.props.fetchUserRedux();
    }

    render() {
        let locations = this.props.listLocations;
        let vehicles = this.props.listVehicle;
        let users = this.props.listUsers;
        return (
            <>
                <div className="container form-redux">
                    <div>
                        <div className="title text-center">Dashboard</div>
                        <Row className="test_dashboard">
                            <Col md={4}>
                                <div className="card">
                                    <div className="card-content_1 ">
                                        <div>
                                            <div className="icon-wrapper">
                                                <i className="fas fa-users"></i>
                                            </div>
                                            {users && users.length > 0 && (
                                                <h3>{users.length}</h3>
                                            )}
                                            <h3>Người dùng</h3>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col md={4}>
                                <div className="card">
                                    <div className="card-content_2 ">
                                        <div>
                                            <div className="icon-wrapper">
                                                <i className="fas fa-map-marked"></i>
                                                <FmdGoodIcon
                                                    sx={{ fontSize: "45px" }}
                                                />{" "}
                                            </div>{" "}
                                            {locations &&
                                                locations.length > 0 && (
                                                    <h3>{locations.length}</h3>
                                                )}
                                            <h3>Bến xe</h3>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col md={4}>
                                <div className="card">
                                    <div className="card-content_3 text-white">
                                        <div>
                                            <div className="icon-wrapper">
                                                <CommuteIcon
                                                    sx={{ fontSize: "50px" }}
                                                />
                                            </div>{" "}
                                            {vehicles &&
                                                vehicles.length > 0 && (
                                                    <h3>{vehicles.length}</h3>
                                                )}
                                            <h3>Phương tiện</h3>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <DashboardComponent />
                        </Row>
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        listLocations: state.admin.locations,
        listVehicle: state.admin.vehicles,
        listUsers: state.admin.users,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllLocation: () => dispatch(actions.fetchAllLocation()),
        fetchAllVehicle: () => dispatch(actions.fetchAllVehicle()),
        fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
