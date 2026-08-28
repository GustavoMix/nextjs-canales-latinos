export type WebPlayable = boolean | null;

export interface CountryIndexEntry {
  code: string;
  name: string;
  channels: number;
  generated_at: string;
  path: string;
}

export interface CountriesFeed {
  schema_version: number;
  generated_at: string;
  countries: CountryIndexEntry[];
}

export interface ChannelAlternate {
  stream: string;
  sources: string[];
  latency_ms: number | null;
  https: boolean;
  cors: "allowed" | "blocked" | "unknown";
  web_playable: WebPlayable;
}

export interface Channel {
  id: string;
  name: string;
  logo: string;
  category: string;
  stream: string;
  alternates: ChannelAlternate[];
  status: string;
  stability: {
    success_rate: number;
    consecutive_successes: number;
  };
  latency_ms: number | null;
  sources: string[];
  android_playable: boolean;
  https: boolean;
  cors: "allowed" | "blocked" | "unknown";
  web_playable: WebPlayable;
  last_checked: string;
}

export interface CountryFeed {
  schema_version: number;
  country: { code: string; name: string };
  generated_at: string;
  total_channels: number;
  channels: Channel[];
}
