import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from "reactstrap";
import { Box, TextField, Stack } from "@mui/material";
import "../style.scss";
import * as actions from "../../../../store/actions";
import { LANGUAGES } from "../../../../utils";
import { toast } from "react-toastify";
import _ from "lodash";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import Select from "react-select";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "dayjs/locale/vi";

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
            errMessage6: "",
            dayStartEvent: 0,
            dayEndEvent: 0,
        };
    }
    componentDidMount() {
        this.props.fetchAllEvents();
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
                if (+item.endDate < new Date().getTime()) {
                    obj.isDisabled = true;
                }
                result.push(obj);
                return result;
            });
        }
        return result;
    };
    toggle = () => {
        this.props.toggleFromParent();
    };

    onChangeInput = (event, id) => {
        let copyState = { ...this.state };
        let { language } = this.props;
        let message1 = "";
        let message2 = "";
        let message3 = "";
        let message4 = "";
        let message5 = "";
        if (language === "vi") {
            if (id === "discount1" && isNaN(event.target.value)) {
                message1 = "Trường này bắt buộc phải la số";
            } else if (id === "discount2" && isNaN(event.target.value)) {
                message2 = "Trường này bắt buộc phải la số";
            } else if (id === "discount2" && event.target.value.length > 2) {
                message2 = "Trường này phải nhỏ hơn 100";
            } else if (id === "discountMax" && isNaN(event.target.value)) {
                message4 = "Trường này bắt buộc phải la số";
            } else if (id === "sumMoneyCondition" && isNaN(event.target.value)) {
                message3 = "Trường này bắt buộc phải la số";
            } else if (id === "count" && isNaN(event.target.value)) {
                message5 = "Trường này bắt buộc phải la số";
            }
        } else {
            if (id === "discount1" && isNaN(event.target.value)) {
                message1 = "This field must be a number";
            } else if (id === "discount2" && isNaN(event.target.value)) {
                message2 = "This field must be a number";
            } else if (id === "discount2" && event.target.value.length > 2) {
                message2 = "This field must be less than 100";
            } else if (id === "discountMax" && isNaN(event.target.value)) {
                message4 = "This field must be a number";
            } else if (id === "sumMoneyCondition" && isNaN(event.target.value)) {
                message3 = "This field must be a number";
            } else if (id === "count" && isNaN(event.target.value)) {
                message5 = "This field must be a number";
            }
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
        let { dayStartEvent, dayEndEvent } = this.state;
        let { language } = this.props;
        let mes;
        if (language === "vi") {
            mes = "Thời gian sử dụng mã giảm giá phải trong thời gian diễn ra sự kiện";
        } else mes = "The time to use the discount code must be during the event period";
        console.log(data.$d.getTime(), data.$d.getTime());
        console.log(dayStartEvent, dayEndEvent);

        if (data.$d.getTime() < dayStartEvent || data.$d.getTime() > dayEndEvent) {
            this.setState({
                dayStart: data.$d,
                errMessage6: mes,
            });
        } else
            this.setState({
                errMessage6: "",
                dayStart: data.$d,
            });
    };
    handleOnChange2 = (data) => {
        let { dayEndEvent } = this.state;
        let { language } = this.props;
        let mes;
        if (language === "vi") {
            mes = "Thời gian sử dụng mã giảm giá phải trong thời gian diễn ra sự kiện";
        } else mes = "The time to use the discount code must be during the event period";
        console.log(data.$d.getTime(), dayEndEvent);
        if (data.$d.getTime() > dayEndEvent) {
            this.setState({
                dayEnd: data.$d,
                errMessage6: mes,
            });
        } else
            this.setState({
                dayEnd: data.$d,
                errMessage6: "",
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

        console.log(dayStart);
        let startDate = new Date(dayStart).getTime();
        let endDatetest = new Date(dayEnd).getTime();
        let nameErr,
            countErr,
            discountErr,
            sumErr,
            dayStartErr,
            dayEndErr,
            compareDay,
            selectTypeErr,
            selectEventErr;

        if (language === "vi") {
            nameErr = "Vui lòng điền tên mã giảm giá";
            countErr = "Vui lòng điền số lượng mã giảm giá";
            discountErr = "Vui lòng điền số tiền giảm";
            sumErr = "Vui lòng nhập số tiền tối thiểu để nhận mã giảm giá";
            dayStartErr = "Vui lòng chọn ngày bắt đầu mã giảm giá có hiệu lực";
            dayEndErr = "Vui lòng chọn ngày mã giảm giá hết hiệu lực";
            selectTypeErr = "Vui lòng chọn loại giảm giá";
            selectEventErr = "Vui lòng chọn sự kiện";
            compareDay = "Thời gian bắt đầu phải trước thời gian kết thúc";
        } else {
            nameErr = "Please enter discount name";
            countErr = "Please enter the number of discount";
            discountErr = "Please enter the discount amount";
            sumErr = "Please enter the minimum amount to receive the discount";
            dayStartErr = "Please select a valid discount code start date";
            dayEndErr = "Please select the expiration date of the discount code";
            selectTypeErr = "Please select a discount type";
            selectEventErr = "Please select a event";
            compareDay = "The start time must be before the end time";
        }

        if (!name) {
            toast.error(nameErr);
        } else if (selectEvent && _.isEmpty(selectEvent)) {
            toast.error(selectEventErr);
        } else if (selectType && _.isEmpty(selectType)) {
            toast.error(selectTypeErr);
        } else if (!discount) {
            toast.error(discountErr);
        } else if (!sumMoneyCondition) {
            toast.error(sumErr);
        } else if (!count) {
            toast.error(countErr);
        } else if (!dayStart) {
            toast.error(dayStartErr);
        } else if (!dayEnd) {
            toast.error(dayEndErr);
        } else if (+dayStart > +dayEnd) {
            toast.error(compareDay);
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
        let { dayStart, dayEnd } = this.state;
        let event = this.props.events.filter((item) => item.id === selectEvent.value);
        let start = +event[0].startDate;
        let end = +event[0].endDate;
        if (!dayStart || !dayEnd)
            this.setState({
                dayStartEvent: start,
                dayEndEvent: end,
                selectEvent,
            });
        else {
            this.setState({
                dayStartEvent: start,
                dayEndEvent: end,
                selectEvent,
            });
        }
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
        const formatter = new Intl.NumberFormat("vi-VI", { style: "currency", currency: "VND" });
        return formatter.format(number);
    }
    currencyFormat1(number) {
        const formatter = new Intl.NumberFormat("vi-VI", { maximumSignificantDigits: 3 });
        return formatter.format(number);
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
    theme = createTheme({
        components: {
            MuiInputBase: {
                styleOverrides: {
                    root: {
                        height: 38,
                    },
                    input: {
                        height: 1.5,
                        padding: 0,
                    },
                },
            },
            MuiOutlinedInput: {
                styleOverrides: {
                    notchedOutline: {
                        borderColor: "#CED4DA!important",
                    },
                },
            },
            MuiPickersDay: {
                styleOverrides: {
                    root: {
                        fontSize: "15px",
                    },
                },
            },
        },
    });
    render() {
        let language = this.props.language;
        let {
            name,
            selectEvent,
            selectType,
            dayStart,
            dayEnd,
            discountMax,
            sumMoneyCondition,
            count,
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
            errMessage6,
        } = this.state;
        let label1, label2;
        if (language === "vi") {
            label1 = "Giảm giá trực tiếp (theo đ)";
            label2 = "Giảm giá theo %";
        } else {
            label1 = "Direct discount (according to VND)";
            label2 = "Discount by %";
        }
        let typeSelect = [
            {
                value: 1,
                label: label1,
            },
            {
                value: 2,
                label: label2,
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
                        <FormattedMessage id="menu.busOwner.discount.title2" />
                    </ModalHeader>
                    <ModalBody>
                        <Box
                            sx={{
                                height: 540,
                            }}>
                            <Row>
                                <Col md={4}>
                                    <label htmlFor="name">
                                        <FormattedMessage id="menu.busOwner.discount.name" />
                                    </label>
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
                                    <label>
                                        {" "}
                                        <FormattedMessage id="menu.admin.listCoupons.selectEvent" />
                                    </label>
                                    <Select
                                        className="mb-4"
                                        value={selectEvent}
                                        onChange={this.onChangeInputSelectEvent}
                                        options={listEvents}
                                    />
                                </Col>
                                <Col md={4}>
                                    {" "}
                                    <label>
                                        {" "}
                                        <FormattedMessage id="menu.busOwner.discount.type" />
                                    </label>
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
                                    <label htmlFor="discount">
                                        {" "}
                                        <FormattedMessage id="menu.busOwner.discount.discountd" />
                                    </label>
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
                                    <label htmlFor="discount">
                                        <FormattedMessage id="menu.busOwner.discount.discount2" />
                                    </label>
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
                                        <FormattedMessage id="menu.busOwner.discount.min" />
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
                                    <label htmlFor="discountMax">
                                        <FormattedMessage id="menu.busOwner.discount.max" />
                                    </label>
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
                                    <label htmlFor="count">
                                        {" "}
                                        <FormattedMessage id="menu.busOwner.discount.count" />
                                    </label>
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
                                            value={this.currencyFormat1(count)}
                                            onFocus={this.toggleEditing4.bind(this)}
                                        />
                                    )}

                                    {errMessage5 && (
                                        <div className="col-12" style={{ color: "red" }}>
                                            * {errMessage5}
                                        </div>
                                    )}
                                </Col>
                                <Col md={4}>
                                    <label htmlFor="schedule1">
                                        <FormattedMessage id="menu.busOwner.discount.start" />
                                    </label>

                                    <div className=" mb-4">
                                        <ThemeProvider theme={this.theme}>
                                            {language === "vi" ? (
                                                <LocalizationProvider
                                                    dateAdapter={AdapterDayjs}
                                                    adapterLocale="vi">
                                                    <Stack>
                                                        <DatePicker
                                                            value={dayStart}
                                                            onChange={this.handleOnChange1}
                                                            renderInput={(params) => (
                                                                <TextField {...params} />
                                                            )}
                                                            minDate={new Date()}
                                                            dayOfWeekFormatter={(day) => `${day}.`}
                                                        />
                                                    </Stack>
                                                </LocalizationProvider>
                                            ) : (
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <Stack>
                                                        <DatePicker
                                                            value={dayStart}
                                                            onChange={this.handleOnChange1}
                                                            renderInput={(params) => (
                                                                <TextField {...params} />
                                                            )}
                                                            minDate={new Date()}
                                                            dayOfWeekFormatter={(day) => `${day}.`}
                                                        />
                                                    </Stack>
                                                </LocalizationProvider>
                                            )}
                                        </ThemeProvider>
                                        {errMessage6 && (
                                            <div className="col-12" style={{ color: "red" }}>
                                                * {errMessage6}
                                            </div>
                                        )}
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <label htmlFor="schedule2">
                                        {" "}
                                        <FormattedMessage id="menu.busOwner.discount.end" />
                                    </label>
                                    <div className=" mb-4">
                                        <ThemeProvider theme={this.theme}>
                                            {language === "vi" ? (
                                                <LocalizationProvider
                                                    dateAdapter={AdapterDayjs}
                                                    adapterLocale="vi">
                                                    <Stack>
                                                        <DatePicker
                                                            value={dayEnd}
                                                            onChange={this.handleOnChange2}
                                                            renderInput={(params) => (
                                                                <TextField {...params} />
                                                            )}
                                                            minDate={new Date()}
                                                            dayOfWeekFormatter={(day) => `${day}.`}
                                                        />
                                                    </Stack>
                                                </LocalizationProvider>
                                            ) : (
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <Stack>
                                                        <DatePicker
                                                            value={dayEnd}
                                                            onChange={this.handleOnChange2}
                                                            renderInput={(params) => (
                                                                <TextField {...params} />
                                                            )}
                                                            minDate={new Date()}
                                                            dayOfWeekFormatter={(day) => `${day}.`}
                                                        />
                                                    </Stack>
                                                </LocalizationProvider>
                                            )}
                                        </ThemeProvider>
                                        {errMessage6 && (
                                            <div className="col-12" style={{ color: "red" }}>
                                                * {errMessage6}
                                            </div>
                                        )}
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <label htmlFor="img">
                                        <FormattedMessage id="menu.admin.listCoupons.info" />
                                    </label>
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
                            <FormattedMessage id="account.cancel" />
                        </Button>{" "}
                        <Button
                            color="primary"
                            onClick={() => {
                                this.handleSave();
                            }}
                            className="btn-primary-modal">
                            <FormattedMessage id="account.save" />
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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllEvents: () => dispatch(actions.fetchAllEvents()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalAdd);
