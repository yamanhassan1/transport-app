const jwt = require('jsonwebtoken');
const blackListTokenModel = require('../models/blacklistToken.model');
const { JWT_SECRET } = require('../config/constants');

const getToken = (req) =>
  req.cookies?.token || req.headers.authorization?.split(' ')[1];

const authenticate = async (req, res, next, {
  idField,
  roleField,
  expectedRole,
}) => {
  const token = getToken(req);
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  const isBlackListed = await blackListTokenModel.findOne({ token });
  if (isBlackListed) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (expectedRole && decoded.role !== expectedRole) {
      return res.status(401).json({ message: 'Unauthorized.' });
    }
    req[idField] = decoded._id;
    req[roleField] = decoded.role;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }
};

module.exports.authUser = (req, res, next) =>
  authenticate(req, res, next, {
    idField: 'userId',
    roleField: 'userRole',
    expectedRole: 'user',
  });

module.exports.authCaptain = (req, res, next) =>
  authenticate(req, res, next, {
    idField: 'captainId',
    roleField: 'captainRole',
    expectedRole: 'captain',
  });
