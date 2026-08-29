const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./database/db");
const userRoutes = require("./routes/user.routes");
const captainRoutes = require("./routes/captain.routes");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get("/", (req, res) => {
    res.send("Hello from the backend!");
});

app.use('/users', userRoutes);
app.use('/captains', captainRoutes);

app.use((err, req, res, next) => {
    if (err.code === 11000) {
        return res.status(409).json({ message: "A record with that value already exists" });
    }

    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({ message: messages[0] });
    }

    console.error(err);
    res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

module.exports = app;