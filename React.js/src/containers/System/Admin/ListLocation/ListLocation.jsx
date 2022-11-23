import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import "../style.scss";
import * as actions from "../../../../store/actions";
import TableLocation from "./TableLocation";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../../utils";

class ListLocation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            city: "",
            address: "",
            state: "",
            status: "",
            editLocationId: "",
        };
    }
    componentDidMount() {
        this.props.fetchAllLocation();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listLocations !== this.props.listLocations) {
            this.setState({
                name: "",
                city: "",
                address: "",
                state: "",
                status: "",
                action: CRUD_ACTIONS.CREATE,
            });
        }
    }

    handleSaveUser = () => {
        let isValid = this.checkValidInput();

        if (isValid === false) return;

        let { action } = this.state;

        if (action === CRUD_ACTIONS.CREATE) {
            this.props.createNewLocation({
                name: this.state.name,
                city: this.state.city,
                address: this.state.address,
                state: this.state.state,
                status: this.state.status,
            });
        }

        if (action === CRUD_ACTIONS.EDIT) {
            this.props.EditLocation({
                id: this.state.editLocationId,
                name: this.state.name,
                city: this.state.city,
                address: this.state.address,
                state: this.state.state,
                status: this.state.status,
            });
        }
    };
    checkValidInput = () => {
        let isValid = true;
        let arrCheck = ["name", "city", "address"];
        for (let i = 0; i < arrCheck.length; i++) {
            if (!this.state[arrCheck[i]]) {
                isValid = false;
                alert("this input is required: " + arrCheck[i]);
                break;
            }
        }
        return isValid;
    };

    onChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState,
        });
    };
    handleEditUserFromParent = (user) => {
        this.setState({
            name: user.name,
            city: user.city,
            address: user.address,
            state: user.state,
            status: user.status,
            action: CRUD_ACTIONS.EDIT,
            editLocationId: user.id,
        });
    };
    handleKeyDown = (e) => {
        if (e.key === "Enter" || e.keyCode === 13) {
            this.handleSaveUser();
        }
    };
    render() {
        let language = this.props.language;

        return (
            <div className="user-redux-container">
                <div className="title">
                    <p style={{ marginBottom: "20px" }}>
                        <FormattedMessage id="menu.admin.listLocations.title" />
                    </p>
                </div>
                <div className="container form-redux">
                    <Row>
                        <Col md={4}>
                            <label htmlFor="name">
                                <FormattedMessage id="menu.admin.listLocations.name" />
                            </label>
                            <input
                                className="form-control mb-4"
                                id="name"
                                type="text"
                                value={this.state.name}
                                onChange={(event) => {
                                    this.onChangeInput(event, "name");
                                }}
                            />
                        </Col>
                        <Col md={4}>
                            <label htmlFor="exampleEmail">
                                <FormattedMessage id="menu.admin.listLocations.city" />
                            </label>
                            <input
                                className="form-control mb-4"
                                id="exampleEmail"
                                type="email"
                                onChange={(event) => {
                                    this.onChangeInput(event, "city");
                                }}
                                value={this.state.city}
                            />
                        </Col>
                        <Col md={4}>
                            <label htmlFor="exampleEmail">
                                {" "}
                                <FormattedMessage id="menu.admin.listLocations.address" />
                            </label>
                            <input
                                className="form-control mb-4"
                                id="exampleEmail"
                                type="email"
                                onChange={(event) => {
                                    this.onChangeInput(event, "address");
                                }}
                                value={this.state.address}
                                onKeyDown={this.handleKeyDown}
                            />
                        </Col>
                    </Row>
                    <button
                        style={{ width: "90px" }}
                        className={
                            this.state.action === CRUD_ACTIONS.EDIT
                                ? "btn btn-warning"
                                : "btn btn-primary"
                        }
                        // className="btn btn-primary"
                        onClick={() => this.handleSaveUser()}>
                        {this.state.action === CRUD_ACTIONS.EDIT ? (
                            <FormattedMessage id="manage-user.edit" />
                        ) : (
                            <FormattedMessage id="manage-user.save" />
                        )}
                    </button>
                    <div style={{ marginTop: "50px" }}></div>

                    <TableLocation
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
        listLocations: state.admin.locations,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllLocation: () => dispatch(actions.fetchAllLocation()),
        createNewLocation: (data) => dispatch(actions.createNewLocation(data)),
        EditLocation: (data) => dispatch(actions.EditLocation(data)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListLocation);
