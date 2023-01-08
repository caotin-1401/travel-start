import React, { Component } from "react";
import { connect } from "react-redux";
import Header from "../../HomePage/Header";
import { FormattedMessage } from "react-intl";
import moment from "moment";
import localization from "moment/locale/vi";
import { withRouter } from "react-router";
import { getAllEventsService } from "../../../services/userService";
import { Row, Col } from "reactstrap";
import ModalDetalCoupon from "./ModalDetalCoupon";
import HomeFooter from "./../../HomePage/Section/HomeFooter";
import SkeletonDetail from "./SkeletonDetail";
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
            isOpenModelEditUser: false,
            loading: false,
        };
    }
    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let res = await getAllEventsService(id);
            let data = [];
            res && res.errCode === 0 && (data = res.events);
            res &&
                res.errCode === 0 &&
                this.setState({
                    loading: true,
                });
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
    toggleUserEditModel = () => {
        this.setState({
            isOpenModelEditUser: !this.state.isOpenModelEditUser,
        });
    };
    handleEditUser = (user) => {
        console.log(user);
        this.setState({
            isOpenModelEditUser: true,
            userEdit: user,
        });
    };
    doEditUser = async (user) => {
        this.setState({
            isOpenModelEditUser: false,
        });
    };
    currencyFormat(num) {
        console.log(" >>:", num);
        return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") + " đ";
    }
    render() {
        let { name, description, startDate, endDate, image, listCoupons } = this.state;
        let language = this.props.language;
        let start = moment(+startDate).format(" DD/MM/YYYY");
        let end = moment(+endDate).format(" DD/MM/YYYY");
        let imageBase64 = "";
        if (image) {
            imageBase64 = Buffer.from(image, "base64").toString("binary");
        }
        let mes, mes2;
        if (language === "en") {
            mes = "Discount";
            mes2 = "Get the coupon successfully";
        } else {
            mes = "Giảm";
            mes2 = "Lấy mã giảm giá thành công";
        }
        return (
            <div style={{ overflowX: "hidden" }}>
                <Header />
                {this.state.isOpenModelEditUser && (
                    <ModalDetalCoupon
                        isOpen={this.state.isOpenModelEditUser}
                        toggleFromParent={this.toggleUserEditModel}
                        currentUser={this.state.userEdit}
                        doEditUser={this.doEditUser}
                    />
                )}
                <div
                    style={{
                        backgroundColor: "#FAFAFA",
                    }}>
                    <div className="container">
                        <Row>
                            <Col lg={3} md={2} sm={1}></Col>
                            <Col lg={6} md={8} sm={10} className="content_event">
                                {this.state.loading === false && <SkeletonDetail />}
                                {this.state.loading === true && (
                                    <>
                                        <div className="title_header">
                                            {" "}
                                            <FormattedMessage id="events.details.title" />
                                        </div>
                                        <h2
                                            style={{
                                                marginBottom: "22px",
                                                fontSize: "30px",
                                            }}>
                                            {name}
                                        </h2>
                                        <div style={{ marginBottom: "22px" }}>
                                            <FormattedMessage id="events.details.time1" />
                                            <b>{start}</b>{" "}
                                            <FormattedMessage id="events.details.time2" />
                                            <b>{end} </b>
                                        </div>
                                        <div className="t-box">
                                            <div
                                                className="bg-img_100"
                                                style={{
                                                    backgroundImage: `url(${imageBase64})`,
                                                }}
                                            />
                                        </div>
                                        <div
                                            className="content_mardown"
                                            style={{ textAlign: "justify " }}
                                            dangerouslySetInnerHTML={{
                                                __html: description,
                                            }}></div>
                                    </>
                                )}
                            </Col>

                            <Col lg={3} md={2} sm={1}></Col>
                        </Row>
                        <div style={{ height: "500px" }} className="test"></div>
                    </div>
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
                                {listCoupons && listCoupons.length > 0 && listCoupons[0].id ? (
                                    listCoupons.map((item, index) => {
                                        if (index % 2 === 0) {
                                            let price;
                                            +item.type === 2 ? (price = "%") : (price = "đ");
                                            let start = moment(+item.startDate).format("L");
                                            let end = moment(+item.endDate).format("L");
                                            let text = item.name;
                                            return (
                                                <>
                                                    <Col md={1}></Col>
                                                    <Col md={5}>
                                                        <div className="basic-style">
                                                            <div className="coupon">
                                                                <div className="main-coupon">
                                                                    <p className="coupon-value">
                                                                        {+item.type === 2
                                                                            ? `  ${mes} ${item.discount} ${price}`
                                                                            : `  ${mes} ${this.currencyFormat(
                                                                                  +item.discount
                                                                              )} `}
                                                                    </p>

                                                                    <p className="coupon-required">
                                                                        <FormattedMessage id="events.details.order" />{" "}
                                                                        {this.currencyFormat(
                                                                            item.discountMax
                                                                        )}
                                                                    </p>
                                                                    <p className="start-date">
                                                                        {start} - {end}
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
                                                                                    alert(mes2);
                                                                                }}>
                                                                                {text}
                                                                            </button>
                                                                        </p>
                                                                    </p>
                                                                    <p
                                                                        className="condition"
                                                                        onClick={() =>
                                                                            this.handleEditUser(
                                                                                item
                                                                            )
                                                                        }>
                                                                        <FormattedMessage id="events.details.conditions" />
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
                                            +item.type === 2 ? (price = "%") : (price = "đ");
                                            let start = moment(+item.startDate).format("L");
                                            let end = moment(+item.endDate).format("L");
                                            let text = item.name;
                                            return (
                                                <>
                                                    <Col md={5}>
                                                        <div className="basic-style">
                                                            <div className="coupon">
                                                                <div className="main-coupon">
                                                                    <p className="coupon-value">
                                                                        {+item.type === 2
                                                                            ? `  ${mes} ${item.discount} ${price}`
                                                                            : `  ${mes} ${this.currencyFormat(
                                                                                  +item.discount
                                                                              )} `}
                                                                    </p>

                                                                    <p className="coupon-required">
                                                                        <FormattedMessage id="events.details.order" />{" "}
                                                                        {this.currencyFormat(
                                                                            item.discountMax
                                                                        )}
                                                                    </p>
                                                                    <p className="start-date">
                                                                        {start} - {end}
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
                                                                                    alert(mes2);
                                                                                }}>
                                                                                {text}
                                                                            </button>
                                                                        </p>
                                                                    </p>
                                                                    <p
                                                                        className="condition"
                                                                        onClick={() =>
                                                                            this.handleEditUser(
                                                                                item
                                                                            )
                                                                        }>
                                                                        <FormattedMessage id="events.details.conditions" />
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
                                    <div>
                                        <div style={{ textAlign: "center" }}>
                                            Hiện tại không có mã giảm giá của sự kiện này
                                        </div>
                                    </div>
                                )}
                            </Row>
                        </Col>
                        <Col md={1}></Col>
                        <div style={{ height: "100px" }}></div>
                    </Row>
                </div>
                <HomeFooter />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DetailEvent));
