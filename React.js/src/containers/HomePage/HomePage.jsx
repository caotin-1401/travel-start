import React, { Component, Suspense, lazy } from "react";
import { connect } from "react-redux";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./HomePage.scss";
import Loading from "../../components/Loading";
const HomeFooter = lazy(() => import("./Section/HomeFooter"));
const HeaderPage = lazy(() => import("./Header"));
const Banner = lazy(() => import("./Banner"));
const Routes = lazy(() => import("./Section/Routes"));
const Events = lazy(() => import("./Section/Events"));
const Blog = lazy(() => import("./Section/Blog"));
const FAQ = lazy(() => import("./Section/FAQ"));

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
                <Suspense fallback={<Loading />}>
                    <HeaderPage />
                    <Banner />
                    <Routes settings={settings} />
                    <Events settings={settings} />
                    <Blog settings={settings} />
                    <FAQ />
                    <HomeFooter />
                </Suspense>
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
