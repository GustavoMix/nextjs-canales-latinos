import test from "node:test";
import assert from "node:assert/strict";
import { canAttemptWebPlayback } from "./playback.ts";

test("bloquea únicamente streams marcados explícitamente como incompatibles con web", () => {
  assert.equal(canAttemptWebPlayback(false), false);
  assert.equal(canAttemptWebPlayback(true), true);
  assert.equal(canAttemptWebPlayback(null), true);
});
