process.env.JWT_SECRET = "test-secret";
process.env.NODE_ENV = "test";

const test = require("node:test");
const assert = require("node:assert/strict");
const { cookieOptions, clearCookieOptions } = require("../config/cookies");

test("cookieOptions are httpOnly and expire with the token ttl", () => {
  const options = cookieOptions();
  assert.equal(options.httpOnly, true);
  assert.equal(options.maxAge, 24 * 60 * 60 * 1000);
  assert.equal(typeof options.sameSite, "string");
  assert.equal(typeof options.secure, "boolean");
});

test("clearCookieOptions drop the maxAge field", () => {
  const options = clearCookieOptions();
  assert.equal("maxAge" in options, false);
  assert.equal(options.httpOnly, true);
});