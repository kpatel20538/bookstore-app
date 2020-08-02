const jwt = require("jsonwebtoken");

const signOtpToken = ({ subject }) =>
  jwt.sign({ email: subject }, process.env.JWT_OTP_KEY, {
    issuer: process.env.JWT_OTP_ISS,
    audience: process.env.JWT_OTP_AUD,
    subject,
    algorithm: process.env.JWT_OTP_ALG,
    expiresIn: process.env.JWT_OTP_EXP,
  });

const verifyOtpToken = (token) =>
  jwt.verify(token, process.env.JWT_OTP_KEY, {
    algorithms: [process.env.JWT_OTP_ALG],
  });

const signAccessToken = ({ subject, ...claims }) =>
  jwt.sign({ email: subject, ...claims }, process.env.JWT_ACCESS_KEY, {
    issuer: process.env.JWT_ACCESS_ISS,
    audience: process.env.JWT_ACCESS_AUD,
    subject,
    algorithm: process.env.JWT_ACCESS_ALG,
    expiresIn: process.env.JWT_ACCESS_EXP,
  });

const verifyAccessToken = (token) =>
  jwt.verify(token, process.env.JWT_ACCESS_KEY, {
    algorithms: [process.env.JWT_ACCESS_ALG],
  });

module.exports = {
  signOtpToken,
  signAccessToken,
  verifyOtpToken,
  verifyAccessToken,
};
