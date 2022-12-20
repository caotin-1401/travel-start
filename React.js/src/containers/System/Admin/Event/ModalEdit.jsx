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
import "../style.scss";
import DatePicker from "../../../../components/DatePicker";
import * as actions from "../../../../store/actions";
import { LANGUAGES, CommonUtils } from "../../../../utils";
import { toast } from "react-toastify";
import _ from "lodash";
import dayjs from "dayjs";
import localization from "moment/locale/vi";
import moment from "moment";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { editEventsService } from "../../../../services/userService";
const mdParser = new MarkdownIt(/* Markdown-it options */);

class ModalEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            image: "",
            previewImgURL: "",

            dayStart: "",
            dayEnd: "",
            description: "",
            descriptionMarkdown: "",
            id: "",
        };
    }
    async componentDidMount() {
        let user = this.props.currentUser;
        if (user && !_.isEmpty(user)) {
            let imageBase64 = "";
            if (user.image) {
                imageBase64 = Buffer.from(user.image, "base64").toString(
                    "binary"
                );
            }
            let time1 = moment(+user.startDate).format("L");
            let time2 = moment(+user.endDate).format("L");
            this.setState({
                id: user.id,
                name: user.name,
                dayStart: time1,
                dayEnd: time2,
                previewImgURL: imageBase64,
                image: imageBase64,
                description: user.description,
                descriptionMarkdown: user.descriptionMarkdown,
            });
        }
    }

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
    handleChangeImage = async (event) => {
        const file = event.target.files[0];

        if (file) {
            let base64 = await CommonUtils.getBase64(file);
            file.preview = URL.createObjectURL(file);
            this.setState({
                previewImgURL: file.preview,
                image: base64,
            });
        }
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
            image,
            previewImgURL,
            dayStart,
            dayEnd,
            description,
            descriptionMarkdown,
            id,
        } = this.state;

        let str = "00:00";
        let [hours, minutes] = str.split(":");
        let startDate, endDate;
        if (!dayStart.length && !dayEnd.length) {
            startDate = new Date(dayStart).getTime();
            endDate = new Date(dayEnd).getTime() + 86399000;
        } else if (!dayEnd.length && dayStart.length === 10) {
            endDate = new Date(dayEnd).getTime() + 86399000;
            let [day1, month1, year1] = dayStart.split("/");
            let date1 = new Date(+year1, month1 - 1, +day1, +hours, +minutes);
            startDate = Math.floor(date1.getTime());
        } else if (!dayStart.length && dayEnd.length === 10) {
            startDate = new Date(dayStart).getTime();
            let [day2, month2, year2] = dayEnd.split("/");
            let date2 = new Date(+year2, month2 - 1, +day2, +hours, +minutes);
            endDate = Math.floor(date2.getTime()) + 86399000;
        } else {
            let [day1, month1, year1] = dayStart.split("/");
            let [day2, month2, year2] = dayEnd.split("/");

            let date1 = new Date(+year1, month1 - 1, +day1, +hours, +minutes);
            let date2 = new Date(+year2, month2 - 1, +day2, +hours, +minutes);
            startDate = Math.floor(date1.getTime());
            endDate = Math.floor(date2.getTime()) + 86399000;
        }
        // let startDate = new Date(dayStart).getTime();
        // let endDate = new Date(dayEnd).getTime();
        let language = this.props.language;

        let nameErrVi = "Vui lòng điền tên sự kiện";
        let nameErrEn = "Please enter event name";
        let imageErrVi = "Vui lòng chọn ảnh của sự kiện";
        let imageErrEn = "Please choose a photo of the event";
        let dateStartErrVi = "Vui lòng chọn thời gian bắt đầu sự kiện";
        let dateStartErrEn = "Please select an event start time";
        let dateEndErrVi = "Vui lòng chọn thời gian kết thúc sự kiện";
        let dateEndErrEn = "Please select an event end time";
        let compareDateVi = "Thời gian bắt đầu phải trước thời gian kết thúc";
        let compareDateEn = "The start time must be before the end time";
        let descriptionVi = "Vui lòng nhập mô tả chi tiết cho sự kiện";
        let descriptionEn = "Please enter a detailed description for the event";
        if (!name) {
            if (language === LANGUAGES.VI) {
                toast.error(nameErrVi);
            } else {
                toast.error(nameErrEn);
            }
            return;
        } else if (!image) {
            if (language === LANGUAGES.VI) {
                toast.error(imageErrVi);
            } else {
                toast.error(imageErrEn);
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
        } else if (!descriptionMarkdown) {
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
            let res = await editEventsService({
                id,
                name,
                image,
                startDate,
                endDate,
                description,
                descriptionMarkdown,
            });
            if (res && res.errCode === 0) {
                if (language === LANGUAGES.VI) {
                    toast.success("Chỉnh sửa sự kiện thành công");
                } else {
                    toast.success("Edit successful event");
                }
            }
        }
        this.props.doEditUser(this.state);
    };
    render() {
        let language = this.props.language;
        let {
            name,
            image,
            dayStart,
            description,
            dayEnd,
            descriptionMarkdown,
        } = this.state;
        console.log(this.state);
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
                        Create a new trip
                    </ModalHeader>
                    <ModalBody>
                        <Box
                            sx={{
                                height: 540,
                                p: 2,
                            }}>
                            <Row>
                                <Col md={6}>
                                    <Row>
                                        <label htmlFor="exampleEmail">
                                            Tên sự kiện
                                        </label>
                                        <input
                                            className="form-control mb-4 h-38 "
                                            id="name"
                                            type="text"
                                            style={{
                                                width: "calc(100% - 22px)",
                                                marginLeft: "11px",
                                            }}
                                            value={name}
                                            onChange={(event) => {
                                                this.onChangeInput(
                                                    event,
                                                    "name"
                                                );
                                            }}
                                        />
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <label htmlFor="schedule1">
                                                Ngày bắt đầu
                                            </label>
                                            <div
                                                className="form-control mb-4"
                                                style={{ height: "38px" }}
                                                htmlFor="schedule1">
                                                <DatePicker
                                                    style={{ border: "none" }}
                                                    onChange={
                                                        this.handleOnChange1
                                                    }
                                                    id="schedule1"
                                                    value={dayStart}
                                                    selected={dayStart}
                                                    // minDate={new Date()}
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
                                        <Col md={6}>
                                            <label htmlFor="schedule2">
                                                Ngày kết thúc
                                            </label>
                                            <div
                                                className="form-control mb-4"
                                                style={{ height: "38px" }}
                                                htmlFor="schedule2">
                                                <DatePicker
                                                    style={{ border: "none" }}
                                                    onChange={
                                                        this.handleOnChange2
                                                    }
                                                    id="schedule2"
                                                    value={dayEnd}
                                                    selected={dayEnd}
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
                                </Col>
                                <Col md={1}></Col>
                                <Col md={5}>
                                    <label htmlFor="img">Img</label>
                                    <div className="prev-img-container">
                                        <input
                                            id="img"
                                            type="file"
                                            hidden
                                            onChange={(event) =>
                                                this.handleChangeImage(event)
                                            }
                                        />
                                        <label
                                            className="upload-img"
                                            htmlFor="img">
                                            Tải ảnh
                                            <i className="fas fa-upload"></i>
                                        </label>
                                        <div
                                            className="prev-img"
                                            style={{
                                                backgroundImage: `url(${this.state.previewImgURL})`,
                                            }}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <label>Thong tin su kien</label>
                                    <MdEditor
                                        style={{ height: "370px" }}
                                        renderHTML={(text) =>
                                            mdParser.render(text)
                                        }
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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllEvents: () => dispatch(actions.fetchAllEvents()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalEdit);
