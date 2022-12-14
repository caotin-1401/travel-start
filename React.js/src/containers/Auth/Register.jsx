import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import logo from "../../assets/logo2.png";
import { handleRegister } from "../../services/userService";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { LANGUAGES } from "../../utils";
import LoadingOverlay from "react-loading-overlay-ts";
class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            confirmPassword: "",
            phoneNumber: "",
            isShowPassword: false,
            isShowconfirmPassword: false,
            errMessage: "",
            isActive: false,
        };
    }
    onChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState,
        });
    };

    handleRegister = async () => {
        this.setState({ isActive: true });
        let { language } = this.props;
        let { email, password, confirmPassword, phoneNumber } = this.state;
        let message;
        this.setState({
            errMessage: "",
        });
        if (!phoneNumber) {
            this.setState({ isActive: false });
            if (language === LANGUAGES.VI) {
                message = "Vui lòng nhập số điện thoại";
            } else {
                message = "Please enter phone number";
            }
        } else if (!password) {
            this.setState({ isActive: false });
            if (language === LANGUAGES.VI) {
                message = "Vui lòng nhập mật khẩu";
            } else {
                message = "Please enter your password";
            }
        } else if (!confirmPassword) {
            this.setState({ isActive: false });
            if (language === LANGUAGES.VI) {
                message = "Vui lòng nhập xác nhận mật khẩu";
            } else {
                message = "Please enter your comfirm password";
            }
        } else if (password.length !== confirmPassword.length) {
            this.setState({ isActive: false });
            if (language === LANGUAGES.VI) {
                message = "Mật khẩu và xác nhận mật khẩu phải giống nhau";
            } else {
                message = "Comfirm Passwords must be same as password";
            }
        } else if (password.length < 8 || password.length > 15) {
            if (language === LANGUAGES.VI) {
                message = "Mật khẩu phải có ít nhất 8 ký tự và nhiều nhất 15 ký tự";
            } else {
                message = "Password must be at least 8 characters and maximum 15 characters";
            }
        } else {
            try {
                let data = await handleRegister(email, password, confirmPassword, phoneNumber);
                if (data && data.errCode === 0) {
                    this.props.userLoginSuccess(data.user);
                } else if (data && data.errCode === 1) {
                    if (language === LANGUAGES.VI) {
                        message = "Email đã tồn tại, vui lòng thử email khác";
                    } else {
                        message = "Your email already exists, please try another email";
                    }
                } else if (data && data.errCode === 6) {
                    if (language === LANGUAGES.VI) {
                        message = "Số điện thoại đã tồn tại, vui lòng thử số khác";
                    } else {
                        message = "Phone number already exists, please try another ";
                    }
                } else if (data && data.errCode === 5) {
                    if (language === LANGUAGES.VI) {
                        message = "Email không đúng định dạng";
                    } else {
                        message = "Invalid email address";
                    }
                }
                this.setState({ isActive: false });
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
            errMessage: message,
        });
    };

    handleShowPassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword,
        });
    };
    handleShowconfirmPassword = () => {
        this.setState({
            isShowconfirmPassword: !this.state.isShowconfirmPassword,
        });
    };

    render() {
        let { email, password, phoneNumber, confirmPassword } = this.state;
        let language = this.props.language;
        let input1, input2, input3, input4;
        if (language === LANGUAGES.VI) {
            input1 = "Nhập email";
            input2 = "Nhập mật khẩu";
            input3 = "Nhập xác nhận mật khẩu";
            input4 = "Nhập số điện thoại";
        } else {
            input1 = "Enter your email";
            input2 = "Enter your password";
            input3 = "Enter your comfirm password";
            input4 = "Enter your phone number";
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
                            <FormattedMessage id="login.register" />
                        </div>
                        <div className="col-12 form-group login-input">
                            <label>
                                <FormattedMessage id="account.phone" /> (*) :
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder={input4}
                                value={phoneNumber}
                                onChange={(event) => {
                                    this.onChangeInput(event, "phoneNumber");
                                }}
                            />
                        </div>
                        <div className="col-12 form-group login-input">
                            <label>Email : </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder={input1}
                                value={email}
                                onChange={(event) => {
                                    this.onChangeInput(event, "email");
                                }}
                            />
                        </div>
                        <div className="col-12 form-group login-input">
                            <label>
                                <FormattedMessage id="login.password" /> (*) :
                            </label>
                            <div className="custom-password">
                                <input
                                    type={this.state.isShowPassword ? "text" : "password"}
                                    className="form-control"
                                    placeholder={input2}
                                    value={password}
                                    onChange={(event) => {
                                        this.onChangeInput(event, "password");
                                    }}
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
                        <div className="col-12 form-group login-input">
                            <label>
                                {" "}
                                <FormattedMessage id="login.confirm" /> (*) :
                            </label>
                            <div className="custom-password">
                                <input
                                    type={this.state.isShowconfirmPassword ? "text" : "password"}
                                    className="form-control"
                                    placeholder={input3}
                                    value={confirmPassword}
                                    onChange={(event) => {
                                        this.onChangeInput(event, "confirmPassword");
                                    }}
                                />
                                <span onClick={() => this.handleShowconfirmPassword()}>
                                    <i
                                        className={
                                            this.state.isShowconfirmPassword
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
                                    <button
                                        className="btn-login"
                                        onClick={() => {
                                            this.handleRegister();
                                        }}>
                                        <FormattedMessage id="login.register" />
                                    </button>
                                </LoadingOverlay>
                            ) : (
                                <button
                                    className="btn-login"
                                    onClick={() => {
                                        this.handleRegister();
                                    }}>
                                    <FormattedMessage id="login.register" />
                                </button>
                            )}
                        </div>
                        <div className="col-12">
                            <p
                                style={{
                                    textAlign: "center",
                                    fontSize: "15px",
                                }}>
                                <FormattedMessage id="login.title1" />
                                <Link to="/login">
                                    <b>
                                        <FormattedMessage id="login.login" />
                                    </b>
                                </Link>
                            </p>
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
        // userLoginFail: () => dispatch(actions.adminLoginFail()),
        userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
