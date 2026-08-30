const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not set. Add it to backend/.env");
}

const JWT_EXPIRES_IN = "24h";
const ACCESS_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

const CORS_ORIGINS = (process.env.CORS_ORIGINS || "").split(",").filter(Boolean);

const TRUST_PROXY = process.env.TRUST_PROXY === "true";

const RATE_LIMIT = {
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
};

const AUTH_RATE_LIMIT = {
  windowMs: Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.AUTH_RATE_LIMIT_MAX) || 10,
  standardHeaders: true,
  legacyHeaders: false,
};

module.exports = {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  ACCESS_TOKEN_TTL_MS,
  CORS_ORIGINS,
  TRUST_PROXY,
  RATE_LIMIT,
  AUTH_RATE_LIMIT,
};
