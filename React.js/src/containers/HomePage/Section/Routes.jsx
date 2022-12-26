import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import Slider from "react-slick";
import * as actions from "../../../store/actions";
import { withRouter } from "react-router";
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
        if (prevProps.routes !== this.props.routes) {
            this.setState({
                arrRoute: this.props.routes,
            });
        }
    }

    handleViewDetail = (route) => {
        let test = moment(new Date(new Date().setDate(new Date().getDate() + 1))).format("L");
        let test1 = moment(1667926800000).format("LT");
        let [hours, minutes] = test1.split(":");
        let [day, month, year] = test.split("/");
        let date = new Date(+year, month - 1, +day, +hours, +minutes);
        let unixTimestamp = Math.floor(date.getTime());

        if (this.props.history) {
            this.props.history.push(`/home/route/${route.from.name}&${route.to.name}&${unixTimestamp}`);
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
                                {newArr && newArr.length > 0 && (
                                    <div className=" section-custom" onClick={() => this.handleViewDetail(newArr[0])}>
                                        <div className="bg-img1"></div>

                                        <div>
                                            <div className="section-title">TP. Hồ Chí Minh -{">"} Vũng Tàu</div>
                                        </div>
                                    </div>
                                )}
                                {newArr && newArr.length > 0 && (
                                    <div className=" section-custom" onClick={() => this.handleViewDetail(newArr[1])}>
                                        <div className="bg-img2"></div>

                                        <div>
                                            <div className="section-title">TP. Hồ Chí Minh -{">"} Lâm Đồng</div>
                                        </div>
                                    </div>
                                )}
                                {newArr && newArr.length > 0 && (
                                    <div className=" section-custom" onClick={() => this.handleViewDetail(newArr[2])}>
                                        <div className="bg-img3"></div>

                                        <div>
                                            <div className="section-title">TP. Hồ Chí Minh -{">"} Đà Nẵng</div>
                                        </div>
                                    </div>
                                )}
                                {newArr && newArr.length > 0 && (
                                    <div className=" section-custom" onClick={() => this.handleViewDetail(newArr[3])}>
                                        <div className="bg-img4"></div>

                                        <div>
                                            <div className="section-title">TP. Hồ Chí Minh -{">"} Khánh Hòa</div>
                                        </div>
                                    </div>
                                )}
                                {newArr && newArr.length > 0 && (
                                    <div className=" section-custom" onClick={() => this.handleViewDetail(newArr[4])}>
                                        <div className="bg-img5"></div>

                                        <div>
                                            <div className="section-title">TP. Hồ Chí Minh -{">"} Bình Định</div>
                                        </div>
                                    </div>
                                )}
                                {newArr && newArr.length > 0 && (
                                    <div className=" section-custom" onClick={() => this.handleViewDetail(newArr[5])}>
                                        <div className="bg-img6"></div>

                                        <div>
                                            <div className="section-title">Lâm Đồng -{">"} TP.Hồ Chí Minh</div>
                                        </div>
                                    </div>
                                )}
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
