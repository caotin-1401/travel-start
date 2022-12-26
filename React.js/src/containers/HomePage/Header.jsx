import React, { Component, Suspense, lazy } from "react";
import { connect } from "react-redux";
import "./Header.scss";
import * as actions from "../../store/actions";
import logo from "../../assets/logo1.png";
import { FormattedMessage } from "react-intl";
import { LANGUAGES } from "../../utils";
import { changeLanguageApp } from "../../store/actions/appActions";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import Loading from "../../components/Loading";
const ModalErr = lazy(() => import("./Section/ModalErr"));
class HeaderPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            info: "",
            dropdownOpen: false,
            isOpenModel: false,
            listErr: [],
        };
    }
    componentDidMount() {
        this.setState({ info: this.props.userInfo });
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.userInfo !== this.props.userInfo) {
            this.setState({ info: this.props.userInfo });
        }
    }
    changeLanguage = (language) => {
        this.props.changeLanguageAppRedux(language);
    };
    returnToHome = () => {
        if (this.props.history) {
            this.props.history.push(`/home`);
        }
    };
    handleEvents = () => {
        if (this.props.history) {
            this.props.history.push(`/home/events`);
        }
    };
    handleBlogs = () => {
        if (this.props.history) {
            this.props.history.push(`/home/blogs`);
        }
    };
    handleContact = () => {
        if (this.props.history) {
            this.props.history.push(`/home/contact`);
        }
    };
    handleProfile = () => {
        let { info } = this.state;
        if (this.props.history) {
            this.props.history.push(`/home/profile/userId=${info.id}&${1}`);
        }
    };
    handleProfile1 = () => {
        let { info } = this.state;
        if (this.props.history) {
            this.props.history.push(`/home/profile/userId=${info.id}&${2}`);
        }
    };
    toggleUserModel = () => {
        this.setState({
            isOpenModel: !this.state.isOpenModel,
        });
    };
    handleOpneModal = () => {
        this.setState({
            isOpenModel: true,
        });
    };
    createNewUser1 = () => {
        this.setState({
            isOpenModel: false,
        });
    };
    toggle = () => {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen,
        });
    };
    render() {
        const { processLogout, language } = this.props;
        let { info, dropdownOpen } = this.state;
        let username = "a User";
        info && info.name && (username = info.name);
        let test = username.split(" ").reverse();
        let name = test[0];
        return (
            <React.Fragment>
                <Suspense fallback={<Loading />}>
                    <ModalErr
                        isOpen={this.state.isOpenModel}
                        toggleFromParent={this.toggleUserModel}
                        createNewUser1={this.createNewUser1}
                    />
                </Suspense>
                <div className="home-header-container">
                    <div className="home-header-content">
                        <div className="left-content">
                            <i className="fas fa-bars bar-logo"></i>
                            <div className="logostyle" onClick={this.returnToHome}>
                                <img src={logo} alt="logo" />
                            </div>
                        </div>
                        <div className="center-content">
                            <div className="child-content">
                                <p onClick={this.returnToHome}>
                                    <FormattedMessage id="header.home" />
                                </p>
                            </div>

                            <div className="child-content" onClick={() => this.handleEvents()}>
                                <p>
                                    <FormattedMessage id="header.events" />
                                </p>
                            </div>
                            <div className="child-content" onClick={() => this.handleBlogs()}>
                                <p>
                                    <FormattedMessage id="header.blog" />
                                </p>
                            </div>
                            <div className="child-content" onClick={() => this.handleContact()}>
                                <p>
                                    <FormattedMessage id="header.contact" />
                                </p>
                            </div>
                        </div>
                        <div className="right-content">
                            <div className="support" onClick={() => this.handleOpneModal()}>
                                <i className="fas fa-exclamation-triangle">
                                    <span></span>
                                    <FormattedMessage id="header.supports" />
                                </i>
                            </div>
                            <div className={language === LANGUAGES.VI ? "language-vi active" : "language-vi"}>
                                <span onClick={() => this.changeLanguage(LANGUAGES.VI)}>VI</span>
                            </div>
                            <div className={language === LANGUAGES.VI ? "language-en " : "language-en active"}>
                                <span onClick={() => this.changeLanguage(LANGUAGES.EN)}>EN</span>
                            </div>
                            {/* {info && info.roleID && info.roleID === "R4" && (
                                <div
                                    className="btn btn-logout disable"
                                    // "btn btn-logout"
                                    onClick={processLogout}
                                    title="Log out">
                                    <i className="fas fa-sign-out-alt"></i>
                                </div>
                            )} */}
                            {!info && (
                                <Link to="/login" rel="preconnect">
                                    <button className="btn btn-primary">
                                        <i className="fas fa-user-circle"></i> Dang nhap
                                    </button>
                                </Link>
                            )}
                            {info && info.roleID && info.roleID !== "R4" && (
                                <Link to="/login" rel="preconnect">
                                    <button className="btn btn-primary">Đi tới trang admin</button>
                                </Link>
                            )}
                            {info && info.roleID && info.roleID === "R4" && (
                                <Dropdown isOpen={dropdownOpen} toggle={this.toggle}>
                                    <DropdownToggle caret color="primary">
                                        <i className="fas fa-user-circle"></i> {name}
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem onClick={this.handleProfile}>
                                            <i className="fas fa-user-circle"></i> Thông tin tài khoản
                                        </DropdownItem>
                                        <DropdownItem onClick={this.handleProfile1}>
                                            <i className="fas fa-ticket-alt"></i> Vé của tôi
                                        </DropdownItem>

                                        <DropdownItem divider />
                                        <DropdownItem>
                                            <div onClick={processLogout} title="Log out">
                                                <i className="fas fa-sign-out-alt"></i> Đăng xuất
                                            </div>
                                        </DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            )}
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
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
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language)),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HeaderPage));
