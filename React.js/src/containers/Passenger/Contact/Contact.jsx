import React, { Component, Suspense, lazy } from "react";
import { connect } from "react-redux";
import Header from "../../HomePage/Header";
import { FormattedMessage } from "react-intl";
import "./styles.scss";
import { withRouter } from "react-router";
import { Row, Col } from "reactstrap";
import { toast } from "react-toastify";

import Loading from "../../../components/Loading";
const HomeFooter = lazy(() => import("../../HomePage/Section/HomeFooter"));
const emailRegex =
    /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

class Contact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            phone: "",
            comment: "",
            mes1: "",
            mes2: "",
            mes3: "",
            mes4: "",
        };
    }
    componentDidMount() {}
    onChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState,
        });
    };
    isEmailValid = (email) => {
        if (!email) return false;

        if (email.length > 254) return false;

        var valid = emailRegex.test(email);
        if (!valid) return false;

        // Further checking of some things regex can't handle
        var parts = email.split("@");
        if (parts[0].length > 64) return false;

        var domainParts = parts[1].split(".");
        if (
            domainParts.some(function (part) {
                return part.length > 63;
            })
        )
            return false;

        return true;
    };
    handleSend = () => {
        let { language } = this.props;
        let { name, email, phone, comment } = this.state;
        let test = this.isEmailValid(email);
        console.log(test);
        if (!name) {
            if (language === "vi") this.setState({ mes1: "* Vui lòng nhập tên của bạn." });
            else this.setState({ mes1: "* Please enter your name." });
        } else if (!email) {
            if (language === "vi")
                this.setState({ mes2: "* Vui lòng nhập địa chỉ email của bạn.", mes1: "", mes3: "", mes4: "" });
            else this.setState({ mes2: "* Please enter email address.", mes1: "", mes3: "", mes4: "" });
        } else if (this.isEmailValid(email) === false) {
            if (language === "vi")
                this.setState({ mes2: "* Email không đúng định dạng.", mes1: "", mes3: "", mes4: "" });
            else this.setState({ mes2: "* Invalid email address.", mes1: "", mes3: "", mes4: "" });
        } else if (isNaN(phone) || phone.length !== 10) {
            if (language === "vi") this.setState({ mes3: "* Số điện thoại không đúng.", mes1: "", mes2: "", mes4: "" });
            else this.setState({ mes3: "* Invalid phone number address", mes1: "", mes2: "", mes4: "" });
        } else if (!phone) {
            if (language === "vi")
                this.setState({ mes3: "* Vui lòng nhập số điện thoại của bạn.", mes1: "", mes2: "", mes4: "" });
            else this.setState({ mes3: "* Please enter your phon number.", mes1: "", mes2: "", mes4: "" });
        } else if (!comment) {
            if (language === "vi")
                this.setState({ mes4: "* Vui lòng nhập yêu cầu của bạn.", mes1: "", mes2: "", mes3: "" });
            else this.setState({ mes4: "* Please enter your request.", mes1: "", mes2: "", mes3: "" });
        } else {
            if (language === "vi") toast.success("Gửi yêu cầu thành công. Vui lòng chờ phản hồi từ chúng tôi.");
            else toast.success("Submit request successfully. Please wait for our response.");
            this.setState({
                name: "",
                email: "",
                phone: "",
                comment: "",
                mes1: "",
                mes2: "",
                mes3: "",
                mes4: "",
            });
        }
    };
    render() {
        let { language } = this.props;
        let { name, email, phone, comment } = this.state;
        return (
            <div style={{ overflowX: "hidden" }}>
                <Header />
                <div className="container ">
                    <div className="banner_content">
                        <h1>
                            <FormattedMessage id="contacts.sub_title" />{" "}
                        </h1>

                        <Row>
                            <Col md={6}>
                                <h3 className="mb-20">
                                    <FormattedMessage id="contacts.title1" />
                                </h3>
                                <p className=" p-18">
                                    <b>Email</b> : caotin1401@gmail.com
                                </p>
                                <p className="  p-18">
                                    <b>
                                        <FormattedMessage id="contacts.phone" />
                                    </b>{" "}
                                    : 0961429331
                                </p>
                                <p className="  p-18">
                                    <b>
                                        <FormattedMessage id="contacts.address" />
                                    </b>
                                    : {language === "vi" ? "TP.Hồ Chí Minh" : "Ho Chi Minh City"}
                                </p>
                                <h3 className="mb-20  mt-30">
                                    <FormattedMessage id="contacts.title2" />
                                </h3>
                                <ul>
                                    <li className=" p-18">
                                        <FormattedMessage id="contacts.li_title1" />
                                    </li>
                                    <li className=" p-18">
                                        <FormattedMessage id="contacts.li_title2" />
                                    </li>
                                    <li className=" p-18">
                                        <FormattedMessage id="contacts.li_title3" />
                                    </li>
                                </ul>
                            </Col>
                            <Col md={6}>
                                <h4 className="item_input title_content-right">
                                    <FormattedMessage id="contacts.title3" />
                                </h4>
                                <div className="item_input">
                                    <h5 className="mt-4" htmlFor="name">
                                        <FormattedMessage id="contacts.name" />
                                    </h5>
                                    <input
                                        style={{ height: "45px" }}
                                        className="form-control  h-38 "
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={(event) => {
                                            this.onChangeInput(event, "name");
                                        }}
                                    />
                                    <div style={{ color: "red" }}>{this.state.mes1}</div>
                                </div>
                                <div className="item_input">
                                    <h5 className="mt-4" htmlFor="name">
                                        Email
                                    </h5>
                                    <input
                                        style={{ height: "45px" }}
                                        className="form-control  h-38 "
                                        id="name"
                                        type="text"
                                        value={email}
                                        onChange={(event) => {
                                            this.onChangeInput(event, "email");
                                        }}
                                    />
                                    <div style={{ color: "red" }}>{this.state.mes2}</div>
                                </div>
                                <div className="item_input">
                                    <h5 className="mt-4" htmlFor="name">
                                        <FormattedMessage id="contacts.phone" />
                                    </h5>
                                    <input
                                        style={{ height: "45px" }}
                                        className="form-control  h-38 "
                                        id="name"
                                        type="text"
                                        value={phone}
                                        onChange={(event) => {
                                            this.onChangeInput(event, "phone");
                                        }}
                                    />
                                    <div style={{ color: "red" }}>{this.state.mes3}</div>
                                </div>
                                <div className="item_input">
                                    <h5 className="mt-4" htmlFor="name">
                                        <FormattedMessage id="contacts.comment" />
                                    </h5>
                                    <textarea
                                        style={{ height: "100px" }}
                                        className="form-control  h-38 "
                                        id="name"
                                        type="text"
                                        value={comment}
                                        onChange={(event) => {
                                            this.onChangeInput(event, "comment");
                                        }}
                                    />
                                    <div style={{ color: "red" }}>{this.state.mes4}</div>
                                </div>
                                <div className="item_input">
                                    <button
                                        className="btn btn-primary"
                                        style={{ width: "100%", height: "38px", marginTop: "30px" }}
                                        onClick={() => this.handleSend()}>
                                        <h4>
                                            <FormattedMessage id="contacts.send" />
                                        </h4>
                                    </button>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
                <Suspense fallback={<Loading />}>
                    <HomeFooter />
                </Suspense>
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
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Contact));
