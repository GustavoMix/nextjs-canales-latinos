import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");

function read(relative: string): string {
  return readFileSync(resolve(root, relative), "utf8");
}

test("Next se exporta estaticamente con basePath de GitHub", () => {
  const text = read("next.config.ts");
  assert.match(text, /output:\s*["']export["']/);
  assert.match(text, /GITHUB_REPOSITORY/);
  assert.match(text, /basePath/);
  assert.doesNotMatch(text, /assetPrefix/);
});

test("workflow de la web prueba, construye out y despliega Pages", () => {
  const text = read(".github/workflows/deploy-pages.yml");
  assert.match(text, /npm test/);
  assert.match(text, /npm run build/);
  assert.match(text, /NEXT_PUBLIC_BASE_PATH/);
  assert.match(text, /path:\s*out/);
  assert.match(text, /actions\/deploy-pages@v4/);
});
