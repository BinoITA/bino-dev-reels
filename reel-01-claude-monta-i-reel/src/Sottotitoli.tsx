// Sottotitoli parola per parola, stile reel: la parola detta in quel momento si accende in verde.
// I tempi vengono da tempi.json (generato da strumenti/voce-narratore/tempi.py), quindi qui
// non sono modificabili dal Caption editor di Studio: per cambiarli si rigenera il JSON.
import { createTikTokStyleCaptions, type Caption } from "@remotion/captions";
import React, { useMemo } from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colori, fontTitolo } from "./stile";

export const Sottotitoli: React.FC<{ readonly captions: Caption[] }> = ({ captions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { pages } = useMemo(
    () =>
      createTikTokStyleCaptions({
        captions,
        combineTokensWithinMilliseconds: 900,
        breakOnSilenceAfterMilliseconds: 280,
      }),
    [captions],
  );

  const ms = (frame / fps) * 1000;
  const indice = pages.findIndex((p, i) => {
    const fine = Math.min(p.startMs + p.durationMs, pages[i + 1]?.startMs ?? Infinity);
    return ms >= p.startMs && ms < fine;
  });
  if (indice === -1) return null;
  const pagina = pages[indice];
  const ultimo = pagina.tokens[pagina.tokens.length - 1];
  if (ms > ultimo.toMs + 400) return null;

  const pop = spring({ frame: frame - Math.round((pagina.startMs / 1000) * fps), fps, config: { damping: 14 } });

  return (
    <div
      style={{
        position: "absolute",
        // margini di 120 px: il testo resta lontano dalla colonna dei pulsanti di Instagram
        left: 120,
        right: 120,
        top: 1310,
        display: "flex",
        justifyContent: "center",
        textAlign: "center",
        scale: String(0.85 + 0.15 * pop),
      }}
    >
      <div
        style={{
          fontFamily: fontTitolo,
          fontWeight: 700,
          fontSize: 76,
          lineHeight: 1.15,
          color: colori.testo,
          WebkitTextStroke: `14px ${colori.sfondo}`,
          paintOrder: "stroke fill",
          textShadow: "0 6px 24px rgba(0,0,0,0.6)",
        }}
      >
        {pagina.tokens.map((t, i) => {
          const attiva = ms >= t.fromMs && ms < t.toMs + 60;
          return (
            <span key={i} style={{ color: attiva ? colori.accento : colori.testo, whiteSpace: "pre-wrap" }}>
              {t.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};
