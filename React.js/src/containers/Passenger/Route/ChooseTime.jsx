import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import { FormattedMessage } from "react-intl";
import moment from "moment";
export default class ChooseTime extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectButton1: false,
            selectButton2: false,
            selectButton3: false,
            selectButton4: false,
            arrTemp: [],
            isTemp: false,
        };
    }

    handleButton1 = () => {
        let { selectButton1, selectButton2, selectButton3, selectButton4 } = this.props.test;
        let { arrRoute } = this.props;
        let arr = [];
        let temp = false;
        this.setState({ isTemp: false });
        this.props.parentCallback(false);
        if (selectButton1 === false) {
            if (selectButton4 === true && selectButton2 === true && selectButton3 === true) {
                arr = arrRoute;
                temp = true;
            }
            if (selectButton2 === false && selectButton3 === false && selectButton4 === false) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time < 6;
                    }));
            }
            if (selectButton2 === false && selectButton3 === false && selectButton4 === true) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time < 6 || +time >= 18;
                    }));
            }
            if (selectButton2 === false && selectButton3 === true && selectButton4 === false) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time < 6 || (+time >= 12 && +time < 18);
                    }));
            }
            if (selectButton2 === true && selectButton3 === false && selectButton4 === false) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time < 12;
                    }));
            }
            if (selectButton2 === true && selectButton3 === true && selectButton4 === false) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time < 18;
                    }));
            }
            if (selectButton2 === true && selectButton3 === false && selectButton4 === true) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time < 12 || +time >= 18;
                    }));
            }
            if (selectButton2 === false && selectButton3 === true && selectButton4 === true) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time < 6 || +time >= 12;
                    }));
            }
        }
        if (selectButton1 === true) {
            if (selectButton2 === false && selectButton3 === false && selectButton4 === false) {
                arr = arrRoute;
                temp = true;
            }
            if (selectButton2 === false && selectButton3 === false && selectButton4 === true) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time >= 18;
                    }));
            }
            if (selectButton2 === false && selectButton3 === true && selectButton4 === false) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time >= 12 && +time < 18;
                    }));
            }
            if (selectButton2 === true && selectButton3 === false && selectButton4 === false) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time >= 6 && +time < 12;
                    }));
            }
            if (selectButton2 === true && selectButton3 === true && selectButton4 === false) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time >= 6 && +time < 18;
                    }));
            }
            if (selectButton2 === true && selectButton3 === false && selectButton4 === true) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return (+time >= 6 && +time < 12) || +time >= 18;
                    }));
            }
            if (selectButton2 === false && selectButton3 === true && selectButton4 === true) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time >= 12;
                    }));
            }
            if (selectButton2 === true && selectButton3 === true && selectButton4 === true) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time >= 6;
                    }));
            }
        }
        if (temp === true) {
            this.props.parentCallback1(arrRoute, false, !this.state.selectButton1);
            this.setState({
                arrTemp: arrRoute,
                isTemp: false,
                selectButton1: !this.state.selectButton1,
            });
        } else {
            this.props.parentCallback1(arr, true, !this.state.selectButton1);

            this.setState({
                arrTemp: arr,
                isTemp: true,
                selectButton1: !this.state.selectButton1,
            });
        }
    };
    handleButton2 = () => {
        this.setState({ isTemp: false });
        this.props.parentCallback(false);
        let { arrRoute } = this.props;
        let { selectButton1, selectButton2, selectButton3, selectButton4 } = this.props.test;
        let arr = [];
        let temp = false;
        if (selectButton2 === false) {
            if (selectButton1 === true && selectButton4 === true && selectButton3 === true) {
                arr = arrRoute;
                temp = true;
            }
            if (selectButton1 === false && selectButton3 === false && selectButton4 === false) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time >= 6 && +time < 12;
                    }));
            }
            if (selectButton1 === false && selectButton3 === false && selectButton4 === true) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return (+time >= 6 && +time < 12) || +time >= 18;
                    }));
            }
            if (selectButton1 === false && selectButton3 === true && selectButton4 === false) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time >= 6 && +time < 18;
                    }));
            }
            if (selectButton1 === true && selectButton3 === false && selectButton4 === false) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time < 12;
                    }));
            }
            if (selectButton1 === true && selectButton3 === true && selectButton4 === false) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time < 18;
                    }));
            }
            if (selectButton1 === true && selectButton3 === false && selectButton4 === true) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time < 12 || +time >= 18;
                    }));
            }
            if (selectButton1 === false && selectButton3 === true && selectButton4 === true) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time >= 6;
                    }));
            }
        }
        if (selectButton2 === true) {
            if (selectButton1 === false && selectButton3 === false && selectButton4 === false) {
                arr = arrRoute;
                temp = true;
            }
            if (selectButton1 === false && selectButton3 === false && selectButton4 === true) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time >= 18;
                    }));
            }
            if (selectButton1 === false && selectButton3 === true && selectButton4 === false) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time >= 12 && +time < 18;
                    }));
            }
            if (selectButton1 === true && selectButton3 === false && selectButton4 === false) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time < 6;
                    }));
            }
            if (selectButton1 === true && selectButton3 === true && selectButton4 === false) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time < 6 || (+time >= 12 && +time < 18);
                    }));
            }
            if (selectButton1 === true && selectButton3 === false && selectButton4 === true) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time < 12 || +time >= 18;
                    }));
            }
            if (selectButton1 === false && selectButton3 === true && selectButton4 === true) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time >= 12;
                    }));
            }
            if (selectButton1 === true && selectButton3 === true && selectButton4 === true) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time < 6 || +time > 12;
                    }));
            }
        }

        if (temp === true) {
            this.props.parentCallback2(arrRoute, false, !this.state.selectButton2);
            this.setState({
                arrTemp: arrRoute,
                isTemp: false,
                selectButton2: !this.state.selectButton2,
            });
        } else {
            this.props.parentCallback2(arr, true, !this.state.selectButton2);
            this.setState({
                arrTemp: arr,
                isTemp: true,
                selectButton2: !this.state.selectButton2,
            });
        }
    };
    handleButton3 = () => {
        this.setState({ isTemp: false });
        this.props.parentCallback(false);
        let { arrRoute } = this.props;
        let { selectButton1, selectButton2, selectButton3, selectButton4 } = this.props.test;
        let arr = [];
        let temp = false;
        if (selectButton3 === false) {
            if (selectButton1 === false && selectButton2 === false && selectButton4 === false) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time >= 12 && +time < 18;
                    }));
            }
            if (selectButton1 === false && selectButton2 === false && selectButton4 === true) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time >= 12;
                    }));
            }
            if (selectButton1 === false && selectButton2 === true && selectButton4 === false) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time >= 6 && +time < 18;
                    }));
            }
            if (selectButton1 === true && selectButton2 === false && selectButton4 === false) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time < 6 || (+time >= 12 && +time < 18);
                    }));
            }
            if (selectButton1 === true && selectButton2 === true && selectButton4 === false) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time < 18;
                    }));
            }
            if (selectButton1 === true && selectButton2 === false && selectButton4 === true) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time < 6 || +time >= 12;
                    }));
            }
            if (selectButton1 === false && selectButton2 === true && selectButton4 === true) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time >= 6;
                    }));
            }
            if (selectButton1 === true && selectButton2 === true && selectButton4 === true) {
                arr = arrRoute;
                temp = true;
            }
        }
        if (selectButton3 === true) {
            if (selectButton1 === false && selectButton2 === false && selectButton4 === false) {
                arr = arrRoute;
                temp = true;
            }
            if (selectButton1 === false && selectButton2 === false && selectButton4 === true) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time >= 18;
                    }));
            }
            if (selectButton1 === false && selectButton2 === true && selectButton4 === false) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time >= 6 && +time < 12;
                    }));
            }
            if (selectButton1 === true && selectButton2 === false && selectButton4 === false) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time < 6;
                    }));
            } //err
            if (selectButton1 === true && selectButton2 === true && selectButton4 === false) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time < 12;
                    }));
            }
            if (selectButton1 === true && selectButton2 === false && selectButton4 === true) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time < 6 || +time >= 18;
                    }));
            }
            if (selectButton1 === false && selectButton2 === true && selectButton4 === true) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return (+time >= 6 && +time < 12) || +time >= 18;
                    }));
            }
            if (selectButton1 === true && selectButton2 === true && selectButton4 === true) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time < 12 || +time >= 18;
                    }));
            }
        }

        if (temp === true) {
            this.props.parentCallback3(arrRoute, false, !this.state.selectButton3);

            this.setState({
                arrTemp: arrRoute,
                isTemp: false,
                selectButton3: !this.state.selectButton3,
            });
        } else {
            this.props.parentCallback3(arr, true, !this.state.selectButton3);

            this.setState({
                arrTemp: arr,
                isTemp: true,
                selectButton3: !this.state.selectButton3,
            });
        }
    };
    handleButton4 = () => {
        this.setState({ isTemp: false });
        this.props.parentCallback(false);
        let { arrRoute } = this.props;
        let { selectButton1, selectButton2, selectButton3, selectButton4 } = this.props.test;
        let arr = [];
        let temp = false;
        if (selectButton4 === false) {
            if (selectButton1 === false && selectButton2 === false && selectButton3 === false) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time >= 18;
                    }));
            }
            if (selectButton1 === false && selectButton2 === false && selectButton3 === true) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time >= 12;
                    }));
            }
            if (selectButton1 === false && selectButton2 === true && selectButton3 === false) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return (+time >= 6 && +time < 12) || +time >= 18;
                    }));
            }
            if (selectButton1 === true && selectButton2 === false && selectButton3 === false) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return (+time >= 0 && +time < 6) || +time >= 18;
                    }));
            }
            if (selectButton1 === true && selectButton2 === true && selectButton3 === false) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return (+time >= 0 && +time < 12) || +time >= 18;
                    }));
            }
            if (selectButton1 === true && selectButton2 === false && selectButton3 === true) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return (+time >= 0 && +time < 6) || +time >= 12;
                    }));
            }
            if (selectButton1 === false && selectButton2 === true && selectButton3 === true) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time >= 6;
                    }));
            }
            if (selectButton1 === true && selectButton2 === true && selectButton3 === true) {
                arr = arrRoute;
                temp = true;
            }
        }
        if (selectButton4 === true) {
            if (selectButton1 === false && selectButton2 === false && selectButton3 === false) {
                arr = arrRoute;
                temp = true;
            }
            if (selectButton1 === false && selectButton2 === false && selectButton3 === true) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time >= 12 && +time < 18;
                    }));
            }
            if (selectButton1 === false && selectButton2 === true && selectButton3 === false) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time >= 6 && +time < 12;
                    }));
            }
            if (selectButton1 === true && selectButton2 === false && selectButton3 === false) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time < 6;
                    }));
            } //err
            if (selectButton1 === true && selectButton2 === true && selectButton3 === false) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time < 12;
                    }));
            }
            if (selectButton1 === true && selectButton2 === false && selectButton3 === true) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time < 6 || (+time >= 12 && +time < 18);
                    }));
            }
            if (selectButton1 === false && selectButton2 === true && selectButton3 === true) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time >= 6 && +time < 18;
                    }));
            }
            if (selectButton2 === true && selectButton3 === true && selectButton1 === true) {
                arrRoute.length > 0 &&
                    (arr = arrRoute.filter((item, index) => {
                        let time = moment(+item.timeStart).format("HH");
                        return +time < 18;
                    }));
            }
        }
        if (temp === true) {
            this.props.parentCallback4(arrRoute, false, !this.state.selectButton4);

            this.setState({
                arrTemp: arrRoute,
                isTemp: false,
                selectButton4: !this.state.selectButton4,
            });
        } else {
            this.props.parentCallback4(arr, true, !this.state.selectButton4);

            this.setState({
                arrTemp: arr,
                isTemp: true,
                selectButton4: !this.state.selectButton4,
            });
        }
    };
    render() {
        let { selectButton1, selectButton2, selectButton3, selectButton4 } = this.props.test;
        let { current } = this.props;
        return (
            <>
                <Row>
                    <Col md={6}>
                        <button
                            className="item_choose"
                            style={{
                                borderColor: `${selectButton1 ? "#0B5ED8" : "#c0c0c0"}`,
                                background: `${selectButton1 ? "#F0F0F0 " : "white"}`,
                            }}
                            onClick={() => this.handleButton1()}
                            disabled={current === 1 ? false : true}>
                            <div>
                                <FormattedMessage id="routes.dawn" />
                            </div>
                            <div>00:00 - 05:59</div>
                        </button>
                    </Col>
                    <Col md={6}>
                        <button
                            style={{
                                borderColor: `${selectButton2 ? "#0B5ED8" : "#c0c0c0"}`,
                                background: `${selectButton2 ? "#F0F0F0 " : "white"}`,
                            }}
                            onClick={() => this.handleButton2()}
                            className="item_choose"
                            disabled={current === 2 || current === 1 ? false : true}>
                            <div>
                                <FormattedMessage id="routes.morning" />
                            </div>
                            <div>06:00 - 11:59</div>
                        </button>
                    </Col>
                </Row>
                <Row className="mt-3">
                    <Col md={6}>
                        <button
                            style={{
                                borderColor: `${selectButton3 ? "#0B5ED8" : "#c0c0c0"}`,
                                background: `${selectButton3 ? "#F0F0F0 " : "white"}`,
                            }}
                            onClick={() => this.handleButton3()}
                            className="item_choose"
                            disabled={
                                current === 2 || current === 1 || current === 3 ? false : true
                            }>
                            <div>
                                <FormattedMessage id="routes.afternoon" />
                            </div>
                            <div>12:00 - 17:59</div>
                        </button>
                    </Col>
                    <Col md={6}>
                        <button
                            style={{
                                borderColor: `${selectButton4 ? "#0B5ED8" : "#c0c0c0"}`,
                                background: `${selectButton4 ? "#F0F0F0 " : "white"}`,
                            }}
                            onClick={() => this.handleButton4()}
                            className="item_choose">
                            <div>
                                <FormattedMessage id="routes.evening" />
                            </div>
                            <div>18:00 - 23:59</div>
                        </button>
                    </Col>
                </Row>
            </>
        );
    }
}
