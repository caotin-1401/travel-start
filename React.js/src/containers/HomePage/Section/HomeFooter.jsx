import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import { FormattedMessage } from "react-intl";

class HomeFooter extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="home-footer">
                    <Row>
                        <Col md={1}></Col>
                        <Col md={3}>
                            <h3 className="title_h3" style={{ marginLeft: "15px" }}>
                                Travel Start
                            </h3>
                            <div className="share">
                                <a
                                    target="_blank"
                                    rel="noreferrer"
                                    href="https://www.facebook.com/"
                                    className="fab fa-facebook"></a>
                                <a
                                    target="_blank"
                                    rel="noreferrer"
                                    href="https://twitter.com/"
                                    className="fab fa-twitter"></a>
                                <a
                                    target="_blank"
                                    rel="noreferrer"
                                    href="https://www.linkedin.com/"
                                    className="fab fa-linkedin"></a>
                                <a
                                    target="_blank"
                                    rel="noreferrer"
                                    href="https://www.google.com/"
                                    className="fab fa-instagram"></a>
                            </div>
                        </Col>
                        <Col md={4}>
                            <h3 className="title_h3">
                                <FormattedMessage id="contacts.title1" />
                            </h3>
                            <a target="_blank" href="https" rel="noreferrer" className="links">
                                <i className="fas fa-phone"></i>
                                0961 429 331
                            </a>
                            <a target="_blank" href="https" rel="noreferrer" className="links">
                                <i className="fas fa-envelope"></i>
                                caotin1401@gmail.com
                            </a>
                            <a target="_blank" href="https" rel="noreferrer" className="links">
                                <i className="fas fa-map-marker-alt"></i>
                                Tp.Hồ Chí Minh
                            </a>
                        </Col>
                        <Col md={4}>
                            <h3 className="title_h3">
                                {" "}
                                <FormattedMessage id="contacts.link" />
                            </h3>
                            <a href="/home" rel="noreferrer" className="links">
                                <i className="fas fa-arrow-right"></i>
                                <FormattedMessage id="header.home" />
                            </a>
                            <a href="/home/events" rel="noreferrer" className="links">
                                <i className="fas fa-arrow-right"></i>
                                <FormattedMessage id="header.events" />
                            </a>
                            <a href="/home/blogs" rel="noreferrer" className="links">
                                <i className="fas fa-arrow-right"></i>
                                <FormattedMessage id="header.blog" />
                            </a>
                            <a href="https" rel="noreferrer" className="links">
                                <i className="fas fa-arrow-right"></i>
                                <FormattedMessage id="header.contact" />
                            </a>
                        </Col>
                        <Col md={1}></Col>
                    </Row>
                    <p className="a_footer">
                        &copy; 2022 TravelStart . More information, please visit my github.
                        <a target="_blank" href="https://github.com/caotin-1401" rel="noreferrer">
                            &#8594; Click here &#8592;
                        </a>
                    </p>
                </div>
            </React.Fragment>
        );
    }
}

export default HomeFooter;
