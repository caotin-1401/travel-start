import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import "./Login.scss";
import logo from "../../assets/logo2.png";
import { handleLogin } from "../../services/userService";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { LANGUAGES } from "../../utils";
import LoadingOverlay from "react-loading-overlay-ts";
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            isShowPassword: false,
            errMessage: "",
            isActive: false,
        };
    }

    handleChangeUser = (e) => {
        this.setState({
            email: e.target.value,
        });
    };

    handleChangePassword = (e) => {
        this.setState({
            password: e.target.value,
        });
    };
    handleKeyDown = (e) => {
        if (e.key === "Enter" || e.keyCode === 13) {
            this.handleLogin();
        }
    };
    redirectToSystemPage = (data) => {
        const { navigate } = this.props;
        let redirectPath;
        if (data === "R1") {
            redirectPath = "/system/dashboard";
        } else if (data === "R2") {
            redirectPath = "/busOwner/dashboard";
        } else if (data === "R3") {
            redirectPath = "/driver/seatNo";
        } else {
            redirectPath = "/home";
        }

        navigate(`${redirectPath}`);
    };
    handleLogin = async () => {
        this.setState({ isActive: true });
        let { email, password } = this.state;
        let language = this.props.language;
        let message1;
        if (!email) {
            this.setState({ isActive: false });
            if (language === LANGUAGES.VI) {
                message1 = "Vui lòng nhập email hoặc số điện thoại đã đăng ký";
            } else {
                message1 = "Please enter your registered email or phone number";
            }
        } else if (!password) {
            this.setState({ isActive: false });
            if (language === LANGUAGES.VI) {
                message1 = "Vui lòng nhập mật khẩu";
            } else {
                message1 = "Please enter your password";
            }
        } else {
            try {
                let data = await handleLogin(this.state.email, this.state.password);
                console.log(data);
                if (data && data.errCode !== 0) {
                    if (data.errCode === 3) {
                        if (language === LANGUAGES.VI) {
                            message1 = "Mật khẩu không hợp lệ";
                        } else {
                            message1 = "Invalid password";
                        }
                    } else if (data.errCode === 1) {
                        if (language === LANGUAGES.VI) {
                            message1 = "Email không tồn tại";
                        } else {
                            message1 = "Invalid email";
                        }
                    }
                    this.setState({ isActive: false });
                }
                if (data && data.errCode === 0) {
                    this.setState({ isActive: false });
                    this.redirectToSystemPage(data.user.roleID);
                    this.props.userLoginSuccess(data.user);
                }
            } catch (error) {
                if (error.response) {
                    if (error.response.data) {
                        this.setState({
                            errMessage: error.response.data.message,
                        });
                    }
                }
            }
        }

        this.setState({
            errMessage: message1,
        });
    };

    handleShowPassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword,
        });
    };

    render() {
        let language = this.props.language;
        let input1, input2;
        if (language === LANGUAGES.VI) {
            input1 = "Nhập email hoặc số điện thoại";
            input2 = "Nhập mật khẩu";
        } else {
            input1 = "Enter your email or phone number";
            input2 = "Enter your password";
        }
        return (
            <div className="login-background">
                <div className="login-container">
                    <div className="login-content row">
                        <div className="logostyle">
                            <Link to="/home">
                                <img src={logo} loading="eager" alt="logo" />
                            </Link>
                        </div>
                        <div className="col-12 text-center text-login">
                            <FormattedMessage id="login.login" />
                        </div>
                        <div className="col-12 form-group login-input">
                            <label>
                                <FormattedMessage id="login.username" /> :{" "}
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder={input1}
                                value={this.state.email}
                                onChange={(e) => this.handleChangeUser(e)}
                            />
                        </div>
                        <div className="col-12 form-group login-input">
                            <label>
                                <FormattedMessage id="login.password" /> :{" "}
                            </label>
                            <div className="custom-password">
                                <input
                                    type={this.state.isShowPassword ? "text" : "password"}
                                    className="form-control"
                                    placeholder={input2}
                                    value={this.state.password}
                                    onChange={this.handleChangePassword}
                                    onKeyDown={this.handleKeyDown}
                                />
                                <span onClick={() => this.handleShowPassword()}>
                                    <i
                                        className={
                                            this.state.isShowPassword
                                                ? "fas fa-eye"
                                                : "fas fa-eye-slash"
                                        }></i>
                                </span>
                            </div>
                        </div>
                        <div className="col-12" style={{ color: "red" }}>
                            {this.state.errMessage}
                        </div>
                        <div className="col-12">
                            {this.state.isActive === true ? (
                                <LoadingOverlay active={this.state.isActive} spinner>
                                    <button className="btn-login" onClick={this.handleLogin}>
                                        <FormattedMessage id="login.login" />
                                    </button>{" "}
                                </LoadingOverlay>
                            ) : (
                                <button className="btn-login" onClick={this.handleLogin}>
                                    <FormattedMessage id="login.login" />
                                </button>
                            )}
                        </div>
                        <div className="col-12">
                            <p
                                style={{
                                    textAlign: "center",
                                    fontSize: "15px",
                                }}>
                                <FormattedMessage id="login.title" />
                                <Link to="/register">
                                    <b>
                                        <FormattedMessage id="login.register" />
                                    </b>
                                </Link>
                            </p>
                        </div>
                        <div className="row mt-3">
                            <div className="col-6">
                                <span className="forgot-pass">
                                    <Link to="/forgot-password">
                                        <FormattedMessage id="login.forgot" />
                                    </Link>
                                </span>
                            </div>
                            <div className="col-6 left-forgot">
                                <span className="forgot-pass">
                                    <Link to="/home">
                                        &#60; &#60; <FormattedMessage id="login.home" />
                                    </Link>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* </div> */}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        navigate: (path) => dispatch(push(path)),
        userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
