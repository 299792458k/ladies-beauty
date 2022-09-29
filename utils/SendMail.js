const nodemailer = require('nodemailer');

const SendMail = async (email, otp) => {
    console.log(email, otp)
    try {
        let testAccount = await nodemailer.createTestAccount();
        let transporter = nodemailer.createTransport({
            host: "smtp-mail.outlook.com",
            // port: 587,
            // secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.AUTH_EMAIL,
                pass: process.env.AUTH_PASSWORD, // generated ethereal password
            },
        });

        let info = await transporter.sendMail({
            from: process.env.AUTH_EMAIL,
            to: email, // list of receivers
            subject: "Verify your email", // Subject line
            html: `<p>Enter <b>${otp}</b> in the app to verify your email address and complete register.
            </p><p>This code expires <b>expires in 1 hour</b>.</p>`, // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    } catch (err) {
        console.log(err)
    }
}

module.exports = SendMail;