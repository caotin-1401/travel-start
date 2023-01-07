import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import Slider from "react-slick";
import * as actions from "../../../store/actions";
import { withRouter } from "react-router";
import moment from "moment";
import vungtau from "../../../assets/vungtau.jpg";
import dalat from "../../../assets/dalat.jpg";
import danang from "../../../assets/danang.jpg";
import khanhhoa from "../../../assets/khanhhoa.jpg";
import quynhon from "../../../assets/quynhon.jpg";
import hcm3 from "../../../assets/hcm3.jpg";
class Routes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrRoute: [],
        };
    }
    componentDidMount() {
        this.props.fetchAllRouteHome();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.routes !== this.props.routes) {
            this.setState({
                arrRoute: this.props.routes,
            });
        }
    }

    handleViewDetail = (route) => {
        let test = moment(new Date(new Date().setDate(new Date().getDate() + 1))).format(
            "DD/MM/YYYY"
        );
        let test1 = "00:00";
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
                                {newArr && newArr.length === 0 && (
                                    <div
                                        className=" section-custom"
                                        onClick={() => this.handleViewDetail(newArr[0])}>
                                        <div className="bg-img1">
                                            <img src={vungtau} alt="Vũng tàu" loading="lazy" />
                                        </div>

                                        <div>
                                            <div className="section-title">
                                                TP. Hồ Chí Minh -{">"} Vũng Tàu
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {newArr && newArr.length === 0 && (
                                    <div
                                        className=" section-custom"
                                        onClick={() => this.handleViewDetail(newArr[1])}>
                                        <div className="bg-img2">
                                            <img src={dalat} alt="..." loading="lazy" />
                                        </div>

                                        <div>
                                            <div className="section-title">
                                                TP. Hồ Chí Minh -{">"} Lâm Đồng
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {newArr && newArr.length === 0 && (
                                    <div
                                        className=" section-custom"
                                        onClick={() => this.handleViewDetail(newArr[2])}>
                                        <div className="bg-img3">
                                            <img src={danang} alt="..." loading="lazy" />
                                        </div>

                                        <div>
                                            <div className="section-title">
                                                TP. Hồ Chí Minh -{">"} Đà Nẵng
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {newArr && newArr.length === 0 && (
                                    <div
                                        className=" section-custom"
                                        onClick={() => this.handleViewDetail(newArr[3])}>
                                        <div className="bg-img4">
                                            <img src={khanhhoa} alt="..." loading="lazy" />
                                        </div>

                                        <div>
                                            <div className="section-title">
                                                TP. Hồ Chí Minh -{">"} Khánh Hòa
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {newArr && newArr.length === 0 && (
                                    <div
                                        className=" section-custom"
                                        onClick={() => this.handleViewDetail(newArr[4])}>
                                        <div className="bg-img5">
                                            <img src={quynhon} alt="..." loading="lazy" />
                                        </div>

                                        <div>
                                            <div className="section-title">
                                                TP. Hồ Chí Minh -{">"} Bình Định
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {newArr && newArr.length === 0 && (
                                    <div
                                        className=" section-custom"
                                        onClick={() => this.handleViewDetail(newArr[5])}>
                                        <div className="bg-img6">
                                            <img src={hcm3} alt="..." loading="lazy" />
                                        </div>

                                        <div>
                                            <div className="section-title">
                                                Lâm Đồng -{">"} TP.Hồ Chí Minh
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {newArr && newArr.length > 0 && (
                                    <div
                                        className=" section-custom"
                                        onClick={() => this.handleViewDetail(newArr[0])}>
                                        <div className="bg-img1">
                                            {" "}
                                            <img src={vungtau} alt="Vũng tàu" loading="lazy" />
                                        </div>

                                        <div>
                                            <div className="section-title">
                                                TP. Hồ Chí Minh -{">"} Vũng Tàu
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {newArr && newArr.length > 0 && (
                                    <div
                                        className=" section-custom"
                                        onClick={() => this.handleViewDetail(newArr[1])}>
                                        <div className="bg-img2">
                                            <img src={dalat} alt="..." loading="lazy" />
                                        </div>

                                        <div>
                                            <div className="section-title">
                                                TP. Hồ Chí Minh -{">"} Lâm Đồng
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {newArr && newArr.length > 0 && (
                                    <div
                                        className=" section-custom"
                                        onClick={() => this.handleViewDetail(newArr[2])}>
                                        <div className="bg-img3">
                                            {" "}
                                            <img src={danang} alt="..." loading="lazy" />
                                        </div>

                                        <div>
                                            <div className="section-title">
                                                TP. Hồ Chí Minh -{">"} Đà Nẵng
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {newArr && newArr.length > 0 && (
                                    <div
                                        className=" section-custom"
                                        onClick={() => this.handleViewDetail(newArr[3])}>
                                        <div className="bg-img4">
                                            {" "}
                                            <img src={khanhhoa} alt="..." loading="lazy" />
                                        </div>

                                        <div>
                                            <div className="section-title">
                                                TP. Hồ Chí Minh -{">"} Khánh Hòa
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {newArr && newArr.length > 0 && (
                                    <div
                                        className=" section-custom"
                                        onClick={() => this.handleViewDetail(newArr[4])}>
                                        <div className="bg-img5">
                                            <img src={quynhon} alt="..." loading="lazy" />
                                        </div>

                                        <div>
                                            <div className="section-title">
                                                TP. Hồ Chí Minh -{">"} Bình Định
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {newArr && newArr.length > 0 && (
                                    <div
                                        className=" section-custom"
                                        onClick={() => this.handleViewDetail(newArr[5])}>
                                        <div className="bg-img6">
                                            {" "}
                                            <img src={hcm3} alt="..." loading="lazy" />
                                        </div>

                                        <div>
                                            <div className="section-title">
                                                Lâm Đồng -{">"} TP.Hồ Chí Minh
                                            </div>
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
        fetchAllRouteHome: () => dispatch(actions.fetchAllRouteHome()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Routes));
