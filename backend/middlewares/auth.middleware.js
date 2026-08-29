const userModel = require('../models/user.model');
const captainModel = require('../models/captain.model');
const blackListTokenModel = require('../models/blacklistToken.model');
const jwt = require('jsonwebtoken');

module.exports.authUser = async (req, res, next) => {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized.' });
    }

    const isBlackListed = await blackListTokenModel.findOne({ token });
    if (isBlackListed) {
        return res.status(401).json({ message: 'Unauthorized.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized.' });
        }
        req.user = user;
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized.' });
    }
};

module.exports.authCaptain = async (req, res, next) => {
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized.' });
    }

    const isBlackListed = await blackListTokenModel.findOne({ token });
    if (isBlackListed) {
        return res.status(401).json({ message: 'Unauthorized.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const captain = await captainModel.findById(decoded._id);
        if (!captain) {
            return res.status(401).json({ message: 'Unauthorized.' });
        }
        req.captain = captain;
        return next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized.' });
    }
};