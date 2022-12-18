import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import Slider from "react-slick";
import * as actions from "../../../store/actions";
import { withRouter } from "react-router";

class Events extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrEvents: [],
        };
    }
    componentDidMount() {
        this.props.fetchAllEvents();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.events !== this.props.events) {
            this.setState({
                arrEvents: this.props.events,
            });
        }
    }

    handleViewDetail = (events) => {
        if (this.props.history) {
            this.props.history.push(`/home/event/eventId=${events.id}`);
        }
    };
    handleEvents = () => {
        if (this.props.history) {
            this.props.history.push(`/home/events`);
        }
    };
    render() {
        let { arrEvents } = this.state;
        arrEvents = arrEvents.concat(arrEvents);
        let newArr = arrEvents.slice(0, 5);
        return (
            <React.Fragment>
                <div className="section-share  section-events">
                    <div className="section-container">
                        <div className="section-header">
                            <span className="title-section">
                                <FormattedMessage id="header.promotion" />
                            </span>
                            <button
                                className="btn-section"
                                onClick={() => this.handleEvents()}>
                                <FormattedMessage id="header.more" />
                            </button>
                        </div>
                        <div className="section-body">
                            <Slider {...this.props.settings}>
                                {newArr &&
                                    newArr.length > 0 &&
                                    newArr.map((item, index) => {
                                        let imageBase64 = "";
                                        if (item.image) {
                                            imageBase64 = new Buffer(
                                                item.image,
                                                "base64"
                                            ).toString("binary");
                                        }
                                        return (
                                            <div
                                                key={index}
                                                className=" section-custom"
                                                onClick={() =>
                                                    this.handleViewDetail(item)
                                                }>
                                                <div
                                                    className="bg-img"
                                                    style={{
                                                        backgroundImage: `url(${imageBase64})`,
                                                        borderBottom:
                                                            "1px solid gray ",
                                                    }}></div>

                                                <div>
                                                    <div className="section-title">
                                                        {item.name}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </Slider>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        events: state.admin.events,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllEvents: () => dispatch(actions.fetchAllEvents()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Events));
