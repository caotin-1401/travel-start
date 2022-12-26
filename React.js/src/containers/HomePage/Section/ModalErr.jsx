import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Box from "@mui/material/Box";
import { LANGUAGES } from "../../../utils";
import { toast } from "react-toastify";
import { createNewErrService } from "../../../services/userService";
class ModalErr extends Component {
    constructor(props) {
        super(props);
        this.state = {
            description: "",
        };
    }

    toggle = () => {
        this.props.toggleFromParent();
    };

    handleSave = async () => {
        let { description } = this.state;
        let { language } = this.props;
        console.log(description);
        let res = await createNewErrService({ description });
        if (res && res.errCode === 0) {
            this.props.createNewUser1(this.state);
            this.setState({
                description: "",
            });
            if (language === LANGUAGES.VI) {
                toast.success("Hệ thống đã ghi nhận lỗi từ bạn");
            } else {
                toast.success("The system has recorded an error from you");
            }
        }
    };
    onChangeInput = (event) => {
        this.setState({
            description: event.target.value,
        });
    };
    render() {
        let { language } = this.props;
        let mes;
        if (language === "vi") {
            mes = "Vui lòng nhập mô tả lỗi xảy ra";
        } else mes = "Please enter a description of the error that occurred";
        return (
            <div>
                <Modal
                    isOpen={this.props.isOpen}
                    toggle={() => {
                        this.toggle();
                    }}
                    centered
                    size="xl">
                    <ModalHeader
                        toggle={() => {
                            this.toggle();
                        }}>
                        <FormattedMessage id="modalErr.title1" />
                    </ModalHeader>
                    <ModalBody>
                        <Box
                            sx={{
                                p: 2,
                            }}>
                            <p>
                                <FormattedMessage id="modalErr.title2" />
                            </p>
                            <textarea
                                class="form-control"
                                placeholder={mes}
                                id="floatingTextarea2"
                                onChange={(event) => {
                                    this.onChangeInput(event);
                                }}
                                style={{ height: "100px", marginBottom: "20px" }}></textarea>
                        </Box>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            color="secondary"
                            onClick={() => {
                                this.toggle();
                            }}
                            className="btn-primary-modal">
                            <FormattedMessage id="modalErr.cancel" />
                        </Button>
                        <Button
                            color="primary"
                            onClick={() => {
                                this.handleSave();
                            }}
                            className="btn-primary-modal">
                            <FormattedMessage id="modalErr.send" />
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
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalErr);
