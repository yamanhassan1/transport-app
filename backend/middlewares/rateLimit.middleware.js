const rateLimit = require("express-rate-limit");
const { RATE_LIMIT, AUTH_RATE_LIMIT } = require("../config/constants");

const generalLimiter = rateLimit(RATE_LIMIT);

const authLimiter = rateLimit(AUTH_RATE_LIMIT);

module.exports = { generalLimiter, authLimiter };
