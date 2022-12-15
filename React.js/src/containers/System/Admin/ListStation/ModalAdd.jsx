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
import "./TableStation.scss";
import * as actions from "../../../../store/actions";
import { LANGUAGES } from "../../../../utils";
import { toast } from "react-toastify";
import _ from "lodash";
import Select from "react-select";

import {
    createNewLocationService,
    getAllCity,
} from "../../../../services/userService";

class ModalAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            selectCity: "",
            listCity: [],
            address: "",
        };
    }
    componentDidMount() {
        this.getListCity();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listLocations !== this.props.listLocations) {
            this.setState({
                name: "",
                selectCity: "",
                address: "",
            });
        }
    }
    getListCity = async () => {
        let res = await getAllCity("ALL");
        let listCity = res.citys;
        this.setState({
            listCity,
        });
    };

    toggle = () => {
        this.props.toggleFromParent();
    };
    onChangeInputSelect = (selectCity) => {
        this.setState({ selectCity });
    };
    onChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState,
        });
    };
    handleSave = async () => {
        let { name, address, selectCity } = this.state;
        let { language } = this.props;
        if (!name) {
            if (language === LANGUAGES.VI) {
                toast.error("Vui lòng điền tên bến xe");
            } else {
                toast.error("Please enter bus station name");
            }
        } else if (!selectCity) {
            if (language === LANGUAGES.VI) {
                toast.error("Vui lòng chọn tỉnh / thành phố");
            } else {
                toast.error("Please select province/city");
            }
        } else if (!address) {
            if (language === LANGUAGES.VI) {
                toast.error("Vui lòng điền địa chỉ bến xe");
            } else {
                toast.error("Please enter the address");
            }
        } else {
            let res = await createNewLocationService({
                name,
                city: selectCity.label,
                address,
            });
            if (res && res.errCode === 0) {
                if (language === LANGUAGES.VI) {
                    toast.success("Thêm bến xe thành công");
                } else {
                    toast.success("Add successful bus station");
                }
                this.props.createLocation(this.state);
            } else if (res && res.errCode === 1) {
                if (language === LANGUAGES.VI) {
                    toast.success("Bến xe đã tồn tại trong hệ thống");
                } else {
                    toast.success("The station already exists in the system");
                }
                this.props.createLocation(this.state);
            } else {
                if (language === LANGUAGES.VI) {
                    toast.error("Lỗi từ máy chủ");
                } else {
                    toast.error("Error from server");
                }
            }
        }
    };
    render() {
        let language = this.props.language;
        let { selectCity, listCity } = this.state;
        let listSelctCity = [];
        listCity &&
            listCity.length > 0 &&
            listCity.forEach((item) => {
                let obj = {};
                obj.value = item.id;
                obj.label = item.name;
                listSelctCity.push(obj);
            });

        let nameInput, addressInput;
        if (language === LANGUAGES.VI) {
            nameInput = "Tên bến xe";
            addressInput = "Địa chỉ bến xê";
        } else {
            nameInput = "Name bus station";
            addressInput = "Address bus station";
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
                        <FormattedMessage id="menu.admin.listLocations.modaladd" />
                    </ModalHeader>
                    <ModalBody>
                        <Box>
                            <Row>
                                <Col md={12}>
                                    <label htmlFor="name">
                                        <FormattedMessage id="menu.admin.listLocations.name" />
                                    </label>
                                    <input
                                        className="form-control mb-4 h38"
                                        placeholder={nameInput}
                                        id="name"
                                        type="text"
                                        value={this.state.name}
                                        onChange={(event) => {
                                            this.onChangeInput(event, "name");
                                        }}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    <label htmlFor="exampleEmail">
                                        <FormattedMessage id="menu.admin.listLocations.city" />
                                    </label>
                                    <Select
                                        className="mb-4"
                                        value={selectCity}
                                        onChange={this.onChangeInputSelect}
                                        options={listSelctCity}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    <label htmlFor="Address">
                                        <FormattedMessage id="menu.admin.listLocations.address" />
                                    </label>
                                    <input
                                        className="form-control mb-4 h38"
                                        id="Address"
                                        placeholder={addressInput}
                                        type="text"
                                        onChange={(event) => {
                                            this.onChangeInput(
                                                event,
                                                "address"
                                            );
                                        }}
                                        value={this.state.address}
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
        citys: state.admin.citys,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalAdd);
