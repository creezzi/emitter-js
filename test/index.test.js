import { test } from "node:test";
import assert from "node:assert/strict";
import { Emitter } from "../src/index.js";

test("on/emit passes arguments in subscription order", () => {
  const e = new Emitter();
  const seen = [];
  e.on("x", (a, b) => seen.push(["first", a, b]));
  e.on("x", (a) => seen.push(["second", a]));
  assert.equal(e.emit("x", 1, 2), true);
  assert.deepEqual(seen, [["first", 1, 2], ["second", 1]]);
});

test("emit returns false when nobody listens", () => {
  assert.equal(new Emitter().emit("nothing"), false);
});

test("on returns an unsubscribe function", () => {
  const e = new Emitter();
  let n = 0;
  const off = e.on("x", () => n++);
  e.emit("x");
  off();
  e.emit("x");
  assert.equal(n, 1);
  assert.equal(e.listenerCount("x"), 0);
});

test("once fires a single time and can be removed by the original function", () => {
  const e = new Emitter();
  let n = 0;
  const fn = () => n++;
  e.once("x", fn);
  e.emit("x");
  e.emit("x");
  assert.equal(n, 1);
  e.once("y", fn);
  assert.equal(e.off("y", fn), true);
  e.emit("y");
  assert.equal(n, 1);
});

test("listeners added during emit wait for the next emit", () => {
  const e = new Emitter();
  const seen = [];
  e.on("x", () => {
    seen.push("a");
    e.on("x", () => seen.push("late"));
  });
  e.emit("x");
  assert.deepEqual(seen, ["a"]);
});

test("removeAll and validation", () => {
  const e = new Emitter();
  e.on("a", () => {});
  e.on("b", () => {});
  e.removeAll("a");
  assert.equal(e.listenerCount("a"), 0);
  assert.equal(e.listenerCount("b"), 1);
  e.removeAll();
  assert.equal(e.listenerCount("b"), 0);
  assert.throws(() => e.on("a", "nope"), TypeError);
});
