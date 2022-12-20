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
import Select from "react-select";

import { createNewRouteService } from "../../../../services/userService";

class ModalAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listLocations: [],
            selectLocaion1: "",
            selectLocaion2: "",
            previewImgURL: "",
            image: "",
        };
    }
    componentDidMount() {
        this.props.fetchAllLocation();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.locations !== this.props.locations) {
            let dataSelect = this.buildDataSelect(this.props.locations);
            this.setState({
                listLocations: dataSelect,
            });
        }

        if (prevProps.ListRoutes !== this.props.ListRoutes) {
            this.setState({
                selectLocaion1: "",
                selectLocaion2: "",
                previewImgURL: "",
                image: "",
            });
        }
    }
    handleChangeImage = async (event) => {
        const file = event.target.files[0];
        console.log(file);
        console.log(file.preview);
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
                obj.label = `${item.name} (${item.city}) `;
                obj.value = item.id;
                result.push(obj);
            });
        }
        return result;
    };
    toggle = () => {
        this.props.toggleFromParent();
    };

    handleSave = async () => {
        let { selectLocaion1, selectLocaion2 } = this.state;
        let { language } = this.props;
        if (!selectLocaion1) {
            if (language === LANGUAGES.VI) {
                toast.error("Vui lòng chọn nơi xuất phát");
            } else {
                toast.error("Please choose your starting point");
            }
        } else if (!selectLocaion2) {
            if (language === LANGUAGES.VI) {
                toast.error("Vui lòng chọn nơi đến");
            } else {
                toast.error("Please choose your destination");
            }
        } else {
            let res = await createNewRouteService({
                name: `${this.state.selectLocaion1.label} - ${this.state.selectLocaion2.label}`,
                image: this.state.image,

                areaStartId: selectLocaion1.value,
                areaEndId: selectLocaion2.value,
            });
            if (res && res.errCode === 0) {
                this.props.createLocation(this.state);
                if (language === LANGUAGES.VI) {
                    toast.success("Thêm tuyến đường thành công");
                } else {
                    toast.success("Add successful routes");
                }
            } else if (res && res.errCode === 1) {
                if (language === LANGUAGES.VI) {
                    toast.error("Tuyến đường đã tồn tại");
                } else {
                    toast.error("The route already exists");
                }
            } else if (res && res.errCode === 2) {
                if (language === LANGUAGES.VI) {
                    toast.error("Điểm bắt đầu và kết thúc phải khác nhau");
                } else {
                    toast.error(
                        "The starting and ending points must be different"
                    );
                }
            } else {
                if (language === LANGUAGES.VI) {
                    toast.error("Lỗi từ máy chủ");
                } else {
                    toast.error("Error from server");
                }
            }
        }
    };
    onChangeInput1 = (selectLocaion1) => {
        this.setState({ selectLocaion1 });
    };
    onChangeInput2 = (selectLocaion2) => {
        this.setState({ selectLocaion2 });
    };
    render() {
        let language = this.props.language;
        let { selectLocaion1, selectLocaion2 } = this.state;

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
                                        <FormattedMessage id="menu.admin.listRoute.chooseStart" />
                                    </label>
                                    <Select
                                        className="mb-4"
                                        value={selectLocaion1}
                                        onChange={this.onChangeInput1}
                                        options={this.state.listLocations}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    <label>
                                        <FormattedMessage id="menu.admin.listRoute.chooseEnd" />
                                    </label>
                                    <Select
                                        className="mb-4"
                                        value={selectLocaion2}
                                        onChange={this.onChangeInput2}
                                        options={this.state.listLocations}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
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
                                        <label
                                            className="upload-img"
                                            htmlFor="img">
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
        locations: state.admin.locations,
    };
};

const mapDispatchToProps = (dispatch) => {
    return { fetchAllLocation: () => dispatch(actions.fetchAllLocation()) };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalAdd);
