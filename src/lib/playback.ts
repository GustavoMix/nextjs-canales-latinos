import type { WebPlayable } from "./types.ts";

export function canAttemptWebPlayback(value: WebPlayable): boolean {
  return value !== false;
}
