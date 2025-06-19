const jwt = require('jsonwebtoken');

const verifyToken = async (token) => {
  try {
    const user = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    return user;
  } catch (err) {
    return null;
  }
};

module.exports = {
  verifyToken,
}; 