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
const FAQ = lazy(() => import("./Section/FAQ"));

class HomePage extends Component {
    render() {
        let settings = {
            dots: false,
            infinite: false,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1,
            responsive: [
                {
                    breakpoint: 1400,
                    settings: {
                        slidesToShow: 3,
                        slidesToScroll: 1,
                    },
                },
                {
                    breakpoint: 950,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 1,
                    },
                },
                {
                    breakpoint: 680,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                    },
                },
            ],
        };
        return (
            <div style={{ overflowX: "hidden" }}>
                <Suspense fallback={<Loading />}>
                    <HeaderPage />
                    <Banner />
                    <Routes settings={settings} />
                    <Events settings={settings} />
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
