import React, { Component } from "react";
import { connect } from "react-redux";
import Header from "../../HomePage/Header";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { LANGUAGES } from "../../../utils";
import { changeLanguageApp } from "../../../store/actions/appActions";
import dayjs from "dayjs";
import moment from "moment";
import localization from "moment/locale/vi";
import * as actions from "../../../store/actions";
import { withRouter } from "react-router";
import "./style.scss";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
// import { Link } from "react-router-dom";

import HomeIcon from "@mui/icons-material/Home";
import HomeFooter from "./../../HomePage/Section/HomeFooter";
import { Row, Col } from "reactstrap";
class AllBlogs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listBlogs: [],
        };
    }
    componentDidMount() {
        this.props.fetchAllBlogs();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.blogs !== this.props.blogs) {
            this.setState({ listBlogs: this.props.blogs });
        }
    }
    handleViewDetail = (item) => {
        if (this.props.history) {
            this.props.history.push(`/home/blog/blogId=${item.id}`);
        }
    };
    render() {
        let language = this.props.language;
        let { listBlogs } = this.state;

        return (
            <React.Fragment>
                <Header />
                {/* <div className="container"> */}
                <div className="header-events">
                    <div className="container">
                        <Row>
                            <Col md={1}></Col>

                            <Col md={9}>
                                <div>
                                    <Breadcrumbs
                                        aria-label="breadcrumb"
                                        sx={{ pt: 2 }}>
                                        <Link
                                            underline="hover"
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                // mt: 2,
                                            }}
                                            color="inherit"
                                            href="/home">
                                            <HomeIcon
                                                sx={{ mr: 0.5, ml: 3.5 }}
                                            />
                                            Home
                                        </Link>
                                        <Typography
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                mt: 0.25,
                                            }}
                                            color="text.primary">
                                            Sự kiện
                                        </Typography>
                                    </Breadcrumbs>
                                </div>
                                <h2 className="title-events">
                                    Danh sashc bai viet
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
                                    {listBlogs &&
                                        listBlogs.length > 0 &&
                                        listBlogs.map((item, index) => {
                                            let time = moment(
                                                new Date(
                                                    item.createdAt
                                                ).getTime()
                                            ).format("ddd DD-MM-YYYY HH:mm:ss");
                                            let imageBase64 = "";
                                            if (item.image) {
                                                imageBase64 = Buffer.from(
                                                    item.image,
                                                    "base64"
                                                ).toString("binary");
                                            }

                                            return (
                                                <li key={index}>
                                                    <div
                                                        className="content-events"
                                                        onClick={() =>
                                                            this.handleViewDetail(
                                                                item
                                                            )
                                                        }>
                                                        <div
                                                            className="bg-img"
                                                            style={{
                                                                backgroundImage: `url(${imageBase64})`,
                                                            }}
                                                        />
                                                        <div className="content-right">
                                                            <h3>
                                                                {
                                                                    item.description
                                                                }
                                                            </h3>
                                                            <div>
                                                                <i class="fas fa-calendar-check"></i>
                                                                {time}
                                                            </div>
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
                <HomeFooter />
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
        changeLanguageAppRedux: (language) =>
            dispatch(changeLanguageApp(language)),
        fetchAllBlogs: () => dispatch(actions.fetchAllBlogs()),
    };
};
export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(AllBlogs)
);
