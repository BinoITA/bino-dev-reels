// © 2026 BinoITA (bino.dev, @bino.devs) — CC BY 4.0: se lo riusi, cita "@bino.devs — github.com/BinoITA/bino-dev-reels"
// Copertina del reel 06 per la griglia del profilo: tutto tra y 240 e 1680, così resta nel ritaglio 3:4.
import React from "react";
import { AbsoluteFill } from "remotion";
import { Adesivo, Chip, Evid, Segnalino, Trattoria } from "./Reel06";
import { fontTitolo, T } from "./stile";

export const Copertina: React.FC = () => (
  <AbsoluteFill style={{ background: T.sfondo }}>
    <Chip />
    <div
      style={{
        position: "absolute",
        top: 340,
        left: 60,
        right: 60,
        fontFamily: fontTitolo,
        fontWeight: 700,
        fontSize: 104,
        lineHeight: 1,
        letterSpacing: -5,
        color: T.testo,
      }}
    >
      Un ordine <Evid colore={T.accento}>nascosto</Evid> per la tua AI
    </div>
    <div style={{ position: "absolute", inset: 0, translate: "0px 10px" }}>
      <Trattoria selezione={0} apertura={0} />
      <Segnalino vf={60} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 1400, display: "flex", justifyContent: "center" }}>
      <Adesivo colore={T.giallo} style={{ fontSize: 58, rotate: "-3deg" }}>
        Pagina-trappola gratis
      </Adesivo>
    </div>
  </AbsoluteFill>
);
