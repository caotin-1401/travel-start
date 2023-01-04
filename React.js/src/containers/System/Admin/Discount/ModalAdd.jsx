import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from "reactstrap";
import Box from "@mui/material/Box";
import { changeLanguageApp } from "../../../../store/actions/appActions";
import "../style.scss";
import DatePicker from "../../../../components/DatePicker";
import * as actions from "../../../../store/actions";
import { LANGUAGES } from "../../../../utils";
import { toast } from "react-toastify";
import _ from "lodash";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import dayjs from "dayjs";
import localization from "moment/locale/vi";
import moment from "moment";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import Select from "react-select";

import { createNewCouponService } from "../../../../services/userService";
const mdParser = new MarkdownIt(/* Markdown-it options */);

class ModalAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            selectEvent: "",
            selectType: "",
            dayStart: "",
            dayEnd: "",
            sumMoneyCondition: "",
            count: "",
            description: "",
            descriptionMarkdown: "",
            discount: "",
            discountMax: "",
            listEvents: [],
            discount1: "",
            discount2: "",
            isEditing1: false,
            isEditing2: false,
            isEditing3: false,
            isEditing4: false,
            discountD: false,
            errMessage1: "",
            errMessage2: "",
            errMessage3: "",
            errMessage4: "",
            errMessage5: "",
        };
    }
    componentDidMount() {
        this.props.fetchAllEvents();
        this.props.fetchAllCoupon();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.events !== this.props.events) {
            let dataSelect = this.buildDataSelectEvents(this.props.events);
            this.setState({
                listEvents: dataSelect,
            });
        }
        if (prevProps.listCoupons !== this.props.listCoupons) {
            this.setState({
                name: "",
                selectEvent: "",
                selectType: "",
                dayStart: "",
                dayEnd: "",
                sumMoneyCondition: "",
                count: "",
                description: "",
                descriptionMarkdown: "",
            });
        }
    }
    buildDataSelectEvents = (inputData) => {
        let result = [];
        if (inputData && inputData.length > 0) {
            inputData.map((item, key) => {
                let obj = {};
                obj.label = item.name;
                obj.value = item.id;
                result.push(obj);
            });
        }
        return result;
    };
    toggle = () => {
        this.props.toggleFromParent();
    };

    onChangeInput = (event, id) => {
        let copyState = { ...this.state };
        console.log(isNaN(event.target.value));
        let message1 = "";
        let message2 = "";
        let message3 = "";
        let message4 = "";
        let message5 = "";
        if (id === "discount1" && isNaN(event.target.value)) {
            message1 = "Trường này bắt buộc phải la số";
        } else if (id === "discount2" && isNaN(event.target.value)) {
            message2 = "Trường này bắt buộc phải la số";
        } else if (id === "discountMax" && isNaN(event.target.value)) {
            message4 = "Trường này bắt buộc phải la số";
        } else if (id === "sumMoneyCondition" && isNaN(event.target.value)) {
            message3 = "Trường này bắt buộc phải la số";
        } else if (id === "count" && isNaN(event.target.value)) {
            message5 = "Trường này bắt buộc phải la số";
        }

        if (id === "discount1" || id === "discount2") {
            copyState["discount"] = event.target.value;
            this.setState({
                ...copyState,
            });
        }
        copyState[id] = event.target.value;
        this.setState({
            ...copyState,
            errMessage1: message1,
            errMessage2: message2,
            errMessage3: message3,
            errMessage4: message4,
            errMessage5: message5,
        });
    };
    handleOnChange1 = (data) => {
        this.setState({
            dayStart: data[0],
        });
    };
    handleOnChange2 = (data) => {
        this.setState({
            dayEnd: data[0],
        });
    };
    handleEditorChange = ({ html, text }) => {
        this.setState({
            description: html,
            descriptionMarkdown: text,
        });
    };
    handleSave = async () => {
        let {
            name,
            selectEvent,
            selectType,
            dayStart,
            dayEnd,
            discount,
            discountMax,
            sumMoneyCondition,
            count,
            description,
            descriptionMarkdown,
        } = this.state;
        let language = this.props.language;
        let startDate = new Date(dayStart).getTime();
        let endDatetest = new Date(dayEnd).getTime();
        let nameErrVi = "Vui lòng điền tên sự kiện";
        let nameErrEn = "Please enter event name";
        let dateStartErrVi = "Vui lòng chọn thời gian bắt đầu sự kiện";
        let dateStartErrEn = "Please select an event start time";
        let dateEndErrVi = "Vui lòng chọn thời gian kết thúc sự kiện";
        let dateEndErrEn = "Please select an event end time";
        let compareDateVi = "Thời gian bắt đầu phải trước thời gian kết thúc";
        let compareDateEn = "The start time must be before the end time";
        let descriptionVi = "Vui lòng nhập mô tả chi tiết cho sự kiện";
        let descriptionEn = "Please enter a detailed description for the event";
        if (isNaN(sumMoneyCondition)) {
            if (language === LANGUAGES.VI) {
                toast.error("nameErrVi1");
            } else {
                toast.error("1");
            }
            return;
        } else if (isNaN(discount)) {
            if (language === LANGUAGES.VI) {
                toast.error("2");
            } else {
                toast.error("2");
            }
            return;
        } else if (isNaN(discountMax)) {
            if (language === LANGUAGES.VI) {
                toast.error("2");
            } else {
                toast.error("2");
            }
            return;
        } else if (isNaN(count)) {
            if (language === LANGUAGES.VI) {
                toast.error("nameErrVi");
            } else {
                toast.error("nameErrEn");
            }
            return;
        }
        if (!name) {
            if (language === LANGUAGES.VI) {
                toast.error(nameErrVi);
            } else {
                toast.error(nameErrEn);
            }
            return;
        } else if (selectEvent && _.isEmpty(selectEvent)) {
            if (language === LANGUAGES.VI) {
                toast.error(dateStartErrVi);
            } else {
                toast.error(dateStartErrEn);
            }
        } else if (selectType && _.isEmpty(selectType)) {
            if (language === LANGUAGES.VI) {
                toast.error(dateStartErrVi);
            } else {
                toast.error(dateStartErrEn);
            }
        } else if (!discount) {
            if (language === LANGUAGES.VI) {
                toast.error(dateStartErrVi);
            } else {
                toast.error(dateStartErrEn);
            }
            return;
        } else if (!discountMax) {
            if (language === LANGUAGES.VI) {
                toast.error(dateStartErrVi);
            } else {
                toast.error(dateStartErrEn);
            }
            return;
        } else if (!sumMoneyCondition) {
            if (language === LANGUAGES.VI) {
                toast.error(dateStartErrVi);
            } else {
                toast.error(dateStartErrEn);
            }
            return;
        } else if (!count) {
            if (language === LANGUAGES.VI) {
                toast.error(dateStartErrVi);
            } else {
                toast.error(dateStartErrEn);
            }
            return;
        } else if (!dayStart) {
            if (language === LANGUAGES.VI) {
                toast.error(dateStartErrVi);
            } else {
                toast.error(dateStartErrEn);
            }
            return;
        } else if (!dayEnd) {
            if (language === LANGUAGES.VI) {
                toast.error(dateEndErrVi);
            } else {
                toast.error(dateEndErrEn);
            }
            return;
        } else if (!description) {
            if (language === LANGUAGES.VI) {
                toast.error(descriptionVi);
            } else {
                toast.error(descriptionEn);
            }
            return;
        } else if (+dayStart > +dayEnd) {
            if (language === LANGUAGES.VI) {
                toast.error(compareDateVi);
            } else {
                toast.error(compareDateEn);
            }
            return;
        } else {
            let endDate = +endDatetest + 86399000;
            let use = 0;
            let res = await createNewCouponService({
                name,
                startDate,
                endDate,
                discount,
                discountMax,
                sumMoneyCondition,
                count,
                use,
                description,
                descriptionMarkdown,
                eventId: selectEvent.value,
                type: selectType.value,
            });
            if (res && res.errCode === 0) {
                if (language === LANGUAGES.VI) {
                    toast.success("Thêm mã giảm giá thành công");
                } else {
                    toast.success("Add successful coupon");
                }
            } else {
                if (language === LANGUAGES.VI) {
                    toast.success("Thêm mã giảm giá thất bại");
                } else {
                    toast.success("Failed to add discount code");
                }
            }
            this.props.createNewUser1(this.state);
        }
    };
    onChangeInputSelectEvent = (selectEvent) => {
        this.setState({ selectEvent });
    };
    onChangeInputSelecType = (selectType) => {
        if (selectType.value === 1) {
            this.setState({ discountD: false, discount2: "" });
        } else {
            this.setState({ discountD: true, discount1: "" });
        }
        this.setState({ selectType });
    };
    currencyFormat(number) {
        const formatter = new Intl.NumberFormat("sv-SE", {
            style: "decimal",
            currency: "SEK",
        });

        return formatter.format(number);
        // return number.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g) + " đ";
    }
    toggleEditing1() {
        this.setState({ isEditing1: !this.state.isEditing1 });
    }
    toggleEditing2() {
        this.setState({ isEditing2: !this.state.isEditing2 });
    }
    toggleEditing3() {
        this.setState({ isEditing3: !this.state.isEditing3 });
    }
    toggleEditing4() {
        this.setState({ isEditing4: !this.state.isEditing4 });
    }

    render() {
        let language = this.props.language;
        let {
            name,
            selectEvent,
            selectType,
            dayStart,
            dayEnd,
            discount,
            discountMax,
            sumMoneyCondition,
            count,
            description,
            descriptionMarkdown,
            listEvents,
            discountD,
            discount1,
            discount2,
            isEditing1,
            isEditing2,
            isEditing3,
            isEditing4,
            errMessage1,
            errMessage2,
            errMessage3,
            errMessage4,
            errMessage5,
        } = this.state;
        let typeSelect = [
            {
                value: 1,
                label: "Giảm theo đ",
            },
            {
                value: 2,
                label: "Giảm theo %",
            },
        ];
        return (
            <div>
                <Modal
                    isOpen={this.props.isOpen}
                    toggle={() => {
                        this.toggle();
                    }}
                    centered
                    size="xl">
                    <ModalHeader
                        toggle={() => {
                            this.toggle();
                        }}>
                        Create a new coupon
                    </ModalHeader>
                    <ModalBody>
                        <Box
                            sx={{
                                height: 540,
                            }}>
                            <Row>
                                <Col md={4}>
                                    <label htmlFor="name">Tên mã giảm giá</label>
                                    <input
                                        style={{ height: "38px" }}
                                        className="form-control mb-4 h-38 "
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={(event) => {
                                            this.onChangeInput(event, "name");
                                        }}
                                    />
                                </Col>
                                <Col md={4}>
                                    {" "}
                                    <label>Chọn sự kiện</label>
                                    <Select
                                        className="mb-4"
                                        value={selectEvent}
                                        onChange={this.onChangeInputSelectEvent}
                                        options={listEvents}
                                    />
                                </Col>
                                <Col md={4}>
                                    {" "}
                                    <label>Chọn loại giảm giá</label>
                                    <Select
                                        className="mb-4"
                                        value={selectType}
                                        onChange={this.onChangeInputSelecType}
                                        options={typeSelect}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={3}>
                                    <label htmlFor="discount">Giảm giá theo đ</label>
                                    {isEditing1 ? (
                                        <input
                                            style={{
                                                height: "38px",
                                                marginBottom: `${
                                                    errMessage1 !== "" ? "3px" : "24px"
                                                }`,
                                            }}
                                            className="form-control"
                                            id="discount"
                                            placeholder="Lớn hơn 1.000"
                                            type="text"
                                            disabled={discountD === true ? true : false}
                                            onBlur={this.toggleEditing1.bind(this)}
                                            value={discount1}
                                            onChange={(event) => {
                                                this.onChangeInput(event, "discount1");
                                            }}
                                        />
                                    ) : (
                                        <input
                                            style={{
                                                height: "38px",
                                                marginBottom: `${
                                                    errMessage1 !== "" ? "3px" : "24px"
                                                }`,
                                            }}
                                            className="form-control"
                                            id="discount"
                                            placeholder="Lớn hơn 1.000"
                                            type="text"
                                            disabled={discountD === true ? true : false}
                                            value={this.currencyFormat(discount1)}
                                            onChange={(event) => {
                                                this.onChangeInput(event, "discount1");
                                            }}
                                            onFocus={this.toggleEditing1.bind(this)}
                                        />
                                    )}
                                    {errMessage1 && (
                                        <div className="col-12" style={{ color: "red" }}>
                                            * {errMessage1}
                                        </div>
                                    )}
                                </Col>
                                <Col md={3}>
                                    <label htmlFor="discount">Giảm giá theo %</label>
                                    <input
                                        style={{
                                            height: "38px",
                                            marginBottom: `${errMessage2 !== "" && "3px"}`,
                                        }}
                                        className="form-control"
                                        id="discount"
                                        type="text"
                                        disabled={discountD === false ? true : false}
                                        placeholder="Nhỏ hơn 100"
                                        value={discount2}
                                        onChange={(event) => {
                                            this.onChangeInput(event, "discount2");
                                        }}
                                    />
                                    {errMessage2 && (
                                        <div className="col-12" style={{ color: "red" }}>
                                            * {errMessage2}
                                        </div>
                                    )}
                                </Col>
                                <Col md={3}>
                                    <label htmlFor="sumMoneyCondition">
                                        Hóa đơn tối thiểu từ (đ)
                                    </label>
                                    {isEditing2 ? (
                                        <input
                                            style={{
                                                height: "38px",
                                                marginBottom: `${errMessage3 !== "" && "3px"}`,
                                            }}
                                            className="form-control"
                                            id="sumMoneyCondition"
                                            placeholder="Hóa đơn tối thiểu"
                                            type="text"
                                            onBlur={this.toggleEditing2.bind(this)}
                                            value={sumMoneyCondition}
                                            onChange={(event) => {
                                                this.onChangeInput(event, "sumMoneyCondition");
                                            }}
                                        />
                                    ) : (
                                        <input
                                            style={{
                                                height: "38px",
                                                marginBottom: `${errMessage3 !== "" && "3px"}`,
                                            }}
                                            className="form-control"
                                            id="sumMoneyCondition"
                                            placeholder="Hóa đơn tối thiểu"
                                            type="text"
                                            value={this.currencyFormat(sumMoneyCondition)}
                                            onChange={(event) => {
                                                this.onChangeInput(event, "sumMoneyCondition");
                                            }}
                                            onFocus={this.toggleEditing2.bind(this)}
                                        />
                                    )}
                                    {errMessage3 && (
                                        <div className="col-12" style={{ color: "red" }}>
                                            * {errMessage3}
                                        </div>
                                    )}
                                </Col>
                                <Col md={3}>
                                    <label htmlFor="discountMax">Giảm tối đa (đ)</label>
                                    {isEditing3 ? (
                                        <input
                                            style={{
                                                height: "38px",
                                                marginBottom: `${errMessage4 !== "" && "3px"}`,
                                            }}
                                            className="form-control"
                                            id="discountMax"
                                            type="text"
                                            value={discountMax}
                                            onChange={(event) => {
                                                this.onChangeInput(event, "discountMax");
                                            }}
                                            onBlur={this.toggleEditing3.bind(this)}
                                        />
                                    ) : (
                                        <input
                                            style={{
                                                height: "38px",
                                                marginBottom: `${errMessage4 !== "" && "3px"}`,
                                            }}
                                            className="form-control"
                                            id="discountMax"
                                            type="text"
                                            onChange={(event) => {
                                                this.onChangeInput(event, "discountMax");
                                            }}
                                            value={this.currencyFormat(discountMax)}
                                            onFocus={this.toggleEditing3.bind(this)}
                                        />
                                    )}
                                    {errMessage4 && (
                                        <div className="col-12" style={{ color: "red" }}>
                                            * {errMessage4}
                                        </div>
                                    )}
                                </Col>
                            </Row>
                            <Row>
                                <Col md={4}>
                                    <label htmlFor="count">Số lượng mã giảm giá</label>
                                    {isEditing4 ? (
                                        <input
                                            style={{
                                                height: "38px",
                                                marginBottom: `${errMessage5 === false ?? "4px"}`,
                                            }}
                                            className="form-control"
                                            id="discountMax"
                                            type="text"
                                            value={count}
                                            onChange={(event) => {
                                                this.onChangeInput(event, "count");
                                            }}
                                            onBlur={this.toggleEditing4.bind(this)}
                                        />
                                    ) : (
                                        <input
                                            style={{
                                                height: "38px",
                                                marginBottom: `${errMessage5 === false ?? "4px"}`,
                                            }}
                                            className="form-control"
                                            id="discountMax"
                                            type="text"
                                            onChange={(event) => {
                                                this.onChangeInput(event, "count");
                                            }}
                                            value={this.currencyFormat(count)}
                                            onFocus={this.toggleEditing4.bind(this)}
                                        />
                                    )}

                                    {/* <input
                                        style={{ height: "38px" }}
                                        className="form-control mb-4 h-38 "
                                        id="count"
                                        type="text"
                                        value={count}
                                        onChange={(event) => {
                                            this.onChangeInput(event, "count");
                                        }}
                                    /> */}
                                    {errMessage5 && (
                                        <div className="col-12" style={{ color: "red" }}>
                                            * {errMessage5}
                                        </div>
                                    )}
                                </Col>
                                <Col md={4}>
                                    <label htmlFor="schedule1">Ngày bắt đầu</label>

                                    <div
                                        className="form-control mb-4"
                                        style={{ height: "38px" }}
                                        htmlFor="schedule1">
                                        <DatePicker
                                            locale="vi"
                                            style={{ border: "none" }}
                                            onChange={this.handleOnChange1}
                                            id="schedule1"
                                            selected={dayStart}
                                            minDate={
                                                new Date(
                                                    new Date().setDate(new Date().getDate() - 1)
                                                )
                                            }
                                        />
                                        <label htmlFor="schedule1" style={{ float: "right" }}>
                                            <i
                                                className="far fa-calendar-alt"
                                                style={{
                                                    fontSize: "20px",
                                                }}></i>
                                        </label>
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <label htmlFor="schedule2">Ngày kết thúc</label>
                                    <div
                                        className="form-control mb-4"
                                        style={{ height: "38px" }}
                                        htmlFor="schedule2">
                                        <DatePicker
                                            style={{ border: "none" }}
                                            onChange={this.handleOnChange2}
                                            id="schedule2"
                                            selected={dayEnd}
                                            minDate={
                                                new Date(
                                                    new Date().setDate(new Date().getDate() - 1)
                                                )
                                            }
                                        />
                                        <label htmlFor="schedule2" style={{ float: "right" }}>
                                            <i
                                                className="far fa-calendar-alt"
                                                style={{
                                                    fontSize: "20px",
                                                }}></i>
                                        </label>
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <label htmlFor="img">Thông tin mã giảm giá</label>
                                    <MdEditor
                                        style={{ height: "280px" }}
                                        renderHTML={(text) => mdParser.render(text)}
                                        onChange={this.handleEditorChange}
                                        value={this.state.descriptionMarkdown}
                                    />
                                </Col>
                            </Row>
                        </Box>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            color="secondary"
                            onClick={() => {
                                this.toggle();
                            }}
                            className="btn-primary-modal">
                            Cancel
                        </Button>{" "}
                        <Button
                            color="primary"
                            onClick={() => {
                                this.handleSave();
                            }}
                            className="btn-primary-modal">
                            Save
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        events: state.admin.events,
        coupons: state.admin.coupons,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllEvents: () => dispatch(actions.fetchAllEvents()),
        fetchAllCoupon: () => dispatch(actions.fetchAllCoupon()),
        changeLanguageAppRedux: (language) => dispatch(changeLanguageApp(language)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalAdd);
