const { ACCESS_TOKEN_TTL_MS } = require("./constants");

const isProduction = () => process.env.NODE_ENV === "production";

const cookieOptions = () => ({
  httpOnly: true,
  secure: isProduction(),
  sameSite: isProduction() ? "none" : "lax",
  maxAge: ACCESS_TOKEN_TTL_MS,
});

module.exports.clearCookieOptions = () => {
  const { maxAge, ...rest } = cookieOptions();
  return rest;
};

module.exports.cookieOptions = cookieOptions;