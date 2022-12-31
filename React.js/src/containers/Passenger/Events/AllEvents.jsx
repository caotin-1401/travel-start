import React, { Component, Suspense, lazy } from "react";
import { connect } from "react-redux";
import Header from "../../HomePage/Header";
import { FormattedMessage } from "react-intl";
import { LANGUAGES } from "../../../utils";
import moment from "moment";
import localization from "moment/locale/vi";
import * as actions from "../../../store/actions";
import { withRouter } from "react-router";
import "./style.scss";
import { Typography, Breadcrumbs, Link, Box, Skeleton } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import { Row, Col } from "reactstrap";
import Loading from "../../../components/Loading";
const HomeFooter = lazy(() => import("../../HomePage/Section/HomeFooter"));
class AllEvents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listEvents: [],
            loading: false,
        };
    }
    componentDidMount() {
        // setTimeout(() => {
        //     this.setState({
        //         loading: true,
        //     });
        // }, 500);
        this.props.fetchAllEvents();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.events !== this.props.events) {
            this.setState({ listEvents: this.props.events });
            setTimeout(() => {
                if (this.props.events && this.props.events.length > 0) {
                    this.setState({
                        loading: true,
                    });
                }
            }, 50);
        }
    }
    handleViewDetail = (events) => {
        let time2 = +events.endDate;
        let time1 = +events.startDate;
        let timeCurrent = new Date(1671814800000).getTime();
        if (time2 > timeCurrent && time1 < timeCurrent) {
            if (this.props.history) {
                this.props.history.push(`/home/event/eventId=${events.id}`);
            }
        }
    };
    render() {
        let language = this.props.language;
        let { loading } = this.state;
        let mes1, mes2, mes3;
        if (language === LANGUAGES.VI) {
            mes1 = "Đang diễn ra";
            mes2 = "Sắp diễn ra";
            mes3 = "Đã kết thúc";
        } else {
            mes1 = "Happening";
            mes2 = "Coming...";
            mes3 = "Finished";
        }
        let { listEvents } = this.state;
        return (
            <React.Fragment>
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
                                            <FormattedMessage id="events.event" />
                                        </Typography>
                                    </Breadcrumbs>
                                </div>
                                <h2 className="title-events">
                                    <FormattedMessage id="events.list" />
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
                                    {loading === false && (
                                        <>
                                            <li>
                                                <div className="content-events">
                                                    <div className="bg-img">
                                                        <Box>
                                                            {loading === false && <Skeleton height={140}></Skeleton>}
                                                        </Box>
                                                    </div>
                                                    <div className="content-right">
                                                        <Typography variant="h3" sx={{ mb: 1 }}>
                                                            {loading === false && <Skeleton width="500px" />}
                                                        </Typography>
                                                        <Typography variant="caption">
                                                            {loading === false && <Skeleton width="200px" />}
                                                        </Typography>
                                                        <Typography variant="h2" sx={{ mt: 1 }}>
                                                            {loading === false && <Skeleton width="200px" />}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="content-events">
                                                    <div className="bg-img">
                                                        <Box>
                                                            {loading === false && <Skeleton height={140}></Skeleton>}
                                                        </Box>
                                                    </div>
                                                    <div className="content-right">
                                                        <Typography variant="h3" sx={{ mb: 1 }}>
                                                            {loading === false && <Skeleton width="500px" />}
                                                        </Typography>
                                                        <Typography variant="caption">
                                                            {loading === false && <Skeleton width="200px" />}
                                                        </Typography>
                                                        <Typography variant="h2" sx={{ mt: 1 }}>
                                                            {loading === false && <Skeleton width="200px" />}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="content-events">
                                                    <div className="bg-img">
                                                        <Box>
                                                            {loading === false && <Skeleton height={140}></Skeleton>}
                                                        </Box>
                                                    </div>
                                                    <div className="content-right">
                                                        <Typography variant="h3" sx={{ mb: 1 }}>
                                                            {loading === false && <Skeleton width="500px" />}
                                                        </Typography>
                                                        <Typography variant="caption">
                                                            {loading === false && <Skeleton width="200px" />}
                                                        </Typography>
                                                        <Typography variant="h2" sx={{ mt: 1 }}>
                                                            {loading === false && <Skeleton width="200px" />}
                                                        </Typography>
                                                    </div>
                                                </div>
                                            </li>
                                        </>
                                    )}
                                    {loading === true &&
                                        listEvents &&
                                        listEvents.length > 0 &&
                                        listEvents.map((item, index) => {
                                            let time = `${moment(+item.startDate).format("L")} - ${moment(
                                                +item.endDate
                                            ).format("L")}`;
                                            let imageBase64 = "";
                                            if (item.image) {
                                                imageBase64 = Buffer.from(item.image, "base64").toString("binary");
                                            }
                                            let time1 = +item.startDate;
                                            let time2 = +item.endDate;
                                            let timeCurrent = new Date().getTime();
                                            console.log(time2, timeCurrent);
                                            let mes;
                                            time1 > timeCurrent
                                                ? (mes = mes2)
                                                : time2 < timeCurrent
                                                ? (mes = mes3)
                                                : (mes = mes1);
                                            return (
                                                <li key={index}>
                                                    <div
                                                        className="content-events"
                                                        onClick={() => this.handleViewDetail(item)}
                                                        style={{
                                                            cursor: `${
                                                                time2 > timeCurrent && timeCurrent > time1
                                                                    ? "pointer"
                                                                    : "auto"
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
                                                                        time1 > timeCurrent
                                                                            ? "yellow"
                                                                            : time2 < timeCurrent
                                                                            ? "#E7EBF0"
                                                                            : "#29CC97"
                                                                    }`,
                                                                }}>
                                                                <div className="btn-1">{mes}</div>
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
                </div>{" "}
                <Suspense fallback={<Loading />}>
                    <HomeFooter />
                </Suspense>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        events: state.admin.events,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllEvents: () => dispatch(actions.fetchAllEvents()),
    };
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AllEvents));
