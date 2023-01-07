import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from "reactstrap";
import { Box, TextField, Stack } from "@mui/material";
import "../style.scss";
import { LANGUAGES } from "../../../../utils";
import { toast } from "react-toastify";
import _ from "lodash";
import moment from "moment";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { editCouponService } from "../../../../services/userService";
import Select from "react-select";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "dayjs/locale/vi";

const mdParser = new MarkdownIt(/* Markdown-it options */);

class ModalEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            name: "",
            selectEvent: "",
            selectType: "",
            dayStart: "",
            dayEnd: "",
            sumMoneyCondition: 0,
            count: "",
            description: "",
            descriptionMarkdown: "",
            discount: "",
            discountMax: "",
            listEvents: [],
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
    async componentDidMount() {
        let user = this.props.currentUser;
        let { language } = this.props;
        if (user && !_.isEmpty(user)) {
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
            let time1 = moment(+user.startDate).format("MM/DD/YYYY");
            let time2 = moment(+user.endDate).format("MM/DD/YYYY");
            let objEvent = {};
            objEvent.label = user.Event.name;
            objEvent.value = user.eventId;
            let objType = {};
            let test = "";
            typeSelect.forEach((item) => {
                if (item.value == user.type) {
                    test = item.label;
                }
            });
            objType.label = test;
            objType.value = user.type;
            console.log(objType);
            let cloneCondition;
            if (!user.sumMoneyCondition) cloneCondition = 0;
            else cloneCondition = user.sumMoneyCondition;
            this.setState({
                id: user.id,
                name: user.name,
                dayStart: time1,
                dayEnd: time2,
                selectEvent: objEvent,
                selectType: objType,
                sumMoneyCondition: cloneCondition,
                count: user.count,
                description: user.description,
                descriptionMarkdown: user.descriptionMarkdown,
                discount: user.discount,
                discountMax: user.discountMax,
            });
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.events !== this.props.events) {
            let dataSelect = this.buildDataSelectEvents(this.props.events);
            this.setState({
                listEvents: dataSelect,
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
            if (id === "discount" && isNaN(event.target.value)) {
                message1 = "Trường này bắt buộc phải la số";
            } else if (
                id === "discount" &&
                this.state.selectType.value === 2 &&
                event.target.value.length > 2
            ) {
                message2 = "Trường này phải nhỏ hơn 100";
            } else if (id === "discountMax" && isNaN(event.target.value)) {
                message4 = "Trường này bắt buộc phải la số";
            } else if (id === "sumMoneyCondition" && isNaN(event.target.value)) {
                message3 = "Trường này bắt buộc phải la số";
            } else if (id === "count" && isNaN(event.target.value)) {
                message5 = "Trường này bắt buộc phải la số";
            }
        } else {
            if (id === "discount" && isNaN(event.target.value)) {
                message1 = "This field must be a number";
            } else if (id === "discount" && event.target.value.length > 2) {
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
            id,
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

        let str = "00:00";
        let [hours, minutes] = str.split(":");
        let startDate, endDate;
        if (!dayStart.length && !dayEnd.length) {
            startDate = new Date(dayStart).getTime();
            endDate = new Date(dayEnd).getTime() + 86399000;
        } else if (!dayEnd.length && dayStart.length === 10) {
            endDate = new Date(dayEnd).getTime() + 86399000;
            let [month1, day1, year1] = dayStart.split("/");
            let date1 = new Date(+year1, month1 - 1, +day1, +hours, +minutes);
            startDate = Math.floor(date1.getTime());
        } else if (!dayStart.length && dayEnd.length === 10) {
            startDate = new Date(dayStart).getTime();
            let [month2, day2, year2] = dayEnd.split("/");
            let date2 = new Date(+year2, month2 - 1, +day2, +hours, +minutes);
            endDate = Math.floor(date2.getTime()) + 86399000;
        } else {
            let [month1, day1, year1] = dayStart.split("/");
            let [month2, day2, year2] = dayEnd.split("/");

            let date1 = new Date(+year1, month1 - 1, +day1, +hours, +minutes);
            let date2 = new Date(+year2, month2 - 1, +day2, +hours, +minutes);
            startDate = Math.floor(date1.getTime());
            endDate = Math.floor(date2.getTime()) + 86399000;
        }

        let language = this.props.language;
        let nameErr,
            countErr,
            discountErr,
            dayStartErr,
            dayEndErr,
            compareDay,
            selectTypeErr,
            selectEventErr;

        if (language === "vi") {
            nameErr = "Vui lòng điền tên mã giảm giá";
            countErr = "Vui lòng điền số lượng mã giảm giá";
            discountErr = "Vui lòng điền số tiền giảm";
            dayStartErr = "Vui lòng chọn ngày bắt đầu mã giảm giá có hiệu lực";
            dayEndErr = "Vui lòng chọn ngày mã giảm giá hết hiệu lực";
            selectTypeErr = "Vui lòng chọn loại giảm giá";
            selectEventErr = "Vui lòng chọn sự kiện";
            compareDay = "Thời gian bắt đầu phải trước thời gian kết thúc";
        } else {
            nameErr = "Please enter discount name";
            countErr = "Please enter the number of discount";
            discountErr = "Please enter the discount amount";
            dayStartErr = "Please select a valid discount code start date";
            dayEndErr = "Please select the expiration date of the discount code";
            selectTypeErr = "Please select a discount type";
            selectEventErr = "Please select a event";
            compareDay = "The start time must be before the end time";
        }
        console.log(sumMoneyCondition);
        if (!name) {
            toast.error(nameErr);
        } else if (selectEvent && _.isEmpty(selectEvent)) {
            toast.error(selectEventErr);
        } else if (selectType && _.isEmpty(selectType)) {
            toast.error(selectTypeErr);
        } else if (!discount) {
            toast.error(discountErr);
        } else if (!count) {
            toast.error(countErr);
        } else if (!dayStart) {
            toast.error(dayStartErr);
        } else if (!dayEnd) {
            toast.error(dayEndErr);
        } else if (+dayStart > +dayEnd) {
            toast.error(compareDay);
        } else {
            let res = await editCouponService({
                id,
                name,
                startDate,
                endDate,
                discount,
                discountMax,
                sumMoneyCondition,
                count,
                description,
                descriptionMarkdown,
                eventId: selectEvent.value,
                type: selectType.value,
            });
            console.log(res);
            if (res && res.errCode === 0) {
                if (language === LANGUAGES.VI) {
                    toast.success("Chinh sua mã giảm giá thành công");
                } else {
                    toast.success("Edit successful coupon");
                }
            } else {
                if (language === LANGUAGES.VI) {
                    toast.success("Chinh sua mã giảm giá thất bại");
                } else {
                    toast.success("Failed to edit discount code");
                }
            }
            this.props.doEditUser(this.state);
        }
    };
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
            descriptionMarkdown,
            listEvents,
            isEditing1,
            isEditing2,
            isEditing3,
            isEditing4,
            errMessage1,
            errMessage3,
            errMessage4,
            errMessage5,
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
                        <FormattedMessage id="menu.busOwner.discount.title3" />{" "}
                    </ModalHeader>
                    <ModalBody>
                        <Box
                            sx={{
                                height: 540,
                            }}>
                            <Row>
                                <Col md={4}>
                                    <label htmlFor="name">
                                        {" "}
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
                                <Col md={4}>
                                    {" "}
                                    <label htmlFor="discount">
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
                                            onBlur={this.toggleEditing1.bind(this)}
                                            value={discount}
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
                                            value={this.currencyFormat1(discount)}
                                            onChange={(event) => {
                                                this.onChangeInput(event, "discount");
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
                                <Col md={4}>
                                    {" "}
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
                                <Col md={4}>
                                    {" "}
                                    <label htmlFor="discountMax">
                                        {" "}
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
                                    {" "}
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
                                    <label htmlFor="schedule1">Ngày bắt đầu</label>

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
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <label htmlFor="schedule2">Ngày kết thúc</label>
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
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <label>Thong tin su kien</label>
                                    <MdEditor
                                        style={{ height: "280px" }}
                                        renderHTML={(text) => mdParser.render(text)}
                                        onChange={this.handleEditorChange}
                                        value={descriptionMarkdown}
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
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalEdit);
