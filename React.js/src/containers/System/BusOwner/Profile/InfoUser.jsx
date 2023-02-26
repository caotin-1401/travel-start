import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import { withRouter } from "react-router";
import { Row, Col } from "reactstrap";
import "../style.scss";
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
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let userId = this.props.match.params.id;
            let res = await getAllUsers(+userId);
            console.log(res.users);
            let imageBase64 = "";
            if (res.users[0].image) {
                imageBase64 = Buffer.from(res.users[0].image, "base64").toString("binary");
            }
            this.setState({
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
        if (this.state.name && prevState.name) {
            if (
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
        let { name, phoneNumber, email, address, id, avatar } = this.state;
        let language = this.props.language;
        if (!name) {
            if (language === "vi") toast.error("Tên không được để trống");
            else toast.error("Please enter your name");
        } else if (!email) {
            if (language === "vi") toast.error("Email không được để trống");
            else toast.error("Please enter your Email");
        } else if (!phoneNumber) {
            if (language === "vi") toast.error("Số điện thoại không được để trống");
            else toast.error("Please enter your phone");
        } else {
            let res = await editUserService({
                id,
                name,
                email,
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
            } else if (res && res.errCode === 1) {
                if (language === LANGUAGES.VI) {
                    toast.error("Email đã tồn tại trong hệ thống, vui lòng chọn email khác");
                } else {
                    toast.error("Your email already exists, please try another email");
                }
            } else if (res && res.errCode === 6) {
                if (language === LANGUAGES.VI) {
                    toast.error("Số điện thoại tồn tại trong hệ thống, vui lòng chọn sô khác");
                } else {
                    toast.error("Your email already exists, please try another email");
                }
            } else {
                if (language === LANGUAGES.VI) {
                    toast.error("Cập nhập thông tin người dùng thất bại");
                } else {
                    toast.error("User information update failed");
                }
            }
        }
        return;
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
        let { name, phoneNumber, email, address, isChanged } = this.state;

        let value;
        if (language === "vi") value = "Chủ nhà xe";
        else value = "Bus operator";
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

                        <Col md={6}>
                            <label className="mb-2">
                                {" "}
                                <FormattedMessage id="account.Role" />
                            </label>
                            <input
                                className="form-control mb-4"
                                disabled
                                placeholder="with a placeholder"
                                type="text"
                                value={value}
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <label htmlFor="exampleEmail" className="mb-2">
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
                            <label htmlFor="phoneNumber" className="mb-2">
                                <FormattedMessage id="account.phone" />
                            </label>
                            <input
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
        isLoggedIn: state.user.isLoggedIn,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        processLogout: () => dispatch(actions.processLogout()),
    };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(InfoUser));
