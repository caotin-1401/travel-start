import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Row,
    Col,
} from "reactstrap";
import "./UserManage.scss";
import * as actions from "../../../../store/actions";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../../utils";
import PropTypes from "prop-types";
import { emitter } from "../../../../utils/emitter";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
class ModalUser extends Component {
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
            if (arrRoles && arrRoles.length > 0) {
                for (var i = 0; i < arrRoles.length - 1; i++) {
                    if (arrRoles[i].id === 3) {
                        arrRoles.splice(i, 1);
                    }
                }
                console.log(arrRoles);
            }

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
        let arrCheck = ["email", "password", "name", "phone", "address"];
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

    handleAddNewUser = () => {
        let isValid = this.checkValidInput();
        if (isValid === false) return;
        this.props.createNewUser1(this.state);
        let { action } = this.state;
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
    };

    render() {
        let language = this.props.language;
        let roles = this.state.roleArr;
        let genders = this.state.genderArr;
        let { email, password, name, phone, address, gender, role, avatar } =
            this.state;
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
                        Create a new user
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
                            <Col md={3}>
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
                            <Col md={3}>
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
                            <Col md={6}>
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
        roleRedux: state.admin.roles,
        genderRedux: state.admin.gender,
        listUsers: state.admin.users,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getRoleStart: () => dispatch(actions.fetchRoleStart()),
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        createNewUser: (data) => dispatch(actions.createNewUser(data)),
        fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalUser);
