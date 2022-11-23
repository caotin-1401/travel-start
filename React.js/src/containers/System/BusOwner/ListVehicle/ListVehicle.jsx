import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import "./style.scss";
import * as actions from "../../../../store/actions";
import TableVehicle from "./TableVehicle";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../../utils";
import Select from "react-select";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";

// import { Buffer } from "buffer";
class ListVehicle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listLocations: [],
            selectVehicle: {},
            EditVehicleId: "",
            number: "",
            previewImgURL: "",
            isOpenImg: false,
            image: "",
            busOwnerId: "",
        };
    }
    componentDidMount() {
        this.props.fetchAllVehicle();
        this.props.fetchAllBusType();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listBusTypes !== this.props.listBusTypes) {
            let dataSelect = this.buildDataSelect(this.props.listBusTypes);
            this.setState({
                listLocations: dataSelect,
            });
        }

        if (prevProps.listVehicles !== this.props.listVehicles) {
            this.setState({
                selectVehicle: "",
                number: "",
                image: "",
                previewImgURL: "",
                action: CRUD_ACTIONS.CREATE,
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
    openPreviewImg = () => {
        if (this.state.previewImgURL === "") return;
        this.setState({
            isOpenImg: true,
        });
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

    onChangeInputSelect = (selectVehicle) => {
        this.setState({ selectVehicle });
    };

    handleSaveUser = () => {
        if (!this.state.number) {
            alert("Missing required parameter");
            return;
        }
        let { action } = this.state;
        let busOwnerId = this.props.userInfo.id;

        if (action === CRUD_ACTIONS.CREATE) {
            this.props.createNewVehicle({
                number: this.state.number,
                busTypeId: this.state.selectVehicle.value,
                image: this.state.image,
                busOwnerId: busOwnerId,
            });
        }
        if (action === CRUD_ACTIONS.EDIT) {
            this.props.EditVehicle({
                id: this.state.EditVehicleId,
                number: this.state.number,
                busTypeId: this.state.selectVehicle.value,
                image: this.state.image,
            });
        }
    };
    onChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState,
        });
    };
    handleEditUserFromParent = (user) => {
        let obj1 = {};
        obj1.label = `${user.BusType.typeName} - ${user.BusType.numOfSeat} chỗ `;
        obj1.value = user.busTypeId;

        let imageBase64 = "";
        if (user.image) {
            imageBase64 = Buffer.from(user.image, "base64").toString("binary");
        }
        this.setState({
            selectVehicle: obj1,
            number: user.number,
            action: CRUD_ACTIONS.EDIT,
            EditVehicleId: user.id,
            image: user.image,
            previewImgURL: user.image,
            imageBase64,
        });
    };
    render() {
        let language = this.props.language;
        let { number, selectVehicle, listLocations } = this.state;
        return (
            <div className="user-redux-container">
                <div className="title">
                    <p style={{ marginBottom: "20px" }}>
                        <FormattedMessage id="menu.busOwner.vehicle.title" />
                    </p>
                </div>
                <div className="container form-reux">
                    <Row>
                        <Col md={4}>
                            <label>
                                <FormattedMessage id="menu.busOwner.vehicle.bsx" />
                            </label>
                            <input
                                className="form-control mb-4 h-38"
                                id="name"
                                type="text"
                                value={number}
                                onChange={(event) => {
                                    this.onChangeInput(event, "number");
                                }}
                            />
                        </Col>
                        <Col md={4}>
                            <label>
                                <FormattedMessage id="menu.busOwner.vehicle.type-seat" />
                            </label>
                            <Select
                                className="mb-4"
                                value={selectVehicle}
                                onChange={this.onChangeInputSelect}
                                options={listLocations}
                            />
                        </Col>
                        <Col md={4}>
                            <label htmlFor="img">
                                <FormattedMessage id="menu.busOwner.vehicle.img" />
                            </label>
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
                                    <FormattedMessage id="menu.busOwner.vehicle.upload" />
                                    <i className="fas fa-upload"></i>
                                </label>
                                <div
                                    className="prev-img"
                                    style={{
                                        backgroundImage: `url(${this.state.previewImgURL})`,
                                    }}
                                    onClick={() => this.openPreviewImg()}></div>
                            </div>
                        </Col>
                    </Row>

                    <button
                        style={{ width: "90px" }}
                        className={
                            this.state.action === CRUD_ACTIONS.EDIT
                                ? "btn btn-warning"
                                : "btn btn-primary"
                        }
                        onClick={() => this.handleSaveUser()}>
                        {this.state.action === CRUD_ACTIONS.EDIT ? (
                            <FormattedMessage id="manage-user.edit" />
                        ) : (
                            <FormattedMessage id="manage-user.save" />
                        )}
                    </button>
                    <div style={{ marginTop: "50px" }}></div>

                    <TableVehicle
                        handleEditUserFromParentKey={
                            this.handleEditUserFromParent
                        }
                        action={this.state.action}
                    />
                </div>
                {this.state.isOpenImg === true && (
                    <Lightbox
                        mainSrc={this.state.previewImgURL}
                        onCloseRequest={() =>
                            this.setState({ isOpenImg: false })
                        }
                    />
                )}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        listBusTypes: state.admin.busTypes,
        listVehicles: state.admin.vehicles,
        vehicles: state.admin.vehicles,
        userInfo: state.user.userInfo,
        // language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllBusType: () => dispatch(actions.fetchAllBusType()),
        fetchAllVehicle: () => dispatch(actions.fetchAllVehicle()),
        createNewVehicle: (data) => dispatch(actions.createNewVehicle(data)),
        EditVehicle: (data) => dispatch(actions.EditVehicle(data)),
        // changeLanguageAppRedux: (language) =>
        //     dispatch(changeLanguageApp(language)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListVehicle);
