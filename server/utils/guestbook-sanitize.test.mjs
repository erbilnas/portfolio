import assert from "node:assert/strict";
import { test } from "node:test";
import {
  NAME_MAX,
  NOTE_MAX,
  createRateLimiter,
  isHoneypotFilled,
  sanitizeField,
  stripTags,
} from "./guestbook-sanitize.mjs";

test("stripTags removes markup", () => {
  assert.equal(stripTags('<a href="x">hi</a>'), "hi");
});

test("sanitizeField trims, collapses space, and caps length", () => {
  assert.equal(sanitizeField("  hello   world  ", 20), "hello world");
  assert.equal(sanitizeField("a".repeat(NAME_MAX + 10), NAME_MAX).length, NAME_MAX);
  assert.equal(sanitizeField("<b>note</b>", NOTE_MAX), "note");
});

test("honeypot treats any filled website as bot", () => {
  assert.equal(isHoneypotFilled(""), false);
  assert.equal(isHoneypotFilled(" https://spam "), true);
});

test("rate limiter allows one hit per window", () => {
  const limiter = createRateLimiter(60_000);
  assert.equal(limiter.allow("1.1.1.1"), true);
  assert.equal(limiter.allow("1.1.1.1"), false);
  assert.equal(limiter.allow("2.2.2.2"), true);
});
