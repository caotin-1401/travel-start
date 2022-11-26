import React, { Component } from "react";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import "./BookingModal.scss";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Box from "@mui/material/Box";
import MobileStepper from "@mui/material/MobileStepper";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import { saveBulkTicket } from "../../../services/userService";
import moment from "moment";
import localization from "moment/locale/vi";
import { toast } from "react-toastify";
import {
    CouponService,
    changeUserFirstCouponService,
} from "../../../services/userService";
class BookingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            tripInfo: {},
            seatArr: [],
            totalPrice: 0,
            name: "",
            phone: "",
            email: "",
            description: "",
            inFoCoupon: {},
            finalPrice: 0,
            isActive: false,
            infoUser: {},
        };
    }
    componentDidMount() {}
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.dataFromParent !== this.props.dataFromParent) {
            this.setState({
                tripInfo: this.props.dataFromParent,
            });
        }

        if (prevState.tripInfo !== this.state.tripInfo) {
            this.setState({
                seatArr: [],
                totalPrice: 0,
            });
        }
    }
    toggle = () => {
        this.props.toggleFromParent();
    };

    handleChooseTicket = async () => {
        let {
            current,
            tripInfo,
            seatArr,
            name,
            phone,
            email,
            description,
            inFoCoupon,
            finalPrice,
            isActive,
            infoUser,
            totalPrice,
        } = this.state;
        let test;
        let dayStart;
        if (finalPrice === 0) {
            finalPrice = totalPrice;
        }
        tripInfo && tripInfo.driverId && (test = tripInfo.driverId);
        tripInfo && tripInfo.driverId && (dayStart = tripInfo.dateStart);
        this.props.addTicket();
        let result = [];
        this.setState(
            {
                isActive: true,
            },
            this.props.parentCallback1(isActive)
        );
        if (!name) {
            toast.error("Please enter your name!");
        } else if (!phone) {
            toast.error("Please enter your phone number!");
        } else if (!email) {
            toast.error("Please enter your email!");
        } else {
            if (seatArr && seatArr.length > 0) {
                seatArr.map((item) => {
                    let obj = {};
                    obj.totalPrice = finalPrice;
                    obj.name = name;
                    obj.driverId = test;
                    obj.dayStart = dayStart;
                    obj.phone = phone;
                    obj.email = email;
                    obj.description = description;
                    obj.userId = this.props.userInfo.id;
                    obj.seatNo = item.keyMap;
                    obj.tripId = tripInfo.id;
                    obj.busOwner = tripInfo.User.busOwner;
                    obj.time = moment(+tripInfo.timeStart).format(
                        "ddd DD/MM hh:mm"
                    );
                    obj.status = "S1";
                    result.push(obj);
                });
            }
            let arrTicket = [];

            let res = await saveBulkTicket({ arrTicket: result });
            if (res && res.errCode === 0) {
                this.setState(
                    {
                        isActive: false,
                    },
                    this.props.parentCallback2(isActive)
                );
                toast.success("Đặt vé xe thành công");
                let data;
                inFoCoupon &&
                    inFoCoupon.length > 0 &&
                    (data = {
                        id: inFoCoupon[0].id,
                        use: +inFoCoupon[0].use + 1,
                    });
                let resCoupon;
                let resUser;
                if (data) {
                    if (data.id) {
                        resCoupon = await CouponService(data);
                    }
                }
                if (infoUser) {
                    if (infoUser.id) {
                        resUser = await changeUserFirstCouponService(infoUser);
                    }
                }
            } else if (res && res.errCode !== 0) {
                this.setState(
                    {
                        isActive: false,
                        seatArr: [],
                    },
                    () => {
                        // this.seatArrParent = { seatArr };
                        this.props.parentCallback2(isActive);
                    }
                );
                toast.error("Đặt vé xe thất bại");
            }
        }
        this.setState(
            {
                isActive: false,
            },
            this.props.parentCallback2(isActive)
        );
        this.setState({
            current: 0,
        });
    };
    next() {
        if (this.state.current === 2) {
            this.props.toggleFromParent();
            this.setState({ current: 0 });
        } else {
            const current = this.state.current + 1;
            this.setState({ current });
        }
    }

    prev() {
        const current = this.state.current - 1;
        this.setState({ current });
    }
    callbackFunction1 = (seatArr, totalPrice) => {
        this.setState({
            seatArr: seatArr,
            totalPrice: totalPrice,
        });
    };
    callbackFunction2 = (name, phone, email, description) => {
        this.setState({
            name: name,
            phone: phone,
            email: email,
            description: description,
        });
    };
    callbackFunction3 = (inFoCoupon, finalPrice, infoUser) => {
        this.setState({
            inFoCoupon,
            finalPrice,
            infoUser,
        });
    };
    render() {
        let {
            current,
            tripInfo,
            seatArr,
            totalPrice,
            name,
            phone,
            email,
            description,
        } = this.state;
        const steps = [
            {
                label: "Chọn ghế",
                description: (
                    <Step1
                        parentCallback={this.callbackFunction1}
                        tripInfoFromParent={tripInfo}
                        seatArrParent={seatArr}
                        totalPriceParent={totalPrice}
                    />
                ),
            },
            {
                label: "Nhập thông tin",
                description: (
                    <Step2
                        nameParent={name}
                        phoneParent={phone}
                        emailParent={email}
                        descriptionParent={description}
                        seatArrParent={seatArr}
                        totalPriceParent={totalPrice}
                        parentCallback={this.callbackFunction2}
                    />
                ),
            },
            {
                label: "Thanh toan",
                description: (
                    <Step3
                        seatArrParent={seatArr}
                        totalPriceParent={totalPrice}
                        parentCallback={this.callbackFunction3}
                    />
                ),
            },
        ];

        const maxSteps = steps.length;
        return (
            <div>
                {" "}
                <Modal
                    isOpen={this.props.isOpen}
                    toggle={() => {
                        this.toggle();
                    }}
                    size="lg"
                    centered>
                    <ModalHeader
                        toggle={() => {
                            this.toggle();
                        }}>
                        {current >= 0 && current < 3 && steps[current].label}
                    </ModalHeader>
                    <ModalBody>
                        {" "}
                        <Box sx={{ maxWidth: "100%", flexGrow: 1 }}>
                            <Box
                                sx={{
                                    height: 440,
                                    maxWidth: "100%",
                                    width: "100%",
                                    p: 2,
                                }}>
                                {current >= 0 &&
                                    current < 3 &&
                                    steps[current].description}
                            </Box>
                        </Box>
                    </ModalBody>
                    <ModalFooter>
                        <MobileStepper
                            sx={{
                                height: 40,
                                maxWidth: "100%",
                                width: "100%",
                                p: 2,
                            }}
                            variant="text"
                            steps={maxSteps}
                            position="static"
                            activeStep={current}
                            nextButton={
                                <>
                                    <Button
                                        size="small"
                                        onClick={() => this.next()}
                                        disabled={current === maxSteps}>
                                        {current === 2 ? (
                                            <span
                                                color="primary"
                                                onClick={() => {
                                                    this.handleChooseTicket();
                                                }}
                                                className="btn-primary-modal">
                                                Đặt vé
                                            </span>
                                        ) : (
                                            <span>
                                                Next <KeyboardArrowRight />
                                            </span>
                                        )}
                                    </Button>
                                </>
                            }
                            backButton={
                                <Button
                                    seatArr={seatArr}
                                    size="small"
                                    onClick={() => this.prev()}
                                    disabled={current === 0}>
                                    <KeyboardArrowLeft />
                                    Back
                                </Button>
                            }
                        />
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
        userInfo: state.user.userInfo,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
