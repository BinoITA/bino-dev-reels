// Scena 4 (17,9 - 22,9 s): "Io ho fatto il regista: più veloce, più grande, cambia colore.
// Lui corregge in pochi secondi." Ogni richiesta in chat cambia davvero l'oggetto sopra.
import React from "react";
import { interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { Chip, Logo, Pop, useEntrata } from "../componenti";
import { colori, fontTitolo } from "../stile";

const VELOCE = 38; // "più veloce"
const GRANDE = 55; // "più grande"
const COLORE = 72; // "cambia colore"
const RISPOSTA = 96; // "Lui corregge in pochi secondi"

const Fumetto: React.FC<{ readonly da: number; readonly mio?: boolean; readonly children: React.ReactNode }> = ({
  da,
  mio = true,
  children,
}) => (
  <Pop da={da} style={{ display: "flex", justifyContent: mio ? "flex-end" : "flex-start" }}>
    <div
      style={{
        fontFamily: fontTitolo,
        fontWeight: 700,
        fontSize: 48,
        padding: "20px 34px",
        borderRadius: 40,
        borderBottomRightRadius: mio ? 10 : 40,
        borderBottomLeftRadius: mio ? 40 : 10,
        backgroundColor: mio ? colori.blu : colori.pannello,
        border: mio ? "none" : `3px solid ${colori.accento}`,
        color: mio ? "#0D1117" : colori.accento,
      }}
    >
      {children}
    </div>
  </Pop>
);

export const Regista: React.FC = () => {
  const frame = useCurrentFrame();
  // rotazione: lenta, poi 4 volte più veloce da "più veloce"
  const rotazione = frame < VELOCE ? frame * 2 : VELOCE * 2 + (frame - VELOCE) * 9;
  const grande = useEntrata(GRANDE, 12);
  const colore = interpolateColors(frame, [COLORE, COLORE + 8], [colori.blu, colori.accento]);

  return (
    <>
      <Pop da={0} style={{ position: "absolute", top: 190, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <Chip colore={colori.giallo}>🎬 io = regista</Chip>
      </Pop>

      {/* l'oggetto che riceve le correzioni */}
      <div style={{ position: "absolute", top: 330, left: 0, right: 0, height: 460, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            width: 260,
            height: 260,
            borderRadius: 48,
            border: `8px solid ${colore}`,
            boxShadow: `0 0 90px ${colore}66`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colori.pannello,
            rotate: `${rotazione}deg`,
            scale: String(interpolate(grande, [0, 1], [1, 1.5])),
          }}
        >
          <Logo dimensione={84} />
        </div>
      </div>

      {/* la chat */}
      {/* right: 130 -> i fumetti restano fuori dalla colonna dei pulsanti di Instagram (x > 960) */}
      <div style={{ position: "absolute", top: 800, left: 90, right: 130, display: "flex", flexDirection: "column", gap: 14 }}>
        <Fumetto da={VELOCE}>più veloce</Fumetto>
        <Fumetto da={GRANDE}>più grande</Fumetto>
        <Fumetto da={COLORE}>cambia colore</Fumetto>
        <Fumetto da={RISPOSTA} mio={false}>
          ✓ fatto. altro?
        </Fumetto>
      </div>
    </>
  );
};
