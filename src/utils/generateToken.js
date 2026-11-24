const jwt = require("jsonwebtoken");
const generateToken = (user) => {
    const payload = { user: { id: user._id.toString() } };
    return jwt.sign(payload, process.env.JWT_SECRET);
}

module.exports = { generateToken };