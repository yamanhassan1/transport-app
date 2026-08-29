const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set. Add it to backend/.env");
}

const JWT_EXPIRES_IN = "24h";
const ACCESS_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

const CORS_ORIGINS = (process.env.CORS_ORIGINS || "").split(",").filter(Boolean);

const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000,
  max: 100,
};

const AUTH_RATE_LIMIT = {
  windowMs: 15 * 60 * 1000,
  max: 10,
};

module.exports = {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  ACCESS_TOKEN_TTL_MS,
  CORS_ORIGINS,
  RATE_LIMIT,
  AUTH_RATE_LIMIT,
};
