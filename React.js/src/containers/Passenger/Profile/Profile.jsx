import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router";
import Header from "../../HomePage/Header";
import { Row, Col } from "reactstrap";
import "./Profile.scss";
import * as actions from "../../../store/actions";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import HomeIcon from "@mui/icons-material/Home";
import InfoUser from "./InfoUser";
import InfoTicket from "./InfoTicket";
import HomeFooter from "./../../HomePage/Section/HomeFooter";

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isInfo: 1,
        };
    }
    componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.status) {
            let test = this.props.match.params.status;
            this.setState({
                isInfo: +test,
            });
        }
    }
    returnToHome = () => {
        if (this.props.history) {
            this.props.history.push(`/home`);
        }
    };
    handleSelection1 = () => {
        this.setState({
            isInfo: 1,
        });
    };
    handleSelection2 = () => {
        this.setState({
            isInfo: 2,
        });
    };
    render() {
        const { processLogout } = this.props;
        let { isInfo } = this.state;
        let mes1 = <FormattedMessage id="menu.driver.info" />;
        let mes2 = <FormattedMessage id="account.infoTicket" />;
        return (
            <div style={{ overflowX: "hidden" }}>
                <Header />
                <div className="backgroundColorPass">
                    <div className="container ">
                        <div>
                            <Breadcrumbs aria-label="breadcrumb" sx={{ pt: 2 }}>
                                <Link
                                    underline="hover"
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                    color="inherit"
                                    href="/home">
                                    <HomeIcon sx={{ mr: 0.5, ml: 12 }} />
                                    <FormattedMessage id="account.home" />
                                </Link>
                                <p style={{ marginTop: "14px" }}>{isInfo === 1 ? mes1 : mes2}</p>
                            </Breadcrumbs>
                        </div>
                        <Row>
                            <Col md={3} className="container-left">
                                <div className="contentProfile">
                                    <div>
                                        <Row
                                            className={isInfo === 1 ? "active" : ""}
                                            onClick={this.handleSelection1}>
                                            <Col md={2}>
                                                <i className="fas fa-user-circle"></i>
                                            </Col>
                                            <Col md={10}>
                                                <p>
                                                    <FormattedMessage id="menu.driver.info" />
                                                </p>
                                            </Col>
                                        </Row>
                                    </div>
                                    <div>
                                        <Row
                                            onClick={this.handleSelection2}
                                            className={isInfo === 2 ? "active" : ""}>
                                            <Col md={2}>
                                                <i className="fas fa-ticket-alt"></i>
                                            </Col>
                                            <Col md={10}>
                                                <p>
                                                    <FormattedMessage id="account.myTicket" />
                                                </p>
                                            </Col>
                                        </Row>
                                    </div>
                                    <div onClick={this.returnToHome}>
                                        <Row onClick={processLogout} title="Log out">
                                            <Col md={2}>
                                                <i className="fas fa-sign-out-alt"></i>
                                            </Col>
                                            <Col md={10}>
                                                <p>
                                                    <FormattedMessage id="menu.driver.logout" />
                                                </p>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </Col>
                            <Col md={9} className="container-right">
                                {isInfo === 1 && <InfoUser />}
                                {isInfo === 2 && <InfoTicket />}
                            </Col>
                        </Row>
                    </div>
                </div>
                <HomeFooter />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        genderRedux: state.admin.gender,
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        processLogout: () => dispatch(actions.processLogout()),
    };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile));
