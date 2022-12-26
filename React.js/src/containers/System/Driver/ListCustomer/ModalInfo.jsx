import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import "../style.scss";
import { TableBody, TableContainer, Paper, Table } from "@mui/material";
import { checkCustomerPresent, getDriverTicketsRoute } from "../../../../services/userService";
class ModalInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listUser: [],
        };
    }

    async componentDidMount() {
        let listUser = this.props.listUser;
        if (!listUser) {
            this.setState({ listUser: [] });
        } else this.setState({ listUser: listUser });
    }

    toggle = () => {
        this.props.toggleFromParent();
    };

    handleCheck = async (item) => {
        let token = item.token;
        let tripId = item.tripId;
        let res = await checkCustomerPresent({ token, tripId });
        let driverId = this.props.userInfo.id;
        let day = item.dayStart;
        let resUser;
        if (res && res.errCode === 0) {
            resUser = await getDriverTicketsRoute(driverId, day, tripId);
            let tempUser = {};
            let resultUser;
            if (resUser && resUser.errCode === 0) {
                if (resUser.tickets.length > 0) {
                    resUser.tickets.forEach((ticket) => {
                        if (tempUser[`${ticket.token}`]) {
                            tempUser[`${ticket.token}`].seatNo.push(ticket.seatNo);
                        } else {
                            tempUser[`${ticket.token}`] = {
                                Trip: ticket.Trip,
                                userId: ticket.userId,
                                seatNo: [ticket.seatNo],
                                token: ticket.token,
                                phone: ticket.phone,
                                name: ticket.name,
                                totalPrice: ticket.totalPrice,
                                driverId: ticket.driverId,
                                status: ticket.status,
                                email: ticket.email,
                                tripId: ticket.tripId,
                                description: ticket.description,
                                isPresent: ticket.isPresent,
                                dayStart: ticket.dayStart,
                            };
                        }
                    });

                    resultUser = Object.values(tempUser);
                }
            }
            this.setState({ listUser: resultUser });
        }
    };
    currencyFormat(num) {
        return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") + " đ";
    }
    currencyFormatEn(num) {
        return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") + " VNĐ";
    }
    render() {
        let language = this.props.language;
        let { listUser } = this.state;
        let totalPrice = 0;
        return (
            <div>
                <Modal
                    isOpen={this.props.isOpen}
                    toggle={() => {
                        this.toggle();
                    }}
                    style={{ maxWidth: "90%" }}
                    fullscreen>
                    <ModalHeader
                        toggle={() => {
                            this.toggle();
                        }}>
                        <FormattedMessage id="menu.driver.list_passenger" />
                    </ModalHeader>

                    <ModalBody>
                        <TableContainer component={Paper} id="customers">
                            <Table>
                                <TableBody>
                                    <tr>
                                        <th>Id</th>
                                        <th className="section-id-list">
                                            {" "}
                                            <FormattedMessage id="menu.driver.name" />
                                        </th>
                                        <th className="section-id-list">
                                            {" "}
                                            <FormattedMessage id="menu.driver.phone" />
                                        </th>
                                        <th className="section-id-list">
                                            {" "}
                                            <FormattedMessage id="menu.driver.seat" />
                                        </th>
                                        <th className="section-id-list">
                                            {" "}
                                            <FormattedMessage id="menu.driver.pay" />
                                        </th>
                                        <th className="section-id-list">
                                            {" "}
                                            <FormattedMessage id="menu.driver.description" />
                                        </th>
                                        <th
                                            className="section-id-list"
                                            style={{
                                                width: "10%",
                                            }}>
                                            <FormattedMessage id="menu.driver.dacomat" />
                                        </th>
                                    </tr>

                                    {listUser &&
                                        listUser.length > 0 &&
                                        listUser.map((item, index) => {
                                            let test = item.seatNo.join(" - ");
                                            totalPrice = totalPrice + item.totalPrice;
                                            return (
                                                <tr key={index}>
                                                    <td className="section-id-list">{item.id}</td>
                                                    <td>{item.name}</td>
                                                    <td>{item.phone}</td>
                                                    <td>{test}</td>
                                                    <td>
                                                        {language === "vi"
                                                            ? this.currencyFormat(item.totalPrice)
                                                            : this.currencyFormatEn(item.totalPrice)}
                                                    </td>
                                                    <td>{item.description}</td>
                                                    <td>
                                                        {item.Trip.status === 3 ? (
                                                            <></>
                                                        ) : !item.isPresent ? (
                                                            <>
                                                                <button className="btn-delete">
                                                                    <i className="fas fa-window-close"></i>
                                                                </button>
                                                                <button
                                                                    className="btn-edit"
                                                                    onClick={() => this.handleCheck(item)}>
                                                                    <i className="fas fa-check"></i>
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <FormattedMessage id="menu.driver.dacomat" />
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </TableBody>
                                {listUser && listUser.length === 0 && (
                                    <td colSpan="8" style={{ textAlign: "center" }}>
                                        No data
                                    </td>
                                )}
                            </Table>
                        </TableContainer>
                        <div className="tatol_price">
                            <FormattedMessage id="menu.driver.total" />:{" "}
                            <b>
                                {language === "vi"
                                    ? this.currencyFormat(totalPrice)
                                    : this.currencyFormatEn(totalPrice)}
                            </b>
                        </div>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            color="primary"
                            onClick={() => {
                                this.toggle();
                            }}
                            className="btn-primary-modal">
                            Close
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalInfo);
