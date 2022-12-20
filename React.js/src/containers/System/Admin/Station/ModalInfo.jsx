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
import { LANGUAGES } from "../../../../utils";
import _ from "lodash";
import localization from "moment/locale/vi";
import moment from "moment";
import "../style.scss";
class ModalInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            number: "",
            type: "",
            numOfSeat: 0,
            name: "",
            arrivalTime: "",
            Image: "",
            previewImgURL: "",
        };
    }
    async componentDidMount() {
        let user = this.props.currentUser;
        console.log(user);
        let test;
        if (user && !_.isEmpty(user)) {
            if (user && user.image) {
                test = Buffer.from(user.image, "base64").toString("binary");
            }
            this.setState({
                number: user.number,
                type: user.BusType.typeName,
                numOfSeat: user.BusType.numOfSeat,
                name: user.User.name,
                arrivalTime: user.arrivalTime,
                image: test,
                previewImgURL: test,
            });
        }
    }

    toggle = () => {
        this.props.toggleFromParent();
    };

    render() {
        let language = this.props.language;
        let { number, type, numOfSeat, name, arrivalTime, image } = this.state;
        let time = moment(+arrivalTime).format("DD/MM/YYYY HH:mm");
        console.log(image);
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
                    Thông tin phương tiện
                </ModalHeader>
                <ModalBody>
                    <Row style={{ fontSize: "16px" }}>
                        <Col md={6}>
                            <Row>
                                <Col md={12} style={{ marginBottom: "10px" }}>
                                    Biển số xe: <b>{number}</b>
                                </Col>
                                <Col md={12} style={{ marginBottom: "10px" }}>
                                    Thuộc nhà xe : <b>{name}</b>
                                </Col>
                                <Col md={12} style={{ marginBottom: "10px" }}>
                                    Thời gian vào bến : <b>{time}</b>
                                </Col>
                                <Col md={12} style={{ marginBottom: "10px" }}>
                                    Loại xe - Số chỗ ngồi:{" "}
                                    <b>
                                        {type} - {numOfSeat} chỗ
                                    </b>
                                </Col>
                            </Row>
                        </Col>
                        <Col md={6}>
                            <div className="prev-img-container">
                                <label htmlFor="img">Img</label>
                                <div
                                    className="prev-img_vehicle"
                                    style={{
                                        backgroundImage: `url(${image})`,
                                    }}
                                    onClick={() => this.openPreviewImg()}
                                />
                            </div>
                        </Col>
                    </Row>

                    <Row style={{ fontSize: "16px" }}>
                        <Col md={12} style={{ marginBottom: "10px" }}>
                            Tuyến đường tuyến kế tiếp:
                        </Col>
                    </Row>
                    <Row style={{ fontSize: "16px" }}>
                        <Col md={12} style={{ marginBottom: "10px" }}>
                            Thời gian xuất phát chuyến kế tiếp:
                        </Col>
                    </Row>
                    <Row style={{ fontSize: "16px" }}>
                        <Col md={12} style={{ marginBottom: "10px" }}>
                            Tài xế chuyến kế tiếp:
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
                        OK
                    </Button>
                </ModalFooter>
            </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalInfo);
