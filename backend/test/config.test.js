process.env.JWT_SECRET = "test-secret";

const test = require("node:test");
const assert = require("node:assert/strict");
const constants = require("../config/constants");

test("constants expose the access token lifecycle", () => {
  assert.equal(constants.JWT_EXPIRES_IN, "24h");
  assert.equal(constants.ACCESS_TOKEN_TTL_MS, 24 * 60 * 60 * 1000);
});

test("rate limits are tuned and emit standard headers", () => {
  assert.ok(constants.RATE_LIMIT.windowMs > 0);
  assert.ok(constants.RATE_LIMIT.max > 0);
  assert.equal(constants.RATE_LIMIT.standardHeaders, true);
  assert.equal(constants.RATE_LIMIT.legacyHeaders, false);
  assert.ok(constants.AUTH_RATE_LIMIT.max < constants.RATE_LIMIT.max);
  assert.equal(constants.AUTH_RATE_LIMIT.standardHeaders, true);
});

test("cors origins are parsed from env", () => {
  assert.ok(Array.isArray(constants.CORS_ORIGINS));
  assert.equal(constants.TRUST_PROXY, process.env.TRUST_PROXY === "true");
});