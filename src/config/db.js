const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            minPoolSize: 2,
            maxPoolSize: 20,
            serverSelectionTimeoutMS: 5000
        });
        console.log("MongoDB connected:", 
            mongoose.connection.name);
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        throw error;
    }
};

module.exports = connectDB;
