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
// import "../UserRedux.scss";
import * as actions from "../../../../store/actions";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../../utils";
import _ from "lodash";

class ModalEditUser extends Component {
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
            action: "",
            userEditId: "",
        };
    }
    async componentDidMount() {
        this.props.getGenderStart();

        let user = this.props.currentUser;
        if (user && !_.isEmpty(user)) {
            let imageBase64 = "";
            if (user.image) {
                imageBase64 = Buffer.from(user.image, "base64").toString(
                    "binary"
                );
            }

            this.setState({
                email: user.email,
                password: "HASHCODE",
                name: user.name,
                phone: user.phoneNumber,
                address: user.address,

                gender: user.gender,
                avatar: "",
                previewImgURL: imageBase64,
                action: CRUD_ACTIONS.EDIT,
                userEditId: user.id,
            });
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.genderRedux !== this.props.genderRedux) {
            let arrGenders = this.props.genderRedux;
            this.setState({
                genderArr: arrGenders,
            });
        }
    }
    toggle = () => {
        this.props.toggleFromParent();
    };
    handleSaveUser = () => {
        let isValid = this.checkValidInput();
        console.log(isValid);
        if (isValid === false) return;

        this.props.doEditUser1(this.state);

        let { action } = this.state;

        if (action === CRUD_ACTIONS.EDIT) {
            this.props.EditUser({
                id: this.state.userEditId,
                name: this.state.name,
                address: this.state.address,
                gender: this.state.gender,
                phoneNumber: this.state.phone,
                avatar: this.state.avatar,
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
    render() {
        let language = this.props.language;
        let genders = this.state.genderArr;
        let { email, password, name, phone, address, gender, avatar } =
            this.state;

        return (
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
                                disabled
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
                                disabled
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
                                    onClick={() => this.openPreviewImg()}></div>
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
                            this.handleSaveUser();
                        }}
                        className="btn-primary-modal">
                        Save
                    </Button>
                </ModalFooter>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        genderRedux: state.admin.gender,
        listUsers: state.admin.users,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
        EditUser: (data) => dispatch(actions.EditUser(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditUser);
