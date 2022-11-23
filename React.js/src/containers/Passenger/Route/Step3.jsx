import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import {
    useCouponService,
    getUseCouponService,
} from "../../../services/userService";

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
            this.setState({ inFoCoupon: res.coupons });
        }
    }
    currencyFormat(num) {
        return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") + " đ";
    }
    fetchCoupon = async () => {
        let { coupon } = this.state;
        let res = await getUseCouponService(coupon);
    };
    onChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value.toUpperCase();
        this.setState({
            ...copyState,
        });
    };
    handleBlur = async (event) => {
        let {
            finalPrice,
            inFoCoupon,
            totalPrice,
            discount,
            discountMax,
            type,
        } = this.state;
        console.log(inFoCoupon);
        inFoCoupon && inFoCoupon.length > 0
            ? (discount = inFoCoupon[0].discount)
            : (discount = 0);
        inFoCoupon && inFoCoupon.length > 0
            ? (type = inFoCoupon[0].type)
            : (discount = 0);
        inFoCoupon && inFoCoupon.length > 0
            ? (discountMax = inFoCoupon[0].discountMax)
            : (discount = 0);
        if (type == "2") {
            finalPrice = totalPrice - +discount;
        } else {
            if (totalPrice.discount > discountMax)
                finalPrice = totalPrice - +discountMax;
            else finalPrice = totalPrice - +discount;
        }
        if (finalPrice < 0) finalPrice = 0;
        else {
            finalPrice = finalPrice;
        }
        this.setState(
            {
                finalPrice,
                discount,
                discountMax,
                type,
            },
            this.props.parentCallback(inFoCoupon, finalPrice)
        );
    };
    render() {
        let {
            seatArr,
            totalPrice,
            coupon,
            finalPrice,
            discount,
            discountMax,
            type,
        } = this.state;

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
                                    <Col md={5}> Giá : </Col>
                                    <Col md={7}>
                                        {this.currencyFormat(totalPrice)}
                                    </Col>
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
                                    <Col md={5}>Vị trí ngồi : </Col>
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
                                    Nhap ma khuyen mai :
                                </label>
                            </Col>
                            <Col md={7}>
                                <input
                                    value={coupon}
                                    onChange={(event) => {
                                        this.onChangeInput(event, "coupon");
                                    }}
                                    onBlur={this.handleBlur}
                                    id="coupon"
                                    className="form-control mb-4 h-38 "
                                />
                            </Col>
                        </Row>
                        <Row className="mb-4">
                            <span
                                style={{
                                    fontSize: "16px",
                                }}>
                                <Row>
                                    <Col md={5}> Giảm : </Col>
                                    <Col md={7}>
                                        - {this.currencyFormat(+discount)}
                                    </Col>
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
                                    <Col md={5}> Tổng thanh toán : </Col>
                                    <Col md={7}>
                                        {this.currencyFormat(finalPrice)}
                                    </Col>
                                </Row>
                            </span>
                        </Row>
                        <p>
                            Vui lòng kiểm tra email đã đăng ký để hoàn tất thủ
                            tục đăng ký vé
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
};
const mapDispatchToProps = (dispatch) => {
    return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(Step3);
