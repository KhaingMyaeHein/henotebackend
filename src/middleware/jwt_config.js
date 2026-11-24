const jwt = require("jsonwebtoken");
const authmiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(new Error("Authorization header missing or malformed"));
    }
    
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("User: ",decoded.user);
        req.user = decoded.user; // Attach user info to request object
        next();
    } catch (error) {
    
        return next(new Error("Invalid or expired token"));
    }
};

module.exports = { authmiddleware };