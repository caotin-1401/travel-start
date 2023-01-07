import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router";
import { Row, Col } from "reactstrap";
import "./ProfileAdmin.scss";
import * as actions from "../../../../store/actions";
import { LANGUAGES, CommonUtils } from "../../../../utils";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { getAllUsers, editUserService } from "../../../../services/userService";
import { toast } from "react-toastify";
import ModalChangePassword from "./ModalChangePassword";
class InfoUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            gender: "",
            name: "",
            phoneNumber: "",
            email: "",
            address: "",
            id: "",
            avatar: "",
            previewImgURL: "",
            isChanged: false,
            editPass: "",
            isOpenModel: false,
        };
    }
    async componentDidMount() {
        this.props.getGenderStart();
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let userId = this.props.match.params.id;
            let res = await getAllUsers(+userId);
            console.log(res.users);
            let imageBase64 = "";
            if (res.users[0].image) {
                imageBase64 = Buffer.from(res.users[0].image, "base64").toString("binary");
            }
            this.setState({
                gender: res.users[0].gender,
                id: res.users[0].id,
                name: res.users[0].name,
                phoneNumber: res.users[0].phoneNumber,
                email: res.users[0].email,
                address: res.users[0].address,
                previewImgURL: imageBase64,
                avatar: imageBase64,
            });
        }
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.genderRedux !== this.props.genderRedux) {
            let arrGenders = this.props.genderRedux;
            this.setState({
                genderArr: arrGenders,
            });
        }
        if (this.state.name && prevState.name) {
            if (
                prevState.gender !== this.state.gender ||
                prevState.name !== this.state.name ||
                prevState.phoneNumber !== this.state.phoneNumber ||
                prevState.email !== this.state.email ||
                prevState.address !== this.state.address ||
                prevState.avatar !== this.state.avatar ||
                prevState.previewImgURL !== this.state.previewImgURL
            ) {
                this.setState({ isChanged: true });
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
    handleSaveUser = async () => {
        let { gender, name, phoneNumber, email, address, id, avatar } = this.state;
        console.log(this.state);
        let language = this.props.language;
        if (!gender) gender = "M";
        if (language === LANGUAGES.VI) {
            if (!name) {
                toast.error("Tên không được để trống");
            } else if (!email) {
                toast.error("Email không được để trống");
            } else if (!phoneNumber) {
                toast.error("Số điện thoại không được để trống");
            } else {
                console.log(gender);
                let res = await editUserService({
                    id,
                    name,
                    email,
                    gender,
                    phoneNumber,
                    address,
                    avatar,
                });
                if (res && res.errCode === 0) {
                    this.setState({
                        isChanged: false,
                    });
                    if (language === LANGUAGES.VI) {
                        toast.success("Cập nhập thông tin người dùng thành công");
                    } else {
                        toast.success("User information is successfully updated");
                    }
                } else {
                    if (language === LANGUAGES.VI) {
                        toast.success("Cập nhập thông tin người dùng thất bại");
                    } else {
                        toast.success("User information update failed");
                    }
                }
            }
            return;
        } else if (language === LANGUAGES.EN) {
            if (!name) {
                toast.error("Please enter your name");
            } else if (!email) {
                toast.error("Please enter your email");
            } else if (!phoneNumber) {
                toast.error("Please enter your phone number");
            } else {
                console.log(gender);
                let res = await editUserService({
                    id,
                    name,
                    email,
                    gender,
                    phoneNumber,
                    address,
                    avatar,
                });
                if (res && res.errCode === 0) {
                    this.setState({
                        isChanged: false,
                    });
                    if (language === LANGUAGES.VI) {
                        toast.success("Cập nhập thông tin người dùng thành công");
                    } else {
                        toast.success("User information is successfully updated");
                    }
                } else {
                    if (language === LANGUAGES.VI) {
                        toast.success("Cập nhập thông tin người dùng thất bại");
                    } else {
                        toast.success("User information update failed");
                    }
                }
            }
            return;
        } else {
        }
    };
    toggleUserEditModel = () => {
        this.setState({
            isOpenModel: !this.state.isOpenModel,
        });
    };
    handleChangeChangePassword = () => {
        this.setState({
            isOpenModel: true,
        });
    };
    closeModal = async (user) => {
        this.setState({
            isOpenModel: false,
        });
    };
    render() {
        const { language } = this.props;
        let genders = this.state.genderArr;
        let { gender, name, phoneNumber, email, address, isChanged } = this.state;
        return (
            <React.Fragment>
                {this.state.isOpenModel && (
                    <ModalChangePassword
                        isOpen={this.state.isOpenModel}
                        toggleFromParent={this.toggleUserEditModel}
                        currentUser={this.state.id}
                        closeModal={this.closeModal}
                    />
                )}

                <div className="contentProfile">
                    <div className="avatar-container">
                        <div className="prev-img-container">
                            <input
                                id="img"
                                type="file"
                                hidden
                                onChange={(event) => this.handleChangeImage(event)}
                            />
                            <div
                                className="avatar"
                                style={{
                                    backgroundImage: `url(${this.state.previewImgURL})`,
                                }}>
                                <label className="upload-avatar" htmlFor="img">
                                    <div className="avatar-small">
                                        <div className="border-edit">
                                            <PhotoCameraIcon className="camera" />
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                    <Row>
                        <Col md={6}>
                            <label htmlFor="name" className="mb-2">
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
                        <Col md={3}>
                            <label className="mb-2">
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
                                                {language === LANGUAGES.VI
                                                    ? item.valueVi
                                                    : item.valueEn}
                                            </option>
                                        );
                                    })}
                            </select>
                        </Col>
                        <Col md={3}>
                            <label className="mb-2">
                                <FormattedMessage id="account.Role" />
                            </label>
                            <input
                                className="form-control mb-4"
                                disabled
                                placeholder="with a placeholder"
                                type="text"
                                value="Admin"
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <label htmlFor="exampleEmail" className="mb-2">
                                <FormattedMessage id="account.email" />
                            </label>
                            <input
                                disabled
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
                            <label htmlFor="phoneNumber" className="mb-2">
                                <FormattedMessage id="account.phone" />
                            </label>
                            <input
                                disabled
                                className="form-control mb-4"
                                id="phoneNumber"
                                name="phoneNumberNumber"
                                placeholder="with a placeholder"
                                type="text"
                                value={phoneNumber}
                                onChange={(event) => {
                                    this.onChangeInput(event, "phoneNumber");
                                }}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={12}>
                            {" "}
                            <label htmlFor="exampleAddress" className="mb-2">
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
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6} style={{ display: "flex" }}>
                            <button
                                onClick={() => this.handleSaveUser()}
                                className={
                                    isChanged === true
                                        ? "btn btn-primary save-info mt-3"
                                        : "btn btn-secondary save-info mt-3"
                                }
                                disabled={isChanged === true ? false : true}>
                                <FormattedMessage id="account.saveInfo" />
                            </button>
                        </Col>
                        <Col md={6} style={{ display: "flex" }}>
                            <button
                                className="btn btn-primary change-password mt-3"
                                onClick={() => this.handleChangeChangePassword()}>
                                <FormattedMessage id="account.change" />
                            </button>
                        </Col>
                    </Row>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        genderRedux: state.admin.gender,
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        processLogout: () => dispatch(actions.processLogout()),
    };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(InfoUser));
