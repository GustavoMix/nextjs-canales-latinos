import type { Channel } from "./types.ts";

export function webChannels(channels: Channel[]): Channel[] {
  return channels.filter((channel) => channel.web_playable === true);
}

export function selectInitialChannel(channels: Channel[], selectedId: string | null): Channel | null {
  if (selectedId) {
    const selected = channels.find((channel) => channel.id === selectedId);
    if (selected) return selected;
  }
  return channels[0] ?? null;
}
