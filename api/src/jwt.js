const jwt = require("jsonwebtoken");

const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_KEY, {
      algorithms: [process.env.JWT_ACCESS_ALG],
    });
  } catch {
    return null;
  }
};
module.exports = {
  verifyAccessToken,
};
