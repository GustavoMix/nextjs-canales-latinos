import test from "node:test";
import assert from "node:assert/strict";
import { selectInitialChannel, webChannels } from "./channels.ts";
import type { Channel } from "./types.ts";

function channel(id: string, webPlayable: boolean | null, latency = 500): Channel {
  return {
    id,
    name: `Canal ${id}`,
    logo: "",
    category: "General",
    stream: `https://example.test/${id}.m3u8`,
    alternates: [],
    status: "stable",
    stability: { success_rate: 1, consecutive_successes: 2 },
    latency_ms: latency,
    sources: ["test"],
    android_playable: true,
    https: true,
    cors: webPlayable === true ? "allowed" : webPlayable === false ? "blocked" : "unknown",
    web_playable: webPlayable,
    last_checked: "2026-08-28T12:00:00Z",
  };
}

test("webChannels publica únicamente canales confirmados para web", () => {
  const input = [channel("app", false), channel("unknown", null), channel("web", true)];
  assert.deepEqual(webChannels(input).map((item) => item.id), ["web"]);
});

test("selectInitialChannel conserva la selección si sigue disponible", () => {
  const one = channel("uno", true);
  const two = channel("dos", true);
  assert.equal(selectInitialChannel([one, two], "dos")?.id, "dos");
});

test("selectInitialChannel elige automáticamente el primer canal web disponible", () => {
  const one = channel("uno", true);
  const two = channel("dos", true);
  assert.equal(selectInitialChannel([one, two], "inexistente")?.id, "uno");
  assert.equal(selectInitialChannel([], null), null);
});
