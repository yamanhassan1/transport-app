const express = require("express");
const { body } = require("express-validator");
const captainController = require('../controllers/captain.controller');
const { authCaptain } = require('../middlewares/auth.middleware');
const { authLimiter } = require('../middlewares/rateLimit.middleware');

const router = express.Router();

router.post("/register", authLimiter, [
  body("fullname.firstName")
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters long"),
  body("fullname.lastName")
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters long"),
  body("email")
    .isEmail()
    .withMessage("Invalid Email")
    .normalizeEmail()
    .toLowerCase(),
  body("phone")
    .notEmpty()
    .withMessage("Phone is required")
    .isMobilePhone()
    .withMessage("Invalid phone number"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("vehicle.vehicleType")
    .notEmpty()
    .withMessage("Vehicle type is required")
    .isIn(["bike", "rickshaw", "car", "premium", "go", "go_mini", "go_sedan"])
    .withMessage("Invalid vehicle type"),
  body("vehicle.make")
    .notEmpty()
    .withMessage("Vehicle make is required"),
  body("vehicle.model")
    .notEmpty()
    .withMessage("Vehicle model is required"),
  body("vehicle.year")
    .notEmpty()
    .withMessage("Vehicle year is required")
    .isInt({ min: 1886, max: new Date().getFullYear() + 1 })
    .withMessage("Invalid vehicle year"),
  body("vehicle.color")
    .notEmpty()
    .withMessage("Vehicle color is required"),
  body("vehicle.plateNumber")
    .notEmpty()
    .withMessage("Vehicle plate number is required")
    .isLength({ min: 3, max: 15 })
    .withMessage("Plate number must be between 3 and 15 characters long")
    .toUpperCase(),
  body("license.number")
    .notEmpty()
    .withMessage("License number is required")
    .isLength({ min: 5, max: 30 })
    .withMessage("License number must be between 5 and 30 characters long"),
  body("license.expiryDate")
    .notEmpty()
    .withMessage("License expiry date is required")
    .isISO8601()
    .withMessage("Invalid expiry date"),
], captainController.registerCaptain);

router.post("/login", authLimiter, [
  body("email").isEmail().withMessage("Invalid Email").toLowerCase(),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
], captainController.loginCaptain);

router.get("/profile", authCaptain, captainController.getCaptainProfile);

router.get("/logout", authCaptain, captainController.logoutCaptain);

module.exports = router;