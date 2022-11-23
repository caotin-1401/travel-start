import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';


class ParkingLot extends Component {

  
    // constructor(props) {

    // }

    async componentDidMount() {

    }

    render() {
        return (
            <div className="text-center">
                ParkingLot
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

export default connect(mapStateToProps, mapDispatchToProps)(ParkingLot);
