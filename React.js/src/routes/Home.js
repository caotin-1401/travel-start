import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { LANGUAGES, USER_ROLE } from "../utils";
import { FormattedMessage } from "react-intl";
import {
    adminMenu,
    busOwnerMenu,
    driverMenu,
} from "../containers/Header/menuApp";
import _ from "lodash";
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuApp: [],
        };
    }
    componentDidMount() {
        let { userInfo } = this.props;
        let menu = [];
        if (userInfo && !_.isEmpty(userInfo)) {
            let role = userInfo.roleID;
            if (role === USER_ROLE.ADMIN) {
                menu = "/system/dashboard";
            }
            if (role === USER_ROLE.BUSOWNER) {
                menu = "/busOwner/dashboard";
            }
            if (role === USER_ROLE.DRIVER) {
                menu = "/driver/manage-parking";
            }
            if (role === USER_ROLE.PASSENGER) {
                menu = "/home";
            }
        }

        this.setState({
            menuApp: menu,
        });
    }
    render() {
        const { isLoggedIn, userInfo } = this.props;
        // let linkToRedirect = isLoggedIn ? '/system/dashboard' : '/home';
        let linkToRedirect = isLoggedIn ? this.state.menuApp : "/home";

        return <Redirect to={linkToRedirect} />;
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
