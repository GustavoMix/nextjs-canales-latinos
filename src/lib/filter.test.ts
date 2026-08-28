import test from "node:test";
import assert from "node:assert/strict";
import { filterChannels } from "./filter.ts";
import type { Channel } from "./types.ts";

const channels: Channel[] = [
  {
    id: "uno",
    name: "Señal Música",
    logo: "",
    category: "Música",
    stream: "https://example.test/uno.m3u8",
    alternates: [],
    status: "stable",
    stability: { success_rate: 1, consecutive_successes: 2 },
    latency_ms: 500,
    sources: ["fuente_uno"],
    android_playable: true,
    https: true,
    cors: "allowed",
    web_playable: true,
    last_checked: "2026-08-28T12:00:00Z",
  },
  {
    id: "dos",
    name: "Noticias 24",
    logo: "",
    category: "Noticias",
    stream: "https://example.test/dos.m3u8",
    alternates: [],
    status: "stable",
    stability: { success_rate: 1, consecutive_successes: 2 },
    latency_ms: 600,
    sources: ["iptv_org"],
    android_playable: true,
    https: true,
    cors: "unknown",
    web_playable: null,
    last_checked: "2026-08-28T12:00:00Z",
  },
];

test("busca sin distinguir acentos ni mayúsculas", () => {
  assert.deepEqual(filterChannels(channels, "senal musica", "Todos").map((c) => c.id), ["uno"]);
});

test("filtra por categoría y también busca fuentes", () => {
  assert.deepEqual(filterChannels(channels, "", "Noticias").map((c) => c.id), ["dos"]);
  assert.deepEqual(filterChannels(channels, "iptv", "Todos").map((c) => c.id), ["dos"]);
});
