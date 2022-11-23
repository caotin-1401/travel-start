import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import "./Login.scss";
import logo from "../../assets/logo2.png";
import { handleLogin } from "../../services/userService";
import { Link } from "react-router-dom";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            isShowPassword: false,
            errMessage: "",
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
            redirectPath = "/driver/manage-parking";
        } else {
            redirectPath = "/home";
        }

        navigate(`${redirectPath}`);
    };
    handleLogin = async () => {
        this.setState({
            errMessage: "",
        });
        try {
            let data = await handleLogin(this.state.email, this.state.password);
            console.log(data);
            if (data && data.errCode !== 0) {
                this.setState({
                    errMessage: data.message,
                });
            }
            if (data && data.errCode === 0) {
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
    };

    handleShowPassword = () => {
        this.setState({
            isShowPassword: !this.state.isShowPassword,
        });
    };

    render() {
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
                            Login
                        </div>
                        <div className="col-12 form-group login-input">
                            <label>Email : </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter your email"
                                value={this.state.email}
                                onChange={(e) => this.handleChangeUser(e)}
                            />
                        </div>
                        <div className="col-12 form-group login-input">
                            <label>Password : </label>
                            <div className="custom-password">
                                <input
                                    type={
                                        this.state.isShowPassword
                                            ? "text"
                                            : "password"
                                    }
                                    className="form-control"
                                    placeholder="Enter your password"
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
                            <button
                                className="btn-login"
                                onClick={this.handleLogin}>
                                Login
                            </button>
                        </div>
                        <p style={{ textAlign: "center" }}>
                            {" "}
                            You don't have an account?{" "}
                            <Link to="/register">Register</Link>
                        </p>
                        <div className="col-12 text-center mt-3">
                            <span className="text-other-login">
                                Or login with:
                            </span>
                        </div>
                        <div className="row mt-3">
                            <div className="col-6">
                                <span className="forgot-pass">
                                    Forgot your password ?{" "}
                                </span>
                            </div>
                            <div className="col-6">
                                <span className="forgot-pass">
                                    <Link to="/home">
                                        &#60; &#60; Go to HomePage
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
        userLoginSuccess: (userInfo) =>
            dispatch(actions.userLoginSuccess(userInfo)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
