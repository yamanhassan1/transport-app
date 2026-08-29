const CaptainModel = require("../models/captain.model");
const captainService = require("../services/captain.service");
const { validationResult } = require("express-validator");
const blackListTokenModel = require("../models/blacklistToken.model");
const { ACCESS_TOKEN_TTL_MS } = require("../config/constants");

module.exports.registerCaptain = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullname, email, phone, password, vehicle, license } = req.body;

  try {
    const exists = await captainService.isCaptainExists({
      email,
      phone,
      licenseNumber: license.number,
      plateNumber: vehicle.plateNumber,
    });
    if (exists.exists) {
      const messages = {
        email: "A captain with this email already exists",
        phone: "A captain with this phone number already exists",
        "license.number": "A captain with this license number already exists",
        "vehicle.plateNumber": "A captain with this vehicle plate number already exists",
      };
      return res.status(409).json({ message: messages[exists.field] });
    }

    const hashedPassword = await CaptainModel.hashPassword(password);

    const captain = await captainService.createCaptain({
      firstName: fullname.firstName,
      lastName: fullname.lastName,
      email,
      phone,
      password: hashedPassword,
      vehicle,
      license,
    });

    const token = captain.generateAuthToken();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: ACCESS_TOKEN_TTL_MS,
    });

    res.status(201).json({ token, captain });
  } catch (err) {
    next(err);
  }
};

module.exports.loginCaptain = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const captain = await CaptainModel
      .findOne({ email: email.toLowerCase() })
      .select("+password");

    if (!captain) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await captain.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = captain.generateAuthToken();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: ACCESS_TOKEN_TTL_MS,
    });

    captain.password = undefined;

    res.status(200).json({ token, captain });
  } catch (err) {
    next(err);
  }
};

module.exports.getCaptainProfile = async (req, res, next) => {
  try {
    const captain = await CaptainModel.findById(req.captainId);
    if (!captain) {
      return res.status(404).json({ message: "Captain not found" });
    }
    res.status(200).json(captain);
  } catch (err) {
    next(err);
  }
};

module.exports.logoutCaptain = async (req, res, next) => {
  try {
    res.clearCookie("token");
    const token =
      req.cookies.token || req.headers.authorization?.split(" ")[1];

    await blackListTokenModel.create({ token });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};
