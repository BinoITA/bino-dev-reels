// Scena 2 (5 - 10 s): "Io non ti chiedo niente. Anzi: questo reel l'ha montato Claude. Dall'inizio alla fine."
// Il reel mostra sé stesso dentro un telefono, con la timeline che si riempie.
import React from "react";
import { Freeze, interpolate, useCurrentFrame } from "remotion";
import { Chip, Pop, useEntrata } from "../componenti";
import { colori, fontCodice, fontTitolo } from "../stile";
import { Gancio } from "./Gancio";

export const NienteDaCommentare: React.FC = () => {
  const frame = useCurrentFrame();
  const uscitaTesto = useEntrata(40);
  const telefono = useEntrata(52);
  const riempimento = interpolate(frame, [106, 144], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const barrato = interpolate(frame, [2, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <>
      {/* parte 1: niente da commentare */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 520,
          opacity: 1 - uscitaTesto,
          translate: `0px ${-120 * uscitaTesto}px`,
        }}
      >
        <div style={{ position: "relative" }}>
          <Chip colore={colori.giallo} style={{ opacity: 1 - barrato * 0.5 }}>
            Commenta “EDIT”
          </Chip>
          <div
            style={{
              position: "absolute",
              left: -10,
              top: "50%",
              height: 10,
              borderRadius: 5,
              width: `calc(${barrato * 100}% + 20px)`,
              backgroundColor: colori.rosso,
              rotate: "-4deg",
            }}
          />
        </div>
        <Pop da={2} style={{ marginTop: 60, fontFamily: fontTitolo, fontWeight: 500, fontSize: 84, color: colori.testo }}>
          Non ti chiedo
        </Pop>
        <Pop da={18} style={{ fontFamily: fontTitolo, fontWeight: 700, fontSize: 210, lineHeight: 1, color: colori.accento }}>
          niente.
        </Pop>
      </div>

      {/* parte 2: questo reel, dentro un telefono */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 170,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: telefono,
          translate: `0px ${interpolate(telefono, [0, 1], [300, 0])}px`,
        }}
      >
        <div style={{ fontFamily: fontTitolo, fontWeight: 700, fontSize: 60, color: colori.testo, marginBottom: 28 }}>
          questo reel ↓
        </div>
        <div style={{ position: "relative" }}>
          <div
            style={{
              width: 432,
              height: 768,
              borderRadius: 56,
              border: `10px solid ${colori.bordo}`,
              overflow: "hidden",
              position: "relative",
              backgroundColor: colori.sfondo,
              boxShadow: `0 0 80px ${colori.accento}33`,
            }}
          >
            <div style={{ width: 1080, height: 1920, scale: "0.4", transformOrigin: "0 0", position: "absolute", left: 0, top: 0 }}>
              <Freeze frame={100}>
                <Gancio />
              </Freeze>
            </div>
          </div>
          <Pop da={86} style={{ position: "absolute", right: -150, top: 90, rotate: "6deg" }}>
            <Chip>✂️ montato da Claude</Chip>
          </Pop>
        </div>

        {/* timeline */}
        <div style={{ width: 820, marginTop: 50 }}>
          <div style={{ height: 34, borderRadius: 17, backgroundColor: colori.pannello, border: `3px solid ${colori.bordo}`, overflow: "hidden" }}>
            <div style={{ width: `${riempimento * 100}%`, height: "100%", backgroundColor: colori.accento }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontFamily: fontCodice, fontSize: 34, color: colori.muto, marginTop: 14 }}>
            <span>00:00</span>
            <span style={{ color: riempimento >= 1 ? colori.accento : colori.muto }}>{riempimento >= 1 ? "✓ fine" : "00:30"}</span>
          </div>
        </div>
      </div>
    </>
  );
};
