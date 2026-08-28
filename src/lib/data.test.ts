import test from "node:test";
import assert from "node:assert/strict";
import { dataUrl, resolveDataBase } from "./data.ts";

test("dataUrl construye rutas locales sin barras duplicadas", () => {
  assert.equal(dataUrl("countries.json", "/data/"), "/data/countries.json");
  assert.equal(dataUrl("/bo.json", "/data"), "/data/bo.json");
});

test("dataUrl funciona con una URL remota", () => {
  assert.equal(
    dataUrl("/ar.json", "https://ejemplo.github.io/channelwatch/data/"),
    "https://ejemplo.github.io/channelwatch/data/ar.json",
  );
});

test("GitHub Pages descubre automaticamente el repo channelwatch-cron del mismo usuario", () => {
  assert.equal(
    resolveDataBase({ hostname: "grover.github.io", origin: "https://grover.github.io" }),
    "https://grover.github.io/channelwatch-cron/data",
  );
});

test("fuera de GitHub Pages usa datos locales respetando el base path", () => {
  assert.equal(
    resolveDataBase({ hostname: "localhost", origin: "http://localhost:3000", basePath: "/tv-latino-web" }),
    "/tv-latino-web/data",
  );
});

test("una URL explicita tiene prioridad sobre la deteccion automatica", () => {
  assert.equal(
    resolveDataBase({
      explicitBase: "https://datos.example/feed/",
      hostname: "grover.github.io",
      origin: "https://grover.github.io",
      basePath: "/tv-latino-web",
    }),
    "https://datos.example/feed",
  );
});
