import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from "reactstrap";
import { LANGUAGES } from "../../../../utils";
import _ from "lodash";
import moment from "moment";
class ModalInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            name: "",
            phone: "",
            address: "",
            gender: "",
            listTickets: [],
        };
    }
    async componentDidMount() {
        let user = this.props.currentUser;
        if (user && !_.isEmpty(user)) {
            this.setState({
                email: user.email,
                name: user.name,
                phone: user.phoneNumber,
                address: user.address,
                gender: user.gender,
                listTickets: user.Tickets,
            });
        }
    }

    toggle = () => {
        this.props.toggleFromParent();
    };
    currencyFormat(num) {
        return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") + " đ";
    }
    render() {
        let language = this.props.language;

        let { email, name, phone, address, gender, listTickets } = this.state;
        let sex;
        console.log(listTickets);
        let tempUser = {};
        let resultUser;
        listTickets.forEach((ticket) => {
            if (tempUser[`${ticket.token}`]) {
                tempUser[`${ticket.token}`].seatNo.push(ticket.seatNo);
            } else {
                tempUser[`${ticket.token}`] = {
                    Trip: ticket.Trip,
                    seatNo: [ticket.seatNo],
                    token: ticket.token,
                    phone: ticket.phone,
                    name: ticket.name,
                    totalPrice: ticket.totalPrice,
                    driverId: ticket.driverId,
                    tripId: ticket.tripId,
                    dayStart: ticket.dayStart,
                };
            }
        });
        resultUser = Object.values(tempUser);
        console.log(resultUser);
        if (language === LANGUAGES.VI)
            gender === "M" ? (sex = "Nam") : gender === "F" ? (sex = "Nữ") : (sex = "Khác");
        else gender === "M" ? (sex = "Male") : gender === "F" ? (sex = "Female") : (sex = "Other");
        return (
            <Modal
                isOpen={this.props.isOpen}
                toggle={() => {
                    this.toggle();
                }}
                size="xl">
                <ModalHeader
                    toggle={() => {
                        this.toggle();
                    }}>
                    <FormattedMessage id="menu.admin.listPassenger.modal" />
                </ModalHeader>
                <ModalBody>
                    <h4 style={{ textAlign: "center" }}>
                        <FormattedMessage id="menu.admin.listPassenger.modal1" />
                    </h4>
                    <Row
                        style={{
                            marginBottom: "10px",
                            marginTop: "20px",
                            fontSize: "16px",
                        }}>
                        <Col md={4}>
                            <FormattedMessage id="menu.admin.listPassenger.name" />: <b>{name}</b>
                        </Col>
                        <Col md={4}>
                            Email : <b>{email}</b>
                        </Col>
                        <Col md={4}>
                            <FormattedMessage id="menu.admin.listPassenger.phone" />: <b>{phone}</b>
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: "30px", fontSize: "16px" }}>
                        <Col md={4}>
                            <FormattedMessage id="menu.admin.listPassenger.gender" />: <b>{sex}</b>
                        </Col>
                        <Col md={8}>
                            <FormattedMessage id="menu.admin.listPassenger.address" />:{" "}
                            <b>{address}</b>
                        </Col>
                    </Row>
                    <hr />
                    <h4 style={{ marginBottom: "30px", textAlign: "center" }}>
                        <FormattedMessage id="menu.admin.listPassenger.modal2" />
                    </h4>
                    <Row>
                        {resultUser.length > 1 ? (
                            <table className="table table-striped table-hover table-responsive">
                                <thead style={{ borderBottom: "2px solid black" }}>
                                    <tr>
                                        <th scope="col">
                                            <FormattedMessage id="menu.admin.listPassenger.trip" />
                                        </th>
                                        <th scope="col">
                                            <FormattedMessage id="menu.admin.listPassenger.time" />
                                        </th>
                                        <th scope="col">
                                            <FormattedMessage id="menu.admin.listPassenger.seat" />
                                        </th>
                                        <th scope="col">
                                            <FormattedMessage id="menu.admin.listPassenger.total" />
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resultUser &&
                                        resultUser.length > 0 &&
                                        resultUser.map((item, index) => {
                                            let time = moment(+item.Trip.timeStart).format(
                                                "DD/MM/yyyy HH:mm"
                                            );
                                            let seatNO = item.seatNo.join(" - ");
                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        {item.Trip.areaStart} - {item.Trip.areaEnd}
                                                    </td>
                                                    <td>{time}</td>
                                                    <td>{seatNO}</td>
                                                    <td>{this.currencyFormat(item.totalPrice)}</td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        ) : resultUser.length === 1 && resultUser[0].totalPrice ? (
                            <table className="table table-striped table-hover table-responsive">
                                <thead style={{ borderBottom: "2px solid black" }}>
                                    <tr>
                                        <th scope="col">
                                            <FormattedMessage id="menu.admin.listPassenger.trip" />
                                        </th>
                                        <th scope="col">
                                            <FormattedMessage id="menu.admin.listPassenger.time" />
                                        </th>
                                        <th scope="col">
                                            <FormattedMessage id="menu.admin.listPassenger.seat" />
                                        </th>
                                        <th scope="col">
                                            <FormattedMessage id="menu.admin.listPassenger.total" />
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {resultUser &&
                                        resultUser.length > 0 &&
                                        resultUser.map((item, index) => {
                                            let time = moment(+item.dayStart).format(
                                                "DD/MM/yyyy HH:mm"
                                            );
                                            let seatNO = item.seatNo.join(" - ");
                                            console.log(seatNO);
                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        {item.Trip.areaStart} - {item.Trip.areaEnd}
                                                    </td>
                                                    <td>{time}</td>
                                                    <td>{seatNO}</td>
                                                    <td> {this.currencyFormat(item.totalPrice)}</td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        ) : (
                            <div
                                style={{
                                    fontSize: "16px",
                                }}>
                                <FormattedMessage id="menu.admin.listPassenger.des" />
                            </div>
                        )}
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="primary"
                        onClick={() => {
                            this.toggle();
                        }}
                        className="btn-primary-modal">
                        OK
                    </Button>
                </ModalFooter>
            </Modal>
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

export default connect(mapStateToProps, mapDispatchToProps)(ModalInfo);
