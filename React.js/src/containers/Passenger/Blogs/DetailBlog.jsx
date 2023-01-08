import React, { Component } from "react";
import Header from "../../HomePage/Header";
import { FormattedMessage } from "react-intl";
import moment from "moment";
import { withRouter } from "react-router";
import { getAllBlogsService } from "../../../services/userService";
import { Row, Col } from "reactstrap";
import HomeFooter from "./../../HomePage/Section/HomeFooter";
import SkeletonDetail from "./SkeletonDetail";

class DetailBlog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            description: "",
            content: "",
            image: "",
            createAt: "",
            updateAt: "",
            author: "",
            loading: false,
        };
    }
    async componentDidMount() {
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let res = await getAllBlogsService(id);
            let data = [];
            res && res.errCode === 0 && (data = res.blogs);
            res && res.errCode === 0 && this.setState({ loading: true });
            if (data.length > 0) {
                let create = moment(new Date(data[0].createdAt).getTime()).format("DD/MM/YYYY");
                let update = moment(new Date(data[0].updatedAt).getTime()).format("DD/MM/YYYY");
                this.setState({
                    description: data[0].description,
                    content: data[0].content,
                    image: data[0].image,
                    createAt: create,
                    updateAt: update,
                    author: data[0].author,
                });
            }
        }
    }

    render() {
        let { content, description, image, loading } = this.state;

        let imageBase64 = "";
        if (image) {
            imageBase64 = Buffer.from(image, "base64").toString("binary");
        }
        return (
            <div style={{ overflowX: "hidden" }}>
                <Header />
                <div
                    style={{
                        backgroundColor: "#FAFAFA",
                    }}>
                    <div className="container">
                        <Row>
                            <Col lg={3} md={2} sm={1}></Col>
                            <Col lg={6} md={8} sm={10} className="content_blog">
                                {loading === false && <SkeletonDetail />}
                                {loading === true && (
                                    <>
                                        {" "}
                                        <h4>{description}</h4>
                                        <span>
                                            <FormattedMessage id="events.time1" />:{" "}
                                            <b>{this.state.createAt},</b>
                                        </span>
                                        <span>
                                            {" "}
                                            <FormattedMessage id="events.updated" />:{" "}
                                            <b>{this.state.updateAt}</b>
                                        </span>
                                        <p>
                                            <FormattedMessage id="events.actor" />:{" "}
                                            <b>{this.state.author}</b>
                                        </p>
                                        <div className="t-box">
                                            <div
                                                className="t-img"
                                                style={{
                                                    backgroundImage: `url(${imageBase64})`,
                                                }}
                                            />
                                        </div>
                                        <div
                                            style={{ textAlign: "justify" }}
                                            dangerouslySetInnerHTML={{
                                                __html: content,
                                            }}></div>
                                    </>
                                )}
                            </Col>

                            <Col lg={3} md={2} sm={1}></Col>
                        </Row>
                    </div>
                </div>
                <HomeFooter />
            </div>
        );
    }
}

export default withRouter(DetailBlog);
