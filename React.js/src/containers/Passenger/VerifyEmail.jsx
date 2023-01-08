import React, { Component } from "react";
import { connect } from "react-redux";
import { verifyEmail } from "../../services/userService";
import Header from "../HomePage/Header";
class VerifyEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            statusVerify: false,
            errCode: 0,
        };
    }
    async componentDidMount() {
        if (this.props.location && this.props.location.search) {
            let urlParams = new URLSearchParams(this.props.location.search);
            let token = urlParams.get("token");
            let tripId = urlParams.get("tripId");
            let res = await verifyEmail({ token, tripId });

            if (res && res.errCode === 0) {
                this.setState({
                    statusVerify: true,
                    errCode: res.errCode,
                });
            } else {
                this.setState({
                    statusVerify: false,
                    errCode: res && res.errCode ? res.errCode : -1,
                });
            }
        }
    }

    render() {
        let { language } = this.props;
        let mes1, mes2;
        if (language === "vi") {
            mes1 = "Xác nhận lịch hẹn thành công";
            mes2 = "Lịch hẹn không tồn tại hoặc đã được xác nhận";
        } else {
            mes1 = "Appointment confirmed successfully";
            mes2 = "Appointment does not exist or has been confirmed";
        }
        return (
            <>
                <Header />
                <div className="detail_fail text-center">
                    <h4 className="mt-5 detail_title">
                        {this.state.errCode === 0 ? <div>{mes1}</div> : <div>{mes2}</div>}
                    </h4>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail);
