import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
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
    componentDidUpdate(prevProps, prevState, snapshot) {}

    render() {
        return (
            <>
                <Header />
                <div className="detail_fail text-center">
                    <h4 className="mt-5 detail_title">
                        {this.state.errCode === 0 ? (
                            <div>Xác nhận lịch hẹn thành công</div>
                        ) : (
                            <div>
                                Lịch hẹn không tồn tại hoặc đã được xác nhận
                            </div>
                        )}
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
