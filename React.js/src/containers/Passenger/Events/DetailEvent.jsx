import React, { Component } from "react";
import { connect } from "react-redux";
import Header from "../../HomePage/Header";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { LANGUAGES } from "../../../utils";
import { changeLanguageApp } from "../../../store/actions/appActions";
import dayjs from "dayjs";
import moment from "moment";
import localization from "moment/locale/vi";
import * as actions from "../../../store/actions";
import { withRouter } from "react-router";
import { getAllEventsService } from "../../../services/userService";
import { Row, Col } from "reactstrap";
class DetailEvent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listEvents: [],
            listContent: [],
            name: "",
            description: "",
            startDate: "",
            endDate: "",
            image: "",
        };
    }
    async componentDidMount() {
        this.props.fetchAllEvents();
        if (
            this.props.match &&
            this.props.match.params &&
            this.props.match.params.id
        ) {
            let id = this.props.match.params.id;
            let res = await getAllEventsService(id);
            let data = [];
            res && res.errCode === 0 && (data = res.events);
            // console.log(data);
            let arr = [];
            data &&
                data.length > 0 &&
                data.forEach((item) => {
                    // console.log(item);
                    arr.push(item.Coupons);
                });
            console.log(arr);
            data && data.length > 0
                ? this.setState({
                      name: data[0].name,
                      description: data[0].description,
                      startDate: data[0].startDate,
                      endDate: data[0].endDate,
                      image: data[0].image,
                      listCoupons: arr,
                  })
                : this.setState({
                      name: data.name,
                      description: data.description,
                      startDate: data.startDate,
                      endDate: data.endDate,
                      image: data.image,
                      listCoupons: arr,
                  });
        }
    }

    render() {
        let { name, description, startDate, endDate, image, listCoupons } =
            this.state;
        let language = this.props.language;
        let start = moment(+startDate).format(" DD/MM/YYYY");
        let end = moment(+endDate).format(" DD/MM/YYYY");
        let imageBase64 = "";
        if (image) {
            imageBase64 = Buffer.from(image, "base64").toString("binary");
        }
        return (
            <React.Fragment style={{ overflowX: "hidden" }}>
                <Header />
                <div className="container">
                    <Row>
                        <Col lg={3} md={2} sm={1}></Col>
                        <Col lg={7} md={8} sm={10}>
                            <div className="title_header">Uu dai noi bac</div>
                            <h2
                                style={{
                                    marginBottom: "22px",
                                    fontSize: "30px",
                                }}>
                                {name}
                            </h2>
                            <div style={{ marginBottom: "22px" }}>
                                Thời gian: Từ <b>{start}</b> đến hết{" "}
                                <b>{end} </b>
                            </div>
                            <div style={{ width: "inherit" }}>
                                <div
                                    className="bg-img_100"
                                    style={{
                                        backgroundImage: `url(${imageBase64})`,
                                    }}
                                />
                            </div>
                            <div
                                style={{ textAlign: "justify" }}
                                dangerouslySetInnerHTML={{
                                    __html: description,
                                }}></div>
                        </Col>

                        <Col lg={3} md={2} sm={1}></Col>
                    </Row>
                    <div style={{ height: "500px" }} className="test"></div>
                </div>
                <div>
                    <Row style={{ backgroundColor: "#F0F4F6" }}>
                        <Col md={1}></Col>
                        <Col md={10}>
                            <Row
                                style={{
                                    backgroundColor: "#D3D6D8",
                                    marginTop: "40px",
                                }}>
                                {listCoupons && listCoupons.length > 0 ? (
                                    listCoupons.map((item, index) => {
                                        if (index % 2 === 0) {
                                            let price;
                                            +item.type == 1
                                                ? (price = "%")
                                                : (price = "đ");
                                            let start = moment(
                                                +startDate
                                            ).format("L");
                                            let end = moment(+endDate).format(
                                                "L"
                                            );
                                            let text = item.name;
                                            return (
                                                <>
                                                    <Col md={1}></Col>
                                                    <Col md={5}>
                                                        <div className="basic-style">
                                                            <div className="coupon">
                                                                <div className="main-coupon">
                                                                    <p className="coupon-value">
                                                                        Giảm{" "}
                                                                        {
                                                                            item.discount
                                                                        }{" "}
                                                                        {price}
                                                                    </p>

                                                                    <p className="coupon-required">
                                                                        Cho đơn
                                                                        từ{" "}
                                                                        {
                                                                            item.discountMax
                                                                        }{" "}
                                                                        đ
                                                                    </p>
                                                                    <p className="start-date">
                                                                        {start}{" "}
                                                                        - {end}
                                                                    </p>
                                                                </div>
                                                                <div className="vice-coupon">
                                                                    <p className="title">
                                                                        <p
                                                                            style={{
                                                                                zIndex: 10,
                                                                            }}>
                                                                            <button
                                                                                className="btn-coupon"
                                                                                onClick={() => {
                                                                                    navigator.clipboard.writeText(
                                                                                        text
                                                                                    );
                                                                                    alert(
                                                                                        "Lấy mã giảm giá thành công"
                                                                                    );
                                                                                }}>
                                                                                {
                                                                                    text
                                                                                }
                                                                            </button>
                                                                            {/* {" "}
                                                                    NEWFREND2022 */}
                                                                        </p>
                                                                    </p>
                                                                    <p className="condition">
                                                                        Điều
                                                                        kiện
                                                                    </p>
                                                                </div>
                                                                <i></i>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                </>
                                            );
                                        } else {
                                            let price;
                                            +item.type == 1
                                                ? (price = "%")
                                                : (price = "đ");
                                            let start = moment(
                                                +startDate
                                            ).format("L");
                                            let end = moment(+endDate).format(
                                                "L"
                                            );
                                            let text = item.name;
                                            return (
                                                <>
                                                    <Col md={5}>
                                                        <div className="basic-style">
                                                            <div className="coupon">
                                                                <div className="main-coupon">
                                                                    <p className="coupon-value">
                                                                        Giảm{" "}
                                                                        {
                                                                            item.discount
                                                                        }{" "}
                                                                        {price}
                                                                    </p>

                                                                    <p className="coupon-required">
                                                                        Cho đơn
                                                                        từ{" "}
                                                                        {
                                                                            item.discountMax
                                                                        }{" "}
                                                                        đ
                                                                    </p>
                                                                    <p className="start-date">
                                                                        {start}{" "}
                                                                        - {end}
                                                                    </p>
                                                                </div>
                                                                <div className="vice-coupon">
                                                                    <p className="title">
                                                                        <p
                                                                            style={{
                                                                                zIndex: 10,
                                                                            }}>
                                                                            <button
                                                                                className="btn-coupon"
                                                                                onClick={() => {
                                                                                    navigator.clipboard.writeText(
                                                                                        text
                                                                                    );
                                                                                    alert(
                                                                                        "Lấy mã giảm giá thành công"
                                                                                    );
                                                                                }}>
                                                                                {
                                                                                    text
                                                                                }
                                                                            </button>
                                                                        </p>
                                                                    </p>
                                                                    <p className="condition">
                                                                        Điều
                                                                        kiện
                                                                    </p>
                                                                </div>
                                                                <i></i>
                                                            </div>
                                                        </div>
                                                    </Col>
                                                    <Col md={1}></Col>
                                                </>
                                            );
                                        }
                                    })
                                ) : (
                                    <div>nsdf</div>
                                )}
                            </Row>
                        </Col>
                        <Col md={1}></Col>
                        <div style={{ height: "100px" }}></div>
                    </Row>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        listRoutes: state.admin.routes,
        events: state.admin.events,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        changeLanguageAppRedux: (language) =>
            dispatch(changeLanguageApp(language)),
        fetchAllRoute: () => dispatch(actions.fetchAllRoute()),
        fetchAllEvents: () => dispatch(actions.fetchAllEvents()),
    };
};
export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(DetailEvent)
);
