import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { CRUD_ACTIONS, LANGUAGES } from "../../../../utils";
import { changeLanguageApp } from "../../../../store/actions/appActions";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import "../style.scss";
import * as actions from "../../../../store/actions";
import TableBusType from "./TableBusType";

class ListBusType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            typeName: "",
            numOfSeat: "",
            EditBusTypeId: "",
        };
    }
    async componentDidMount() {
        this.props.fetchAllBusType();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listBusTypes !== this.props.listBusTypes) {
            this.setState({
                typeName: "",
                numOfSeat: "",
                action: CRUD_ACTIONS.CREATE,
            });
        }
    }

    handleSaveUser = () => {
        let isValid = this.checkValidInput();
        console.log(isValid);
        if (isValid === false) return;

        let { action } = this.state;
        console.log("action", this.state.action);
        if (action === CRUD_ACTIONS.CREATE) {
            console.log("asd", this.state.typeName);
            this.props.createNewBusType({
                typeName: this.state.typeName,
                numOfSeat: this.state.numOfSeat,
            });
        }
        console.log("asd", this.state.typeName);
        if (action === CRUD_ACTIONS.EDIT) {
            this.props.EditBusType({
                id: this.state.EditBusTypeId,
                typeName: this.state.typeName,
                numOfSeat: this.state.numOfSeat,
            });
        }
    };
    handleKeyDown = (e) => {
        if (e.key === "Enter" || e.keyCode === 13) {
            this.handleSaveUser();
        }
    };
    checkValidInput = () => {
        let isValid = true;
        let arrCheck = ["typeName", "numOfSeat"];
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
            typeName: user.typeName,
            numOfSeat: user.numOfSeat,
            action: CRUD_ACTIONS.EDIT,
            EditBusTypeId: user.id,
        });
    };
    render() {
        let language = this.props.language;
        return (
            <div className="user-redux-container">
                <div className="title">
                    <div>
                        <p style={{ marginBottom: "20px" }}>
                            <FormattedMessage id="menu.admin.listBusType.title" />
                        </p>
                    </div>
                </div>
                <div className="container form-redux">
                    <Row>
                        <Col md={4}>
                            <label htmlFor="name">
                                <FormattedMessage id="menu.admin.listBusType.name" />
                            </label>
                            <input
                                className="form-control mb-4"
                                id="name"
                                type="text"
                                value={this.state.typeName}
                                onChange={(event) => {
                                    this.onChangeInput(event, "typeName");
                                }}
                            />
                        </Col>
                        <Col md={2} />
                        <Col md={4}>
                            <label htmlFor="exampleEmail">
                                <FormattedMessage id="menu.admin.listBusType.num" />
                            </label>
                            <input
                                className="form-control mb-4"
                                id="exampleEmail"
                                type="email"
                                onChange={(event) => {
                                    this.onChangeInput(event, "numOfSeat");
                                }}
                                value={this.state.numOfSeat}
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
                        onClick={() => this.handleSaveUser()}>
                        {this.state.action === CRUD_ACTIONS.EDIT ? (
                            <FormattedMessage id="manage-user.edit" />
                        ) : (
                            <FormattedMessage id="manage-user.save" />
                        )}
                    </button>
                    <div style={{ marginTop: "50px" }}></div>

                    <TableBusType
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
        listBusTypes: state.admin.busTypes,
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllBusType: () => dispatch(actions.fetchAllBusType()),
        createNewBusType: (data) => dispatch(actions.createNewBusType(data)),
        EditBusType: (data) => dispatch(actions.EditBusType(data)),
        changeLanguageAppRedux: (language) =>
            dispatch(changeLanguageApp(language)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListBusType);
