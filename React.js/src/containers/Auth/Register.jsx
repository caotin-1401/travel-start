import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import logo from "../../assets/logo2.png";
import { handleRegister } from "../../services/userService";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { LANGUAGES } from "../../utils";

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            confirmPassword: "",
            name: "",
            isShowPassword: false,
            isShowconfirmPassword: false,
            errMessage: "",
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
        let { language } = this.props;
        let { email, password, confirmPassword, name } = this.state;
        let message;
        this.setState({
            errMessage: "",
        });
        if (!email) {
            if (language === LANGUAGES.VI) {
                message = "Vui lòng nhập email";
            } else {
                message = "Please enter your email";
            }
        } else if (!password) {
            if (language === LANGUAGES.VI) {
                message = "Vui lòng nhập mật khẩu";
            } else {
                message = "Please enter your password";
            }
        } else if (!confirmPassword) {
            if (language === LANGUAGES.VI) {
                message = "Vui lòng nhập xác nhận mật khẩu";
            } else {
                message = "Please enter your comfirm password";
            }
        } else if (password.length !== confirmPassword.length) {
            if (language === LANGUAGES.VI) {
                message = "Mật khẩu và xác nhận mật khẩu phải giống nhau";
            } else {
                message = "Comfirm Passwords must be same as password";
            }
        } else if (password.length < 8 || password.length > 15) {
            if (language === LANGUAGES.VI) {
                message =
                    "Mật khẩu phải có ít nhất 8 ký tự và nhiều nhất 15 ký tự";
            } else {
                message =
                    "Password must be at least 8 characters and maximum 15 characters";
            }
        } else {
            try {
                let data = await handleRegister(
                    email,
                    password,
                    confirmPassword,
                    name
                );
                if (data && data.errCode === 0) {
                    this.props.userLoginSuccess(data.user);
                } else if (data && data.errCode === 1) {
                    if (language === LANGUAGES.VI) {
                        message = "Email đã tồn tại, vui lòng thử email khác";
                    } else {
                        message =
                            "Your email already exists, please try another email";
                    }
                } else if (data && data.errCode === 5) {
                    if (language === LANGUAGES.VI) {
                        message = "Email không đúng định dạng";
                    } else {
                        message = "Invalid email address";
                    }
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
        let { email, password, name, confirmPassword } = this.state;
        let language = this.props.language;
        let input1, input2, input3, input4;
        if (language === LANGUAGES.VI) {
            input1 = "Nhập email";
            input2 = "Nhập mật khẩu";
            input3 = "Nhập xác nhận mật khẩu";
            input4 = "Nhập họ tên đầy đủ";
        } else {
            input1 = "Enter your email";
            input2 = "Enter your password";
            input3 = "Enter your comfirm password";
            input4 = "Enter your full name";
        }
        return (
            <div className="login-background">
                <div className="login-container">
                    <div className="login-content row">
                        <div className="logostyle">
                            <Link to="/home">
                                <img src={logo} loading="eager" />
                            </Link>
                        </div>
                        <div className="col-12 text-center text-login">
                            <FormattedMessage id="login.register" />
                        </div>
                        <div className="col-12 form-group login-input">
                            <label>Email (*) : </label>
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
                                    type={
                                        this.state.isShowPassword
                                            ? "text"
                                            : "password"
                                    }
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
                                    type={
                                        this.state.isShowconfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    className="form-control"
                                    placeholder={input3}
                                    value={confirmPassword}
                                    onChange={(event) => {
                                        this.onChangeInput(
                                            event,
                                            "confirmPassword"
                                        );
                                    }}
                                />
                                <span
                                    onClick={() =>
                                        this.handleShowconfirmPassword()
                                    }>
                                    <i
                                        className={
                                            this.state.isShowconfirmPassword
                                                ? "fas fa-eye"
                                                : "fas fa-eye-slash"
                                        }></i>
                                </span>
                            </div>
                        </div>
                        <div className="col-12 form-group login-input">
                            <label>
                                <FormattedMessage id="login.name" /> (*) :
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder={input4}
                                value={name}
                                onChange={(event) => {
                                    this.onChangeInput(event, "name");
                                }}
                            />
                        </div>

                        <div className="col-12" style={{ color: "red" }}>
                            {this.state.errMessage}
                        </div>
                        <div className="col-12">
                            <button
                                className="btn-login"
                                onClick={() => {
                                    this.handleRegister();
                                }}>
                                <FormattedMessage id="login.register" />
                            </button>
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
        userLoginSuccess: (userInfo) =>
            dispatch(actions.userLoginSuccess(userInfo)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
