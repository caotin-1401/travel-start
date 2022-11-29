import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import "./Register.scss";
import logo from "../../assets/logo2.png";
import { handleRegister } from "../../services/userService";
import { useNavigate, Link } from "react-router-dom";

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
                            <label>Email (*) : </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(event) => {
                                    this.onChangeInput(event, "email");
                                }}
                            />
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
                                    placeholder="Enter your password"
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
                            <label>Full name : </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter your email"
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
                                Login
                            </button>
                        </div>

                        {/* <div className="col-12 text-center mt-3">
                            <span className="text-other-login">
                                Or register with:
                            </span>
                        </div>
                        <div className="col-12 social-login">
                            <i className="fab fa-google-plus-g google"></i>
                            <i className="fab fa-facebook-f facebook"></i>
                        </div> */}
                    </div>
                    <p style={{ textAlign: "center" }}>
                        Have an account?
                        <Link to="/login">Login</Link>
                    </p>
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
