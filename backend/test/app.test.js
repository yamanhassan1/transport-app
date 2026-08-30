process.env.JWT_SECRET = "test-secret";
process.env.NODE_ENV = "test";

const test = require("node:test");
const assert = require("node:assert/strict");

let app;

test("app module loads as an express app without connecting to mongodb", () => {
  app = require("../app");
  assert.equal(typeof app, "function");
  assert.equal(typeof app.use, "function");
  assert.equal(typeof app.listen, "function");
});

test("rate-limit middleware exports reusable limiters", async () => {
  const { generalLimiter, authLimiter } = require("../middlewares/rateLimit.middleware");
  assert.equal(typeof generalLimiter, "function");
  assert.equal(typeof authLimiter, "function");
});