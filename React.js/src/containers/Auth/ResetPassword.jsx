import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import "./Register.scss";
import logo from "../../assets/logo2.png";
import { handleRegister } from "../../services/userService";
import { useNavigate, Link } from "react-router-dom";

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: "",
            confirmPassword: "",
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
        let arrInput = ["password", "confirmPassword"];
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
                this.state.password,
                this.state.confirmPassword
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
        let { password, confirmPassword } = this.state;
        return (
            <div className="login-background">
                <div className="login-container">
                    <div className="login-content row">
                        <div className="logostyle">
                            <img src={logo} />
                        </div>
                        <div className="col-12 text-center text-login">
                            Register
                        </div>

                        <div className="col-12 form-group login-input">
                            <label>Password (*) : </label>
                            <div className="custom-password">
                                <input
                                    type={
                                        this.state.isShowPassword
                                            ? "text"
                                            : "password"
                                    }
                                    className="form-control"
                                    placeholder="Enter your password"
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
                            <label>Comfirm Password (*) : </label>
                            <div className="custom-password">
                                <input
                                    type={
                                        this.state.isShowconfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    className="form-control"
                                    placeholder="Enter your Comfirm password"
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

                        <div className="col-12" style={{ color: "red" }}>
                            {this.state.errMessage}
                        </div>
                        <div className="col-12">
                            <button
                                className="btn-login"
                                onClick={() => {
                                    this.handleRegister();
                                }}>
                                Login
                            </button>
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

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
