const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: process.env.STMP_HOST,
  port: parseInt(process.env.STMP_PORT, 10),
  secure: false,
  auth: {
    user: process.env.STMP_USER,
    pass: process.env.STMP_PASS,
  },
});

module.exports = (options) =>
  transporter.sendMail({ from: process.env.STMP_FROM, ...options });
