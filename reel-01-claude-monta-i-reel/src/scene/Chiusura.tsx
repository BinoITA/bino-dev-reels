// Scena 5 (22,9 - 30 s): prompt in didascalia, codice gratis, "commenta cosa smonto dopo",
// poi il logo <b/> e il nome della pagina.
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Logo, Pannello, Pop, useEntrata } from "../componenti";
import { colori, fontCodice, fontTitolo } from "../stile";

const DOMANDA = "cosa smonto dopo? 👇";
const LOGO = 160;

const Riga: React.FC<{ readonly da: number; readonly icona: string; readonly titolo: string; readonly dettaglio: string; readonly daDettaglio: number }> = ({
  da,
  icona,
  titolo,
  dettaglio,
  daDettaglio,
}) => {
  const dett = useEntrata(daDettaglio, 14);
  return (
    <Pop da={da}>
      <Pannello style={{ display: "flex", alignItems: "center", gap: 30, padding: "34px 40px" }}>
        <span style={{ fontSize: 76 }}>{icona}</span>
        <div>
          <div style={{ fontFamily: fontTitolo, fontWeight: 500, fontSize: 50, color: colori.muto }}>{titolo}</div>
          <div style={{ fontFamily: fontTitolo, fontWeight: 700, fontSize: 70, color: colori.accento, opacity: dett, translate: `${interpolate(dett, [0, 1], [-30, 0])}px 0px` }}>
            {dettaglio}
          </div>
        </div>
      </Pannello>
    </Pop>
  );
};

export const Chiusura: React.FC = () => {
  const frame = useCurrentFrame();
  const lettere = Math.floor(interpolate(frame, [96, 140], [0, DOMANDA.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const finale = useEntrata(LOGO);
  const cursore = Math.floor(frame / 8) % 2 === 0;

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 220,
          left: 90,
          right: 90,
          display: "flex",
          flexDirection: "column",
          gap: 36,
          opacity: 1 - finale,
          scale: String(1 - 0.1 * finale),
        }}
      >
        <Riga da={8} icona="📋" titolo="Il prompt" dettaglio="è in didascalia ↓" daDettaglio={22} />
        <Riga da={48} icona="</>" titolo="Il codice" dettaglio="gratis, per tutti" daDettaglio={66} />
        <Pop da={90}>
          <Pannello style={{ display: "flex", alignItems: "center", gap: 24, padding: "30px 36px", borderRadius: 999 }}>
            <div style={{ width: 72, height: 72, borderRadius: 999, backgroundColor: colori.accento }} />
            <div style={{ fontFamily: fontTitolo, fontSize: 54, color: lettere ? colori.testo : colori.muto }}>
              {lettere ? DOMANDA.slice(0, lettere) : "Aggiungi un commento…"}
              {cursore ? <span style={{ color: colori.accento }}>|</span> : null}
            </div>
          </Pannello>
        </Pop>
      </div>

      {/* logo finale */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 200,
          opacity: finale,
          scale: String(interpolate(finale, [0, 1], [0.8, 1])),
        }}
      >
        <Logo dimensione={230} />
        <div style={{ width: 150, height: 22, marginTop: 30, marginLeft: -150, backgroundColor: colori.accento, opacity: cursore ? 1 : 0.25 }} />
        <div style={{ fontFamily: fontCodice, fontWeight: 700, fontSize: 64, color: colori.testo, marginTop: 70 }}>@bino.devs</div>
        <div style={{ fontFamily: fontTitolo, fontSize: 46, color: colori.muto, marginTop: 18 }}>progetti veri, gratis.</div>
      </div>
    </>
  );
};
