const nodemailer = require('nodemailer');
const {mailUser, mailPass} = require('../config/default');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    service: 'gmail',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: mailUser,
        pass: mailPass,
    },
});

module.exports.sendMail = (email, subject, text) => {
    const mailOptions = {
        from: 'mytodomail@gmail.com',
        to: email,
        subject: subject,
        text: text,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};
