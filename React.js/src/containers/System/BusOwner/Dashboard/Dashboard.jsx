import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import "../style.scss";
import CommuteIcon from "@mui/icons-material/Commute";
import * as actions from "../../../../store/actions";
import { getTripsFromBusCompany } from "../../../../services/userService";
import DashboardComponent from "./DashboardComponent";
import TableDriver from "./TableDriver";
class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrDrivers: [],
            arrVehicles: [],
        };
    }
    async componentDidMount() {
        this.props.fetchAllVehicle();
        await this.getTicket();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listVehicle !== this.props.listVehicle) {
            let test = this.props.listVehicle.filter((item) => item.busOwnerId === this.props.userInfo.id);
            this.setState({
                arrVehicles: test,
            });
        }
    }
    getTicket = async () => {
        let busOwnerId = this.props.userInfo.id;
        let res = await getTripsFromBusCompany(busOwnerId);
        this.setState({
            arrDrivers: res.trips,
        });
    };
    render() {
        let { arrDrivers, arrVehicles } = this.state;
        let { language, userInfo } = this.props;
        return (
            <React.Fragment>
                <div className="container-dashboard">
                    <div className="container form-redux">
                        <div>
                            <div className="titleD text-center">
                                <FormattedMessage id="menu.busOwner.dashboard" />
                            </div>
                            <Row>
                                <Col md={6}>
                                    <div className="card">
                                        <div className="card-content_1 ">
                                            <div>
                                                <div className="icon-wrapper">
                                                    <i className="fas fa-users"></i>
                                                </div>
                                                {arrDrivers && arrDrivers.length > 0 && <h3>{arrDrivers.length}</h3>}
                                                <h3>
                                                    <FormattedMessage id="menu.busOwner.drivers" />
                                                </h3>
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
                                                </div>
                                                {arrVehicles && arrVehicles.length > 0 && <h3>{arrVehicles.length}</h3>}
                                                <h3>
                                                    <FormattedMessage id="menu.busOwner.vehicles" />
                                                </h3>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <DashboardComponent userInfo={userInfo} language={language} />
                            </Row>
                            <Row style={{ height: "50px" }}> </Row>

                            <Row>
                                <Col md={6}>
                                    <TableDriver arrDrivers={arrDrivers} language={language} />
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
        listVehicle: state.admin.vehicles,
        userInfo: state.user.userInfo,
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllVehicle: () => dispatch(actions.fetchAllVehicle()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
