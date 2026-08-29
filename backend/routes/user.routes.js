const express = require("express");
const { body } = require("express-validator");
const userController = require('../controllers/user.controller');
const { authUser } = require('../middlewares/auth.middleware');
const { authLimiter } = require('../middlewares/rateLimit.middleware');

const router = express.Router();

router.post("/register", authLimiter, [
  body("fullname.firstName")
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("First name must be between 3 and 50 characters long"),
  body("fullname.lastName")
    .optional()
    .isLength({ min: 3, max: 50 })
    .withMessage("Last name must be between 3 and 50 characters long"),
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
], userController.registerUser);

router.post("/login", authLimiter, [
  body("email").isEmail().withMessage("Invalid Email").toLowerCase(),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
], userController.loginUser);

router.get("/profile", authUser, userController.getUserProfile);

router.get("/logout", authUser, userController.logoutUser);

module.exports = router;