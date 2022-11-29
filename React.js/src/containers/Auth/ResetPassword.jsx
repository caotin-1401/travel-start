import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import "./Register.scss";
import logo from "../../assets/logo2.png";
import {
    getForgotPasswordService,
    postResetPasswordService,
    handleLogin,
} from "../../services/userService";
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
            email: "",
            token: "",
            errCode: "",
        };
    }
    async componentDidMount() {
        if (this.props.location && this.props.location.search) {
            let urlParams = new URLSearchParams(this.props.location.search);
            let token = urlParams.get("token");
            let email = urlParams.get("email");
            console.log(token, email);
            let res = await getForgotPasswordService(email, token);
            console.log(res);
            if (res && res.errCode === 0) {
                this.setState({
                    email: email,
                    token: token,
                });
            } else {
                this.setState({
                    errMessage: "Liên ket đã hết hạn hoặc được sử dụng rồi",
                    errCode: res.errCode,
                });
            }
        }
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
    handleRegister = async () => {
        let { password, confirmPassword, email, token } = this.state;
        console.log(email, token);
        this.setState({
            errMessage: "",
        });

        if (password.length < 8) {
            this.setState({ errMessage: "Mật khẩu phải có ít nất 8 ký tự" });
        } else if (password !== confirmPassword) {
            this.setState({
                errMessage: "Xác nhận mật khẩu không đúng",
            });
        } else {
            let res = await postResetPasswordService({
                password,
                email,
                token,
            });
            let data = await handleLogin(this.state.email, this.state.password);
            console.log(data);

            if (data && data.errCode === 0) {
                this.redirectToSystemPage(data.user.roleID);
                this.props.userLoginSuccess(data.user);
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
        let { password, confirmPassword, errCode } = this.state;
        console.log(errCode);
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
                                    disabled={errCode == 0 ? false : true}
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
                                    disabled={errCode == 0 ? false : true}
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
                            {errCode == 0 ? (
                                <button
                                    className="btn-login"
                                    onClick={() => {
                                        this.handleRegister();
                                    }}>
                                    Login
                                </button>
                            ) : (
                                <button disabled className="btn-login1">
                                    Login
                                </button>
                            )}
                        </div>
                        <div className="row mt-3">
                            <div className="col-6">
                                <span className="forgot-pass">
                                    <Link to="/login">Back to login</Link>
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

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
