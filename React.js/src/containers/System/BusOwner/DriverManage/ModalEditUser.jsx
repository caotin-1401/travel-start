import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from "reactstrap";
import * as actions from "../../../../store/actions";
import { LANGUAGES } from "../../../../utils";
import _ from "lodash";

class ModalEditUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            genderArr: [],
            avatar: "",
            isOpenImg: false,
            email: "",
            password: "",
            name: "",
            phone: "",
            address: "",
            gender: "",
            userEditId: "",
        };
    }
    async componentDidMount() {
        this.props.getGenderStart();

        let user = this.props.currentUser;
        if (user && !_.isEmpty(user)) {
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
                gender: user.gender,
                avatar: imageBase64,
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

    render() {
        let language = this.props.language;
        let genders = this.state.genderArr;
        let { email, password, name, phone, address, gender } = this.state;

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
                    <FormattedMessage id="menu.busOwner.manageDriver.titleInfo" />
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Col md={6}>
                            <label>
                                <FormattedMessage id="account.email" />
                            </label>
                            <input className="form-control mb-4" value={email} disabled />
                        </Col>
                        <Col md={6}>
                            <label>
                                <FormattedMessage id="account.pass" />
                            </label>
                            <input className="form-control mb-4" type="password" value={password} disabled />
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <label htmlFor="name">
                                <FormattedMessage id="account.Name" />
                            </label>
                            <input className="form-control mb-4" value={name} disabled />
                        </Col>
                        <Col md={6}>
                            <label htmlFor="phone">
                                <FormattedMessage id="account.phone" />
                            </label>
                            <input className="form-control mb-4" value={phone} disabled />
                        </Col>
                    </Row>
                    <label>
                        <FormattedMessage id="account.address" />
                    </label>
                    <input className="form-control mb-4" value={address} disabled />
                    <Row>
                        <Col md={3}>
                            <label>
                                <FormattedMessage id="account.gender" />
                            </label>
                            <select disabled className="form-select mb-4" value={gender}>
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
                            <label>Avatar</label>
                            <div className="prev-img-container">
                                <div
                                    className="prev-img"
                                    style={{
                                        backgroundImage: `url(${this.state.avatar})`,
                                        marginLeft: 0,
                                    }}
                                    onClick={() => this.openPreviewImg()}></div>
                            </div>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="primary"
                        onClick={() => {
                            this.toggle();
                        }}
                        className="btn-primary-modal">
                        <FormattedMessage id="menu.busOwner.manageDriver.close" />
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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getGenderStart: () => dispatch(actions.fetchGenderStart()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalEditUser);
