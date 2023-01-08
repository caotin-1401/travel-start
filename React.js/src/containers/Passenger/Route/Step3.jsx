import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import { getUseCouponService, getAllPassengers } from "../../../services/userService";
import { FormattedMessage } from "react-intl";
class Step3 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            seatArr: [],
            totalPrice: 0,
            finalPrice: 0,
            coupon: "",
            inFoCoupon: [],
            discount: 0,
            discountMax: 0,
            type: "",
            errMessage: "",
            infoUser: {},
        };
    }

    componentDidMount() {
        this.setState({
            seatArr: this.props.seatArrParent,
            totalPrice: this.props.totalPriceParent,
            finalPrice: this.props.totalPriceParent,
        });
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.coupon !== this.state.coupon) {
            let res = await getUseCouponService(this.state.coupon);
            if (res && res.coupons) {
                this.setState({ inFoCoupon: res.coupons });
            }
        }
        if (prevState.inFoCoupon !== this.state.inFoCoupon) {
            this.setState({ errMessage: "", discount: 0 });
        }
    }
    currencyFormat(num) {
        return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") + " đ";
    }

    onChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value.toUpperCase();
        this.setState({
            ...copyState,
        });
    };
    handleBlur = async (event) => {
        let { language } = this.props;
        let {
            finalPrice,
            inFoCoupon,
            totalPrice,
            discount,
            discountMax,
            type,
            errMessage,
            infoUser,
        } = this.state;

        inFoCoupon && inFoCoupon.length > 0 ? (discount = inFoCoupon[0].discount) : (discount = 0);
        inFoCoupon && inFoCoupon.length > 0 ? (type = inFoCoupon[0].type) : (discount = 0);
        inFoCoupon && inFoCoupon.length > 0
            ? (discountMax = inFoCoupon[0].discountMax)
            : (discount = 0);

        if (inFoCoupon && inFoCoupon.length > 0) {
            if (inFoCoupon && inFoCoupon[0].Event && inFoCoupon[0].Event.id !== 6) {
                let current = new Date().getTime();
                if (current < inFoCoupon[0].startDate) {
                    if (language === "en") {
                        errMessage = "The coupon has not been used yet";
                    } else errMessage = "Mã giảm giá chưa tới thời gian sử dụng";
                } else if (current > inFoCoupon[0].endDate) {
                    if (language === "en") {
                        errMessage = "The coupon has expired";
                    } else errMessage = "Mã giảm giá đã hết thời gian sử dụng";
                } else if (inFoCoupon[0].use == inFoCoupon[0].count) {
                    if (language === "en") {
                        errMessage = "The coupon is out of stock";
                    } else errMessage = "Mã giảm giả đã hết";
                } else if (!type) {
                    finalPrice = totalPrice;
                } else if (type === "1") {
                    finalPrice = totalPrice - +discount;
                } else {
                    if ((totalPrice * +discount) / 100 > discountMax) {
                        finalPrice = totalPrice - +discountMax;
                    } else finalPrice = totalPrice - (totalPrice * +discount) / 100;

                    discount = (totalPrice * +discount) / 100;
                }
                if (finalPrice < 0) finalPrice = 0;

                if (errMessage) {
                    this.setState({
                        errMessage,
                    });
                } else
                    this.setState(
                        {
                            finalPrice,
                            discount,
                            discountMax,
                            type,
                        },
                        this.props.parentCallback(inFoCoupon, finalPrice)
                    );
            } else {
                let id;
                this.props.userInfo && (id = this.props.userInfo.id);
                let resUser = await getAllPassengers(id);
                if (resUser) {
                    if (resUser.users) {
                        if (!resUser.users[0].isFirst) {
                            let current = new Date().getTime();
                            if (current < inFoCoupon[0].startDate) {
                                if (language === "en") {
                                    errMessage = "The coupon has not been used yet";
                                } else errMessage = "Mã giảm giá chưa tới thời gian sử dụng";
                            } else if (current > inFoCoupon[0].endDate) {
                                if (language === "en") {
                                    errMessage = "The coupon has expired";
                                } else errMessage = "Mã giảm giá đã hết thời gian sử dụng";
                            } else if (inFoCoupon[0].use == inFoCoupon[0].count) {
                                if (language === "en") {
                                    errMessage = "The coupon is out of stock";
                                } else errMessage = "Mã giảm giả đã hết";
                            } else if (!type) {
                                finalPrice = totalPrice;
                            } else if (type === "1") {
                                finalPrice = totalPrice - +discount;
                            } else {
                                if ((totalPrice * +discount) / 100 > discountMax)
                                    finalPrice = totalPrice - +discountMax;
                                else finalPrice = totalPrice - (totalPrice * +discount) / 100;

                                discount = (totalPrice * +discount) / 100;
                            }
                            if (finalPrice < 0) finalPrice = 0;

                            if (errMessage) {
                                this.setState({
                                    errMessage,
                                });
                            } else {
                                infoUser = {
                                    id: resUser.users[0].id,
                                    isFirst: 1,
                                };
                                this.setState(
                                    {
                                        finalPrice,
                                        discount,
                                        discountMax,
                                        type,
                                        infoUser,
                                    },
                                    () => {
                                        this.props.parentCallback(inFoCoupon, finalPrice, infoUser);
                                    }
                                );
                            }
                        } else {
                            errMessage = "Bạn đã sử dụng mã giảm giá lần đầu rồi ";
                            this.setState({
                                errMessage,
                            });
                        }
                    }
                }
            }
        } else {
            if (language === "vi") errMessage = "Mã giảm giá không tồn tại ";
            else errMessage = "Coupon does not exist ";
            this.setState({
                errMessage,
                discount: 0,
                finalPrice: totalPrice,
            });
            this.props.parentCallback(inFoCoupon, finalPrice, infoUser);
        }
    };
    handleKeyDown = (e) => {
        if (e.key === "Enter" || e.keyCode === 13) {
            this.handleBlur();
        }
    };
    render() {
        let { seatArr, totalPrice, coupon, finalPrice, discount, errMessage } = this.state;
        return (
            <div className="container">
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                    <div style={{ width: "400px" }}>
                        <Row className="mb-4">
                            <span
                                style={{
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                }}>
                                <Row>
                                    <Col md={5}>
                                        {" "}
                                        <FormattedMessage id="routes.prices" /> :{" "}
                                    </Col>
                                    <Col md={7}>{this.currencyFormat(totalPrice)}</Col>
                                </Row>
                            </span>
                        </Row>
                        <Row className="mb-4">
                            <span
                                style={{
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                }}>
                                <Row>
                                    <Col md={5}>
                                        {" "}
                                        <FormattedMessage id="routes.seats" /> :{" "}
                                    </Col>
                                    <Col md={7}>
                                        {seatArr &&
                                            seatArr.length > 0 &&
                                            seatArr.map((item) => {
                                                return <> {item.keyMap} </>;
                                            })}
                                    </Col>
                                </Row>
                            </span>
                        </Row>
                        <Row>
                            <Col md={5}>
                                <label htmlFor="coupon" className="mt-2">
                                    <FormattedMessage id="routes.entercoupon" /> :
                                </label>
                            </Col>

                            <Col md={7}>
                                <input
                                    value={coupon}
                                    onChange={(event) => {
                                        this.onChangeInput(event, "coupon");
                                    }}
                                    onBlur={this.handleBlur}
                                    onKeyDown={this.handleKeyDown}
                                    id="coupon"
                                    className="form-control mb-4 h-38 "
                                />
                            </Col>
                        </Row>{" "}
                        <Row>
                            <div style={{ color: "red" }} className="mb-4">
                                {errMessage}
                            </div>
                        </Row>
                        <Row className="mb-4">
                            <span
                                style={{
                                    fontSize: "16px",
                                }}>
                                <Row>
                                    <Col md={5}>
                                        {" "}
                                        <FormattedMessage id="routes.discount" /> :{" "}
                                    </Col>
                                    <Col md={7}>- {this.currencyFormat(+discount)}</Col>
                                </Row>
                            </span>
                        </Row>
                        <Row className="mb-4">
                            <span
                                style={{
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                }}>
                                <Row>
                                    <Col md={5}>
                                        {" "}
                                        <FormattedMessage id="routes.order" /> :{" "}
                                    </Col>
                                    <Col md={7}>{this.currencyFormat(finalPrice)}</Col>
                                </Row>
                            </span>
                        </Row>
                        <p>
                            <FormattedMessage id="routes.title" />
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return { userInfo: state.user.userInfo, language: state.app.language };
};
const mapDispatchToProps = (dispatch) => {
    return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(Step3);
