import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import * as actions from "../../../store/actions";
import { withRouter } from "react-router";

class Blog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listBlogs: [],
        };
    }
    componentDidMount() {
        this.props.fetchAllBlogs();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.blogs !== this.props.blogs) {
            this.setState({
                listBlogs: this.props.blogs,
            });
        }
    }
    handleViewDetail = (item) => {
        if (this.props.history) {
            this.props.history.push(`/home/blog/blogId=${item.id}`);
        }
    };
    handleEvents = () => {
        if (this.props.history) {
            this.props.history.push(`/home/blogs`);
        }
    };
    render() {
        console.log(this.state.listBlogs);
        let { listBlogs } = this.state;
        let test = listBlogs
            .concat(listBlogs)
            .concat(listBlogs)
            .concat(listBlogs)
            .concat(listBlogs);
        let newArr = test.slice(0, 6);
        let settings = {
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 2,
            slidesToScroll: 1,
        };
        return (
            <React.Fragment>
                <div className="section-share  section-blog">
                    <div className="section-container">
                        <div className="section-header">
                            <span className="title-section">Blog</span>
                            <button
                                className="btn-section"
                                onClick={this.handleEvents}>
                                <FormattedMessage id="header.more" />
                            </button>
                        </div>
                        <div className="section-body">
                            {/* <Slider {...this.props.settings}>
                                <div className=" section-custom">
                                    <div className="bg-img img-blog" />
                                    <div className="section-title">
                                        Sài Gòn - Đà Nẵng
                                    </div>
                                </div>
                                <div className=" section-custom">
                                    <div className="bg-img img-blog" />
                                    <div className="section-title">
                                        Sài Gòn - Đà Nẵng
                                    </div>
                                </div>
                                <div className=" section-custom">
                                    <div className="bg-img img-blog" />
                                    <div className="section-title">
                                        Sài Gòn - Đà Nẵng
                                    </div>
                                </div>
                                <div className=" section-custom">
                                    <div className="bg-img img-blog" />
                                    <div className="section-title">
                                        Sài Gòn - Đà Nẵng
                                    </div>
                                </div>
                                <div className=" section-custom">
                                    <div className="bg-img img-blog" />
                                    <div className="section-title">
                                        Sài Gòn - Đà Nẵng
                                    </div>
                                </div>
                                <div className=" section-custom">
                                    <div className="bg-img img-blog" />
                                    <div className="section-title">
                                        Sài Gòn - Đà Nẵng
                                    </div>
                                </div>
                            </Slider> */}
                            <Slider {...this.props.settings}>
                                {newArr &&
                                    newArr.length > 0 &&
                                    newArr.map((item, index) => {
                                        let imageBase64 = "";
                                        if (item.image) {
                                            imageBase64 = Buffer.from(
                                                item.image,
                                                "base64"
                                            ).toString("binary");
                                        }

                                        return (
                                            <div
                                                key={index}
                                                className=" section-custom"
                                                onClick={() =>
                                                    this.handleViewDetail(item)
                                                }>
                                                <div
                                                    className="bg-img"
                                                    style={{
                                                        backgroundImage: `url(${imageBase64})`,
                                                        borderBottom:
                                                            "1px solid gray ",
                                                    }}></div>

                                                <div>
                                                    <div className="section-title">
                                                        {item.description}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </Slider>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
        blogs: state.admin.blogs,
    };
};

const mapDispatchToProps = (dispatch) => {
    return { fetchAllBlogs: () => dispatch(actions.fetchAllBlogs()) };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Blog));
