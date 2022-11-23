import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';


class EventManage extends Component {

  
    // constructor(props) {

    // }

    async componentDidMount() {

    }


    render() {
        return (
            <div className="text-center">
                EventManage
            </div>
        );
    }


}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(EventManage);
