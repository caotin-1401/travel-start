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
import * as actions from "../../../../store/actions";
import { LANGUAGES, CommonUtils } from "../../../../utils";
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
            id: "",
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
                            <label>Email</label>
                            <input className="form-control mb-4" disabled />
                        </Col>
                        <Col md={6}>
                            <label>Password</label>
                            <input
                                className="form-control mb-4"
                                type="password"
                                value={password}
                                disabled
                            />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <label>Full Name</label>
                            <input
                                className="form-control mb-4"
                                value={name}
                                disabled
                            />
                        </Col>
                        <Col md={6}>
                            <label>Phone Number</label>
                            <input
                                className="form-control mb-4"
                                value={phone}
                                disabled
                            />
                        </Col>
                    </Row>
                    <label>Address</label>
                    <input
                        className="form-control mb-4"
                        value={address}
                        disabled
                    />
                    <Row>
                        <Col md={3}>
                            <label>Gender</label>
                            <select
                                className="form-select mb-4"
                                disabled
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

                        <Col md={6} disabled>
                            <label>Img</label>
                            <div className="prev-img-container">
                                <input
                                    // className="form-control mb-4"
                                    type="file"
                                    hidden
                                    disabled
                                />
                                <label className="upload-img">
                                    Tải ảnh<i className="fas fa-upload"></i>
                                </label>
                                <div
                                    className="prev-img"
                                    style={{
                                        backgroundImage: `url(${this.state.previewImgURL})`,
                                    }}></div>
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
                            this.toggle();
                        }}
                        className="btn-primary-modal">
                        Close
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

        // isLoadingRoles: state.admin.isLoadingRoles
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
        fetchUserRedux: () => dispatch(actions.fetchAllUsersStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditUser);
