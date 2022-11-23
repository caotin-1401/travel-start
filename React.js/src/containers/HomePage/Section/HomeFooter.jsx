import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import Slider from "react-slick";

class HomeFooter extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="home-footer">
                    <p>
                        &copy; 2022 TravelStart . More information, please visit
                        my github.
                        <a target="_blank" href="#">
                            &#8594; Click here &#8592;
                        </a>
                    </p>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeFooter);
