import React, { Component } from "react";
import { connect } from "react-redux";

import * as actions from "../../store/actions";
import Navigator from "../../components/Navigator";
import HeaderPage from "../HomePage/Header";
import { adminMenu, busOwnerMenu, driverMenu } from "./menuApp";
import "./Header.scss";
import { withRouter } from "react-router";
import { LANGUAGES, USER_ROLE } from "../../utils";
import { FormattedMessage } from "react-intl";
import _ from "lodash";
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from "reactstrap";
class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuApp: [],
            info: "",
            dropdownOpen: false,
        };
    }

    changeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language);
    };

    componentDidMount() {
        let { userInfo } = this.props;
        let menu = [];
        this.setState({ info: this.props.userInfo });
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

    toggle = () => {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen,
        });
    };
    handleProfile = () => {
        let { info } = this.state;
        console.log(info);
        if (info && info.roleID === "R1") {
            if (this.props.history) {
                this.props.history.push(`/profile/admin/userId=${info.id}`);
            }
        } else if (info && info.roleID === "R2") {
            if (this.props.history) {
                this.props.history.push(`/profile/busOwner/userId=${info.id}`);
            }
        } else if (info && info.roleID === "R3") {
            if (this.props.history) {
                this.props.history.push(`/profile/driver/userId=${info.id}`);
            }
        }
    };
    render() {
        const { processLogout, language, userInfo } = this.props;
        let { info, dropdownOpen } = this.state;
        console.log(info);
        let username = "a b";
        info && info.name && (username = info.name);
        let test = username.split(" ").reverse();
        let name = test[0];
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

                        <div className="right-content">
                            <div
                                className={
                                    language === LANGUAGES.VI
                                        ? "language-vi active"
                                        : "language-vi"
                                }>
                                <span
                                    onClick={() =>
                                        this.changeLanguage(LANGUAGES.VI)
                                    }>
                                    VI
                                </span>
                            </div>
                            <div
                                className={
                                    language === LANGUAGES.VI
                                        ? "language-en "
                                        : "language-en active"
                                }>
                                <span
                                    onClick={() =>
                                        this.changeLanguage(LANGUAGES.EN)
                                    }>
                                    EN
                                </span>
                            </div>

                            <Dropdown
                                isOpen={dropdownOpen}
                                toggle={this.toggle}>
                                <DropdownToggle caret color="primary">
                                    <i className="fas fa-user-circle"></i>{" "}
                                    {name}
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem onClick={this.handleProfile}>
                                        <i className="fas fa-user-circle"></i>{" "}
                                        Thông tin tài khoản
                                    </DropdownItem>

                                    <DropdownItem divider />
                                    <DropdownItem>
                                        <div
                                            onClick={processLogout}
                                            title="Log out">
                                            <i className="fas fa-sign-out-alt"></i>{" "}
                                            Đăng xuất
                                        </div>
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                        {/* nút logout */}
                    </div>
                );
            }
        }
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
