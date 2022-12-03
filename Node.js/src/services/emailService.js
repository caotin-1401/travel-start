require("dotenv").config();
// const nodemailer = require("nodemailer");
import nodemailer from "nodemailer";
let sendEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });
    let info = await transporter.sendMail({
        from: "<caotin99a7@gmail.com>", // sender address
        to: dataSend.receiversEmail, // list of receivers
        subject: "Thông tin đặt vé xe", // Subject line
        text: "Hello world?", // plain text body
        html: `
        <h3>Xin chào ${dataSend.name}</h3>
        <p>Bạn nhận được email này vì đã đặt vé xe online trên hệ thống Booking Bus</p>
        <p>Thông tin vé xe: </p>
        <div><b>Khởi hành tại bến: ${dataSend.busOwner}</b></div>
        <div><b>Nhà xe: ${dataSend.busOwner}</b></div>
        <div><b>Thời gian khởi hành: ${dataSend.time}</b></div>
        <div><b>Vị trí ghế: ${dataSend.seatNo} </b></div>
        <div><b>Tổng tiền: ${dataSend.totalPrice} đ</b></div>       
        <p>Nếu các thông tin trên là đúng sự thật, vui lòng click <b><a href=${dataSend.redirectLink} target="_blank"> Click here</a></b> để xác nhận và hoàn tất thông tin đặt vé xe</p>
        <div><i>Xin chân thành cảm ơn</i></div>    
        `,
    });
};
let sendEmailFrogotPassword = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_APP, // generated ethereal user
            pass: process.env.EMAIL_APP_PASSWORD, // generated ethereal password
        },
    });
    let info = await transporter.sendMail({
        from: "<caotin99a7@gmail.com>", // sender address
        to: dataSend.receiversEmail, // list of receivers
        subject: "Thay đổi mật khẩu", // Subject line
        text: "Hello world?", // plain text body
        html: `
        <p>Để đặt lại mật khẩu của bạn, vui lòng nhấp vào liên kết bên dưới.\n\n</p>
        <p><b><a href=${dataSend.redirectLink} target="_blank"> Click here.\n\n</a></b></p>   
        <P>Liên kết chỉ có hiệu lực trong vòng 10 phút </P>
        `,
    });
};
module.exports = {
    sendEmail,
    sendEmailFrogotPassword,
};
