const User = require("../models/user");
const { Encoder } = require("../utils/core");
const { Msg } = require("../utils/core");
const { generateToken } = require("../utils/generateToken");
const bcrypt = require("bcryptjs")
const registerUser = async (req, res, next) => {
    const { username, password, email, phone } = req.body;

    // Validate input
    if (!username || !password || !email || !phone) {
        return next(new Error("All fields are required"));
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
        if (existingUser) {
            return next(new Error("User with this email or phone number already exists"));
        }
        
        const hashedPassword = Encoder.encode(password);
        // Create new user
        const user = new User({ 
            username, 
            password: hashedPassword,
            email, 
            phone });

        await user.save();
        const token = generateToken(user);
        return Msg(res, "User registered successfully",
             { token: token,
                   user: {
        _id: user._id.toString(), // Ensure it's a string
        username: user.username,
        email: user.email,
        phone: user.phone
    }
              });
    } catch (error) {
        return next(new Error("Internal server error"));
    }
};

const loginUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const loginIdentifier = username || email;

        if (!loginIdentifier || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required"
            });
        }

        const user = await User.findOne({
            $or: [
                { username: loginIdentifier },
                { email: loginIdentifier }
            ]
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        const token = generateToken(user);

        // ✅ FIX: Added the 'user' object here to match the Register response!
        return res.status(200).json({
            success: true,
            message: "Login successful",
            result: {
                token: token,
                user: {
                    _id: user._id.toString(),
                    username: user.username,
                    email: user.email,
                    phone: user.phone
                }
            }
        });

    } catch (error) {
        console.error("LOGIN ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};
module.exports = { registerUser, loginUser };