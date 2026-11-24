// © 2026 BinoITA (bino.dev, @bino.devs) — CC BY 4.0: se lo riusi, cita "@bino.devs — github.com/BinoITA/bino-dev-reels"
// Copertina del reel 04: Bino felice nella piazzetta, titolo dentro il ritaglio 3:4 della griglia (y 240-1680).
import { ThreeCanvas } from "@remotion/three";
import React from "react";
import { AbsoluteFill } from "remotion";
import * as THREE from "three";
import { Scena3D } from "./Reel04";
import { fontCodice, fontTitolo, T } from "./stile";

export const Copertina: React.FC = () => (
  <AbsoluteFill style={{ background: T.sfondo }}>
    <ThreeCanvas
      width={1080}
      height={1920}
      shadows="soft"
      dpr={1}
      gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      camera={{ fov: 30, near: 0.1, far: 200, position: [1.82, 4.02, 11.34] }}
    >
      <Scena3D f={118} />
    </ThreeCanvas>
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(60,40,20,0.18))" }} />
    <div style={{ position: "absolute", top: 290, left: 70 }}>
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
        #04 · CARTONI 3D
      </span>
    </div>
    <div
      style={{
        position: "absolute",
        top: 370,
        left: 60,
        right: 60,
        fontFamily: fontTitolo,
        fontWeight: 700,
        fontSize: 104,
        lineHeight: 1,
        letterSpacing: -5,
        color: T.testo,
        background: T.pannello,
        border: `5px solid ${T.bordo}`,
        borderRadius: 30,
        boxShadow: `10px 10px 0 ${T.bordo}`,
        padding: "22px 34px 28px",
        rotate: "-1.5deg",
      }}
    >
      Cartoni 3D
      <br />
      con{" "}
      <span style={{ background: `linear-gradient(transparent 10%, ${T.accento} 10%, ${T.accento} 90%, transparent 90%)`, padding: "0 12px" }}>
        Claude
      </span>
    </div>
    <div style={{ position: "absolute", top: 1470, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          fontFamily: fontTitolo,
          fontWeight: 700,
          fontSize: 64,
          padding: "14px 34px",
          borderRadius: 22,
          background: T.rosso,
          color: "#FFFFFF",
          border: `5px solid ${T.bordo}`,
          boxShadow: `8px 8px 0 ${T.bordo}`,
          rotate: "2deg",
        }}
      >
        79 € → gratis
      </div>
    </div>
  </AbsoluteFill>
);
