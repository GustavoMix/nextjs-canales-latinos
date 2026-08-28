"use client";

import Hls from "hls.js";
import { useEffect, useRef, useState } from "react";
import type { Channel } from "@/lib/types";

type Props = {
  channel: Channel | null;
};

export function HlsPlayer({ channel }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !channel) return;

    setError("");
    setLoading(true);
    setMuted(true);
    video.muted = true;

    let hls: Hls | null = null;

    const tryPlay = () => {
      void video.play().catch(() => {
        // Autoplay muted is normally allowed. If the browser still blocks it,
        // native controls remain available for a manual start.
      });
    };

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = channel.stream;
      video.addEventListener("loadedmetadata", tryPlay, { once: true });
    } else if (Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 30,
        maxBufferLength: 20,
      });
      hls.loadSource(channel.stream);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, tryPlay);
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          setLoading(false);
          setError("Esta señal no pudo reproducirse ahora. Elige otro canal de la lista.");
        }
      });
    } else {
      setLoading(false);
      setError("Este navegador no soporta reproducción HLS.");
    }

    const onPlaying = () => setLoading(false);
    const onWaiting = () => setLoading(true);
    const onVideoError = () => {
      setLoading(false);
      setError("No se pudo iniciar esta señal. Puede haberse caído después de la última revisión.");
    };

    video.addEventListener("playing", onPlaying);
    video.addEventListener("waiting", onWaiting);
    video.addEventListener("error", onVideoError);

    return () => {
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("waiting", onWaiting);
      video.removeEventListener("error", onVideoError);
      hls?.destroy();
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [channel]);

  const enableSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    setMuted(false);
    void video.play().catch(() => undefined);
  };

  if (!channel) {
    return (
      <div className="player-empty">
        <span className="player-empty-icon">▶</span>
        <strong>Elige un canal</strong>
        <p>Cuando haya una señal compatible con web aparecerá aquí.</p>
      </div>
    );
  }

  return (
    <div className="player-wrap" key={channel.id}>
      <div className="video-shell">
        <video
          ref={videoRef}
          controls
          autoPlay
          muted={muted}
          playsInline
          crossOrigin="anonymous"
          aria-label={`Reproduciendo ${channel.name}`}
        />
        {loading && !error ? (
          <div className="video-loading" aria-live="polite">
            <span className="spinner" />
            <span>Conectando señal…</span>
          </div>
        ) : null}
        <div className="live-overlay"><i /> EN VIVO</div>
      </div>

      {error ? <div className="player-error">⚠ {error}</div> : null}

      <div className="sound-row">
        {muted ? (
          <button type="button" className="sound-button" onClick={enableSound}>
            <span>🔊</span> Activar sonido
          </button>
        ) : (
          <span className="sound-enabled">✓ Sonido activado</span>
        )}
        <span className="autoplay-note">Inicio automático en silencio</span>
      </div>
    </div>
  );
}
