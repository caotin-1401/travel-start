import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { getAllCodeService } from "../../../services/userService";
import { Row, Col } from "reactstrap";
import "./UserRedux.scss";
import * as actions from "../../../store/actions";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../utils";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css"; // This only needs to be imported once in your app
import TableManageUser from "./TableManageUser";

class UserRedux extends Component {
    constructor(props) {
        super(props);
        this.state = {
            roleArr: [],
            genderArr: [],
            previewImgURL: "",
            isOpenImg: false,

            email: "",
            password: "",
            name: "",
            phone: "",
            address: "",
            gender: "",
            role: "",
            avatar: "",
            action: "",
            userEditId: "",
        };
    }
    async componentDidMount() {
        this.props.getRoleStart();
        this.props.getGenderStart();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.roleRedux !== this.props.roleRedux) {
            let arrRoles = this.props.roleRedux;
            this.setState({
                roleArr: arrRoles,
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : "",
            });
        }
        if (prevProps.genderRedux !== this.props.genderRedux) {
            let arrGenders = this.props.genderRedux;
            this.setState({
                genderArr: arrGenders,
                gender:
                    arrGenders && arrGenders.length > 0
                        ? arrGenders[0].keyMap
                        : "",
            });
        }
        if (prevProps.listUsers !== this.props.listUsers) {
            let arrRoles = this.props.roleRedux;
            let arrGenders = this.props.genderRedux;
            this.setState({
                email: "",
                password: "",
                name: "",
                phone: "",
                address: "",
                role: arrRoles && arrRoles.length > 0 ? arrRoles[0].keyMap : "",
                gender:
                    arrGenders && arrGenders.length > 0
                        ? arrGenders[0].keyMap
                        : "",
                avatar: "",
                action: CRUD_ACTIONS.CREATE,
                previewImgURL: "",
            });
        }
    }

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

    openPreviewImg = () => {
        if (this.state.previewImgURL === "") return;
        this.setState({
            isOpenImg: true,
        });
    };

    handleSaveUser = () => {
        let isValid = this.checkValidInput();
        console.log(isValid);
        if (isValid === false) return;

        let { action } = this.state;
        console.log("action", this.state.action);
        if (action === CRUD_ACTIONS.CREATE) {
            this.props.createNewUser({
                email: this.state.email,
                password: this.state.password,
                name: this.state.name,
                address: this.state.address,
                phoneNumber: this.state.phone,
                roleID: this.state.role,
                gender: this.state.gender,
                avatar: this.state.avatar,
            });
        }
        if (action === CRUD_ACTIONS.EDIT) {
            this.props.EditUser({
                id: this.state.userEditId,
                name: this.state.name,
                address: this.state.address,
                roleID: this.state.role,
                gender: this.state.gender,
                phoneNumber: this.state.phone,
                avatar: this.state.avatar,
            });
        }
    };

    checkValidInput = () => {
        let isValid = true;
        let arrCheck = ["name", "email", "password", "phone", "address"];
        for (let i = 0; i < arrCheck.length; i++) {
            if (!this.state[arrCheck[i]]) {
                isValid = false;
                alert("this input is required: " + arrCheck[i]);
                break;
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

    handleEditUserFromParent = (user) => {
        let imageBase64 = "";
        if (user.image) {
            imageBase64 = Buffer.from(user.image, "base64").toString("binary");
        }

        this.setState({
            email: user.email,
            password: "HASHCODE",
            name: user.name,
            phone: user.phoneNumber,
            address: user.address,
            role: user.roleID,
            gender: user.gender,
            avatar: user.image,
            previewImgURL: imageBase64,
            action: CRUD_ACTIONS.EDIT,
            userEditId: user.id,
            imageBase64,
        });
    };

    render() {
        let language = this.props.language;
        let roles = this.state.roleArr;
        let genders = this.state.genderArr;
        let { email, password, name, phone, address, gender, role, avatar } =
            this.state;
        console.log(this.state);

        return (
            <div>
                <div className="user-redux-container">
                    <div className="title">User Redux</div>
                    <div>
                        {/* {isLoadingRoles === true ? 'Loading' : ''} */}
                    </div>
                    <div className="container form-redux">
                        {/* <p><FormattedMessage id="manage-user.add"/></p> */}
                        {/* <form> */}
                        <Row>
                            <Col md={4}>
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
                            <Col md={4}>
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
                                    disabled={
                                        this.state.action === CRUD_ACTIONS.EDIT
                                            ? true
                                            : false
                                    }
                                />
                            </Col>
                            <Col md={4}>
                                <label htmlFor="examplePassword">
                                    Password
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
                                    disabled={
                                        this.state.action === CRUD_ACTIONS.EDIT
                                            ? true
                                            : false
                                    }
                                />
                            </Col>
                        </Row>

                        <Row>
                            <Col md={4}>
                                <label htmlFor="phone">Phone Number</label>
                                <input
                                    className="form-control mb-4"
                                    id="phone"
                                    placeholder="with a placeholder"
                                    type="text"
                                    value={phone}
                                    onChange={(event) => {
                                        this.onChangeInput(event, "phone");
                                    }}
                                />
                            </Col>
                            <Col md={8}>
                                {/* <FormGroup> */}
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
                            </Col>
                        </Row>

                        <Row>
                            <Col md={4}>
                                <label htmlFor="exampleAddress">Gender</label>
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
                                                <option
                                                    key={index}
                                                    value={item.keyMap}>
                                                    {language === LANGUAGES.VI
                                                        ? item.valueVi
                                                        : item.valueEn}
                                                </option>
                                            );
                                        })}
                                </select>
                            </Col>
                            <Col md={4}>
                                <label htmlFor="exampleAddress">RoleID</label>
                                <select
                                    className="form-select mb-4"
                                    onChange={(event) => {
                                        this.onChangeInput(event, "role");
                                    }}
                                    value={role}>
                                    {roles &&
                                        roles.length > 0 &&
                                        roles.map((item, index) => {
                                            return (
                                                <option
                                                    key={index}
                                                    value={item.keyMap}>
                                                    {language === LANGUAGES.VI
                                                        ? item.valueVi
                                                        : item.valueEn}
                                                </option>
                                            );
                                        })}
                                </select>
                            </Col>

                            <Col md={4}>
                                <label htmlFor="img">Img</label>
                                <div className="prev-img-container">
                                    <input
                                        // className="form-control mb-4"
                                        id="img"
                                        type="file"
                                        hidden
                                        onChange={(event) =>
                                            this.handleChangeImage(event)
                                        }
                                    />
                                    <label className="upload-img" htmlFor="img">
                                        Tải ảnh<i className="fas fa-upload"></i>
                                    </label>
                                    <div
                                        className="prev-img"
                                        style={{
                                            backgroundImage: `url(${this.state.previewImgURL})`,
                                        }}
                                        onClick={() =>
                                            this.openPreviewImg()
                                        }></div>
                                </div>
                            </Col>
                        </Row>
                        <button
                            className={
                                this.state.action === CRUD_ACTIONS.EDIT
                                    ? "btn btn-warning"
                                    : "btn btn-primary"
                            }
                            // className="btn btn-primary"
                            onClick={() => this.handleSaveUser()}>
                            {this.state.action === CRUD_ACTIONS.EDIT ? (
                                <FormattedMessage id="manage-user.edit" />
                            ) : (
                                <FormattedMessage id="manage-user.save" />
                            )}
                        </button>
                        <div style={{ marginTop: "50px" }}></div>
                        <Row>
                            <TableManageUser
                                handleEditUserFromParentKey={
                                    this.handleEditUserFromParent
                                }
                                action={this.state.action}
                            />
                        </Row>
                        {/* </form> */}
                    </div>
                    {/* <TableManageUser/> */}
                    {this.state.isOpenImg === true && (
                        <Lightbox
                            mainSrc={this.state.previewImgURL}
                            onCloseRequest={() =>
                                this.setState({ isOpenImg: false })
                            }
                        />
                    )}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        roleRedux: state.admin.roles,
        genderRedux: state.admin.gender,
        listUsers: state.admin.users,

        // isLoadingRoles: state.admin.isLoadingRoles
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        createNewUser: (data) => dispatch(actions.createNewUser(data)),
        fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
        EditUser: (data) => dispatch(actions.EditUser(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRedux);
