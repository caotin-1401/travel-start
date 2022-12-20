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
import { changeLanguageApp } from "../../../../store/actions/appActions";
import * as actions from "../../../../store/actions";
import { LANGUAGES } from "../../../../utils";
import { toast } from "react-toastify";
import _ from "lodash";
import { createNewBusTypeService } from "../../../../services/userService";

class ModalAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            numOfSeat: "",
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listBusType !== this.props.listBusType) {
            this.setState({
                name: "",
                numOfSeat: "",
            });
        }
    }

    toggle = () => {
        this.props.toggleFromParent();
    };
    onChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState,
        });
    };
    handleSave = async () => {
        let { name, numOfSeat } = this.state;
        let { language } = this.props;
        if (!name) {
            if (language === LANGUAGES.VI) {
                toast.error("Vui lòng điền loại xe");
            } else {
                toast.error("Please enter vehicle type");
            }
        } else if (!numOfSeat) {
            if (language === LANGUAGES.VI) {
                toast.error("Vui lòng điền tổng số chỗ ngồi");
            } else {
                toast.error("Please enter the total number of seats");
            }
        } else if (isNaN(numOfSeat)) {
            if (language === LANGUAGES.VI) {
                toast.error("Tổng số chỗ ngồi phải là 1 số");
            } else {
                toast.error("Number of seat must be a number");
            }
        } else if (numOfSeat > 50) {
            if (language === LANGUAGES.VI) {
                toast.error("Tổng số chỗ ngồi phải bé hơn 50");
            } else {
                toast.error("Total number of seats must be less than 50");
            }
        } else {
            let res = await createNewBusTypeService({
                typeName: name,
                numOfSeat: numOfSeat,
            });
            if (res && res.errCode === 0) {
                if (language === LANGUAGES.VI) {
                    toast.success("Thêm loại xe thành công");
                } else {
                    toast.success("Add successful vehicle type");
                }
                this.props.createLocation(this.state);
            } else if (res && res.errCode === 1) {
                if (language === LANGUAGES.VI) {
                    toast.error("Loại xe đã tồn tại");
                } else {
                    toast.error("Bus type already exists");
                }
            }
        }
    };
    render() {
        let language = this.props.language;
        let type, num;
        if (language === LANGUAGES.VI) {
            type = "Vui lòng điền tên loại xe...";
            num = "Vui lòng điền tổng số chỗ ngồi...";
        } else {
            type = "Please enter vehicle type...";
            num = "Please enter the total number of seats...";
        }
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
                        <FormattedMessage id="menu.admin.listBusType.modaladd" />
                    </ModalHeader>
                    <ModalBody>
                        <Box>
                            <Row>
                                <Col md={12}>
                                    <label htmlFor="name">
                                        <FormattedMessage id="menu.admin.listBusType.name" />
                                    </label>
                                    <input
                                        className="form-control mb-4 h38"
                                        id="name"
                                        type="text"
                                        placeholder={type}
                                        value={this.state.name}
                                        onChange={(event) => {
                                            this.onChangeInput(event, "name");
                                        }}
                                    />
                                </Col>
                            </Row>

                            <Row>
                                <Col md={12}>
                                    <label htmlFor="numOfSeat">
                                        <FormattedMessage id="menu.admin.listBusType.num" />
                                    </label>
                                    <input
                                        className="form-control mb-4 h38"
                                        id="numOfSeat"
                                        type="text"
                                        placeholder={num}
                                        onChange={(event) => {
                                            this.onChangeInput(
                                                event,
                                                "numOfSeat"
                                            );
                                        }}
                                        value={this.state.numOfSeat}
                                        onKeyDown={this.handleKeyDown}
                                    />
                                </Col>
                            </Row>
                        </Box>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            color="secondary"
                            onClick={() => {
                                this.toggle();
                            }}
                            className="btn-primary-modal">
                            <FormattedMessage id="menu.admin.listLocations.cancel" />
                        </Button>
                        <Button
                            color="primary"
                            onClick={() => {
                                this.handleSave();
                            }}
                            className="btn-primary-modal">
                            <FormattedMessage id="menu.admin.listLocations.save" />
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
    return {
        changeLanguageAppRedux: (language) =>
            dispatch(changeLanguageApp(language)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalAdd);
