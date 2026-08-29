const dotenv = require("dotenv");

dotenv.config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const connectDB = require("./database/db");
const userRoutes = require("./routes/user.routes");
const captainRoutes = require("./routes/captain.routes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const { CORS_ORIGINS } = require("./config/constants");
const { generalLimiter } = require("./middlewares/rateLimit.middleware");

connectDB();

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: CORS_ORIGINS.length ? CORS_ORIGINS : true,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { customSiteTitle: "transport-app API Docs" }),
);

app.use("/users", generalLimiter, userRoutes);
app.use("/captains", generalLimiter, captainRoutes);

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
