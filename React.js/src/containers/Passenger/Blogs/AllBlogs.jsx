import React, { Component, Suspense, lazy } from "react";
import { connect } from "react-redux";
import Header from "../../HomePage/Header";
import { FormattedMessage } from "react-intl";
import moment from "moment";
import * as actions from "../../../store/actions";
import { withRouter } from "react-router";
import "./style.scss";
import { Typography, Breadcrumbs, Link } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { Row, Col } from "reactstrap";
import Loading from "../../../components/Loading";
import SkeletonAllBlog from "./SkeletonAllBlog";
const HomeFooter = lazy(() => import("../../HomePage/Section/HomeFooter"));
class AllBlogs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listBlogs: [],
            loading: false,
        };
    }
    componentDidMount() {
        this.props.fetchAllBlogs();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.blogs !== this.props.blogs) {
            this.setState({ listBlogs: this.props.blogs });
            setTimeout(() => {
                if (this.props.blogs && this.props.blogs.length > 0) {
                    this.setState({
                        loading: true,
                    });
                }
            }, 50);
        }
    }
    handleViewDetail = (item) => {
        if (this.props.history) {
            this.props.history.push(`/home/blog/blogId=${item.id}`);
        }
    };
    render() {
        let { listBlogs, loading } = this.state;

        return (
            <div style={{ overflowX: "hidden" }}>
                <Header />
                <div className="header-events">
                    <div className="container">
                        <Row>
                            <Col md={1}></Col>

                            <Col md={9}>
                                <div>
                                    <Breadcrumbs aria-label="breadcrumb" sx={{ pt: 2 }}>
                                        <Link
                                            underline="hover"
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                            color="inherit"
                                            href="/home">
                                            <HomeIcon sx={{ mr: 0.5, ml: 3.5 }} />
                                            <FormattedMessage id="events.home" />
                                        </Link>
                                        <Typography
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                mt: 0.25,
                                            }}
                                            color="text.primary">
                                            <FormattedMessage id="events.blog" />
                                        </Typography>
                                    </Breadcrumbs>
                                </div>
                                <h2 className="title-events">
                                    <FormattedMessage id="events.listblog" />
                                </h2>
                            </Col>
                            <Col md={2}></Col>
                        </Row>
                    </div>
                </div>

                <div className="body-events">
                    <div className="container">
                        <ul>
                            <Row>
                                <Col md={1}></Col>
                                <Col md={9}>
                                    {loading === false && <SkeletonAllBlog loading={loading} />}
                                    {loading === true &&
                                        listBlogs &&
                                        listBlogs.length > 0 &&
                                        listBlogs.map((item, index) => {
                                            let time = moment(new Date(item.createdAt).getTime()).format(
                                                "DD-MM-YYYY HH:mm:ss"
                                            );
                                            let imageBase64 = "";
                                            if (item.image) {
                                                imageBase64 = Buffer.from(item.image, "base64").toString("binary");
                                            }

                                            return (
                                                <li key={index}>
                                                    <div
                                                        className="content-events"
                                                        onClick={() => this.handleViewDetail(item)}>
                                                        <div
                                                            className="bg-img"
                                                            style={{
                                                                backgroundImage: `url(${imageBase64})`,
                                                            }}
                                                        />
                                                        <div className="content-right">
                                                            <h3>{item.description}</h3>
                                                            <div>{time}</div>
                                                        </div>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                </Col>
                            </Row>
                        </ul>
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
        blogs: state.admin.blogs,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllBlogs: () => dispatch(actions.fetchAllBlogs()),
    };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AllBlogs));
