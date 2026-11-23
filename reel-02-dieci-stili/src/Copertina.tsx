// © 2026 BinoITA (bino.dev, @bino.devs) — CC BY 4.0: se lo riusi, cita "@bino.devs — github.com/BinoITA/bino-dev-reels"
// Copertina del reel 02. Tutto il contenuto sta tra y 240 e 1680, così si legge anche nel ritaglio 3:4 della griglia del profilo.
import React from "react";
import { AbsoluteFill } from "remotion";
import { STILI } from "./razzi";
import { fontCodice, fontTitolo, T } from "./stile";

export const Copertina: React.FC = () => (
  <AbsoluteFill style={{ background: T.sfondo }}>
    <div
      style={{
        position: "absolute",
        top: 300,
        left: 70,
        fontFamily: fontCodice,
        fontWeight: 700,
        fontSize: 34,
        letterSpacing: 2,
        color: T.testo,
      }}
    >
      <span
        style={{
          padding: "12px 22px",
          borderRadius: 999,
          border: `3px solid ${T.bordo}`,
          background: T.giallo,
          boxShadow: `5px 5px 0 ${T.bordo}`,
        }}
      >
        #02 · PROMPT GRATIS
      </span>
    </div>
    <div
      style={{
        position: "absolute",
        top: 400,
        left: 70,
        right: 70,
        fontFamily: fontTitolo,
        fontWeight: 700,
        fontSize: 118,
        lineHeight: 1,
        letterSpacing: -5,
        color: T.testo,
      }}
    >
      10 stili di
      <br />
      animazione
      <br />
      con{" "}
      <span
        style={{
          background: `linear-gradient(transparent 12%, ${T.accento} 12%, ${T.accento} 88%, transparent 88%)`,
          padding: "0 14px",
          margin: "0 -6px",
        }}
      >
        Claude
      </span>
    </div>
    {STILI.map((s, i) => {
      const Stile = s.Comp;
      const r = Math.floor(i / 5);
      const c = i % 5;
      return (
        <div
          key={s.nome}
          style={{
            position: "absolute",
            left: 70 + c * 192,
            top: 800 + r * 330,
            width: 172,
            height: 300,
            borderRadius: 16,
            border: `4px solid ${T.bordo}`,
            boxShadow: `6px 6px 0 ${T.bordo}`,
            overflow: "hidden",
            background: "#000",
            rotate: `${(c - 2) * 1.2}deg`,
          }}
        >
          <Stile f={40 + i * 7} id={`cop-${i}`} />
        </div>
      );
    })}
    <div
      style={{
        position: "absolute",
        top: 1500,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontFamily: fontTitolo,
          fontWeight: 700,
          fontSize: 52,
          padding: "14px 30px",
          borderRadius: 20,
          background: T.accento,
          border: `4px solid ${T.bordo}`,
          boxShadow: `7px 7px 0 ${T.bordo}`,
          rotate: "-2deg",
        }}
      >
        senza commentare niente 👇
      </div>
    </div>
  </AbsoluteFill>
);
