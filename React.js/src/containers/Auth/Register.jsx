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
    checkValidInput = () => {
        let isValid = true;
        let arrInput = ["email", "password", "confirmPassword", "name"];
        for (let i = 0; i < arrInput.length; i++) {
            if (!this.state[arrInput[i]]) {
                isValid = false;
                alert("Missing: " + arrInput[i]);
                break;
            }
        }
        return isValid;
    };
    handleRegister = async () => {
        this.setState({
            errMessage: "",
        });
        try {
            let data = await handleRegister(
                this.state.email,
                this.state.password,
                this.state.confirmPassword,
                this.state.name
            );
            if (data && data.errCode !== 0) {
                this.setState({
                    errMessage: data.message,
                });
            }
            if (data && data.errCode === 0) {
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
                                <img src={logo} />
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
