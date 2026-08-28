import type { Channel } from "./types.ts";

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es")
    .trim();
}

export function filterChannels(channels: Channel[], query: string, category: string): Channel[] {
  const q = normalize(query);
  const categoryKey = normalize(category);
  return channels.filter((channel) => {
    const categoryMatches = categoryKey === "" || categoryKey === "todos" || normalize(channel.category || "Sin categoría") === categoryKey;
    if (!categoryMatches) return false;
    if (!q) return true;

    const haystack = normalize([
      channel.name,
      channel.category,
      channel.id,
      ...channel.sources,
    ].join(" "));
    return haystack.includes(q);
  });
}
