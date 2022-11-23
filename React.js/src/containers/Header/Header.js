import React, { Component } from "react";
import { connect } from "react-redux";

import * as actions from "../../store/actions";
import Navigator from "../../components/Navigator";
import HeaderPage from "../HomePage/Header";
import { adminMenu, busOwnerMenu, driverMenu } from "./menuApp";
import "./Header.scss";
import { LANGUAGES, USER_ROLE } from "../../utils";
import { FormattedMessage } from "react-intl";
import _ from "lodash";

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuApp: [],
        };
    }

    changeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language);
    };

    componentDidMount() {
        let { userInfo } = this.props;
        let menu = [];
        if (userInfo && !_.isEmpty(userInfo)) {
            let role = userInfo.roleID;
            if (role === USER_ROLE.ADMIN) {
                menu = adminMenu;
            }
            if (role === USER_ROLE.BUSOWNER) {
                menu = busOwnerMenu;
            }
            if (role === USER_ROLE.DRIVER) {
                menu = driverMenu;
            }
        }
        this.setState({
            menuApp: menu,
        });
    }

    render() {
        const { processLogout, language, userInfo } = this.props;
        if (userInfo && !_.isEmpty(userInfo)) {
            let role = userInfo.roleID;
            if (
                role === USER_ROLE.ADMIN ||
                role === USER_ROLE.BUSOWNER ||
                role === USER_ROLE.DRIVER
            ) {
                return (
                    <div className="header-container">
                        <div className="header-tabs-container">
                            <Navigator menus={this.state.menuApp} />
                        </div>

                        <div className="languages">
                            <span className="welcome">
                                <FormattedMessage id="header.welcome" />
                                {userInfo && userInfo.name ? userInfo.name : ""}
                                !
                            </span>
                            <span
                                onClick={() =>
                                    this.changeLanguage(LANGUAGES.VI)
                                }
                                className={
                                    language === LANGUAGES.VI
                                        ? "language-vi active"
                                        : "language-vi"
                                }>
                                VI
                            </span>

                            <span
                                onClick={() =>
                                    this.changeLanguage(LANGUAGES.EN)
                                }
                                className={
                                    language === LANGUAGES.VI
                                        ? "language-en "
                                        : "language-en active"
                                }>
                                EN
                            </span>

                            <div
                                className="btn btn-logout"
                                onClick={processLogout}
                                title="Log out">
                                <i className="fas fa-sign-out-alt"></i>
                            </div>
                        </div>
                        {/* nút logout */}
                    </div>
                );
            }
        }
        // else {
        //     return (
        //         <div className="header-container">
        //             <div className="header-tabs-container">
        //                 <HeaderPage />
        //             </div>

        //             <div className="languages">
        //                 <span className="welcome">
        //                     <FormattedMessage id="header.welcome" />
        //                     {userInfo && userInfo.name ? userInfo.name : ""}!
        //                 </span>
        //                 <span
        //                     onClick={() => this.changeLanguage(LANGUAGES.VI)}
        //                     className={
        //                         language === LANGUAGES.VI
        //                             ? "language-vi active"
        //                             : "language-vi"
        //                     }>
        //                     VI
        //                 </span>

        //                 <span
        //                     onClick={() => this.changeLanguage(LANGUAGES.EN)}
        //                     className={
        //                         language === LANGUAGES.VI
        //                             ? "language-en "
        //                             : "language-en active"
        //                     }>
        //                     EN
        //                 </span>

        //                 <div
        //                     className="btn btn-logout"
        //                     onClick={processLogout}
        //                     title="Log out">
        //                     <i className="fas fa-sign-out-alt"></i>
        //                 </div>
        //             </div>
        //             {/* nút logout */}
        //         </div>
        //     );
        // }
        // let language = this.props.language;
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
        changeLanguageAppRedux: (language) =>
            dispatch(actions.changeLanguageApp(language)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
