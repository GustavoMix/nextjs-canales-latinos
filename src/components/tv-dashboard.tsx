"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchJson } from "@/lib/data";
import { filterChannels } from "@/lib/filter";
import { selectInitialChannel, webChannels } from "@/lib/channels";
import type { Channel, CountriesFeed, CountryFeed, CountryIndexEntry } from "@/lib/types";
import { HlsPlayer } from "./hls-player";

function flagEmoji(code: string) {
  return code
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

function formatDate(value: string) {
  if (!value) return "Sin fecha";
  try {
    return new Intl.DateTimeFormat("es", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
  } catch {
    return value;
  }
}

function Logo({ channel }: { channel: Channel }) {
  const [failed, setFailed] = useState(false);
  const initials = channel.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  if (!channel.logo || failed) {
    return <div className="channel-logo fallback">{initials || "TV"}</div>;
  }

  return (
    <div className="channel-logo">
      <img src={channel.logo} alt="" onError={() => setFailed(true)} />
    </div>
  );
}

function ChannelRow({ channel, active, onSelect }: { channel: Channel; active: boolean; onSelect: () => void }) {
  return (
    <button
      type="button"
      className={`channel-row ${active ? "active" : ""}`}
      onClick={onSelect}
      aria-pressed={active}
    >
      <Logo channel={channel} />
      <span className="channel-row-copy">
        <strong>{channel.name}</strong>
        <small>{channel.category || "General"}</small>
      </span>
      <span className="channel-row-status">
        {active ? <i className="playing-bars"><b /><b /><b /></i> : <i className="online-dot" />}
        <small>{active ? "Viendo" : channel.latency_ms != null ? `${channel.latency_ms} ms` : "Online"}</small>
      </span>
    </button>
  );
}

export function TvDashboard() {
  const [countries, setCountries] = useState<CountryIndexEntry[]>([]);
  const [selectedCode, setSelectedCode] = useState("");
  const [countryFeed, setCountryFeed] = useState<CountryFeed | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null);
  const [loadingIndex, setLoadingIndex] = useState(true);
  const [loadingCountry, setLoadingCountry] = useState(false);
  const [indexError, setIndexError] = useState("");
  const [countryError, setCountryError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const loadIndex = useCallback(async () => {
    setLoadingIndex(true);
    setIndexError("");
    try {
      const payload = await fetchJson<CountriesFeed>("countries.json");
      setCountries(payload.countries);
      setSelectedCode((current) => {
        if (current && payload.countries.some((item) => item.code === current)) return current;
        return (payload.countries.find((item) => item.code === "BO") || payload.countries[0])?.code || "";
      });
    } catch (error) {
      setIndexError(error instanceof Error ? error.message : "No se pudo cargar el índice de países.");
    } finally {
      setLoadingIndex(false);
    }
  }, []);

  useEffect(() => {
    void loadIndex();
  }, [loadIndex, refreshKey]);

  useEffect(() => {
    if (!selectedCode) return;

    const selected = countries.find((item) => item.code === selectedCode);
    const controller = new AbortController();
    setLoadingCountry(true);
    setCountryError("");
    setCountryFeed(null);
    setSelectedChannelId(null);
    setQuery("");
    setCategory("Todos");

    void fetchJson<CountryFeed>(selected?.path || `${selectedCode.toLowerCase()}.json`, controller.signal)
      .then(setCountryFeed)
      .catch((error) => {
        if (controller.signal.aborted) return;
        setCountryError(error instanceof Error ? error.message : "No se pudieron cargar los canales.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoadingCountry(false);
      });

    return () => controller.abort();
  }, [countries, selectedCode, refreshKey]);

  const allChannels = countryFeed?.channels ?? [];
  const compatibleChannels = useMemo(() => webChannels(allChannels), [allChannels]);

  useEffect(() => {
    const next = selectInitialChannel(compatibleChannels, selectedChannelId);
    setSelectedChannelId(next?.id ?? null);
  }, [compatibleChannels, selectedChannelId]);

  const selectedChannel = useMemo(
    () => compatibleChannels.find((channel) => channel.id === selectedChannelId) ?? null,
    [compatibleChannels, selectedChannelId],
  );

  const categories = useMemo(() => {
    const values = new Set(compatibleChannels.map((channel) => channel.category || "General"));
    return ["Todos", ...Array.from(values).sort((a, b) => a.localeCompare(b, "es"))];
  }, [compatibleChannels]);

  const visibleChannels = useMemo(
    () => filterChannels(compatibleChannels, query, category),
    [compatibleChannels, query, category],
  );

  const selectedCountry = countries.find((item) => item.code === selectedCode);
  const hiddenCount = Math.max(0, allChannels.length - compatibleChannels.length);

  return (
    <main className="tv-app" id="top">
      <header className="topbar">
        <div className="topbar-inner">
          <a className="brand" href="#top" aria-label="TV Latino inicio">
            <span className="brand-mark"><i />▶</span>
            <span><strong>TV Latino</strong><small>Señales en vivo verificadas</small></span>
          </a>

          <div className="top-controls">
            <label className="country-select-wrap" aria-label="Seleccionar país">
              <span>{selectedCode ? flagEmoji(selectedCode) : "🌎"}</span>
              <select
                value={selectedCode}
                onChange={(event) => setSelectedCode(event.target.value)}
                disabled={loadingIndex || countries.length === 0}
              >
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>{country.name}</option>
                ))}
              </select>
              <b>⌄</b>
            </label>
            <button type="button" className="refresh-button" onClick={() => setRefreshKey((value) => value + 1)}>
              ↻ <span>Actualizar</span>
            </button>
          </div>
        </div>
      </header>

      {indexError ? (
        <section className="global-error">
          <strong>No pude cargar countries.json</strong>
          <span>{indexError}</span>
          <button type="button" onClick={() => void loadIndex()}>Reintentar</button>
        </section>
      ) : null}

      <div className="tv-workspace">
        <aside className="channel-browser">
          <div className="browser-head">
            <div>
              <span className="eyebrow">{selectedCode || "TV"} · CANALES</span>
              <h1>{selectedCountry?.name || "Televisión"}</h1>
            </div>
            <span className="online-count"><i /> {compatibleChannels.length} online</span>
          </div>

          <label className="search-box">
            <span>⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar canal…"
            />
            {query ? <button type="button" onClick={() => setQuery("")} aria-label="Limpiar búsqueda">×</button> : null}
          </label>

          <div className="category-chips" aria-label="Categorías">
            {categories.map((item) => (
              <button
                type="button"
                key={item}
                className={item === category ? "active" : ""}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="list-summary">
            <span>{visibleChannels.length} disponibles</span>
            {hiddenCount > 0 ? <small>{hiddenCount} incompatibles ocultos</small> : null}
          </div>

          <div className="channel-list">
            {loadingCountry ? Array.from({ length: 8 }, (_, index) => (
              <div className="channel-row skeleton-row" key={index} />
            )) : null}

            {!loadingCountry && countryError ? (
              <div className="list-message error">
                <strong>No se pudieron cargar los canales.</strong>
                <span>{countryError}</span>
                <button type="button" onClick={() => setRefreshKey((value) => value + 1)}>Reintentar</button>
              </div>
            ) : null}

            {!loadingCountry && !countryError ? visibleChannels.map((channel) => (
              <ChannelRow
                key={`${channel.id}-${channel.stream}`}
                channel={channel}
                active={channel.id === selectedChannelId}
                onSelect={() => setSelectedChannelId(channel.id)}
              />
            )) : null}

            {!loadingCountry && !countryError && compatibleChannels.length === 0 ? (
              <div className="list-message">
                <strong>Sin señales web disponibles</strong>
                <span>El cron no publicó canales compatibles con navegador para este país.</span>
              </div>
            ) : null}

            {!loadingCountry && !countryError && compatibleChannels.length > 0 && visibleChannels.length === 0 ? (
              <div className="list-message">
                <strong>No encontré coincidencias</strong>
                <span>Prueba otra búsqueda o cambia la categoría.</span>
              </div>
            ) : null}
          </div>
        </aside>

        <section className="watch-stage">
          <div className="stage-card">
            <HlsPlayer channel={selectedChannel} />

            <div className="now-playing">
              <div className="now-playing-main">
                {selectedChannel ? <Logo channel={selectedChannel} /> : <div className="channel-logo fallback">TV</div>}
                <div>
                  <span className="eyebrow"><i className="live-pulse" /> AHORA EN VIVO</span>
                  <h2>{selectedChannel?.name || "Esperando señal"}</h2>
                  <p>{selectedChannel ? `${selectedChannel.category || "General"} · ${selectedCountry?.name || ""}` : "Selecciona un canal compatible."}</p>
                </div>
              </div>

              {selectedChannel ? (
                <div className="signal-metrics">
                  <span><small>Estabilidad</small><strong>{Math.round((selectedChannel.stability?.success_rate ?? 0) * 100)}%</strong></span>
                  <span><small>Respuesta</small><strong>{selectedChannel.latency_ms != null ? `${selectedChannel.latency_ms} ms` : "—"}</strong></span>
                  <span><small>Señal</small><strong>HLS</strong></span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="stage-footer">
            <div>
              <span className="status-dot" />
              <span>{countryFeed ? `Lista actualizada ${formatDate(countryFeed.generated_at)}` : "Cargando señales verificadas…"}</span>
            </div>
            <small>Solo se muestran señales confirmadas para navegador.</small>
          </div>
        </section>
      </div>
    </main>
  );
}
