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
import HomeIcon from "@mui/icons-material/Home";
import HomeFooter from "./../../HomePage/Section/HomeFooter";
import { Row, Col } from "reactstrap";
class AllEvents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listEvents: [],
        };
    }
    componentDidMount() {
        this.props.fetchAllEvents();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.events !== this.props.events) {
            this.setState({ listEvents: this.props.events });
        }
    }
    handleViewDetail = (events) => {
        let time2 = +events.endDate;
        let timeCurrent = new Date(1671814800000).getTime();
        if (time2 > timeCurrent) {
            if (this.props.history) {
                this.props.history.push(`/home/event/eventId=${events.id}`);
            }
        }
    };
    render() {
        let language = this.props.language;
        let { listEvents } = this.state;
        listEvents &&
            listEvents.length > 0 &&
            (listEvents = [listEvents[3], ...listEvents]);
        // listEvents = [listEvents[3], ...listEvents];
        console.log(listEvents[3]);
        return (
            <React.Fragment>
                <Header />
                {/* <div className="container"> */}
                <div className="header-events">
                    <div className="container">
                        <Row>
                            <Col md={1}></Col>

                            <Col md={9}>
                                {" "}
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
                                    {" "}
                                    Danh sách sự kiện
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
                                    {listEvents &&
                                        listEvents.length > 0 &&
                                        listEvents.map((item, index) => {
                                            let time = `${moment(
                                                +item.startDate
                                            ).format("L")} - ${moment(
                                                +item.endDate
                                            ).format("L")}`;
                                            let imageBase64 = "";
                                            if (item.image) {
                                                imageBase64 = Buffer.from(
                                                    item.image,
                                                    "base64"
                                                ).toString("binary");
                                            }
                                            let time1 = +item.startDate;
                                            let time2 = +item.endDate;
                                            let timeCurrent =
                                                new Date().getTime();

                                            return (
                                                <li key={index}>
                                                    <div
                                                        className="content-events"
                                                        onClick={() =>
                                                            this.handleViewDetail(
                                                                item
                                                            )
                                                        }
                                                        style={{
                                                            cursor: `${
                                                                time2 >
                                                                timeCurrent
                                                                    ? "pointer"
                                                                    : ""
                                                            } `,
                                                        }}>
                                                        <div
                                                            className="bg-img"
                                                            style={{
                                                                backgroundImage: `url(${imageBase64})`,
                                                            }}
                                                        />
                                                        <div className="content-right">
                                                            <h3>{item.name}</h3>
                                                            <div>{time}</div>
                                                            <div
                                                                className="content-1"
                                                                style={{
                                                                    background: `${
                                                                        time1 >
                                                                        timeCurrent
                                                                            ? "yellow"
                                                                            : time2 <
                                                                              timeCurrent
                                                                            ? "#E7EBF0"
                                                                            : "#29CC97"
                                                                    }`,
                                                                }}>
                                                                <div className="btn-1">
                                                                    {time1 >
                                                                    timeCurrent
                                                                        ? "Sắp diễn ra"
                                                                        : time2 <
                                                                          timeCurrent
                                                                        ? "Đã kết thúc"
                                                                        : "Đang diễn ra"}
                                                                </div>
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
        events: state.admin.events,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        changeLanguageAppRedux: (language) =>
            dispatch(changeLanguageApp(language)),
        fetchAllEvents: () => dispatch(actions.fetchAllEvents()),
    };
};
export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(AllEvents)
);
