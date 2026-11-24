// © 2026 BinoITA (bino.dev, @bino.devs) — CC BY 4.0: se lo riusi, cita "@bino.devs — github.com/BinoITA/bino-dev-reels"
// Copertina del reel 03. Tutto il contenuto sta tra y 240 e 1680 (ritaglio 3:4 della griglia del profilo).
import React from "react";
import { AbsoluteFill } from "remotion";
import { fontCodice, fontTitolo, T } from "./stile";

const Codice: React.FC<{ readonly colore: string; readonly fondo: string; readonly children: React.ReactNode }> = ({
  colore,
  fondo,
  children,
}) => (
  <div
    style={{
      background: fondo,
      padding: "18px 30px",
      fontFamily: fontCodice,
      fontWeight: 700,
      fontSize: 34,
      color: colore,
      whiteSpace: "pre",
    }}
  >
    {children}
  </div>
);

export const Copertina: React.FC = () => (
  <AbsoluteFill style={{ background: T.sfondo }}>
    <div style={{ position: "absolute", top: 300, left: 70 }}>
      <span
        style={{
          fontFamily: fontCodice,
          fontWeight: 700,
          fontSize: 34,
          letterSpacing: 2,
          padding: "12px 22px",
          borderRadius: 999,
          border: `3px solid ${T.bordo}`,
          background: T.giallo,
          boxShadow: `5px 5px 0 ${T.bordo}`,
        }}
      >
        #03 · SICUREZZA
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
        fontSize: 124,
        lineHeight: 1,
        letterSpacing: -6,
        color: T.testo,
      }}
    >
      Cancellare
      <br />
      la API key
      <br />
      <span
        style={{
          background: `linear-gradient(transparent 10%, ${T.rosso} 10%, ${T.rosso} 90%, transparent 90%)`,
          padding: "0 14px",
          margin: "0 -6px",
          color: "#FFFFFF",
        }}
      >
        non basta.
      </span>
    </div>
    <div
      style={{
        position: "absolute",
        top: 900,
        left: 70,
        width: 940,
        background: T.pannello,
        border: `4px solid ${T.bordo}`,
        borderRadius: T.raggio,
        boxShadow: T.ombra,
        overflow: "hidden",
        rotate: "-1.5deg",
      }}
    >
      <div
        style={{
          padding: "18px 30px",
          borderBottom: `4px solid ${T.bordo}`,
          background: "#F7F4EC",
          fontFamily: fontCodice,
          fontWeight: 700,
          fontSize: 30,
        }}
      >
        git log -p
      </div>
      <Codice colore={T.accentoTesto} fondo="#FFFFFF">b6406fa prima versione dell'app</Codice>
      <Codice colore="#B3261E" fondo="#FFE3E1">{'+ const KEY = "AIzaSy•••••";'}</Codice>
      <Codice colore={T.muto} fondo="#FFFFFF">{"  ↑ è ancora qui"}</Codice>
    </div>
    <div style={{ position: "absolute", top: 1440, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
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
        + lo script gratis per controllare 👇
      </div>
    </div>
  </AbsoluteFill>
);
