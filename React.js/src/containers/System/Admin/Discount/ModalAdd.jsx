import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Row,
    Col,
} from "reactstrap";
import Box from "@mui/material/Box";
import { changeLanguageApp } from "../../../../store/actions/appActions";
import "./TableDiscount.scss";
import DatePicker from "../../../../components/DatePicker";
import * as actions from "../../../../store/actions";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../../utils";
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
        copyState[id] = event.target.value;
        this.setState({
            ...copyState,
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
        this.setState({ selectType });
    };
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
        } = this.state;
        let typeSelect = [
            {
                value: 1,
                label: "Giảm theo %",
            },
            {
                value: 2,
                label: "Giảm theo đ",
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
                                    <label htmlFor="name">
                                        Tên mã giảm giá
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
                                <Col md={4}>
                                    {" "}
                                    <label htmlFor="discount">Giảm giá</label>
                                    <input
                                        style={{ height: "38px" }}
                                        className="form-control mb-4 h-38 "
                                        id="discount"
                                        type="text"
                                        value={discount}
                                        onChange={(event) => {
                                            this.onChangeInput(
                                                event,
                                                "discount"
                                            );
                                        }}
                                    />
                                </Col>
                                <Col md={4}>
                                    {" "}
                                    <label htmlFor="sumMoneyCondition">
                                        Hóa đơn tối thiểu từ (đ)
                                    </label>
                                    <input
                                        style={{ height: "38px" }}
                                        className="form-control mb-4 h-38 "
                                        id="sumMoneyCondition"
                                        type="text"
                                        value={sumMoneyCondition}
                                        onChange={(event) => {
                                            this.onChangeInput(
                                                event,
                                                "sumMoneyCondition"
                                            );
                                        }}
                                    />
                                </Col>
                                <Col md={4}>
                                    {" "}
                                    <label htmlFor="discountMax">
                                        Giảm tối đa (đ)
                                    </label>
                                    <input
                                        style={{ height: "38px" }}
                                        className="form-control mb-4 h-38 "
                                        id="discountMax"
                                        type="text"
                                        value={discountMax}
                                        onChange={(event) => {
                                            this.onChangeInput(
                                                event,
                                                "discountMax"
                                            );
                                        }}
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={4}>
                                    {" "}
                                    <label htmlFor="count">
                                        Số lượng mã giảm giá
                                    </label>
                                    <input
                                        style={{ height: "38px" }}
                                        className="form-control mb-4 h-38 "
                                        id="count"
                                        type="text"
                                        value={count}
                                        onChange={(event) => {
                                            this.onChangeInput(event, "count");
                                        }}
                                    />
                                </Col>
                                <Col md={4}>
                                    <label htmlFor="schedule1">
                                        Ngày bắt đầu
                                    </label>

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
                                                    new Date().setDate(
                                                        new Date().getDate() - 1
                                                    )
                                                )
                                            }
                                        />
                                        <label
                                            htmlFor="schedule1"
                                            style={{ float: "right" }}>
                                            <i
                                                className="far fa-calendar-alt"
                                                style={{
                                                    fontSize: "20px",
                                                }}></i>
                                        </label>
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <label htmlFor="schedule2">
                                        Ngày kết thúc
                                    </label>
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
                                                    new Date().setDate(
                                                        new Date().getDate() - 1
                                                    )
                                                )
                                            }
                                        />
                                        <label
                                            htmlFor="schedule2"
                                            style={{ float: "right" }}>
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
                                    <label htmlFor="img">
                                        Thông tin mã giảm giá
                                    </label>
                                    <MdEditor
                                        style={{ height: "280px" }}
                                        renderHTML={(text) =>
                                            mdParser.render(text)
                                        }
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
        changeLanguageAppRedux: (language) =>
            dispatch(changeLanguageApp(language)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalAdd);
