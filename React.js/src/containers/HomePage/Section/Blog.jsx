import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import {FormattedMessage } from 'react-intl';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

class Blog extends Component {
    render() {
        let settings = {
            dots: false,
            infinite: true,
            speed: 500,
            slidesToShow: 2,
            slidesToScroll: 1,
          };
        return(
            <React.Fragment>
                <div className= "section-share  section-blog">
                    <div className= "section-container"> 
                      <div className= "section-header">
                        <span className= "title-section">Blog</span>
                        <button className= "btn-section"><FormattedMessage id="header.more"/></button>
                      </div>
                      <div className= "section-body">
                      <Slider {...this.props.settings}>
                          <div className=" section-custom">
                              <div className="bg-img img-blog" />                     
                              <div className="section-title">Sài Gòn - Đà Nẵng</div>
                          </div>
                          <div className=" section-custom">               
                             <div className="bg-img img-blog" />
                             <div className="section-title">Sài Gòn - Đà Nẵng</div>
                          </div>
                          <div className=" section-custom">
                            <div className="bg-img img-blog" />                     
                            <div className="section-title">Sài Gòn - Đà Nẵng</div>
                          </div>
                          <div className=" section-custom">
                             <div className="bg-img img-blog" />                     
                             <div className="section-title">Sài Gòn - Đà Nẵng</div>
                          </div>
                          <div className=" section-custom">
                            <div className="bg-img img-blog" />                     
                            <div className="section-title">Sài Gòn - Đà Nẵng</div>
                          </div>
                          <div className=" section-custom">
                            <div className="bg-img img-blog" />                     
                            <div className="section-title">Sài Gòn - Đà Nẵng</div>
                          </div>
                    </Slider>
                      </div>
                   </div>
                </div>
            </React.Fragment>
        )
    }

}

const mapStateToProps = state => {
    return {
        isLoggedIn: state.user.isLoggedIn,
        language: state.app.language,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Blog);
