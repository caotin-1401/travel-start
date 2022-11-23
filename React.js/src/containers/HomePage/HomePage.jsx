import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import HeaderPage from "./Header";
import Banner from "./Banner";
import Routes from "./Section/Routes";
import Events from "./Section/Events";
import Blog from "./Section/Blog";
import FAQ from "./Section/FAQ";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./HomePage.scss";
import HomeFooter from "./Section/HomeFooter";

class HomePage extends Component {
    render() {
        let settings = {
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1,
        };
        return (
            <div>
                <HeaderPage />
                <Banner />
                <Routes settings={settings} />
                <Events settings={settings} />
                <Blog settings={settings} />
                <FAQ />
                <HomeFooter />
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
