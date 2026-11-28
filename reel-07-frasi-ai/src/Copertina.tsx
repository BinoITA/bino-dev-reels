// © 2026 BinoITA (bino.dev, @bino.devs) — CC BY 4.0: se lo riusi, cita "@bino.devs — github.com/BinoITA/bino-dev-reels"
// Copertina del reel #07: tutto tra y 240 e 1680, così resta nel ritaglio 3:4 della griglia.
import React from "react";
import { AbsoluteFill } from "remotion";
import { fontCodice, fontTitolo, T } from "./stile";

const CREMA = "#FFFDF7";

export const Copertina: React.FC = () => (
  <AbsoluteFill style={{ background: T.sfondo }}>
    <div
      style={{
        position: "absolute",
        top: 270,
        left: 60,
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
      L'AI TRADOTTA · #07
    </div>
    <div style={{ position: "absolute", top: 370, left: 60, right: 60, fontFamily: fontTitolo, fontWeight: 700, fontSize: 118, lineHeight: 1, letterSpacing: -5, color: T.testo }}>
      Le 5 frasi che ti dice{" "}
      <span style={{ background: `linear-gradient(176deg, transparent 14%, ${T.accento} 14%, ${T.accento} 90%, transparent 90%)`, padding: "0 12px", margin: "0 -6px" }}>
        l'AI
      </span>
    </div>
    {/* la bolla dell'AI */}
    <div
      style={{
        position: "absolute",
        left: 60,
        top: 820,
        maxWidth: 820,
        padding: "30px 40px",
        fontFamily: fontTitolo,
        fontWeight: 500,
        fontSize: 74,
        lineHeight: 1.1,
        letterSpacing: -1,
        background: "#FFF1B0",
        border: `4px solid ${T.bordo}`,
        borderRadius: "48px 48px 48px 14px",
        boxShadow: `14px 14px 0 ${T.bordo}, 0 30px 60px rgba(20,20,20,0.16)`,
      }}
    >
      Hai perfettamente ragione!
    </div>
    {/* la traduzione */}
    <div
      style={{
        position: "absolute",
        left: 130,
        top: 1150,
        width: 800,
        padding: "60px 40px 36px",
        background: CREMA,
        border: `4px solid ${T.bordo}`,
        borderRadius: 34,
        boxShadow: `14px 14px 0 ${T.bordo}`,
        rotate: "-1.5deg",
        fontFamily: fontTitolo,
        fontWeight: 700,
        fontSize: 66,
        lineHeight: 1.08,
        letterSpacing: -2,
      }}
    >
      <span style={{ background: `linear-gradient(176deg, transparent 14%, ${T.accento} 14%, ${T.accento} 90%, transparent 90%)`, padding: "0 10px", margin: "0 -6px", WebkitBoxDecorationBreak: "clone", boxDecorationBreak: "clone" }}>
        Così smetti di discutere.
      </span>
      <div
        style={{
          position: "absolute",
          left: 34,
          top: -30,
          fontFamily: fontCodice,
          fontWeight: 700,
          fontSize: 32,
          letterSpacing: 4,
          color: T.rosso,
          background: CREMA,
          border: `4px solid ${T.rosso}`,
          borderRadius: 10,
          padding: "6px 16px",
          rotate: "-5deg",
        }}
      >
        TRADUZIONE
      </div>
    </div>
  </AbsoluteFill>
);
