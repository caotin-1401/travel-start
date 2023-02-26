import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router";
import * as actions from "../../../../store/actions";
import Header from "../../../Header/Header";
import { Row, Col } from "reactstrap";
import "../style.scss";
import InfoUser from "./InfoUser";

class ProfileDriver extends Component {
    render() {
        const { processLogout } = this.props;
        return (
            <React.Fragment>
                <Header />
                <div className="backgroundColor">
                    <div className="container ">
                        <Row>
                            <Col md={1} className="none"></Col>
                            <Col md={3} className="container-left__admin">
                                <div className="contentProfile">
                                    <div>
                                        <Row className="active" onClick={this.handleSelection1}>
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
                            <Col md={7} className="container-right__admin">
                                <InfoUser />
                            </Col>
                            <Col md={1} className="none"></Col>
                        </Row>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
};

const mapDispatchToProps = (dispatch) => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
    };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProfileDriver));
