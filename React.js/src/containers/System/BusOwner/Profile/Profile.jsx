import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router";
import * as actions from "../../../../store/actions";
import Header from "../../../Header/Header";
import { Row, Col } from "reactstrap";
import "./ProfileAdmin.scss";
import InfoUser from "./InfoUser";
class ProfileBusOwner extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {}
    componentDidUpdate(prevProps, prevState, snapshot) {}

    render() {
        const { processLogout, language } = this.props;
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
                                        <Row className="active">
                                            <Col md={2}>
                                                <i className="fas fa-user-circle"></i>
                                            </Col>
                                            <Col md={10}>
                                                <p>Thông tin tài khoản</p>
                                            </Col>
                                        </Row>
                                    </div>
                                    <div>
                                        <Row
                                            onClick={processLogout}
                                            title="Log out">
                                            <Col md={2}>
                                                <i className="fas fa-sign-out-alt"></i>
                                            </Col>
                                            <Col md={10}>
                                                <p>Đăng xuất</p>
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
export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(ProfileBusOwner)
);
