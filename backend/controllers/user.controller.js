const userModel = require("../models/user.model");
const userService = require("../services/user.service");
const { validationResult } = require("express-validator");
const blackListTokenModel = require("../models/blacklistToken.model");
const { cookieOptions, clearCookieOptions } = require("../config/cookies");

module.exports.registerUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, phone, password } = req.body;

  try {
    const exists = await userService.isUserExists({ email, phone });
    if (exists.exists) {
      const message =
        exists.field === "email"
          ? "An account with this email already exists"
          : "An account with this phone number already exists";
      return res.status(409).json({ message });
    }

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
      firstName: fullname.firstName,
      lastName: fullname.lastName,
      email,
      phone,
      password: hashedPassword,
    });

    const token = user.generateAuthToken();

    res.cookie("token", token, cookieOptions());

    user.password = undefined;

    res.status(201).json({ token, user });
  } catch (err) {
    next(err);
  }
};

module.exports.loginUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, phone, password } = req.body;

    const query = phone ? { phone } : { email: email.toLowerCase() };
    const user = await userModel.findOne(query).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = user.generateAuthToken();

    res.cookie("token", token, cookieOptions());

    user.password = undefined;

    res.status(200).json({ token, user });
  } catch (err) {
    next(err);
  }
};

module.exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

module.exports.logoutUser = async (req, res, next) => {
  try {
    res.clearCookie("token", clearCookieOptions());
    const token =
      req.cookies.token || req.headers.authorization?.split(" ")[1];

    await blackListTokenModel.create({ token });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};
