// Scena 3 (10 - 17,9 s): copione + voce AI -> Claude scrive il video in codice (Remotion)
// -> scritte, animazioni, sottotitoli.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Chip, Pannello, Pop, useEntrata } from "../componenti";
import { colori, fontCodice } from "../stile";

// righe di codice vere, prese da questo progetto (semplificate)
const C = colori;
const CODICE: [string, string][][] = [
  [["<", C.muto], ["Composition", C.blu], [" fps", C.viola], ["={", C.muto], ["30", C.giallo], ["}", C.muto]],
  [["  width", C.viola], ["={", C.muto], ["1080", C.giallo], ["} ", C.muto], ["height", C.viola], ["={", C.muto], ["1920", C.giallo], ["} />", C.muto]],
  [["", C.muto]],
  [["<", C.muto], ["Audio", C.blu], [" src", C.viola], ["=", C.muto], ['"voce.wav"', C.accento], [" />", C.muto]],
  [["<", C.muto], ["Sottotitoli", C.blu], [" parole", C.viola], ["={", C.muto], ["tempi", C.testo], ["} />", C.muto]],
  [["", C.muto]],
  [["<", C.muto], ["Scena", C.blu], [" nome", C.viola], ["=", C.muto], ['"Gancio"', C.accento], [">", C.muto]],
  [["  <", C.muto], ["Titolo", C.blu], [">", C.muto], ["Commenta EDIT", C.testo], ["</", C.muto], ["Titolo", C.blu], [">", C.muto]],
  [["  <", C.muto], ["Timbro", C.blu], [">", C.muto], ["NO.", C.rosso], ["</", C.muto], ["Timbro", C.blu], [">", C.muto]],
  [["</", C.muto], ["Scena", C.blu], [">", C.muto]],
];
const TOTALE = CODICE.flat().reduce((n, [t]) => n + t.length, 0);

const Onda: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 7, height: 56 }}>
      {new Array(12).fill(0).map((_, i) => (
        <div
          key={i}
          style={{
            width: 9,
            borderRadius: 5,
            backgroundColor: C.accento,
            height: 12 + Math.abs(Math.sin(frame / 4 + i * 0.9)) * 44,
          }}
        />
      ))}
    </div>
  );
};

export const Catena: React.FC = () => {
  const frame = useCurrentFrame();
  const editor = useEntrata(72);
  let restanti = Math.floor(interpolate(frame, [80, 200], [0, TOTALE], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const cursoreAcceso = Math.floor(frame / 8) % 2 === 0;
  let cursoreMesso = false; // un solo cursore, sulla riga che si sta scrivendo

  return (
    <>
      {/* riga in alto: copione -> voce */}
      <div style={{ position: "absolute", top: 190, left: 90, right: 90, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Pop da={20}>
          <Pannello style={{ width: 380, height: 150, display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
            <span style={{ fontSize: 60 }}>📄</span>
            <span style={{ fontFamily: fontCodice, fontSize: 40, color: C.testo }}>copione.txt</span>
          </Pannello>
        </Pop>
        <Pop da={36} style={{ fontSize: 70, color: C.muto }}>
          →
        </Pop>
        <Pop da={42}>
          <Pannello style={{ width: 380, height: 150, display: "flex", alignItems: "center", justifyContent: "center", gap: 22 }}>
            <span style={{ fontFamily: fontCodice, fontSize: 40, color: C.testo, whiteSpace: "nowrap" }}>voce AI</span>
            <Onda />
          </Pannello>
        </Pop>
      </div>

      {/* editor di codice */}
      <Pannello
        style={{
          position: "absolute",
          left: 90,
          right: 90,
          top: 400,
          height: 640,
          overflow: "hidden",
          opacity: editor,
          translate: `0px ${interpolate(editor, [0, 1], [120, 0])}px`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "22px 28px", borderBottom: `3px solid ${C.bordo}` }}>
          {[C.rosso, C.giallo, C.accento].map((c) => (
            <div key={c} style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: c }} />
          ))}
          <span style={{ marginLeft: 16, fontFamily: fontCodice, fontSize: 32, color: C.muto }}>Reel.tsx — scritto da Claude</span>
        </div>
        <div style={{ padding: "26px 34px", fontFamily: fontCodice, fontSize: 34, lineHeight: 1.5 }}>
          {CODICE.map((riga, r) => {
            const primaDellaRiga = restanti;
            const parti = riga.map(([testo, colore], k) => {
              const mostra = testo.slice(0, Math.max(0, restanti));
              restanti -= testo.length;
              return (
                <span key={k} style={{ color: colore }}>
                  {mostra}
                </span>
              );
            });
            // il cursore va sulla prima riga non finita (o sull'ultima, a codice completo)
            const qui = !cursoreMesso && (restanti < 0 || r === CODICE.length - 1) && primaDellaRiga >= 0;
            if (qui) cursoreMesso = true;
            return (
              <div key={r} style={{ minHeight: 51, whiteSpace: "pre" }}>
                {parti}
                {qui && cursoreAcceso ? <span style={{ color: C.accento }}>▍</span> : null}
              </div>
            );
          })}
        </div>
        <Pop da={126} style={{ position: "absolute", right: 28, top: 90 }}>
          <Chip colore={C.blu} style={{ fontSize: 38, padding: "12px 24px" }}>
            ⚛ Remotion
          </Chip>
        </Pop>
      </Pannello>

      {/* cosa ha fatto */}
      <div style={{ position: "absolute", top: 1080, left: 90, right: 120, display: "flex", justifyContent: "center", gap: 14 }}>
        <Pop da={150}>
          <Chip style={{ fontSize: 40, padding: "14px 24px" }}>✓ scritte</Chip>
        </Pop>
        <Pop da={180}>
          <Chip style={{ fontSize: 40, padding: "14px 24px" }}>✓ animazioni</Chip>
        </Pop>
        <Pop da={208}>
          <Chip style={{ fontSize: 40, padding: "14px 24px" }}>✓ sottotitoli</Chip>
        </Pop>
      </div>
    </>
  );
};
