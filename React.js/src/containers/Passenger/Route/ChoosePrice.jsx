import React, { Component } from "react";
import { Slider, Box } from "@mui/material";
export default class ChoosePrice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            arrMouse: [],
            isMouse: false,
        };
    }

    handleMouseLeave = () => {
        let { arrRoute, value } = this.props;
        let arrMouse = [];

        arrRoute.length > 0 &&
            (arrMouse = arrRoute.filter((item) => {
                return item.price <= value[1] && item.price >= value[0];
            }));
        if (arrMouse.length === arrRoute.length) {
            this.setState({
                arrMouse: arrRoute,
                isMouse: false,
            });
            this.props.parentCallbackPrice(arrMouse, false);
        } else {
            this.setState({
                arrMouse: arrMouse,
                isMouse: true,
            });
            this.props.parentCallbackPrice(arrMouse, true);
        }
    };
    currencyFormat(num) {
        return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") + " đ";
    }
    handleChange = (value) => {
        this.props.parentCallbackValue(value.target.value);
    };
    render() {
        let { value } = this.props;
        return (
            <>
                <Box sx={{ width: 280 }}>
                    <Slider
                        getAriaLabel={() => "Temperature range"}
                        value={value}
                        min={0}
                        max={1000000}
                        step={50000}
                        onMouseUp={this.handleMouseLeave}
                        onChange={(e) => this.handleChange(e)}
                        valueLabelDisplay="auto"
                    />
                </Box>
                {/* <Slider range min={0} max={2000000} defaultValue={[0, 2000000]} /> */}
                <div className="filter_b">
                    <span>{this.currencyFormat(value[0])}</span>
                    <span className="float-end">{this.currencyFormat(value[1])}</span>
                </div>
            </>
        );
    }
}
