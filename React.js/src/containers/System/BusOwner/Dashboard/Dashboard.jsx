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
            arrDrivers: [],
            arrVehicles: [],
        };
    }
    componentDidMount() {
        this.props.fetchAllLocation();
        this.props.fetchAllVehicle();
        this.props.fetchUserRedux();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log(this.props.listUsers);
        if (prevProps.listUsers !== this.props.listUsers) {
            let test = this.props.listUsers.filter(
                (item) =>
                    item.Driver.busOwnerId &&
                    item.Driver.busOwnerId === this.props.userInfo.id
            );
            this.setState({
                arrDrivers: test,
            });
        }
        if (prevProps.listVehicle !== this.props.listVehicle) {
            let test = this.props.listVehicle.filter(
                (item) => item.busOwnerId === this.props.userInfo.id
            );
            this.setState({
                arrVehicles: test,
            });
        }
    }
    render() {
        let { arrDrivers, arrVehicles } = this.state;
        return (
            <React.Fragment>
                <div className="container-dashboard">
                    <div className="container form-redux">
                        <div>
                            <div className="titleD text-center">Dashboard</div>
                            <Row>
                                <Col md={6}>
                                    <div className="card">
                                        <div className="card-content_1 ">
                                            <div>
                                                <div className="icon-wrapper">
                                                    <i className="fas fa-users"></i>
                                                </div>
                                                {arrDrivers &&
                                                    arrDrivers.length > 0 && (
                                                        <h3>
                                                            {arrDrivers.length}
                                                        </h3>
                                                    )}
                                                <h3>Tài xế</h3>
                                            </div>
                                        </div>
                                    </div>
                                </Col>

                                <Col md={6}>
                                    <div className="card">
                                        <div className="card-content_2 text-white">
                                            <div>
                                                <div className="icon-wrapper">
                                                    <CommuteIcon
                                                        sx={{
                                                            fontSize: "50px",
                                                        }}
                                                    />
                                                </div>{" "}
                                                {arrVehicles &&
                                                    arrVehicles.length > 0 && (
                                                        <h3>
                                                            {arrVehicles.length}
                                                        </h3>
                                                    )}
                                                <h3>Phương tiện</h3>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <DashboardComponent />{" "}
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
        userInfo: state.user.userInfo,
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
