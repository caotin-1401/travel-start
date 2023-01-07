import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from "reactstrap";
import _ from "lodash";
import moment from "moment";
import "../style.scss";

class ModalInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            number: "",
            numOfSeat: 0,
            name: "",
            arrivalTime: "",
            Image: "",
            previewImgURL: "",
        };
    }
    async componentDidMount() {
        let user = this.props.currentUser;
        let test;
        if (user && !_.isEmpty(user)) {
            if (user && user.image) {
                test = Buffer.from(user.image, "base64").toString("binary");
            }
            this.setState({
                number: user.number,
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
        let info = this.props.info;
        console.log(info);
        let { number, numOfSeat, name, arrivalTime, image } = this.state;
        let time, start, mes, route;
        if (info && info.length === 0) {
            if (language === "vi") {
                time = moment(+arrivalTime).format("DD/MM/YYYY HH:mm");
                mes = "Chưa có thông tin";
            } else {
                mes = "No information";
                time = `${moment(+arrivalTime).locale("en").format("L")} ${" "} ${moment(
                    +arrivalTime
                )
                    .locale("en")
                    .format("LT")}`;
            }
        } else {
            if (language === "vi") {
                time = moment(+arrivalTime).format("DD/MM/YYYY HH:mm");
                start = moment(+info.timeStart).format("DD/MM/YYYY  HH:mm");
            } else {
                time = `${moment(+arrivalTime).locale("en").format("L")} ${" "} ${moment(
                    +arrivalTime
                )
                    .locale("en")
                    .format("LT")}`;
                start = `${moment(+info.timeStart).locale("en").format("L")} ${" "} ${moment(
                    +info.timeStart
                )
                    .locale("en")
                    .format("LT")}`;
            }
            route = `${info.areaStart} ${"->"} ${info.areaEnd}`;
            console.log(route);
        }
        console.log(route);

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
                    <FormattedMessage id="menu.admin.listLocations.detailMode" />
                </ModalHeader>
                <ModalBody>
                    <Row style={{ fontSize: "16px" }}>
                        <Col md={6}>
                            <Row>
                                <Col md={12} style={{ marginBottom: "10px" }}>
                                    <FormattedMessage id="menu.busOwner.vehicle.bsx" />:{" "}
                                    <b>{number}</b>
                                </Col>
                                <Col md={12} style={{ marginBottom: "10px" }}>
                                    <FormattedMessage id="menu.admin.listLocations.bus" /> :{" "}
                                    <b>{name}</b>
                                </Col>
                                <Col md={12} style={{ marginBottom: "10px" }}>
                                    <FormattedMessage id="menu.admin.listLocations.time" /> :{" "}
                                    <b>{time}</b>
                                </Col>
                                <Col md={12} style={{ marginBottom: "10px" }}>
                                    <FormattedMessage id="menu.busOwner.vehicle.seat" />:{" "}
                                    <b>
                                        {numOfSeat} {language === "vi" ? "chỗ" : "seat"}
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
                            <FormattedMessage id="menu.admin.listLocations.titleInfo1" />:{" "}
                            <b>{info && info.length === 0 ? mes : route}</b>
                        </Col>
                    </Row>
                    <Row style={{ fontSize: "16px" }}>
                        <Col md={12} style={{ marginBottom: "10px" }}>
                            <FormattedMessage id="menu.admin.listLocations.titleInfo2" />:{" "}
                            <b>{info && info.length === 0 ? mes : `${start}`}</b>
                        </Col>
                    </Row>
                    <Row style={{ fontSize: "16px" }}>
                        <Col md={12} style={{ marginBottom: "10px" }}>
                            <FormattedMessage id="menu.admin.listLocations.titleInfo3" />:{" "}
                            <b>{info && info.length === 0 ? mes : `${info.User.name}`}</b>
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
