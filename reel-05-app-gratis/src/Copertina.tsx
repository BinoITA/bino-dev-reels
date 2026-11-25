// © 2026 BinoITA (bino.dev, @bino.devs) — CC BY 4.0: se lo riusi, cita "@bino.devs — github.com/BinoITA/bino-dev-reels"
// Copertina del reel 05 per la griglia del profilo: tutto tra y 240 e 1680, così resta nel ritaglio 3:4.
import React from "react";
import { AbsoluteFill } from "remotion";
import { TreApp } from "./Reel05";
import { fontCodice, fontTitolo, T } from "./stile";

export const Copertina: React.FC = () => (
  <AbsoluteFill style={{ background: T.sfondo }}>
    <div style={{ position: "absolute", top: 300, left: 60 }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 14,
          fontFamily: fontCodice,
          fontWeight: 700,
          fontSize: 30,
          letterSpacing: 2,
          padding: "12px 22px",
          borderRadius: 999,
          border: `3px solid ${T.bordo}`,
          background: T.giallo,
          boxShadow: `5px 5px 0 ${T.bordo}`,
        }}
      >
        <span style={{ width: 14, height: 14, borderRadius: 7, background: T.accento, border: `2px solid ${T.bordo}` }} />
        APP GRATIS · #05
      </div>
    </div>
    <div
      style={{
        position: "absolute",
        top: 400,
        left: 60,
        right: 60,
        fontFamily: fontTitolo,
        fontWeight: 700,
        fontSize: 120,
        lineHeight: 1,
        letterSpacing: -5,
        color: T.testo,
      }}
    >
      3 app che paghi.
      <br />
      <span
        style={{
          background: `linear-gradient(transparent 10%, ${T.accento} 10%, ${T.accento} 90%, transparent 90%)`,
          padding: "0 14px",
          margin: "0 -8px",
        }}
      >
        Gratis.
      </span>
    </div>
    <TreApp vf={200} gratis={0} top={760} />
    <div style={{ position: "absolute", left: 0, right: 0, top: 1370, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          fontFamily: fontTitolo,
          fontWeight: 700,
          fontSize: 60,
          padding: "14px 32px",
          borderRadius: 20,
          background: T.giallo,
          border: `4px solid ${T.bordo}`,
          boxShadow: `7px 7px 0 ${T.bordo}`,
          rotate: "-3deg",
        }}
      >
        Rifatte con Claude
      </div>
    </div>
  </AbsoluteFill>
);
