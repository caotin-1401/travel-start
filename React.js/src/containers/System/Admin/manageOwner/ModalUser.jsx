import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from "reactstrap";
import "../style.scss";
import { LANGUAGES, CommonUtils } from "../../../../utils";
import { toast } from "react-toastify";
import { createNewUserService } from "../../../../services/userService";

class ModalUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            previewImgURL: "",
            email: "",
            password: "",
            name: "",
            phone: "",
            address: "",
            avatar: "",
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.usersRedux !== this.props.usersRedux) {
            this.setState({
                email: "",
                password: "",
                name: "",
                phone: "",
                address: "",
                avatar: "",
                previewImgURL: "",
            });
        }
    }
    toggle = () => {
        this.props.toggleFromParent();
    };
    handleChangeImage = async (event) => {
        const file = event.target.files[0];
        console.log(file);
        console.log(file.preview);
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            file.preview = URL.createObjectURL(file);
            this.setState({
                previewImgURL: file.preview,
                avatar: base64,
            });
        }
    };

    checkValidInput = () => {
        let { language } = this.props;
        if (language === LANGUAGES.VI) {
            if (!this.state.email) {
                toast.error("Email không được để trống ! ");
                return false;
            } else if (!this.state.password) {
                toast.error("Mật khẩu không được để trống ! ");
                return false;
            } else if (this.state.password.length < 8 || this.state.password.length > 15) {
                toast.error("Mật khẩu tối thiểu 8 ký tự và tối đa 15 ký tự ");
                return false;
            } else if (isNaN(this.state.phone)) {
                toast.error("Số điện thoại phải là 1 chuỗi số");
                return false;
            } else if (!this.state.name) {
                toast.error("Tên không được để trống ! ");
                return false;
            } else if (!this.state.phone) {
                toast.error("Số điện thoại không được để trống ! ");
                return false;
            } else if (!this.state.address) {
                toast.error("Địa chỉ không được để trống ! ");
                return false;
            } else return true;
        } else {
            if (!this.state.email) {
                toast.error("Please enter your email! ");
                return false;
            } else if (!this.state.password) {
                toast.error("Please enter your password! ");
                return false;
            } else if (this.state.password.length < 8 || this.state.password.length > 15) {
                toast.error("Password minimum 8 characters and maximum 15 characters     ");
                return false;
            } else if (isNaN(this.state.phone)) {
                toast.error("Phone Number must be a number");
                return false;
            } else if (!this.state.name) {
                toast.error("TPlease enter your name! ");
                return false;
            } else if (!this.state.phone) {
                toast.error("Please enter your phone! ");
                return false;
            } else if (!this.state.address) {
                toast.error("Please enter your address! ");
                return false;
            } else return true;
        }
    };

    onChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState,
        });
    };

    handleAddNewUser = async () => {
        let isValid = this.checkValidInput();
        let language = this.props.language;

        if (isValid === false) return;
        let res = await createNewUserService({
            email: this.state.email,
            password: this.state.password,
            name: this.state.name,
            address: this.state.address,
            phoneNumber: this.state.phone,
            roleID: "R2",
            avatar: this.state.avatar,
        });
        if (res && res.errCode === 0) {
            if (language === LANGUAGES.VI) {
                toast.success("Thêm nhà xe thành công");
            } else {
                toast.success("Add successful bus owner");
            }
            this.props.createNewUser1(this.state);
        } else if (res && res.errCode === 1) {
            if (language === LANGUAGES.VI) {
                toast.error("Email đã tồn tại, vui lòng nhập email khác");
            } else {
                toast.error("Your email already exists, please try another email");
            }
        } else if (res && res.errCode === 6) {
            if (language === LANGUAGES.VI) {
                toast.error("Email không đúng định dạng");
            } else {
                toast.error("Invalid mail address");
            }
        }
    };

    render() {
        let { email, password, name, phone, address } = this.state;
        return (
            <div>
                <Modal
                    isOpen={this.props.isOpen}
                    toggle={() => {
                        this.toggle();
                    }}
                    size="lg">
                    <ModalHeader
                        toggle={() => {
                            this.toggle();
                        }}>
                        <FormattedMessage id="menu.admin.listOwner.modaltitle" />
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col md={6}>
                                <label htmlFor="exampleEmail">Email</label>
                                <input
                                    className="form-control mb-4"
                                    id="exampleEmail"
                                    placeholder="with a placeholder"
                                    type="email"
                                    value={email}
                                    onChange={(event) => {
                                        this.onChangeInput(event, "email");
                                    }}
                                />
                            </Col>
                            <Col md={6}>
                                <label htmlFor="examplePassword">Password</label>
                                <input
                                    className="form-control mb-4"
                                    id="examplePassword"
                                    placeholder="password placeholder"
                                    type="password"
                                    value={password}
                                    onChange={(event) => {
                                        this.onChangeInput(event, "password");
                                    }}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <label htmlFor="name">Full Name</label>
                                <input
                                    className="form-control mb-4"
                                    id="name"
                                    placeholder="with a placeholder"
                                    type="text"
                                    value={name}
                                    onChange={(event) => {
                                        this.onChangeInput(event, "name");
                                    }}
                                />
                            </Col>
                            <Col md={6}>
                                <label htmlFor="phone">Phone Number</label>
                                <input
                                    className="form-control mb-4"
                                    id="phone"
                                    name="phoneNumber"
                                    placeholder="with a placeholder"
                                    type="text"
                                    value={phone}
                                    onChange={(event) => {
                                        this.onChangeInput(event, "phone");
                                    }}
                                />
                            </Col>
                        </Row>
                        <label htmlFor="exampleAddress">Address</label>
                        <input
                            className="form-control mb-4"
                            id="exampleAddress"
                            placeholder="1234 Main St"
                            type="text"
                            value={address}
                            onChange={(event) => {
                                this.onChangeInput(event, "address");
                            }}
                        />
                        <Row>
                            <Col md={6}>
                                <label htmlFor="img">Img</label>
                                <div className="prev-img-container">
                                    <input
                                        // className="form-control mb-4"
                                        id="img"
                                        type="file"
                                        hidden
                                        onChange={(event) => this.handleChangeImage(event)}
                                    />
                                    <label className="upload-img" htmlFor="img">
                                        Tải ảnh<i className="fas fa-upload"></i>
                                    </label>
                                    <div
                                        className="prev-img"
                                        style={{
                                            backgroundImage: `url(${this.state.previewImgURL})`,
                                        }}
                                        onClick={() => this.openPreviewImg()}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            color="secondary"
                            onClick={() => {
                                this.toggle();
                            }}
                            className="btn-primary-modal">
                            Cancel
                        </Button>{" "}
                        <Button
                            color="primary"
                            onClick={() => {
                                this.handleAddNewUser();
                            }}
                            className="btn-primary-modal">
                            Save
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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);
