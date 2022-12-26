import React, { Component } from "react";
import { connect } from "react-redux";
import Header from "../../HomePage/Header";
import { FormattedMessage } from "react-intl";
import moment from "moment";
import * as actions from "../../../store/actions";
import { withRouter } from "react-router";
import { getAllBlogsService } from "../../../services/userService";
import { Row, Col } from "reactstrap";

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
        };
    }
    async componentDidMount() {
        this.props.fetchAllBlogs();
        if (this.props.match && this.props.match.params && this.props.match.params.id) {
            let id = this.props.match.params.id;
            let res = await getAllBlogsService(id);
            let data = [];
            res && res.errCode === 0 && (data = res.blogs);
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
        let { content, description, image } = this.state;

        let imageBase64 = "";
        if (image) {
            imageBase64 = Buffer.from(image, "base64").toString("binary");
        }
        return (
            <React.Fragment style={{ overflowX: "hidden" }}>
                <Header />
                <div
                    style={{
                        backgroundColor: "#FAFAFA",
                    }}>
                    <div className="container">
                        <Row>
                            <Col lg={3} md={2} sm={1}></Col>
                            <Col lg={6} md={8} sm={10} className="content_blog">
                                <h4>{description}</h4>
                                <span>
                                    Xuất bản: <b>{this.state.createAt}</b>
                                </span>
                                <span>
                                    , Cập nhập lần cuối:
                                    <b>{this.state.updateAt}</b>
                                </span>
                                <p>
                                    Người kiểm duyệt: <b>{this.state.author}</b>
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
                            </Col>

                            <Col lg={3} md={2} sm={1}></Col>
                        </Row>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        blogs: state.admin.blogs,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllBlogs: () => dispatch(actions.fetchAllBlogs()),
    };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DetailBlog));
