// Scena 1 (0 - 5 s): il classico post "Commenta EDIT e ti mando la guida",
// sommerso da commenti tutti uguali. Volutamente anonimo: nessun account reale.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Pannello, Pop, useEntrata } from "../componenti";
import { colori, fontTitolo } from "../stile";

const COMMENTI = ["EDIT", "EDIT 🙏", "EDIT", "edit", "EDIT!!", "EDIT 🔥", "EDIT", "EDIT pls", "EDIT", "EDIT 😍", "EDIT", "EDIT"];

const Commento: React.FC<{ readonly testo: string; readonly i: number }> = ({ testo, i }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 22, height: 92 }}>
    <div
      style={{
        width: 64,
        height: 64,
        borderRadius: 999,
        background: `linear-gradient(135deg, hsl(${(i * 47) % 360} 45% 45%), hsl(${(i * 47 + 60) % 360} 45% 30%))`,
      }}
    />
    <div style={{ width: 150 + ((i * 37) % 90), height: 20, borderRadius: 10, backgroundColor: colori.bordo }} />
    <div style={{ fontFamily: fontTitolo, fontWeight: 700, fontSize: 46, color: colori.testo }}>{testo}</div>
  </div>
);

export const Gancio: React.FC = () => {
  const frame = useCurrentFrame();
  const card = useEntrata(0);
  // un commento nuovo ogni 4 frame dal momento in cui si sente "EDIT"
  const visibili = Math.max(0, Math.min(COMMENTI.length, Math.floor((frame - 50) / 4)));
  const conteggio = Math.floor(interpolate(frame, [50, 150], [0, 18742], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const timbro = useEntrata(128, 12);

  return (
    <>
      <Pannello
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 200,
          padding: 40,
          opacity: card,
          translate: `0px ${interpolate(card, [0, 1], [80, 0])}px`,
          filter: `grayscale(${interpolate(timbro, [0, 1], [0, 0.8])})`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ width: 84, height: 84, borderRadius: 999, background: `linear-gradient(135deg, ${colori.viola}, ${colori.blu})` }} />
          <div>
            <div style={{ width: 260, height: 24, borderRadius: 12, backgroundColor: colori.bordo }} />
            <div style={{ width: 170, height: 18, borderRadius: 9, backgroundColor: colori.bordo, marginTop: 14, opacity: 0.6 }} />
          </div>
        </div>
        <div
          style={{
            marginTop: 36,
            height: 260,
            borderRadius: 24,
            background: `linear-gradient(160deg, #2a1f4d, #13324a)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: fontTitolo,
            fontWeight: 700,
            fontSize: 64,
            color: "#ffffffcc",
          }}
        >
          🤖 + 🎬 = 🤯
        </div>
        <Pop da={34} style={{ marginTop: 34, fontFamily: fontTitolo, fontSize: 54, fontWeight: 500, color: colori.testo, lineHeight: 1.25 }}>
          Commenta <span style={{ color: colori.giallo, fontWeight: 700 }}>“EDIT”</span> e ti mando la guida 👇
        </Pop>
        <div style={{ marginTop: 26, fontFamily: fontTitolo, fontSize: 40, color: colori.muto }}>
          💬 {String(conteggio).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} commenti
        </div>
      </Pannello>

      {/* commenti che scorrono */}
      <div
        style={{
          position: "absolute",
          left: 130,
          right: 90,
          top: 960,
          height: 320,
          overflow: "hidden",
          maskImage: "linear-gradient(to bottom, transparent, black 25%, black 75%, transparent)",
        }}
      >
        <div style={{ translate: `0px ${-Math.max(0, visibili - 3) * 92 + 40}px` }}>
          {COMMENTI.slice(0, visibili).map((c, i) => (
            <Commento key={i} testo={c} i={i} />
          ))}
        </div>
      </div>

      {/* timbro finale */}
      <div
        style={{
          position: "absolute",
          top: 520,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: timbro,
          scale: String(interpolate(timbro, [0, 1], [2.2, 1])),
          rotate: "-12deg",
        }}
      >
        <div
          style={{
            fontFamily: fontTitolo,
            fontWeight: 700,
            fontSize: 150,
            color: colori.rosso,
            border: `12px solid ${colori.rosso}`,
            borderRadius: 30,
            padding: "10px 50px",
            backgroundColor: "#0D1117cc",
          }}
        >
          NO.
        </div>
      </div>
    </>
  );
};
