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

import "../style.scss";
import DatePicker from "../../../../components/DatePicker";
import * as actions from "../../../../store/actions";
import { LANGUAGES, CRUD_ACTIONS, CommonUtils } from "../../../../utils";
import { toast } from "react-toastify";
import _ from "lodash";
import dayjs from "dayjs";
import localization from "moment/locale/vi";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker, TimePicker } from "@mui/x-date-pickers";
import moment from "moment";
import { createTheme } from "@mui/material/styles";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { createNewEventsService } from "../../../../services/userService";
const mdParser = new MarkdownIt(/* Markdown-it options */);

class ModalAdd extends Component {
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
        };
    }
    componentDidMount() {}

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listEvents !== this.props.listEvents) {
            this.setState({
                name: "",
                image: "",
                previewImgURL: "",

                dayStart: "",
                dayEnd: "",
                description: "",
                descriptionMarkdown: "",
            });
        }
    }
    toggle = () => {
        this.props.toggleFromParent();
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
        // viVI,
    });
    onChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState,
        });
    };
    handleChangeImage = async (event) => {
        const file = event.target.files[0];
        console.log(file);
        console.log(file.preview);
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
        console.log(html, text);
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
        } = this.state;
        let language = this.props.language;
        let startDate = new Date(dayStart).getTime();
        let endDatetest = new Date(dayEnd).getTime();
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
            let res = await createNewEventsService({
                name,
                image,
                previewImgURL,
                startDate,
                endDate,
                description,
                descriptionMarkdown,
            });
            if (res && res.errCode === 0) {
                if (language === LANGUAGES.VI) {
                    toast.success("Thêm sự kiện thành công");
                } else {
                    toast.success("Add successful event");
                }
            }
            this.props.createNewUser1(this.state);
        }
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
                        Thêm sự kiện
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
                                                    locale="vi"
                                                    style={{ border: "none" }}
                                                    onChange={
                                                        this.handleOnChange1
                                                    }
                                                    id="schedule1"
                                                    selected={dayStart}
                                                    minDate={
                                                        new Date(
                                                            new Date().setDate(
                                                                new Date().getDate() -
                                                                    1
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
                                                    selected={dayEnd}
                                                    minDate={
                                                        new Date(
                                                            new Date().setDate(
                                                                new Date().getDate() -
                                                                    1
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
                                </Col>
                                <Col md={1}></Col>
                                <Col md={5}>
                                    <label htmlFor="img">Img</label>
                                    <div className="prev-img-container">
                                        <input
                                            // className="form-control mb-4"
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
                                    <label htmlFor="img">
                                        Thong tin su kien
                                    </label>
                                    <MdEditor
                                        style={{ height: "350px" }}
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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchAllEvents: () => dispatch(actions.fetchAllEvents()),
        changeLanguageAppRedux: (language) =>
            dispatch(changeLanguageApp(language)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalAdd);
