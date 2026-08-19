const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const app = express();

app.use(cors());

dotenv.config();

app.get("/", (req, res) => {
    res.send("Hello from the backend!");
});

module.exports = app;