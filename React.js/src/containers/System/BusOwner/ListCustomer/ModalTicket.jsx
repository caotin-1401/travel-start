import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from "reactstrap";
import { CommonUtils } from "../../../../utils";
import { toast } from "react-toastify";
import { sendTicket } from "../../../../services/userService";

class ModalTicket extends Component {
    constructor(props) {
        super(props);
        this.state = {
            img: "",
            imgBase64: "",
            listUser: [],
        };
    }

    toggle = () => {
        this.props.toggleFromParent();
    };
    handleChangeImage = async (event) => {
        const file = event.target.files[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            file.preview = URL.createObjectURL(file);
            this.setState({
                imgBase64: file.preview,
                img: base64,
            });
        }
    };
    handleSendEmail = async () => {
        let { img } = this.state;
        let { email, token, tripId, name } = this.props.userEdit;
        let { language } = this.props;
        this.props.parentCallback1(true);
        if (!img) {
            if (language === "vi") toast.error("Vui lòng chọn vé xe");
            else toast.error("Please select bus ticket");
        } else {
            this.props.sendEmail();
            let res = await sendTicket({ token, tripId, img, name, email });
            if (res && res.errCode === 0) {
                if (language === "vi") toast.success("Gửi vé xe thành công");
                else toast.success("Gửi vé xe thành công");
                this.props.parentCallback2(false);
            } else {
                if (language === "vi") toast.error("Gửi vé xe thất bại");
                else toast.error("Ticket submission failed");
                this.props.parentCallback2(false);
            }
            this.props.sendEmail();
        }
    };

    render() {
        let email = this.props.userEdit.email;
        return (
            <div>
                <Modal
                    isOpen={this.props.isOpen}
                    toggle={() => {
                        this.toggle();
                    }}>
                    <ModalHeader
                        toggle={() => {
                            this.toggle();
                        }}>
                        <FormattedMessage id="menu.busOwner.ticket.title" />
                    </ModalHeader>

                    <ModalBody>
                        <Row>
                            <Col sx={6}>
                                <label>
                                    <FormattedMessage id="menu.busOwner.ticket.email" />
                                </label>
                                <input
                                    style={{ height: "38px" }}
                                    className="form-control mb-4 h-38"
                                    disabled
                                    value={email}
                                />
                            </Col>
                            <Col sx={6}>
                                <label htmlFor="img">Img</label>
                                <div className="prev-img-container">
                                    <input
                                        id="img"
                                        type="file"
                                        hidden
                                        onChange={(event) => this.handleChangeImage(event)}
                                    />
                                    <label className="upload-img" htmlFor="img">
                                        <FormattedMessage id="menu.busOwner.ticket.upload" />
                                    </label>
                                    <div
                                        className="prev-img"
                                        style={{
                                            backgroundImage: `url(${this.state.imgBase64})`,
                                        }}
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
                            <FormattedMessage id="menu.busOwner.ticket.cancel" />
                        </Button>
                        <Button
                            color="primary"
                            onClick={() => {
                                this.handleSendEmail();
                            }}
                            className="btn-primary-modal">
                            <FormattedMessage id="menu.busOwner.ticket.send" />
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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalTicket);
