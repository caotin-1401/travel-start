import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col } from "reactstrap";
import { Box, TextField, Stack } from "@mui/material";
import "../style.scss";
import { LANGUAGES, CommonUtils } from "../../../../utils";
import { toast } from "react-toastify";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { createNewEventsService } from "../../../../services/userService";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "dayjs/locale/vi";

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
            dayStart: data.$d,
        });
    };
    handleOnChange2 = (data) => {
        this.setState({
            dayEnd: data.$d,
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
        let { name, image, previewImgURL, dayStart, dayEnd, description, descriptionMarkdown } =
            this.state;
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
        let { name, dayStart, dayEnd } = this.state;
        let mes;
        if (language === "vi") {
            mes = "Vui lòng điền tên sự kiện";
        } else {
            mes = "Please enter event name";
        }
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
                        <FormattedMessage id="menu.admin.listEvents.title1" />
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
                                            <FormattedMessage id="menu.admin.listEvents.name" />
                                        </label>
                                        <input
                                            className="form-control mb-4 h-38 "
                                            id="name"
                                            type="text"
                                            style={{
                                                width: "calc(100% - 22px)",
                                                marginLeft: "11px",
                                            }}
                                            placeholder={mes}
                                            value={name}
                                            onChange={(event) => {
                                                this.onChangeInput(event, "name");
                                            }}
                                        />
                                    </Row>
                                    <Row>
                                        <Col md={6}>
                                            <label htmlFor="schedule1">
                                                <FormattedMessage id="menu.admin.listEvents.start1" />
                                            </label>
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
                                                                dayOfWeekFormatter={(day) =>
                                                                    `${day}.`
                                                                }
                                                            />
                                                        </Stack>
                                                    </LocalizationProvider>
                                                ) : (
                                                    <LocalizationProvider
                                                        dateAdapter={AdapterDayjs}>
                                                        <Stack>
                                                            <DatePicker
                                                                value={dayStart}
                                                                onChange={this.handleOnChange1}
                                                                renderInput={(params) => (
                                                                    <TextField {...params} />
                                                                )}
                                                                minDate={new Date()}
                                                                dayOfWeekFormatter={(day) =>
                                                                    `${day}.`
                                                                }
                                                            />
                                                        </Stack>
                                                    </LocalizationProvider>
                                                )}
                                            </ThemeProvider>
                                        </Col>
                                        <Col md={6}>
                                            <label htmlFor="schedule2">
                                                <FormattedMessage id="menu.admin.listEvents.end1" />
                                            </label>{" "}
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
                                                                    dayOfWeekFormatter={(day) =>
                                                                        `${day}.`
                                                                    }
                                                                />
                                                            </Stack>
                                                        </LocalizationProvider>
                                                    ) : (
                                                        <LocalizationProvider
                                                            dateAdapter={AdapterDayjs}>
                                                            <Stack>
                                                                <DatePicker
                                                                    value={dayEnd}
                                                                    onChange={this.handleOnChange2}
                                                                    renderInput={(params) => (
                                                                        <TextField {...params} />
                                                                    )}
                                                                    minDate={new Date()}
                                                                    dayOfWeekFormatter={(day) =>
                                                                        `${day}.`
                                                                    }
                                                                />
                                                            </Stack>
                                                        </LocalizationProvider>
                                                    )}
                                                </ThemeProvider>
                                            </div>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md={1}></Col>
                                <Col md={5}>
                                    <label htmlFor="img">
                                        <FormattedMessage id="menu.admin.listEvents.img" />
                                    </label>
                                    <div className="prev-img-container">
                                        <input
                                            // className="form-control mb-4"
                                            id="img"
                                            type="file"
                                            hidden
                                            onChange={(event) => this.handleChangeImage(event)}
                                        />
                                        <label className="upload-img" htmlFor="img">
                                            <FormattedMessage id="account.upload" />
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
                                        <FormattedMessage id="menu.admin.listEvents.description" />
                                    </label>
                                    <MdEditor
                                        style={{ height: "340px" }}
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
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalAdd);
