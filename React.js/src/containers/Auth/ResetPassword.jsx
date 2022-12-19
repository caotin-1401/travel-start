import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import "./Login.scss";
import logo from "../../assets/logo2.png";
import {
    getForgotPasswordService,
    postResetPasswordService,
    handleLogin,
} from "../../services/userService";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { LANGUAGES } from "../../utils";
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
        let language = this.props.language;
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
                if (language === LANGUAGES.VI) {
                    this.setState({
                        errMessage: "Liên ket đã hết hạn hoặc được sử dụng rồi",
                        errCode: res.errCode,
                    });
                } else {
                    this.setState({
                        errMessage: "The link has expired or is already in use",
                        errCode: res.errCode,
                    });
                }
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
        let language = this.props.language;

        let { password, confirmPassword, email, token } = this.state;
        this.setState({
            errMessage: "",
        });

        if (password.length < 8) {
            if (language === LANGUAGES.VI) {
                this.setState({
                    errMessage: "Mật khẩu phải có ít nất 8 ký tự",
                });
            } else {
                this.setState({
                    errMessage: "Password must be at least 8 characters",
                });
            }
        } else if (password !== confirmPassword) {
            if (language === LANGUAGES.VI) {
                this.setState({
                    errMessage: "Xác nhận mật khẩu không đúng",
                });
            } else {
                this.setState({
                    errMessage: "Comfirm password invalid",
                });
            }
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
        let language = this.props.language;
        let input2, input3;
        if (language === LANGUAGES.VI) {
            input2 = "Nhập mật khẩu";
            input3 = "Nhập xác nhận mật khẩu";
        } else {
            input2 = "Enter your password";
            input3 = "Enter your comfirm password";
        }
        console.log(errCode);
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
                            <FormattedMessage id="login.reset" />
                        </div>

                        <div className="col-12 form-group login-input">
                            <label>
                                <FormattedMessage id="login.password" />
                                (*) :
                            </label>
                            <div className="custom-password">
                                <input
                                    type={
                                        this.state.isShowPassword
                                            ? "text"
                                            : "password"
                                    }
                                    disabled={errCode == 0 ? false : true}
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
                                <FormattedMessage id="login.confirm" />
                                (*) :
                            </label>
                            <div className="custom-password">
                                <input
                                    type={
                                        this.state.isShowconfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    disabled={errCode == 0 ? false : true}
                                    className="form-control"
                                    placeholder={input2}
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
                                    <FormattedMessage id="login.login" />
                                </button>
                            ) : (
                                <button disabled className="btn-login1">
                                    <FormattedMessage id="login.login" />
                                </button>
                            )}
                        </div>
                        <div className="row mt-3">
                            <span
                                style={{ fontWeight: "500", fontSize: "15px" }}>
                                <Link to="/login">
                                    <FormattedMessage id="login.back-login" />
                                </Link>
                            </span>
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
