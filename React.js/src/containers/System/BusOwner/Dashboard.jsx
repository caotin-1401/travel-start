import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";

class Dashboard extends Component {
    // constructor(props) {

    // }

    async componentDidMount() {}

    render() {
        console.log("user", this.props.user);
        return <div className="text-center">Dashboard</div>;
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
