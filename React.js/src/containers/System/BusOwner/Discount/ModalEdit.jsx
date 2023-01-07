import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from "reactstrap";
import Box from "@mui/material/Box";
import "../style.scss";
import { LANGUAGES } from "../../../../utils";
import { toast } from "react-toastify";
import _ from "lodash";
import moment from "moment";

import { editCouponService } from "../../../../services/userService";
import Select from "react-select";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "dayjs/locale/vi";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

class ModalEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            name: "",
            selectType: "",
            dayStart: "",
            dayEnd: "",
            sumMoneyCondition: 0,
            count: "",
            description: "",
            descriptionMarkdown: "",
            discount: "",
            discountMax: "",

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
        let language = this.props.language;
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
            console.log(time1, time2);
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
            this.setState({
                id: user.id,
                name: user.name,
                dayStart: time1,
                dayEnd: time2,
                selectType: objType,
                sumMoneyCondition: user.sumMoneyCondition,
                count: user.count,
                description: user.description,
                descriptionMarkdown: user.descriptionMarkdown,
                discount: user.discount,
                discountMax: user.discountMax,
            });
        }
    }

    toggle = () => {
        this.props.toggleFromParent();
    };

    onChangeInput = (event, id) => {
        let copyState = { ...this.state };
        let { language } = this.props;
        let message1 = "";
        let message3 = "";
        let message4 = "";
        let message5 = "";
        if (language === "vi") {
            if (id === "discount" && isNaN(event.target.value)) {
                message1 = "Trường này bắt buộc phải la số";
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
            } else if (id === "discountMax" && isNaN(event.target.value)) {
                message4 = "This field must be a number";
            } else if (id === "sumMoneyCondition" && isNaN(event.target.value)) {
                message3 = "This field must be a number";
            } else if (id === "count" && isNaN(event.target.value)) {
                message5 = "This field must be a number";
            }
        }

        copyState[id] = event.target.value;
        this.setState({
            ...copyState,
            errMessage1: message1,
            errMessage3: message3,
            errMessage4: message4,
            errMessage5: message5,
        });
    };
    onChangeInputSelecType = (selectType) => {
        this.setState({ selectType });
    };
    handleOnChange1 = (data) => {
        this.setState({
            dayStart: data.$d,
        });
    };
    handleOnChange2 = (data) => {
        this.setState({
            dayEnd: data.$d,
        });
    };

    handleSave = async () => {
        let {
            name,
            id,
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

        let nameErr, countErr, discountErr, dayStartErr, dayEndErr, compareDay, selectTypeErr;

        if (language === "vi") {
            nameErr = "Vui lòng điền tên mã giảm giá";
            countErr = "Vui lòng điền số lượng mã giảm giá";
            discountErr = "Vui lòng điền số tiền giảm";
            dayStartErr = "Vui lòng chọn ngày bắt đầu mã giảm giá có hiệu lực";
            dayEndErr = "Vui lòng chọn ngày mã giảm giá hết hiệu lực";
            selectTypeErr = "Vui lòng chọn loại giảm giá";
            compareDay = "Thời gian bắt đầu phải trước thời gian kết thúc";
        } else {
            nameErr = "Please enter discount name";
            countErr = "Please enter the number of discount";
            discountErr = "Please enter the discount amount";
            dayStartErr = "Please select a valid discount code start date";
            dayEndErr = "Please select the expiration date of the discount code";
            selectTypeErr = "Please select a discount type";
            compareDay = "The start time must be before the end time";
        }

        if (!name) {
            toast.error(nameErr);
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
        } else if (+startDate > +endDate) {
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
            MuiButtonBase: {
                styleOverrides: {
                    root: {
                        color: "#000000!important",
                    },
                },
            },
        },
    });
    currencyFormat(number) {
        const formatter = new Intl.NumberFormat("vi-VI", { style: "currency", currency: "VND" });

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
            selectType,
            dayStart,
            dayEnd,
            discount,
            discountMax,
            sumMoneyCondition,
            count,
            isEditing1,
            isEditing2,
            isEditing3,
            isEditing4,
            errMessage1,
            errMessage3,
            errMessage4,
            errMessage5,
        } = this.state;

        return (
            <div>
                <Modal
                    isOpen={this.props.isOpen}
                    toggle={() => {
                        this.toggle();
                    }}
                    style={{ maxWidth: "60%" }}>
                    <ModalHeader
                        toggle={() => {
                            this.toggle();
                        }}>
                        <FormattedMessage id="menu.busOwner.discount.title3" />
                    </ModalHeader>
                    <ModalBody>
                        <Box>
                            <Row>
                                <Col md={4}>
                                    <label>
                                        {" "}
                                        <FormattedMessage id="menu.busOwner.discount.name" />
                                    </label>
                                    <input
                                        style={{ height: "38px" }}
                                        className="form-control mb-4 h-38 "
                                        disabled
                                        value={name}
                                    />
                                </Col>

                                <Col md={4}>
                                    <label>
                                        {" "}
                                        <FormattedMessage id="menu.busOwner.discount.type" />
                                    </label>
                                    <Select className="mb-4" value={selectType} isDisabled={true} />
                                </Col>
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

                                    {errMessage5 && (
                                        <div className="col-12" style={{ color: "red" }}>
                                            * {errMessage5}
                                        </div>
                                    )}
                                </Col>
                            </Row>
                            <Row>
                                <Col md={4}>
                                    <label htmlFor="discount">
                                        {" "}
                                        <FormattedMessage id="menu.busOwner.discount.discount" />
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
                                            value={this.currencyFormat(discount)}
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
                                <Col md={4}>
                                    <label htmlFor="sumMoneyCondition">
                                        {" "}
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
                                <Col md={6}>
                                    <label htmlFor="schedule1">
                                        {" "}
                                        <FormattedMessage id="menu.busOwner.discount.start" />
                                    </label>
                                    <div className=" mb-2">
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
                                <Col md={6}>
                                    <label htmlFor="schedule2">
                                        {" "}
                                        <FormattedMessage id="menu.busOwner.discount.end" />
                                    </label>

                                    <div className=" mb-2">
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
                        </Box>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            color="secondary"
                            onClick={() => {
                                this.toggle();
                            }}
                            className="btn-primary-modal">
                            <FormattedMessage id="account.cancel" />{" "}
                        </Button>{" "}
                        <Button
                            color="primary"
                            onClick={() => {
                                this.handleSave();
                            }}
                            className="btn-primary-modal">
                            <FormattedMessage id="account.save" />{" "}
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
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalEdit);
