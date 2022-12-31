import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from "reactstrap";
import Box from "@mui/material/Box";
import * as actions from "../../../../store/actions";
import { CommonUtils } from "../../../../utils";
import { toast } from "react-toastify";

import Select from "react-select";

import { createNewVehicleService } from "../../../../services/userService";

class ModalAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: "",
            previewImgURL: "",
            listBusTypes: [],
            selectBusType: {},
            busOwnerId: "",
            number: "",
        };
    }
    componentDidMount() {
        this.props.fetchAllBusType();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.busTypes !== this.props.busTypes) {
            let dataSelect = this.buildDataSelect(this.props.busTypes);
            this.setState({
                listBusTypes: dataSelect,
            });
        }

        if (prevProps.ListVehicles !== this.props.ListVehicles) {
            this.setState({
                image: "",
                previewImgURL: "",
                selectBusType: {},
                busOwnerId: "",
            });
        }
    }
    handleChangeImage = async (event) => {
        let file = event.target.files[0];
        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            file.preview = URL.createObjectURL(file);
            this.setState({
                previewImgURL: file.preview,
                image: base64,
            });
        }
    };
    buildDataSelect = (inputData) => {
        let result = [];
        if (inputData && inputData.length > 0) {
            inputData.map((item, key) => {
                let obj = {};
                obj.label = `${item.typeName} - ${item.numOfSeat} chỗ `;
                obj.value = item.id;
                result.push(obj);
            });
        }
        return result;
    };
    toggle = () => {
        this.props.toggleFromParent();
    };
    onChangeInputSelect = (selectBusType) => {
        this.setState({ selectBusType });
    };
    handleSave = async () => {
        let { number, image, selectBusType, busOwnerId } = this.state;
        busOwnerId = this.props.userInfo.id;
        let { language } = this.props;
        if (!number) {
            if (language === "vi") toast.error("Vui lòng nhập biển số xe ");
            else toast.error("Please enter license plate number");
        } else if (!selectBusType) {
            if (language === "vi") toast.error("Vui lòng chọn loại xe ");
            else toast.error("Please select vehicle type");
        } else if (!image) {
            if (language === "vi") toast.error("Vui lòng chọn ảnh của xe ");
            else toast.error("Please choose a photo of the vehicle");
        } else {
            let res = await createNewVehicleService({
                number: this.state.number,
                busTypeId: this.state.selectBusType.value,
                image: this.state.image,
                busOwnerId,
            });
            if (res.errCode === 0) {
                if (language === "vi") toast.success("Thêm mới phương tiện thành công ");
                else toast.success("Successfully added vehicle");
            } else if (res.errCode === 1) {
                if (language === "vi") toast.error("Phương tiện này đã tồn tại trong hệ thống");
                else toast.error("Vehicle already exists in the system");
            } else {
                if (language === "vi") toast.error("Thêm mới phương tiện thất bại ");
                else toast.error("Failed added vehicle");
            }
            this.props.createVehicle();
        }
    };
    onChangeInput1 = (selectLocaion1) => {
        this.setState({ selectLocaion1 });
    };
    onChangeInput = (event) => {
        let number = event.target.value;
        this.setState({
            number,
        });
    };
    render() {
        let { number, listBusTypes, selectBusType } = this.state;
        console.log(number);
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
                        <FormattedMessage id="menu.admin.listRoute.modaladd" />
                    </ModalHeader>
                    <ModalBody>
                        <Box>
                            <Row>
                                <Col md={12}>
                                    <label>
                                        <FormattedMessage id="menu.busOwner.vehicle.bsx" />
                                    </label>
                                    <input
                                        className="form-control mb-4 h-38"
                                        id="name"
                                        type="text"
                                        value={number}
                                        onChange={(event) => {
                                            this.onChangeInput(event);
                                        }}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    <label>
                                        <FormattedMessage id="menu.busOwner.vehicle.type-seat" />
                                    </label>
                                    <Select
                                        className="mb-4"
                                        value={selectBusType}
                                        onChange={this.onChangeInputSelect}
                                        options={listBusTypes}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    <label htmlFor="img">Img</label>
                                    <div className="prev-img-container">
                                        <input
                                            id="img"
                                            type="file"
                                            hidden
                                            onChange={(event) => this.handleChangeImage(event)}
                                        />
                                        <label className="upload-img" htmlFor="img">
                                            <FormattedMessage id="menu.admin.listRoute.upimage" />
                                            <i className="fas fa-upload"></i>
                                        </label>
                                        <div
                                            className="prev-img"
                                            style={{
                                                backgroundImage: `url(${this.state.previewImgURL})`,
                                            }}
                                        />
                                    </div>
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
        busTypes: state.admin.busTypes,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return { fetchAllBusType: () => dispatch(actions.fetchAllBusType()) };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalAdd);
