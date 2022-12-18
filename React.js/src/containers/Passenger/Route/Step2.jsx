import React, { Component } from "react";
import { connect } from "react-redux";
import { Row, Col } from "reactstrap";
class Step2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            seatArr: [],
            totalPrice: 0,
            name: "",
            phone: "",
            email: "",
            description: "",
            isActive: false,
        };
    }

    componentDidMount() {
        this.setState({
            seatArr: this.props.seatArrParent,
            totalPrice: this.props.totalPriceParent,
        });
        let isCleanData = this.props.isCleanDataParent;
        if (isCleanData === false) {
            if (
                this.props.nameParent ||
                this.props.phoneParent ||
                this.props.emailParent ||
                this.props.description
            ) {
                this.setState({
                    name: this.props.nameParent,
                    phone: this.props.phoneParent,
                    email: this.props.emailParent,
                    description: this.props.descriptionParent,
                });
            }
        } else {
            this.setState({
                name: "",
                phone: "",
                email: "",
                description: "",
                seatArr: [],
                totalPrice: 0,
            });
        }
    }

    checkValidInput = () => {
        let isValid = true;
        let arrCheck = ["name", "email", "phone", "description"];
        for (let i = 0; i < arrCheck.length; i++) {
            if (!this.state[arrCheck[i]]) {
                isValid = false;
                alert("this input is required: " + arrCheck[i]);
                break;
            }
        }
        return isValid;
    };
    onChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState(
            {
                ...copyState,
            },
            () => {
                let { name, phone, email, description } = this.state;
                this.props.parentCallback(name, phone, email, description);
            }
        );
    };
    currencyFormat(num) {
        return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") + " đ";
    }
    render() {
        let { seatArr, totalPrice, name, phone, email, description } =
            this.state;
        return (
            <div className="container">
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}>
                    <div style={{ width: "400px" }}>
                        <Row>
                            <label htmlFor="name">Full Name *</label>
                            <input
                                className="form-control mb-4"
                                id="name"
                                placeholder="with a placeholder"
                                type="text"
                                value={name}
                                onChange={(event) => {
                                    this.onChangeInput(event, "name");
                                }}
                            />
                        </Row>
                        <Row>
                            <label htmlFor="exampleEmail">Email *</label>
                            <input
                                className="form-control mb-4"
                                id="exampleEmail"
                                placeholder="with a placeholder"
                                type="email"
                                value={email}
                                onChange={(event) => {
                                    this.onChangeInput(event, "email");
                                }}
                            />
                        </Row>
                        <Row>
                            <label htmlFor="phone">Phone Number *</label>
                            <input
                                className="form-control mb-4"
                                id="phone"
                                placeholder="with a placeholder"
                                type="text"
                                value={phone}
                                onChange={(event) => {
                                    this.onChangeInput(event, "phone");
                                }}
                            />
                        </Row>
                        <Row>
                            <label htmlFor="description">Ghi chus</label>
                            <textarea
                                className="form-control mb-4"
                                id="description"
                                placeholder="with a placeholder"
                                type="text"
                                value={description}
                                onChange={(event) => {
                                    this.onChangeInput(event, "description");
                                }}
                            />
                        </Row>
                        <Row>
                            <div>
                                <span
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: "16px",
                                    }}>
                                    Giá : {this.currencyFormat(totalPrice)}
                                </span>
                            </div>
                        </Row>
                        <Row>
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
                        </Row>
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
export default connect(mapStateToProps, mapDispatchToProps)(Step2);
