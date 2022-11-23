import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import {
    Paper,
    Box,
    BottomNavigation,
    BottomNavigationAction,
} from "@mui/material";

import RestoreIcon from "@mui/icons-material/Restore";
import CheckIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
class InfoTicket extends Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 0,
        };
    }
    componentDidMount() {}
    componentDidUpdate(prevProps, prevState, snapshot) {}
    handleStep = (event, step) => {
        this.setState({ step: step });
    };
    render() {
        let { step } = this.state;
        return (
            <div className="contentProfile" style={{ padding: 0 }}>
                <Paper sx={{ height: 75 }} elevation={3}>
                    <BottomNavigation
                        showLabels
                        value={step}
                        sx={{ height: 75 }}
                        onChange={this.handleStep}>
                        <BottomNavigationAction
                            label="Đã đặt"
                            sx={{
                                fontSize: "30px",
                            }}
                            icon={
                                <CheckIcon sx={{ mb: 1.5, fontSize: "25px" }} />
                            }
                        />
                        <BottomNavigationAction
                            label="Hoàn thành"
                            sx={{ fontSize: "30px" }}
                            icon={
                                <RestoreIcon
                                    sx={{ mb: 1.5, fontSize: "25px" }}
                                />
                            }
                        />
                        <BottomNavigationAction
                            label="Đã hủy"
                            sx={{ fontSize: "30px" }}
                            icon={
                                <CancelIcon
                                    sx={{ mb: 1.5, fontSize: "25px" }}
                                />
                            }
                        />
                    </BottomNavigation>
                </Paper>
            </div>
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
export default connect(mapStateToProps, mapDispatchToProps)(InfoTicket);
