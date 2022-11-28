import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import "./Login.scss";
import logo from "../../assets/logo2.png";
import { Link } from "react-router-dom";
import { postForgotPasswordService } from "../../services/userService";
class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
        };
    }

    handleChangeUser = (e) => {
        this.setState({
            email: e.target.value,
        });
    };

    // handleKeyDown = (e) => {
    //     if (e.key === "Enter" || e.keyCode === 13) {
    //         this.handleLogin();
    //     }
    // };

    handleLogin = async () => {
        // alert("asdj");
        let { email } = this.state;
        try {
            console.log(this.state.email);
            let data = await postForgotPasswordService({ email });
            console.log(data);
        } catch (error) {
            if (error.response) {
                if (error.response.data) {
                    // this.setState({
                    //     errMessage: error.response.data.message,
                    // });
                }
            }
        }
    };

    render() {
        console.log(this.state.email);
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

                        <div className="row mt-3">
                            <div className="col-6">
                                <span className="forgot-pass">
                                    <Link to="/login">Back to login</Link>
                                </span>
                            </div>
                            <div className="col-6">
                                <span className="forgot-pass">
                                    <Link to="/reset-password">resset</Link>
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
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
