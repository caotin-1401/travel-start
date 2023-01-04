import React, { Component } from "react";
import { Slider, Box } from "@mui/material";
import { FormattedMessage } from "react-intl";
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
                <div className="filter_brand">
                    <h6 className="mt-3">
                        <FormattedMessage id="routes.oparator" />
                    </h6>
                    <input type="text" className="form-control" placeholder="Tìm nhà xe" />
                    <div className="listNhaXe mt-3">
                        <div className="d-flex align-items-center">
                            <input type="checkbox" name="nhaxe" id="nhaxe" />
                            <label className="nhaxe mb-0 ml-2" htmlFor="nhaxe">
                                Hoàng Long (3)
                            </label>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
