import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
import * as actions from "../../../store/actions";
class Step1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rangeSeat: [],
            seatArr: [],
            seatDisable: [],
            dataTicket: {},
            price: 0,
            totalPrice: 0,
        };
    }

    async componentDidMount() {
        let { rangeSeat, seatArr, price, totalPrice } = this.state;

        this.props.fetchAllArrSeat();
        this.props.fetchAllTickets();
        if (this.props.seatArrParent && this.props.seatArrParent.length > 0) {
            this.setState({
                dataTicket: this.props.tripInfoFromParent,
                seatArr: this.props.seatArrParent,
                // rangeSeat: this.props.rangeSeatParent,
                totalPrice: this.props.totalPriceParent,
            });
        } else
            this.setState({
                dataTicket: this.props.tripInfoFromParent,
            });
        if (this.state.seatArr && this.state.seatArr.length > 0) {
            totalPrice = this.state.length * this.state.price;
            this.setState({
                totalPrice,
            });
        }
    }
    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listOfSeat !== this.props.listOfSeat) {
            let data = this.props.listOfSeat;
            if (data && data.length > 0) {
                data = data.map((item) => ({
                    ...item,
                    isSelected: false,
                    tripId: this.props.tripInfoFromParent.id,
                    price: this.props.tripInfoFromParent.price,
                }));
            }
            let test1 = data.slice(0, this.props.tripInfoFromParent.maxNumber);
            this.setState({
                rangeSeat: test1,
                price: this.props.tripInfoFromParent.price,
            });
        }
        if (prevProps.seatArrParent !== this.props.seatArrParent) {
            if (this.props.seatArrParent.length > 0) {
            } else {
                this.setState({
                    totalPrice: 0,
                    seatArr: [],
                });
            }
        }
        if (
            prevProps.listOfTicketDisabled !== this.props.listOfTicketDisabled
        ) {
            this.setState({
                seatDisable: this.props.listOfTicketDisabled,
            });
        }
    }
    handleClickBtnSeat = (time) => {
        let { rangeSeat, seatArr, price, totalPrice } = this.state;
        if (rangeSeat && rangeSeat.length > 0) {
            rangeSeat = rangeSeat.map((item) => {
                if (item.id === time.id) item.isSelected = !item.isSelected;
                return item;
            });
            seatArr = rangeSeat.filter((item) => {
                return (
                    item.isSelected === true &&
                    item.tripId === this.props.tripInfoFromParent.id
                );
            });
            if (seatArr && seatArr.length > 0) {
                totalPrice = seatArr.length * price;
            } else totalPrice = 0;
            this.setState({
                rangeSeat: rangeSeat,
                totalPrice,
                seatArr,
            });
        }
        this.props.parentCallback(seatArr, totalPrice);
    };
    currencyFormat(num) {
        return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") + " đ";
    }
    render() {
        let { rangeSeat, dataTicket, totalPrice, seatArr, seatDisable } =
            this.state;

        let lengthArr = rangeSeat.length;
        return (
            <div>
                <Row style={{ marginBottom: "30px" }}>
                    <Col md={5} span={12}>
                        <div>
                            <div className="seat__groups">
                                <div className="seat__note">
                                    <p>Chú thích</p>
                                </div>
                                <div className="seat__info">
                                    <div className="seat__info--empty"></div>
                                    <span className="seat__info--name">
                                        Còn trống
                                    </span>
                                </div>
                                <div className="seat__info">
                                    <div className="seat__info--booked"></div>
                                    <span className="seat__info--name">
                                        Đã đặt
                                    </span>
                                </div>
                                <div className="seat__info">
                                    <div className="seat__info--select"></div>
                                    <span className="seat__info--name">
                                        Đang chọn
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div
                            style={{
                                position: "absolute",
                                bottom: "100px",
                                width: "40%",
                            }}>
                            <div>
                                <span
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: "16px",
                                    }}>
                                    Giá : {this.currencyFormat(totalPrice)}
                                </span>
                            </div>
                            <div>
                                <span
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: "16px",
                                    }}>
                                    Vị trí ngồi :{" "}
                                    {seatArr &&
                                        seatArr.length > 0 &&
                                        seatArr.map((item) => {
                                            return <> {item.keyMap} </>;
                                        })}
                                </span>
                            </div>
                        </div>
                    </Col>
                    <Col md={7} span={12}>
                        {lengthArr === 40 && (
                            <div style={{ display: "flex" }}>
                                <div>
                                    <span style={{ fontSize: "20px" }}>
                                        Tầng 1
                                    </span>
                                    <div className="floor1">
                                        <div className="row">
                                            <p className="driver">TÀI XẾ</p>
                                            {rangeSeat
                                                .slice(0, lengthArr / 2)
                                                .map((s, index) => {
                                                    let a = seatDisable.find(
                                                        (item) =>
                                                            item.seatNo ===
                                                                s.keyMap &&
                                                            item.tripId ===
                                                                dataTicket.id
                                                    );

                                                    return (
                                                        <>
                                                            {index > 14 ? (
                                                                <div className="w-17">
                                                                    <td
                                                                        className="w-17"
                                                                        key={
                                                                            index
                                                                        }>
                                                                        <button
                                                                            onClick={() =>
                                                                                this.handleClickBtnSeat(
                                                                                    s
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                a &&
                                                                                a.seatNo ===
                                                                                    s.keyMap
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                            style={{
                                                                                background: `${
                                                                                    a &&
                                                                                    a.seatNo ===
                                                                                        s.keyMap
                                                                                        ? "#767676"
                                                                                        : s.isSelected
                                                                                        ? "#5090e9"
                                                                                        : "white"
                                                                                }`,
                                                                            }}
                                                                            className="seat_last_5">
                                                                            <div>
                                                                                {
                                                                                    s.keyMap
                                                                                }
                                                                            </div>
                                                                        </button>
                                                                    </td>
                                                                </div>
                                                            ) : (
                                                                <div className="col-4">
                                                                    <td
                                                                        key={
                                                                            index
                                                                        }>
                                                                        <button
                                                                            onClick={() =>
                                                                                this.handleClickBtnSeat(
                                                                                    s
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                a &&
                                                                                a.seatNo ===
                                                                                    s.keyMap
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                            style={{
                                                                                background: `${
                                                                                    a &&
                                                                                    a.seatNo ===
                                                                                        s.keyMap
                                                                                        ? "#767676"
                                                                                        : s.isSelected
                                                                                        ? "#5090e9"
                                                                                        : "white"
                                                                                }`,
                                                                            }}
                                                                            className="seat_last">
                                                                            <div>
                                                                                {
                                                                                    s.keyMap
                                                                                }
                                                                            </div>
                                                                        </button>
                                                                    </td>
                                                                </div>
                                                            )}
                                                        </>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <span style={{ fontSize: "20px" }}>
                                        Tầng 2
                                    </span>
                                    <div className="floor2">
                                        <div className="row">
                                            <p className="driver_none"></p>
                                            {rangeSeat
                                                .slice(lengthArr / 2, lengthArr)
                                                .map((s, index) => {
                                                    let a = seatDisable.find(
                                                        (item) =>
                                                            item.seatNo ===
                                                                s.keyMap &&
                                                            item.tripId ===
                                                                dataTicket.id
                                                    );
                                                    return (
                                                        <>
                                                            {index > 14 ? (
                                                                <div className="w-17">
                                                                    <td
                                                                        key={
                                                                            index
                                                                        }>
                                                                        <button
                                                                            onClick={() =>
                                                                                this.handleClickBtnSeat(
                                                                                    s
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                a &&
                                                                                a.seatNo ===
                                                                                    s.keyMap
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                            style={{
                                                                                background: `${
                                                                                    a &&
                                                                                    a.seatNo ===
                                                                                        s.keyMap
                                                                                        ? "#767676"
                                                                                        : s.isSelected
                                                                                        ? "#5090e9"
                                                                                        : "white"
                                                                                }`,
                                                                            }}
                                                                            className="seat_last_5">
                                                                            <div>
                                                                                {
                                                                                    s.keyMap
                                                                                }
                                                                            </div>
                                                                        </button>
                                                                    </td>
                                                                </div>
                                                            ) : (
                                                                <div className="col-4">
                                                                    <td
                                                                        key={
                                                                            index
                                                                        }>
                                                                        <button
                                                                            onClick={() =>
                                                                                this.handleClickBtnSeat(
                                                                                    s
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                a &&
                                                                                a.seatNo ===
                                                                                    s.keyMap
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                            style={{
                                                                                background: `${
                                                                                    a &&
                                                                                    a.seatNo ===
                                                                                        s.keyMap
                                                                                        ? "#767676"
                                                                                        : s.isSelected
                                                                                        ? "#5090e9"
                                                                                        : "white"
                                                                                }`,
                                                                            }}
                                                                            className="seat_last">
                                                                            <div>
                                                                                {
                                                                                    s.keyMap
                                                                                }
                                                                            </div>
                                                                        </button>
                                                                    </td>
                                                                </div>
                                                            )}
                                                        </>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {lengthArr === 44 && (
                            <div style={{ display: "flex" }}>
                                <div>
                                    <span style={{ fontSize: "20px" }}>
                                        Tầng 1
                                    </span>
                                    <div className="floor1">
                                        <div className="row">
                                            <p className="driver">TÀI XẾ</p>
                                            {rangeSeat
                                                .slice(0, lengthArr / 2)
                                                .map((s, index) => {
                                                    let a = seatDisable.find(
                                                        (item) =>
                                                            item.seatNo ===
                                                                s.keyMap &&
                                                            item.tripId ===
                                                                dataTicket.id
                                                    );
                                                    return (
                                                        <>
                                                            {index > 16 ? (
                                                                <div className="w-17">
                                                                    <td
                                                                        key={
                                                                            index
                                                                        }>
                                                                        <button
                                                                            onClick={() =>
                                                                                this.handleClickBtnSeat(
                                                                                    s
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                a &&
                                                                                a.seatNo ===
                                                                                    s.keyMap
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                            style={{
                                                                                background: `${
                                                                                    a &&
                                                                                    a.seatNo ===
                                                                                        s.keyMap
                                                                                        ? "#767676"
                                                                                        : s.isSelected
                                                                                        ? "#5090e9"
                                                                                        : "white"
                                                                                }`,
                                                                            }}
                                                                            className="seat_last_5">
                                                                            <div>
                                                                                {
                                                                                    s.keyMap
                                                                                }
                                                                            </div>
                                                                        </button>
                                                                    </td>
                                                                </div>
                                                            ) : index === 15 ? (
                                                                <div className="col-8">
                                                                    <td
                                                                        key={
                                                                            index
                                                                        }>
                                                                        <button
                                                                            onClick={() =>
                                                                                this.handleClickBtnSeat(
                                                                                    s
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                a &&
                                                                                a.seatNo ===
                                                                                    s.keyMap
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                            style={{
                                                                                background: `${
                                                                                    a &&
                                                                                    a.seatNo ===
                                                                                        s.keyMap
                                                                                        ? "#767676"
                                                                                        : s.isSelected
                                                                                        ? "#5090e9"
                                                                                        : "white"
                                                                                }`,
                                                                            }}
                                                                            className="seat_last">
                                                                            <div>
                                                                                {
                                                                                    s.keyMap
                                                                                }
                                                                            </div>
                                                                        </button>
                                                                    </td>
                                                                </div>
                                                            ) : (
                                                                <div className="col-4">
                                                                    <td
                                                                        key={
                                                                            index
                                                                        }>
                                                                        <button
                                                                            onClick={() =>
                                                                                this.handleClickBtnSeat(
                                                                                    s
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                a &&
                                                                                a.seatNo ===
                                                                                    s.keyMap
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                            style={{
                                                                                background: `${
                                                                                    a &&
                                                                                    a.seatNo ===
                                                                                        s.keyMap
                                                                                        ? "#767676"
                                                                                        : s.isSelected
                                                                                        ? "#5090e9"
                                                                                        : "white"
                                                                                }`,
                                                                            }}
                                                                            className="seat_last">
                                                                            <div>
                                                                                {
                                                                                    s.keyMap
                                                                                }
                                                                            </div>
                                                                        </button>
                                                                    </td>
                                                                </div>
                                                            )}
                                                        </>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <span style={{ fontSize: "20px" }}>
                                        Tầng 2
                                    </span>
                                    <div className="floor2">
                                        <div className="row">
                                            <p className="driver_none"></p>
                                            {rangeSeat
                                                .slice(lengthArr / 2, lengthArr)
                                                .map((s, index) => {
                                                    let a = seatDisable.find(
                                                        (item) =>
                                                            item.seatNo ===
                                                                s.keyMap &&
                                                            item.tripId ===
                                                                dataTicket.id
                                                    );
                                                    return (
                                                        <>
                                                            {index > 16 ? (
                                                                <div className="w-17">
                                                                    <td
                                                                        key={
                                                                            index
                                                                        }>
                                                                        <button
                                                                            onClick={() =>
                                                                                this.handleClickBtnSeat(
                                                                                    s
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                a &&
                                                                                a.seatNo ===
                                                                                    s.keyMap
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                            style={{
                                                                                background: `${
                                                                                    a &&
                                                                                    a.seatNo ===
                                                                                        s.keyMap
                                                                                        ? "#767676"
                                                                                        : s.isSelected
                                                                                        ? "#5090e9"
                                                                                        : "white"
                                                                                }`,
                                                                            }}
                                                                            className="seat_last_5">
                                                                            <div>
                                                                                {
                                                                                    s.keyMap
                                                                                }
                                                                            </div>
                                                                        </button>
                                                                    </td>
                                                                </div>
                                                            ) : index === 15 ? (
                                                                <div className="col-8">
                                                                    <td
                                                                        key={
                                                                            index
                                                                        }>
                                                                        <button
                                                                            onClick={() =>
                                                                                this.handleClickBtnSeat(
                                                                                    s
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                a &&
                                                                                a.seatNo ===
                                                                                    s.keyMap
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                            style={{
                                                                                background: `${
                                                                                    a &&
                                                                                    a.seatNo ===
                                                                                        s.keyMap
                                                                                        ? "#767676"
                                                                                        : s.isSelected
                                                                                        ? "#5090e9"
                                                                                        : "white"
                                                                                }`,
                                                                            }}
                                                                            className="seat_last">
                                                                            <div>
                                                                                {
                                                                                    s.keyMap
                                                                                }
                                                                            </div>
                                                                        </button>
                                                                    </td>
                                                                </div>
                                                            ) : (
                                                                <div className="col-4">
                                                                    <td
                                                                        key={
                                                                            index
                                                                        }>
                                                                        <button
                                                                            onClick={() =>
                                                                                this.handleClickBtnSeat(
                                                                                    s
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                a &&
                                                                                a.seatNo ===
                                                                                    s.keyMap
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                            style={{
                                                                                background: `${
                                                                                    a &&
                                                                                    a.seatNo ===
                                                                                        s.keyMap
                                                                                        ? "#767676"
                                                                                        : s.isSelected
                                                                                        ? "#5090e9"
                                                                                        : "white"
                                                                                }`,
                                                                            }}
                                                                            className="seat_last">
                                                                            <div>
                                                                                {
                                                                                    s.keyMap
                                                                                }
                                                                            </div>
                                                                        </button>
                                                                    </td>
                                                                </div>
                                                            )}
                                                        </>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {lengthArr === 34 && (
                            <div style={{ display: "flex" }}>
                                <div>
                                    <span style={{ fontSize: "20px" }}>
                                        Tầng 1
                                    </span>
                                    <div className="floor1">
                                        <div className="row">
                                            <p className="driver">TÀI XẾ</p>
                                            {rangeSeat
                                                .slice(0, lengthArr / 2)
                                                .map((s, index) => {
                                                    let a = seatDisable.find(
                                                        (item) =>
                                                            item.seatNo ===
                                                                s.keyMap &&
                                                            item.tripId ===
                                                                dataTicket.id
                                                    );
                                                    return (
                                                        <>
                                                            {index === 15 ? (
                                                                <div className="col-8">
                                                                    <td
                                                                        key={
                                                                            index
                                                                        }>
                                                                        <button
                                                                            onClick={() =>
                                                                                this.handleClickBtnSeat(
                                                                                    s
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                a &&
                                                                                a.seatNo ===
                                                                                    s.keyMap
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                            style={{
                                                                                background: `${
                                                                                    a &&
                                                                                    a.seatNo ===
                                                                                        s.keyMap
                                                                                        ? "#767676"
                                                                                        : s.isSelected
                                                                                        ? "#5090e9"
                                                                                        : "white"
                                                                                }`,
                                                                            }}
                                                                            className="seat_last">
                                                                            <div>
                                                                                {
                                                                                    s.keyMap
                                                                                }
                                                                            </div>
                                                                        </button>
                                                                    </td>
                                                                </div>
                                                            ) : (
                                                                <div className="col-4">
                                                                    <td
                                                                        key={
                                                                            index
                                                                        }>
                                                                        <button
                                                                            onClick={() =>
                                                                                this.handleClickBtnSeat(
                                                                                    s
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                a &&
                                                                                a.seatNo ===
                                                                                    s.keyMap
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                            style={{
                                                                                background: `${
                                                                                    a &&
                                                                                    a.seatNo ===
                                                                                        s.keyMap
                                                                                        ? "#767676"
                                                                                        : s.isSelected
                                                                                        ? "#5090e9"
                                                                                        : "white"
                                                                                }`,
                                                                            }}
                                                                            className="seat_last">
                                                                            <div>
                                                                                {
                                                                                    s.keyMap
                                                                                }
                                                                            </div>
                                                                        </button>
                                                                    </td>
                                                                </div>
                                                            )}
                                                        </>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <span style={{ fontSize: "20px" }}>
                                        Tầng 2
                                    </span>
                                    <div className="floor2">
                                        <div className="row">
                                            <p className="driver_none"></p>
                                            {rangeSeat
                                                .slice(lengthArr / 2, lengthArr)
                                                .map((s, index) => {
                                                    let a = seatDisable.find(
                                                        (item) =>
                                                            item.seatNo ===
                                                                s.keyMap &&
                                                            item.tripId ===
                                                                dataTicket.id
                                                    );
                                                    return (
                                                        <>
                                                            {index === 15 ? (
                                                                <div className="col-8">
                                                                    <td
                                                                        key={
                                                                            index
                                                                        }>
                                                                        <button
                                                                            onClick={() =>
                                                                                this.handleClickBtnSeat(
                                                                                    s
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                a &&
                                                                                a.seatNo ===
                                                                                    s.keyMap
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                            style={{
                                                                                background: `${
                                                                                    a &&
                                                                                    a.seatNo ===
                                                                                        s.keyMap
                                                                                        ? "#767676"
                                                                                        : s.isSelected
                                                                                        ? "#5090e9"
                                                                                        : "white"
                                                                                }`,
                                                                            }}
                                                                            className="seat_last">
                                                                            <div>
                                                                                {
                                                                                    s.keyMap
                                                                                }
                                                                            </div>
                                                                        </button>
                                                                    </td>
                                                                </div>
                                                            ) : (
                                                                <div className="col-4">
                                                                    <td
                                                                        key={
                                                                            index
                                                                        }>
                                                                        <button
                                                                            onClick={() =>
                                                                                this.handleClickBtnSeat(
                                                                                    s
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                a &&
                                                                                a.seatNo ===
                                                                                    s.keyMap
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                            style={{
                                                                                background: `${
                                                                                    a &&
                                                                                    a.seatNo ===
                                                                                        s.keyMap
                                                                                        ? "#767676"
                                                                                        : s.isSelected
                                                                                        ? "#5090e9"
                                                                                        : "white"
                                                                                }`,
                                                                            }}
                                                                            className="seat_last">
                                                                            <div>
                                                                                {
                                                                                    s.keyMap
                                                                                }
                                                                            </div>
                                                                        </button>
                                                                    </td>
                                                                </div>
                                                            )}
                                                        </>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}{" "}
                        {lengthArr === 28 && (
                            <div style={{ display: "flex" }}>
                                <div>
                                    <div className="background_28">
                                        <div className="row">
                                            <p className="driver">TÀI XẾ</p>
                                            {rangeSeat
                                                .slice(0, lengthArr)
                                                .map((s, index) => {
                                                    let a = seatDisable.find(
                                                        (item) =>
                                                            item.seatNo ===
                                                                s.keyMap &&
                                                            item.tripId ===
                                                                dataTicket.id
                                                    );
                                                    return (
                                                        <>
                                                            {index > 23 ? (
                                                                <div className="col-3">
                                                                    <td
                                                                        key={
                                                                            index
                                                                        }>
                                                                        <button
                                                                            onClick={() =>
                                                                                this.handleClickBtnSeat(
                                                                                    s
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                a &&
                                                                                a.seatNo ===
                                                                                    s.keyMap
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                            className="seat_28"
                                                                            style={{
                                                                                background: `${
                                                                                    a &&
                                                                                    a.seatNo ===
                                                                                        s.keyMap
                                                                                        ? "#767676"
                                                                                        : s.isSelected
                                                                                        ? "#5090e9"
                                                                                        : "white"
                                                                                }`,
                                                                            }}>
                                                                            <div>
                                                                                {
                                                                                    s.keyMap
                                                                                }
                                                                            </div>
                                                                        </button>
                                                                    </td>
                                                                </div>
                                                            ) : (index + 2) %
                                                                  3 ===
                                                              0 ? (
                                                                <div className="col-6">
                                                                    <td
                                                                        key={
                                                                            index
                                                                        }>
                                                                        <button
                                                                            onClick={() =>
                                                                                this.handleClickBtnSeat(
                                                                                    s
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                a &&
                                                                                a.seatNo ===
                                                                                    s.keyMap
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                            className="seat_28"
                                                                            style={{
                                                                                background: `${
                                                                                    a &&
                                                                                    a.seatNo ===
                                                                                        s.keyMap
                                                                                        ? "#767676"
                                                                                        : s.isSelected
                                                                                        ? "#5090e9"
                                                                                        : "white"
                                                                                }`,
                                                                            }}>
                                                                            <div>
                                                                                {
                                                                                    s.keyMap
                                                                                }
                                                                            </div>
                                                                        </button>
                                                                    </td>
                                                                </div>
                                                            ) : (
                                                                <div className="col-3">
                                                                    <td
                                                                        key={
                                                                            index
                                                                        }>
                                                                        <button
                                                                            onClick={() =>
                                                                                this.handleClickBtnSeat(
                                                                                    s
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                a &&
                                                                                a.seatNo ===
                                                                                    s.keyMap
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                            className="seat_28"
                                                                            style={{
                                                                                background: `${
                                                                                    a &&
                                                                                    a.seatNo ===
                                                                                        s.keyMap
                                                                                        ? "#767676"
                                                                                        : s.isSelected
                                                                                        ? "#5090e9"
                                                                                        : "white"
                                                                                }`,
                                                                            }}>
                                                                            <div>
                                                                                {
                                                                                    s.keyMap
                                                                                }
                                                                            </div>
                                                                        </button>
                                                                    </td>
                                                                </div>
                                                            )}
                                                        </>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {lengthArr === 22 && (
                            <div style={{ display: "flex" }}>
                                <div>
                                    <span style={{ fontSize: "20px" }}>
                                        Tầng 1
                                    </span>
                                    <div className="background_22">
                                        <div className="row">
                                            <p className="driver">TÀI XẾ</p>
                                            {rangeSeat
                                                .slice(0, lengthArr / 2)
                                                .map((s, index) => {
                                                    let a = seatDisable.find(
                                                        (item) =>
                                                            item.seatNo ===
                                                                s.keyMap &&
                                                            item.tripId ===
                                                                dataTicket.id
                                                    );
                                                    return (
                                                        <div className="col-6">
                                                            <td
                                                                key={index}
                                                                className="fcc">
                                                                <button
                                                                    onClick={() =>
                                                                        this.handleClickBtnSeat(
                                                                            s
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        a &&
                                                                        a.seatNo ===
                                                                            s.keyMap
                                                                            ? true
                                                                            : false
                                                                    }
                                                                    className="seat_22"
                                                                    style={{
                                                                        background: `${
                                                                            a &&
                                                                            a.seatNo ===
                                                                                s.keyMap
                                                                                ? "#767676"
                                                                                : s.isSelected
                                                                                ? "#5090e9"
                                                                                : "white"
                                                                        }`,
                                                                    }}>
                                                                    <div>
                                                                        {" "}
                                                                        {s}
                                                                    </div>
                                                                </button>
                                                            </td>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <span style={{ fontSize: "20px" }}>
                                        Tầng 2
                                    </span>
                                    <div className="background_22">
                                        <div className="row">
                                            <p className="driver_none"></p>
                                            {rangeSeat
                                                .slice(lengthArr / 2, lengthArr)
                                                .map((s, index) => {
                                                    let a = seatDisable.find(
                                                        (item) =>
                                                            item.seatNo ===
                                                                s.keyMap &&
                                                            item.tripId ===
                                                                dataTicket.id
                                                    );
                                                    return (
                                                        <div className="col-6">
                                                            <td
                                                                key={index}
                                                                className="fcc">
                                                                <button
                                                                    onClick={() =>
                                                                        this.handleClickBtnSeat(
                                                                            s
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        a &&
                                                                        a.seatNo ===
                                                                            s.keyMap
                                                                            ? true
                                                                            : false
                                                                    }
                                                                    className="seat_22"
                                                                    style={{
                                                                        background: `${
                                                                            a &&
                                                                            a.seatNo ===
                                                                                s.keyMap
                                                                                ? "#767676"
                                                                                : s.isSelected
                                                                                ? "#5090e9"
                                                                                : "white"
                                                                        }`,
                                                                    }}>
                                                                    <div>
                                                                        {" "}
                                                                        {s}
                                                                    </div>
                                                                </button>
                                                            </td>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {lengthArr === 16 && (
                            <div style={{ display: "flex" }}>
                                <div>
                                    <div className="background_16">
                                        <div className="row">
                                            <p className="col-3 driver_16">
                                                TÀI XẾ
                                            </p>
                                            {rangeSeat.map((s, index) => {
                                                let a = seatDisable.find(
                                                    (item) =>
                                                        item.seatNo ===
                                                            s.keyMap &&
                                                        item.tripId ===
                                                            dataTicket.id
                                                );
                                                return (
                                                    <>
                                                        {index === 15 ?? (
                                                            <div className="display_none"></div>
                                                        )}
                                                        {index !== 15 &&
                                                            (index > 10 ? (
                                                                <div className="col-3">
                                                                    <td
                                                                        key={
                                                                            index
                                                                        }>
                                                                        <button
                                                                            onClick={() =>
                                                                                this.handleClickBtnSeat(
                                                                                    s
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                a &&
                                                                                a.seatNo ===
                                                                                    s.keyMap
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                            className="seat_16"
                                                                            style={{
                                                                                background: `${
                                                                                    a &&
                                                                                    a.seatNo ===
                                                                                        s.keyMap
                                                                                        ? "#767676"
                                                                                        : s.isSelected
                                                                                        ? "#5090e9"
                                                                                        : "white"
                                                                                }`,
                                                                            }}>
                                                                            <div>
                                                                                {
                                                                                    s.keyMap
                                                                                }
                                                                            </div>
                                                                        </button>
                                                                    </td>
                                                                </div>
                                                            ) : (index + 2) %
                                                                  3 ===
                                                              0 ? (
                                                                <div className="col-6">
                                                                    <td
                                                                        key={
                                                                            index
                                                                        }>
                                                                        <button
                                                                            onClick={() =>
                                                                                this.handleClickBtnSeat(
                                                                                    s
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                a &&
                                                                                a.seatNo ===
                                                                                    s.keyMap
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                            className="seat_16"
                                                                            style={{
                                                                                background: `${
                                                                                    a &&
                                                                                    a.seatNo ===
                                                                                        s.keyMap
                                                                                        ? "#767676"
                                                                                        : s.isSelected
                                                                                        ? "#5090e9"
                                                                                        : "white"
                                                                                }`,
                                                                            }}>
                                                                            <div>
                                                                                {
                                                                                    s.keyMap
                                                                                }
                                                                            </div>
                                                                        </button>
                                                                    </td>
                                                                </div>
                                                            ) : (
                                                                <div className="col-3">
                                                                    <td
                                                                        key={
                                                                            index
                                                                        }>
                                                                        <button
                                                                            onClick={() =>
                                                                                this.handleClickBtnSeat(
                                                                                    s
                                                                                )
                                                                            }
                                                                            disabled={
                                                                                a &&
                                                                                a.seatNo ===
                                                                                    s.keyMap
                                                                                    ? true
                                                                                    : false
                                                                            }
                                                                            className="seat_16"
                                                                            style={{
                                                                                background: `${
                                                                                    a &&
                                                                                    a.seatNo ===
                                                                                        s.keyMap
                                                                                        ? "#767676"
                                                                                        : s.isSelected
                                                                                        ? "#5090e9"
                                                                                        : "white"
                                                                                }`,
                                                                            }}>
                                                                            <div>
                                                                                {
                                                                                    s.keyMap
                                                                                }
                                                                            </div>
                                                                        </button>
                                                                    </td>
                                                                </div>
                                                            ))}
                                                    </>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {lengthArr === 9 && (
                            <div style={{ display: "flex" }}>
                                <div>
                                    <div className="background_16">
                                        <div className="row">
                                            <p className="col-4 driver_16">
                                                TÀI XẾ
                                            </p>
                                            {rangeSeat.map((s, index) => {
                                                let a = seatDisable.find(
                                                    (item) =>
                                                        item.seatNo ===
                                                            s.keyMap &&
                                                        item.tripId ===
                                                            dataTicket.id
                                                );
                                                return (
                                                    <>
                                                        {(index > 2 &&
                                                            index < 6 &&
                                                            (index + 1) % 2) ===
                                                        0 ? (
                                                            <div className="col-8">
                                                                <td key={index}>
                                                                    <button
                                                                        onClick={() =>
                                                                            this.handleClickBtnSeat(
                                                                                s
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            a &&
                                                                            a.seatNo ===
                                                                                s.keyMap
                                                                                ? true
                                                                                : false
                                                                        }
                                                                        className="seat_16"
                                                                        style={{
                                                                            background: `${
                                                                                a &&
                                                                                a.seatNo ===
                                                                                    s.keyMap
                                                                                    ? "#767676"
                                                                                    : s.isSelected
                                                                                    ? "#5090e9"
                                                                                    : "white"
                                                                            }`,
                                                                        }}>
                                                                        <div>
                                                                            {" "}
                                                                            {
                                                                                s.keyMap
                                                                            }
                                                                        </div>
                                                                    </button>
                                                                </td>
                                                            </div>
                                                        ) : (
                                                            <div className="col-4">
                                                                <td key={index}>
                                                                    <button
                                                                        onClick={() =>
                                                                            this.handleClickBtnSeat(
                                                                                s
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            a &&
                                                                            a.seatNo ===
                                                                                s.keyMap
                                                                                ? true
                                                                                : false
                                                                        }
                                                                        className="seat_16"
                                                                        style={{
                                                                            background: `${
                                                                                a &&
                                                                                a.seatNo ===
                                                                                    s.keyMap
                                                                                    ? "#767676"
                                                                                    : s.isSelected
                                                                                    ? "#5090e9"
                                                                                    : "white"
                                                                            }`,
                                                                        }}>
                                                                        <div>
                                                                            {
                                                                                s.keyMap
                                                                            }
                                                                        </div>
                                                                    </button>
                                                                </td>
                                                            </div>
                                                        )}
                                                    </>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Col>
                </Row>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        listOfSeat: state.admin.listOfSeat,
        listRoutes: state.admin.routes,
        listOfTicketDisabled: state.admin.listOfTicketDisabled,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllArrSeat: () => dispatch(actions.fetchAllArrSeat()),
        fetchAllTickets: () => dispatch(actions.fetchAllTickets()),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Step1);
