import React, { Component } from "react";
import "./FilterStyle.scss";
import Slider from "@mui/material/Slider";
export default class FilterComponent extends Component {
    render() {
        return (
            <div className="filter">
                <div className="d-flex">
                    <span className="boloctimkiem">Bộ lọc tìm kiếm</span>
                    <span className="xoaloc float-end">Xoá lọc</span>
                </div>
                <div className="filter_content">
                    <h6>Tiêu chí phổ biến</h6>
                    <div className="d-flex align-items-center">
                        <input
                            type="checkbox"
                            name="datvetructuyen"
                            id="datvetructuyen"
                        />
                        <label
                            className="lblDatVeTrucTuyen mb-0 ml-2"
                            htmlFor="datvetructuyen">
                            Đặt vé trực tuyến (3)
                        </label>
                    </div>
                    <div className="filter_antSlider">
                        <h6 className="mt-3">Giờ đi</h6>
                        <Slider range min={0} max={24} defaultValue={[0, 24]} />
                        <div className="d-flex">
                            <span>00:00</span>
                            <span className="float-end">23:59</span>
                        </div>
                        <h6 className="mt-3">Giá vé</h6>
                        <Slider
                            range
                            min={0}
                            max={2000000}
                            defaultValue={[0, 2000000]}
                        />
                        <div className="d-flex">
                            <span>0 đ</span>
                            <span className="float-end">2,000,000 đ</span>
                        </div>
                        <h6 className="mt-3">Số chỗ trống</h6>
                        <Slider range min={1} max={50} defaultValue={[1, 50]} />
                        <div className="d-flex">
                            <span>1</span>
                            <span className="float-end">50</span>
                        </div>
                    </div>
                    <div className="filter_brand">
                        <h6 className="mt-3">Nhà xe</h6>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Tìm nhà xe"
                        />
                        <div className="listNhaXe mt-3">
                            <div className="d-flex align-items-center">
                                <input
                                    type="checkbox"
                                    name="nhaxe"
                                    id="nhaxe"
                                />
                                <label
                                    className="nhaxe mb-0 ml-2"
                                    htmlFor="nhaxe">
                                    Hoàng Long (3)
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="filter_pickPlace mt-3">
                        <h6>Điểm đón</h6>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nhập điểm đón"
                        />
                        <div className="listDiemDon mt-3">
                            <div className="d-flex align-items-center">
                                <input
                                    type="checkbox"
                                    name="pickPlace"
                                    id="pickPlace"
                                />
                                <label
                                    className="pickPlace mb-0 ml-2"
                                    htmlFor="pickPlace">
                                    Thủ Đức (12)
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="filter_dropPlace mt-3">
                        <h6>Điểm trả</h6>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nhập điểm trả"
                        />
                        <div className="listDiemTra mt-3">
                            <div className="d-flex align-items-center">
                                <input
                                    type="checkbox"
                                    name="dropPlace"
                                    id="dropPlace"
                                />
                                <label
                                    className="dropPlace mb-0 ml-2"
                                    htmlFor="dropPlace">
                                    Hoàng Mai (5)
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="filter_seatType mt-3">
                        <h6>Loại ghế / giường</h6>
                        <div className="listSeatType mt-3">
                            <div className="d-flex align-items-center">
                                <input
                                    type="checkbox"
                                    name="seatType"
                                    id="seatType"
                                />
                                <label
                                    className="seatType mb-0 ml-2"
                                    htmlFor="seatType">
                                    Giường nằm (23)
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="filter_rate mt-3">
                        <h6>Đánh giá</h6>
                        <div>
                            <i
                                className="fa fa-star"
                                style={{ color: "#fadb14" }}></i>
                            <i
                                className="fa fa-star"
                                style={{ color: "#fadb14" }}></i>
                            <i
                                className="fa fa-star"
                                style={{ color: "#fadb14" }}></i>
                            <i
                                className="fa fa-star"
                                style={{ color: "#fadb14" }}></i>
                            <i
                                className="fa fa-star"
                                style={{ color: "rgb(192, 192, 192)" }}></i>
                            <span className="ml-1">trở lên (5)</span>
                        </div>
                        <div>
                            <i
                                className="fa fa-star"
                                style={{ color: "#fadb14" }}></i>
                            <i
                                className="fa fa-star"
                                style={{ color: "#fadb14" }}></i>
                            <i
                                className="fa fa-star"
                                style={{ color: "#fadb14" }}></i>
                            <i
                                className="fa fa-star"
                                style={{ color: "rgb(192, 192, 192)" }}></i>
                            <i
                                className="fa fa-star"
                                style={{ color: "rgb(192, 192, 192)" }}></i>
                            <span className="ml-1">trở lên (9)</span>
                        </div>
                        <div>
                            <i
                                className="fa fa-star"
                                style={{ color: "#fadb14" }}></i>
                            <i
                                className="fa fa-star"
                                style={{ color: "#fadb14" }}></i>
                            <i
                                className="fa fa-star"
                                style={{ color: "rgb(192, 192, 192)" }}></i>
                            <i
                                className="fa fa-star"
                                style={{ color: "rgb(192, 192, 192)" }}></i>
                            <i
                                className="fa fa-star"
                                style={{ color: "rgb(192, 192, 192)" }}></i>
                            <span className="ml-1">trở lên (13)</span>
                        </div>
                        <div>
                            <i
                                className="fa fa-star"
                                style={{ color: "#fadb14" }}></i>
                            <i
                                className="fa fa-star"
                                style={{ color: "rgb(192, 192, 192)" }}></i>
                            <i
                                className="fa fa-star"
                                style={{ color: "rgb(192, 192, 192)" }}></i>
                            <i
                                className="fa fa-star"
                                style={{ color: "rgb(192, 192, 192)" }}></i>
                            <i
                                className="fa fa-star"
                                style={{ color: "rgb(192, 192, 192)" }}></i>
                            <span className="ml-1">trở lên (16)</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
