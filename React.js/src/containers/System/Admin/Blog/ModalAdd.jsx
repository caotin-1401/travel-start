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
import * as actions from "../../../../store/actions";
import { LANGUAGES, CommonUtils } from "../../../../utils";
import { toast } from "react-toastify";
import _ from "lodash";
import { createTheme } from "@mui/material/styles";
import MarkdownIt from "markdown-it";
import MdEditor from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import { createNewBlogsService } from "../../../../services/userService";
const mdParser = new MarkdownIt(/* Markdown-it options */);

class ModalAdd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            description: "",
            image: "",
            previewImgURL: "",
            content: "",
            contentMarkdown: "",
            author: "",
        };
    }
    componentDidMount() {}

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.listEvents !== this.props.listEvents) {
            this.setState({
                description: "",
                image: "",
                previewImgURL: "",
                content: "",
                contentMarkdown: "",
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
    handleEditorChange = ({ html, text }) => {
        this.setState({
            content: html,
            contentMarkdown: text,
        });
    };
    handleSave = async () => {
        let { description, image, previewImgURL, content, contentMarkdown } =
            this.state;
        let language = this.props.language;
        let author = this.props.userInfo.name;
        let nameErrVi = "Vui lòng điền tên bài viết";
        let nameErrEn = "Please enter blog name";
        let imageErrVi = "Vui lòng chọn ảnh của bài viết";
        let imageErrEn = "Please choose a photo of the blog";
        let descriptionVi = "Vui lòng nhập mô tả chi tiết cho bài viết";
        let descriptionEn = "Please enter a detailed description for the blog";
        if (!description) {
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
        } else if (!content) {
            if (language === LANGUAGES.VI) {
                toast.error(descriptionVi);
            } else {
                toast.error(descriptionEn);
            }
            return;
        } else {
            let res = await createNewBlogsService({
                description,
                image,
                content,
                contentMarkdown,
                author,
            });
            if (res && res.errCode === 0) {
                if (language === LANGUAGES.VI) {
                    toast.success("Thêm bài viết thành công");
                } else {
                    toast.success("Add successful event");
                }
            }
            this.props.createNewUser1(this.state);
        }
    };
    render() {
        let language = this.props.language;
        let { description, contentMarkdown } = this.state;
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
                        Thêm bài viết
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
                                            Tên bài viết
                                        </label>
                                        <input
                                            className="form-control mb-4 h-38 "
                                            id="description"
                                            type="text"
                                            style={{
                                                width: "calc(100% - 22px)",
                                                marginLeft: "11px",
                                            }}
                                            value={description}
                                            onChange={(event) => {
                                                this.onChangeInput(
                                                    event,
                                                    "description"
                                                );
                                            }}
                                        />
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
                                        value={contentMarkdown}
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
        userInfo: state.user.userInfo,
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
