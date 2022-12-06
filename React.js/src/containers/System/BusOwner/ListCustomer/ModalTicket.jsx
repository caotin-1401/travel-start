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
import Box from "@mui/material/Box";
import * as actions from "../../../../store/actions";
import { LANGUAGES, CommonUtils } from "../../../../utils";
import { toast } from "react-toastify";
import _ from "lodash";

import {
    sendTicket,
    getDriverTicketsRoute,
} from "../../../../services/userService";

class ModalTicket extends Component {
    constructor(props) {
        super(props);
        this.state = {
            img: "",
            imgBase64: "",
            listUser: [],
        };
    }

    async componentDidMount() {}

    componentDidUpdate(prevProps, prevState, snapshot) {}

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
        let { img, imgBase64 } = this.state;
        let { email, token, tripId, driverId, dayStart, name } =
            this.props.userEdit;

        this.props.parentCallback1(true);
        if (!img) {
            toast.error("Vui long chon ve xe");
        } else {
            this.props.sendEmail();
            let res = await sendTicket({ token, tripId, img, name, email });
            if (res && res.errCode === 0) {
                toast.success("Gui ve xe thanh cong");
                this.props.parentCallback2(false);
            } else {
                toast.error("Gui ve xe that bai");
                this.props.parentCallback2(false);
            }
            this.props.sendEmail();
        }
    };

    render() {
        let language = this.props.language;
        let { img } = this.state;
        let email = this.props.userEdit.email;
        return (
            <div>
                <Modal
                    isOpen={this.props.isOpen}
                    toggle={() => {
                        this.toggle();
                    }}
                    style={{ width: "500px" }}
                    centered
                    size="sm"
                    style={{ maxWidth: "600px" }}>
                    <ModalHeader
                        toggle={() => {
                            this.toggle();
                        }}>
                        Gửi vé xe
                    </ModalHeader>

                    <ModalBody>
                        <Row>
                            <Col sx={6}>
                                <label>Email hanh khach</label>
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
                                        onChange={(event) =>
                                            this.handleChangeImage(event)
                                        }
                                    />
                                    <label className="upload-img" htmlFor="img">
                                        Tải ảnh
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
                            Cancel
                        </Button>{" "}
                        <Button
                            color="primary"
                            onClick={() => {
                                this.handleSendEmail();
                            }}
                            className="btn-primary-modal">
                            Send
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
        events: state.admin.events,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllEvents: () => dispatch(actions.fetchAllEvents()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalTicket);
