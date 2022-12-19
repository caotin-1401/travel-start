import React, { Component } from "react";

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

export default HomeFooter;
