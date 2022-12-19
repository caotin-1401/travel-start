import React, { Component } from "react";
import { connect } from "react-redux";
import "./Login.scss";
import logo from "../../assets/logo2.png";
import { Link } from "react-router-dom";
import { postForgotPasswordService } from "../../services/userService";
import { FormattedMessage } from "react-intl";
import { LANGUAGES } from "../../utils";

class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            errMessage: "",
        };
    }

    handleChangeUser = (e) => {
        this.setState({
            email: e.target.value,
        });
    };

    handleKeyDown = (e) => {
        if (e.key === "Enter" || e.keyCode === 13) {
            this.handleLogin();
        }
    };

    handleLogin = async () => {
        this.setState({ errMessage: "" });
        let { email } = this.state;
        let language = this.props.language;
        let message;
        if (!email) {
            if (language === LANGUAGES.VI) {
                message = "Vui lòng nhập email";
            } else {
                message = "Please enter your email";
            }
        } else {
            try {
                let data = await postForgotPasswordService({ email });
                data && data.errCode === 0
                    ? (message = "")
                    : language === LANGUAGES.EN
                    ? (message = "Email does not exist")
                    : (message = "Email không tồn tại");
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

    render() {
        let language = this.props.language;
        let input1, input2;
        if (language === LANGUAGES.VI) {
            input1 = "Nhập email";
            input2 = "Gửi email thành công";
        } else {
            input1 = "Enter your email";
            input2 = "Send email success";
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
                            <FormattedMessage id="login.forgot" />
                        </div>
                        <div className="col-12 form-group login-input">
                            <label style={{ textAlign: "justify" }}>
                                <FormattedMessage id="login.title2" />
                            </label>
                        </div>
                        <div className="col-12 form-group login-input">
                            <label>Email : </label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder={input1}
                                value={this.state.email}
                                onChange={(e) => this.handleChangeUser(e)}
                                onKeyDown={this.handleKeyDown}
                            />
                        </div>
                        <div className="col-12" style={{ color: "red" }}>
                            {this.state.errMessage}
                        </div>
                        <div className="col-12">
                            <button
                                className="btn-login"
                                onClick={this.handleLogin}>
                                <FormattedMessage id="login.send" />
                            </button>
                        </div>

                        <div className="row mt-3">
                            <span className="forgot-pass">
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
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
