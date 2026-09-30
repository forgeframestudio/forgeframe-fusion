import assert from "node:assert/strict";
import test from "node:test";
import { inferServiceCategory, recommendQuote } from "../src/revenue-operator.js";

test("infers common revenue services from ordinary customer language", () => {
  assert.equal(inferServiceCategory("Can you build my pressure washing website?"), "website");
  assert.equal(inferServiceCategory("I need a flyer for my detailing business"), "quick_creative");
  assert.equal(inferServiceCategory("Make me an Instagram content pack"), "social_content");
});

test("quote recommendation protects a floor and deposit", () => {
  const quote = recommendQuote({ request: "Build a website for my business", complexity: "standard" });
  assert.equal(quote.category, "website");
  assert.equal(quote.quoteUsd, 750);
  assert.equal(quote.floorUsd, 500);
  assert.equal(quote.depositUsd, 375);
  assert.deepEqual(quote.closeRangeUsd, [650, 750]);
});

test("rush and complexity increase quote without silently lowering floor", () => {
  const quote = recommendQuote({ request: "Need a complex brand kit tomorrow", category: "brand_starter", complexity: "complex", rush: true });
  assert.equal(quote.quoteUsd, 675);
  assert.equal(quote.floorUsd, 375);
  assert.match(quote.turnaround, /rush/i);
});
