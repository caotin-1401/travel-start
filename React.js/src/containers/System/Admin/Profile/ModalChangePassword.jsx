import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from "reactstrap";
import Box from "@mui/material/Box";
import * as actions from "../../../../store/actions";
import { LANGUAGES } from "../../../../utils";
import { toast } from "react-toastify";
import { changePasswordService } from "../../../../services/userService";
class ModalChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            oldPass: "",
            newPass: "",
            confirmPass: "",
            errMessage: "",
            isOldPass: false,
            isNewPass: false,
            isConfirmPass: false,
        };
    }

    componentDidMount() {
        this.setState({
            id: this.props.currentUser,
        });
    }

    toggle = () => {
        this.props.toggleFromParent();
    };

    onChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState,
        });
    };
    handleShowOldPassword = () => {
        this.setState({
            isOldPass: !this.state.isOldPass,
        });
    };
    handleShowNewPassword = () => {
        this.setState({
            isNewPass: !this.state.isNewPass,
        });
    };
    handleShowConfirmPassword = () => {
        this.setState({
            isConfirmPass: !this.state.isConfirmPass,
        });
    };
    handleSave = async () => {
        let language = this.props.language;
        let { id, oldPass, newPass, confirmPass } = this.state;
        let err;
        if (!oldPass) {
            if (language === LANGUAGES.VI) {
                err = "Mật khẩu cũ không chính xác";
            } else {
                err = "Old password is incorrect";
            }
            this.setState({
                errMessage: err,
            });
            return;
        } else if (!newPass) {
            if (language === LANGUAGES.VI) {
                err = "Mật khẩu mới không được để trống";
            } else {
                err = "Please enter your new password";
            }
            this.setState({
                errMessage: err,
            });
            return;
        } else if (!confirmPass) {
            if (language === LANGUAGES.VI) {
                err = "Xác nhận mật khẩu không được để trống";
            } else {
                err = "Please enter your confirm password";
            }
            this.setState({
                errMessage: err,
            });
            return;
        } else if (newPass !== confirmPass) {
            if (language === LANGUAGES.VI) {
                err = "Xác nhận mật khẩu phải giống mật khẩu";
            } else {
                err = "Confirm Passwords must be same as password";
            }
            this.setState({
                errMessage: err,
            });
            return;
        } else if (oldPass.trim().length < 8) {
            if (language === LANGUAGES.VI) {
                err = "Mật khẩu cũ không chính xác";
            } else {
                err = "Old password is incorrect";
            }
            this.setState({
                errMessage: err,
            });
            return;
        } else if (newPass.trim().length < 8) {
            if (language === LANGUAGES.VI) {
                err = "Mật khẩu phải có ít nhất 8 ký tự";
            } else {
                err = "Password must be at least 8 characters";
            }
            this.setState({
                errMessage: err,
            });
            return;
        } else {
            let res = await changePasswordService({
                id,
                oldPass,
                newPass,
            });
            console.log(res);
            if (res && res.errCode === 0) {
                if (language === LANGUAGES.VI) {
                    toast.success("Thay đổi mật khẩu thành công");
                } else {
                    toast.success("Change password successfully");
                }
            } else if (res && res.errCode === 2) {
                if (language === LANGUAGES.VI) {
                    err = "Mật khẩu cũ không chính xác";
                } else {
                    err = "Old password is incorrect";
                }
                this.setState({
                    errMessage: err,
                });
                return;
            }
            this.props.closeModal();
        }
    };
    render() {
        let { oldPass, newPass, confirmPass, errMessage } = this.state;
        return (
            <div>
                <Modal
                    isOpen={this.props.isOpen}
                    toggle={() => {
                        this.toggle();
                    }}
                    centered
                    size="lg">
                    <ModalHeader
                        toggle={() => {
                            this.toggle();
                        }}>
                        <FormattedMessage id="account.change" />
                    </ModalHeader>
                    <ModalBody>
                        <Box>
                            <Row>
                                <Col md={1}></Col>
                                <Col md={10} className="form-group login-input">
                                    <label htmlFor="oldPass" className="mb-2">
                                        <FormattedMessage id="account.passOld" />
                                    </label>
                                    <div className="custom-password mb-4">
                                        <input
                                            type={this.state.isOldPass ? "text" : "password"}
                                            id="oldPass"
                                            className="form-control"
                                            placeholder="Enter your password"
                                            value={oldPass}
                                            onChange={(event) => {
                                                this.onChangeInput(event, "oldPass");
                                            }}
                                        />
                                        <span onClick={() => this.handleShowOldPassword()}>
                                            <i
                                                className={
                                                    this.state.isOldPass
                                                        ? "fas fa-eye"
                                                        : "fas fa-eye-slash"
                                                }></i>
                                        </span>
                                    </div>
                                </Col>
                                <Col md={1}></Col>
                            </Row>
                            <Row>
                                <Col md={1}></Col>
                                <Col md={10} className="form-group login-input">
                                    <label htmlFor="newPass" className="mb-2">
                                        <FormattedMessage id="account.passNew" />
                                    </label>
                                    <div className="custom-password mb-4">
                                        <input
                                            type={this.state.isNewPass ? "text" : "password"}
                                            id="newPass"
                                            className="form-control"
                                            placeholder="Enter your password"
                                            value={newPass}
                                            onChange={(event) => {
                                                this.onChangeInput(event, "newPass");
                                            }}
                                        />
                                        <span onClick={() => this.handleShowNewPassword()}>
                                            <i
                                                className={
                                                    this.state.isNewPass
                                                        ? "fas fa-eye"
                                                        : "fas fa-eye-slash"
                                                }></i>
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            color: "red",
                                            fontSize: "16px",
                                        }}>
                                        {errMessage}
                                    </div>
                                </Col>
                                <Col md={1}></Col>
                            </Row>
                            <Row>
                                <Col md={1}></Col>
                                <Col md={10} className="form-group login-input">
                                    <label htmlFor="confirmPass" className="mb-2">
                                        <FormattedMessage id="account.confirm" />
                                    </label>
                                    <div className="custom-password mb-4">
                                        <input
                                            type={this.state.isConfirmPass ? "text" : "password"}
                                            id="confirmPass"
                                            className="form-control"
                                            placeholder="Enter your password"
                                            value={confirmPass}
                                            onChange={(event) => {
                                                this.onChangeInput(event, "confirmPass");
                                            }}
                                        />
                                        <span onClick={() => this.handleShowConfirmPassword()}>
                                            <i
                                                className={
                                                    this.state.isConfirmPass
                                                        ? "fas fa-eye"
                                                        : "fas fa-eye-slash"
                                                }></i>
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            color: "red",
                                            fontSize: "16px",
                                        }}>
                                        {this.state.errMessage}
                                    </div>
                                </Col>
                                <Col md={1}></Col>
                            </Row>
                        </Box>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            color="secondary"
                            onClick={() => {
                                this.toggle();
                            }}
                            className="btn-primary-modal">
                            <FormattedMessage id="account.cancel" />
                        </Button>{" "}
                        <Button
                            color="primary"
                            onClick={() => {
                                this.handleSave();
                            }}
                            className="btn-primary-modal">
                            <FormattedMessage id="account.save" />
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        events: state.admin.events,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllEvents: () => dispatch(actions.fetchAllEvents()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalChangePassword);
