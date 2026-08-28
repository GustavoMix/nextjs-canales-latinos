const DEFAULT_DATA_BASE = "/data";
const DEFAULT_CRON_REPO = "channelwatch-cron";

type DataBaseOptions = {
  explicitBase?: string;
  basePath?: string;
  hostname?: string;
  origin?: string;
};

function trimTrailingSlashes(value: string): string {
  return value.replace(/\/+$/, "");
}

export function resolveDataBase(options: DataBaseOptions = {}): string {
  const explicitBase = options.explicitBase ?? process.env.NEXT_PUBLIC_CHANNELWATCH_DATA_URL ?? "";
  if (explicitBase.trim()) {
    return trimTrailingSlashes(explicitBase.trim());
  }

  let hostname = options.hostname;
  let origin = options.origin;
  if ((!hostname || !origin) && typeof window !== "undefined") {
    hostname ??= window.location.hostname;
    origin ??= window.location.origin;
  }

  if (hostname?.endsWith(".github.io") && origin) {
    return `${trimTrailingSlashes(origin)}/${DEFAULT_CRON_REPO}/data`;
  }

  const basePath = trimTrailingSlashes(options.basePath ?? process.env.NEXT_PUBLIC_BASE_PATH ?? "");
  return `${basePath}${DEFAULT_DATA_BASE}` || DEFAULT_DATA_BASE;
}

export function dataUrl(path: string, base?: string): string {
  const cleanBase = trimTrailingSlashes(base ?? resolveDataBase());
  const cleanPath = path.replace(/^\/+/, "");
  return `${cleanBase}/${cleanPath}`;
}

export async function fetchJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(dataUrl(path), { cache: "no-store", signal });
  if (!response.ok) {
    throw new Error(`No se pudo cargar ${path} (HTTP ${response.status})`);
  }
  return response.json() as Promise<T>;
}
