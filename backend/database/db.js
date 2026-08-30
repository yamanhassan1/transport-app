const mongoose = require("mongoose");

const connectDB = async () => {
    const MONGO_URI = process.env.MONGO_URI;

    if (process.env.NODE_ENV === "test") {
        return;
    }

    if (!MONGO_URI) {
        console.error("MONGO_URI is not set. Add it to backend/.env");
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;