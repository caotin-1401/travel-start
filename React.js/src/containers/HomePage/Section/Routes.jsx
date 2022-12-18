import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import Slider from "react-slick";
import * as actions from "../../../store/actions";
import { withRouter } from "react-router";
import dayjs from "dayjs";
import moment from "moment";
import localization from "moment/locale/vi";
class Routes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrRoute: [],
        };
    }
    componentDidMount() {
        this.props.fetchAllRoute();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        // neu props hien tai khac props trc do
        // gan props hien tai vo bien state
        if (prevProps.routes !== this.props.routes) {
            this.setState({
                arrRoute: this.props.routes,
            });
        }
    }

    handleViewDetail = (route) => {
        let test = moment(
            new Date(new Date().setDate(new Date().getDate() + 1))
        ).format("L");
        let test1 = moment(1667926800000).format("LT");
        let [hours, minutes] = test1.split(":");
        let [day, month, year] = test.split("/");
        let date = new Date(+year, month - 1, +day, +hours, +minutes);
        let unixTimestamp = Math.floor(date.getTime());

        if (this.props.history) {
            this.props.history.push(
                `/home/route/${route.from.name}&${route.to.name}&${unixTimestamp}`
            );
        }
    };
    render() {
        let { arrRoute } = this.state;
        let newArr = arrRoute.slice(0, 6);
        return (
            <React.Fragment>
                <div className="section-share section-routes">
                    <div className="section-container">
                        <div className="section-header">
                            <span className="title-section">
                                <FormattedMessage id="header.routes" />
                            </span>
                        </div>
                        <div className="section-body">
                            <Slider {...this.props.settings}>
                                {newArr &&
                                    newArr.length > 0 &&
                                    newArr.map((item, index) => {
                                        let imageBase64 = "";
                                        if (item.image) {
                                            imageBase64 = Buffer.from(
                                                item.image,
                                                "base64"
                                            ).toString("binary");
                                        }
                                        // let nameVi = `${item.genderData.valueVi}, ${item.name}`;
                                        // let nameEn = `${item.genderData.valueEn}, ${item.name}`;

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
                                                        {`${item.from.city} - ${item.to.city} `}
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
        routes: state.admin.routes,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllRoute: () => dispatch(actions.fetchAllRoute()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Routes));
