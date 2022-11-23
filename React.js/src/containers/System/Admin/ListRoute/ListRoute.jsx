import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import "../style.scss";
import * as actions from "../../../../store/actions";
import TableRoute from "./TableRoute";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../../utils";
import Select from "react-select";
class ListRoute extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listLocations: [],
            selectLocaion1: {},
            selectLocaion2: {},
            // EditRouteId: "",
            previewImgURL: "",
            image: "",
            action: "",
        };
    }
    componentDidMount() {
        this.props.fetchAllRoute();
        this.props.fetchAllLocation();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.locations !== this.props.locations) {
            let dataSelect = this.buildDataSelect(this.props.locations);
            this.setState({
                listLocations: dataSelect,
            });
        }
        if (prevProps.listRoutes !== this.props.listRoutes) {
            console.log(1);
            this.setState({
                selectLocaion1: "",
                selectLocaion2: "",
                action: CRUD_ACTIONS.CREATE,
                image: "",
                previewImgURL: "",
            });
        }
    }
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
    onChangeInput1 = (selectLocaion1) => {
        this.setState({ selectLocaion1 });
    };
    onChangeInput2 = (selectLocaion2) => {
        this.setState({ selectLocaion2 });
    };

    handleSaveUser = () => {
        let { action } = this.state;
        if (action === CRUD_ACTIONS.CREATE) {
            this.props.createNewRoute({
                areaStartId: this.state.selectLocaion1.value,
                areaEndId: this.state.selectLocaion2.value,
                name: `${this.state.selectLocaion1.label} - ${this.state.selectLocaion2.label}`,
                image: this.state.image,
            });
        }
        if (action === CRUD_ACTIONS.EDIT) {
            this.props.EditRoute({
                id: this.state.EditRouteId,
                areaStartId: this.state.selectLocaion1.label,
                areaEndId: this.state.selectLocaion2.label,
            });
        }
    };
    handleEditUserFromParent = (user) => {
        let obj1 = {};
        obj1.label = user.areaStartId;
        obj1.value = user.id;

        console.log(obj1);
        this.setState({
            selectLocaion1: user.areaStartId,
            selectLocaion2: user.areaEndId,
            action: CRUD_ACTIONS.EDIT,
            EditRouteId: user.id,
        });
    };
    render() {
        let language = this.props.language;
        let { selectLocaion1, selectLocaion2 } = this.state;
        console.log(this.state);
        console.log(selectLocaion1, selectLocaion2);
        return (
            <div className="user-redux-container">
                <div className="title">
                    <p style={{ marginBottom: "20px" }}>
                        <FormattedMessage id="menu.admin.listRoute.title" />
                    </p>
                </div>
                <div className="container form-redux">
                    <Row>
                        <Col md={4}>
                            <label>
                                <FormattedMessage id="menu.admin.listRoute.chooseStart" />
                            </label>
                            <Select
                                value={selectLocaion1}
                                onChange={this.onChangeInput1}
                                options={this.state.listLocations}
                            />
                        </Col>
                        <Col md={4}>
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
                        <Col md={4}>
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
                                <label className="upload-img" htmlFor="img">
                                    Tải ảnh<i className="fas fa-upload"></i>
                                </label>
                                <div
                                    className="prev-img"
                                    style={{
                                        backgroundImage: `url(${this.state.previewImgURL})`,
                                    }}
                                    onClick={() => this.openPreviewImg()}
                                />
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

                    <TableRoute
                        handleEditUserFromParentKey={
                            this.handleEditUserFromParent
                        }
                        action={this.state.action}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        listRoutes: state.admin.routes,
        locations: state.admin.locations,
        // language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllRoute: () => dispatch(actions.fetchAllRoute()),
        fetchAllLocation: () => dispatch(actions.fetchAllLocation()),
        createNewRoute: (data) => dispatch(actions.createNewRoute(data)),
        EditRoute: (data) => dispatch(actions.EditRoute(data)),
        // changeLanguageAppRedux: (language) =>
        //     dispatch(changeLanguageApp(language)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListRoute);
