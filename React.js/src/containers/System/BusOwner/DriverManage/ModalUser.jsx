import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from "reactstrap";
import "../style.scss";
import * as actions from "../../../../store/actions";
import { LANGUAGES, CommonUtils } from "../../../../utils";
import { toast } from "react-toastify";
import { createNewUserService } from "../../../../services/userService";
var emailRegex =
    /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

function isEmailValid(email) {
    if (!email) return false;

    if (email.length > 254) return false;

    var valid = emailRegex.test(email);
    if (!valid) return false;

    // Further checking of some things regex can't handle
    var parts = email.split("@");
    if (parts[0].length > 64) return false;

    var domainParts = parts[1].split(".");
    if (
        domainParts.some(function (part) {
            return part.length > 63;
        })
    )
        return false;

    return true;
}

class ModalUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            previewImgURL: "",
            isOpenImg: false,

            email: "",
            password: "",
            name: "",
            phone: "",
            address: "",
            gender: "",
            avatar: "",
            userEditId: "",
            busOwnerId: "",
            busOwner: "",
        };
    }
    async componentDidMount() {
        this.props.getGenderStart();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.genderRedux !== this.props.genderRedux) {
            let arrGenders = this.props.genderRedux;
            this.setState({
                genderArr: arrGenders,
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : "",
            });
        }
        if (prevProps.listUsers !== this.props.listUsers) {
            let arrGenders = this.props.genderRedux;
            this.setState({
                email: "",
                password: "",
                name: "",
                phone: "",
                address: "",
                gender: arrGenders && arrGenders.length > 0 ? arrGenders[0].keyMap : "",
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
        let isValid = true;
        let { language } = this.props;
        let { email, password, name, phone, address } = this.state;
        if (language === "vi") {
            if (!email) {
                toast.error("Email không được để trống ! ");
                isValid = false;
            } else if (!isEmailValid(email)) {
                toast.error("Email không đúng định dạng! ");
                isValid = false;
            } else if (!password) {
                toast.error("Mật khẩu không được để trống ! ");
                isValid = false;
            } else if (password.length < 8 || password.length > 15) {
                toast.error("Mật khẩu tối thiểu 8 ký tự và tối đa 15 ký tự ");
                isValid = false;
            } else if (isNaN(phone)) {
                toast.error("Số điện thoại phải là 1 chuỗi số");
                isValid = false;
            } else if (!name) {
                toast.error("Tên không được để trống ! ");
                isValid = false;
            } else if (!phone) {
                toast.error("Số điện thoại không được để trống ! ");
                isValid = false;
            } else if (!address) {
                toast.error("Địa chỉ không được để trống ! ");
                isValid = false;
            }
        } else {
            if (!email) {
                toast.error("Please enter your email! ");
                isValid = false;
            } else if (!isEmailValid(email)) {
                toast.error("Invalid mail address! ");
                isValid = false;
            } else if (!password) {
                toast.error("Please enter your password! ");
                isValid = false;
            } else if (password.length < 8 || password.length > 15) {
                toast.error("Password minimum 8 characters and maximum 15 characters     ");
                isValid = false;
            } else if (isNaN(phone)) {
                toast.error("Phone Number must be a number");
                isValid = false;
            } else if (!name) {
                toast.error("TPlease enter your name! ");
                isValid = false;
            } else if (!phone) {
                toast.error("Please enter your phone! ");
                isValid = false;
            } else if (!address) {
                toast.error("Please enter your address! ");
                isValid = false;
            }
        }
        return isValid;
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
        let { language } = this.props;
        if (isValid === false) return;
        else {
            let res = await createNewUserService({
                email: this.state.email,
                password: this.state.password,
                name: this.state.name,
                address: this.state.address,
                phoneNumber: this.state.phone,
                roleID: "R3",
                gender: this.state.gender,
                avatar: this.state.avatar,
                busOwnerId: this.props.userInfo.id,
                busOwner: this.props.userInfo.name,
            });
            if (res && res.errCode === 0) {
                if (language === "vi") toast.success("Thêm tài xế thành công");
                else toast.success("Successfully added driver");
                this.props.createNewUser1(this.state);
            } else if (res && res.errCode === 1) {
                if (language === "vi") toast.error("Email đã được sử dụng");
                else toast.error("Email already exists, please try another email");
            } else if (res && res.errCode === 8) {
                if (language === "vi") toast.error("Số điện thoại đã được sử dụng");
                else toast.error("Phone number already exists, please try another email");
            }
        }
    };

    render() {
        let language = this.props.language;
        let genders = this.state.genderArr;
        let { email, password, name, phone, address, gender } = this.state;
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
                        <FormattedMessage id="menu.busOwner.manageDriver.titleAdd" />
                    </ModalHeader>
                    <ModalBody>
                        <Row>
                            <Col md={6}>
                                <label htmlFor="exampleEmail">
                                    <FormattedMessage id="account.email" />
                                </label>
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
                                <label htmlFor="examplePassword">
                                    <FormattedMessage id="account.pass" />
                                </label>
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
                                <label htmlFor="name">
                                    <FormattedMessage id="account.Name" />
                                </label>
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
                                <label htmlFor="phone">
                                    <FormattedMessage id="account.phone" />
                                </label>
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
                        <label htmlFor="exampleAddress">
                            <FormattedMessage id="account.address" />
                        </label>
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
                            <Col md={3}>
                                <label htmlFor="exampleAddress">
                                    {" "}
                                    <FormattedMessage id="account.gender" />
                                </label>
                                <select
                                    className="form-select mb-4"
                                    onChange={(event) => {
                                        this.onChangeInput(event, "gender");
                                    }}
                                    value={gender}>
                                    {genders &&
                                        genders.length > 0 &&
                                        genders.map((item, index) => {
                                            return (
                                                <option key={index} value={item.keyMap}>
                                                    {language === LANGUAGES.VI ? item.valueVi : item.valueEn}
                                                </option>
                                            );
                                        })}
                                </select>
                            </Col>
                            <Col md={6}>
                                <label htmlFor="img">Avatar</label>
                                <div className="prev-img-container">
                                    <input
                                        // className="form-control mb-4"
                                        id="img"
                                        type="file"
                                        hidden
                                        onChange={(event) => this.handleChangeImage(event)}
                                    />
                                    <label className="upload-img" htmlFor="img">
                                        <FormattedMessage id="account.upload" />
                                        <i className="fas fa-upload"></i>
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
                            <FormattedMessage id="account.cancel" />
                        </Button>{" "}
                        <Button
                            color="primary"
                            onClick={() => {
                                this.handleAddNewUser();
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
        genderRedux: state.admin.gender,
        listUsers: state.admin.users,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        createNewUser: (data) => dispatch(actions.createNewUser(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);
