import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Box from "@mui/material/Box";
import * as actions from "../../../store/actions";
import _ from "lodash";
import moment from "moment";

class ModalDetalCoupon extends Component {
    constructor(props) {
        super(props);
        this.state = {
            description: "",
            count: 0,
            use: 0,
            discountMax: 0,
            endDate: "",
            startDate: "",
            sumMoneyCondition: 0,
            discount: 0,
            type: "",
        };
    }
    async componentDidMount() {
        let user = this.props.currentUser;
        if (user && !_.isEmpty(user)) {
            this.setState({
                discount: user.discount,
                type: user.type,
                count: user.count,
                description: user.description,
                use: user.use,
                discountMax: user.discountMax,
                startDate: user.startDate,
                endDate: user.endDate,
            });
        }
    }

    toggle = () => {
        this.props.toggleFromParent();
    };

    render() {
        let { description, count, use, endDate, startDate, discount, type, sumMoneyCondition } =
            this.state;
        console.log(endDate);
        let price;
        +type === 2 ? (price = "%") : (price = "đ");
        let start = moment(+startDate).format(" DD.MM.YYYY ");
        let end = moment(+endDate).format("  DD.MM.YYYY  ");
        return (
            <div>
                <Modal
                    isOpen={this.props.isOpen}
                    toggle={() => {
                        this.toggle();
                    }}
                    centered>
                    <ModalHeader
                        toggle={() => {
                            this.toggle();
                        }}>
                        <FormattedMessage id="events.model.title" />
                    </ModalHeader>
                    <ModalBody>
                        <Box
                            sx={{
                                p: 2,
                            }}>
                            <h6 className="mb0">Ưu đãi: </h6>
                            <span>
                                <FormattedMessage id="events.model.discount" /> {discount} {price}{" "}
                                <FormattedMessage id="events.model.discount_" /> {sumMoneyCondition}{" "}
                                đ
                            </span>
                            <h6 className="mb0">
                                <FormattedMessage id="events.model.count" />:{" "}
                            </h6>{" "}
                            <span>{count}</span>
                            <h6 className="mb0">
                                <FormattedMessage id="events.model.use" /> :
                            </h6>{" "}
                            <span>{count - use}</span>
                            <h6 className="mb0">
                                <FormattedMessage id="events.model.time" />:{" "}
                            </h6>
                            <span>
                                {start} - {end}
                            </span>
                            <div style={{ height: "10px" }}></div>
                            <div
                                style={{ textAlign: "justify" }}
                                dangerouslySetInnerHTML={{
                                    __html: description,
                                }}></div>
                        </Box>
                    </ModalBody>

                    <ModalFooter>
                        <button
                            style={{ width: "100%" }}
                            onClick={() => {
                                this.toggle();
                            }}
                            className="btn btn-primary">
                            OK
                        </button>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalDetalCoupon);
