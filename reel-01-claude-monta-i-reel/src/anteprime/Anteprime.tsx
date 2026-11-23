// © 2026 BinoITA (bino.dev, @bino.devs) — CC BY 4.0: se lo riusi, cita "@bino.devs — github.com/BinoITA/bino-dev-reels"
// Anteprime di stile per il reel 01 v2: due direzioni grafiche (A = Neon notturno, B = Editoriale chiaro),
// tre fotogrammi chiave ciascuna (gancio, processo, finale). Solo immagini ferme, per scegliere lo stile.
import React from "react";
import { AbsoluteFill } from "remotion";
import { fontCodice, fontTitolo } from "../stile";

export type Tema = {
  sfondo: string;
  testo: string;
  muto: string;
  accento: string; // colore pieno dell'accento (riempimenti)
  accentoTesto: string; // accento usato come colore di testo sullo sfondo
  pannello: string;
  bordo: string;
  ombra: string;
  raggio: number;
  evidenzia: "luce" | "evidenziatore";
  rosso: string;
  giallo: string;
  codice: { fondo: string; testo: string; tag: string; attr: string; str: string; graffa: string; numeri: string };
};

export const NEON: Tema = {
  sfondo:
    "radial-gradient(900px 700px at 80% 8%, #1b4d3a 0%, transparent 60%), radial-gradient(800px 900px at 0% 100%, #142a4d 0%, transparent 60%), #07090D",
  testo: "#F2F5F8",
  muto: "#8B98A9",
  accento: "#3FE08F",
  accentoTesto: "#3FE08F",
  pannello: "rgba(22,27,34,0.82)",
  bordo: "rgba(255,255,255,0.12)",
  ombra: "0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)",
  raggio: 36,
  evidenzia: "luce",
  rosso: "#FF5C6C",
  giallo: "#F2CC60",
  codice: { fondo: "rgba(13,17,23,0.92)", testo: "#E6EDF3", tag: "#7EE787", attr: "#79C0FF", str: "#A5D6FF", graffa: "#FFA657", numeri: "#3D4652" },
};

export const EDITORIALE: Tema = {
  sfondo: "radial-gradient(#00000012 2px, transparent 2px) 0 0 / 40px 40px, #F2EEE3",
  testo: "#141414",
  muto: "#5E5A52",
  accento: "#3FE08F",
  accentoTesto: "#0E8F4E",
  pannello: "#FFFFFF",
  bordo: "#141414",
  ombra: "12px 12px 0 #141414",
  raggio: 28,
  evidenzia: "evidenziatore",
  rosso: "#FF4D4D",
  giallo: "#FFD93D",
  codice: { fondo: "#141414", testo: "#F5F5F5", tag: "#3FE08F", attr: "#FFD93D", str: "#9AD1FF", graffa: "#FF9F6B", numeri: "#55524C" },
};

// ---------------------------------------------------------------- pezzi comuni

export const Parola: React.FC<{ readonly t: Tema; readonly children: React.ReactNode }> = ({ t, children }) =>
  t.evidenzia === "luce" ? (
    <span style={{ color: t.accentoTesto, textShadow: `0 0 40px ${t.accento}99, 0 0 90px ${t.accento}55` }}>{children}</span>
  ) : (
    <span
      style={{
        background: `linear-gradient(transparent 12%, ${t.accento} 12%, ${t.accento} 88%, transparent 88%)`,
        padding: "0 12px",
        margin: "0 -6px",
        boxDecorationBreak: "clone",
      }}
    >
      {children}
    </span>
  );

export const Etichetta: React.FC<{ readonly t: Tema; readonly children: React.ReactNode }> = ({ t, children }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 14,
      fontFamily: fontCodice,
      fontWeight: 700,
      fontSize: 30,
      letterSpacing: 2,
      color: t.evidenzia === "luce" ? t.accentoTesto : t.testo,
      padding: "14px 24px",
      borderRadius: 999,
      border: t.evidenzia === "luce" ? `2px solid ${t.accento}66` : `3px solid ${t.bordo}`,
      background: t.evidenzia === "luce" ? `${t.accento}14` : t.giallo,
      boxShadow: t.evidenzia === "luce" ? "none" : `5px 5px 0 ${t.bordo}`,
    }}
  >
    <span style={{ width: 14, height: 14, borderRadius: 7, background: t.evidenzia === "luce" ? t.accento : t.rosso }} />
    {children}
  </div>
);

export const Titolo: React.FC<{ readonly t: Tema; readonly style?: React.CSSProperties; readonly children: React.ReactNode }> = ({ t, style, children }) => (
  <div
    style={{
      fontFamily: fontTitolo,
      fontWeight: 700,
      fontSize: 112,
      lineHeight: 1.02,
      letterSpacing: -4,
      color: t.testo,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Sottotitolo d'esempio, come apparirebbe nel video. */
const Sottotitolo: React.FC<{ readonly t: Tema; readonly prima: string; readonly attiva: string; readonly dopo?: string }> = ({ t, prima, attiva, dopo = "" }) => (
  <div style={{ position: "absolute", left: 100, right: 140, top: 1400, display: "flex", justifyContent: "center", textAlign: "center" }}>
    {t.evidenzia === "luce" ? (
      <div style={{ fontFamily: fontTitolo, fontWeight: 700, fontSize: 74, lineHeight: 1.15, color: t.testo, WebkitTextStroke: "14px #07090D", paintOrder: "stroke fill" }}>
        {prima} <span style={{ color: t.accento }}>{attiva}</span> {dopo}
      </div>
    ) : (
      <div style={{ fontFamily: fontTitolo, fontWeight: 700, fontSize: 70, lineHeight: 1.3, color: t.testo }}>
        <span style={{ background: t.pannello, border: `4px solid ${t.bordo}`, borderRadius: 18, padding: "6px 22px", boxShadow: `6px 6px 0 ${t.bordo}` }}>
          {prima} <span style={{ background: t.accento, borderRadius: 10, padding: "0 10px" }}>{attiva}</span> {dopo}
        </span>
      </div>
    )}
  </div>
);

/** Schermo di un reel "finito", con timeline da editor video: è il risultato che Claude ha montato. */
export const ReelFinito: React.FC<{ readonly t: Tema; readonly scala?: number }> = ({ t, scala = 1 }) => (
  <div style={{ position: "absolute", inset: 0, background: "#0B0E13", display: "flex", flexDirection: "column", fontFamily: fontTitolo }}>
    <div
      style={{
        flex: 1,
        position: "relative",
        background: "radial-gradient(400px 400px at 70% 20%, #2b7a55, transparent 70%), radial-gradient(400px 500px at 10% 90%, #2a3f8a, transparent 70%), #0B0E13",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 36 * scala,
      }}
    >
      <div style={{ fontFamily: fontCodice, fontSize: 22 * scala, color: "#3FE08F", letterSpacing: 2 }}>REEL #01</div>
      <div style={{ fontWeight: 700, fontSize: 64 * scala, lineHeight: 1, color: "#fff", letterSpacing: -2 * scala, marginTop: 14 * scala }}>
        Montato
        <br />
        da <span style={{ color: "#3FE08F" }}>Claude.</span>
      </div>
      <div style={{ position: "absolute", left: "50%", top: "62%", translate: "-50% 0", width: 96 * scala, height: 96 * scala, borderRadius: 999, background: "rgba(255,255,255,0.16)", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid rgba(255,255,255,0.35)" }}>
        <div style={{ width: 0, height: 0, borderTop: `${18 * scala}px solid transparent`, borderBottom: `${18 * scala}px solid transparent`, borderLeft: `${30 * scala}px solid #fff`, marginLeft: 8 * scala }} />
      </div>
    </div>
    {/* timeline */}
    <div style={{ background: "#12161D", padding: `${16 * scala}px ${18 * scala}px`, display: "flex", flexDirection: "column", gap: 8 * scala, borderTop: "2px solid #222a35" }}>
      {[
        [["#3FE08F", 22], ["#58A6FF", 30], ["#D2A8FF", 18], ["#F2CC60", 30]],
        [["#2f3a48", 100]],
        [["#58A6FF55", 15], ["#58A6FF55", 25], ["#58A6FF55", 20], ["#58A6FF55", 20], ["#58A6FF55", 20]],
      ].map((riga, i) => (
        <div key={i} style={{ display: "flex", gap: 4 * scala, height: (i === 1 ? 26 : 20) * scala }}>
          {riga.map(([c, w], k) =>
            i === 1 ? (
              <div key={k} style={{ flex: 1, display: "flex", alignItems: "center", gap: 3 * scala }}>
                {new Array(34).fill(0).map((_, z) => (
                  <div key={z} style={{ flex: 1, height: `${25 + Math.abs(Math.sin(z * 1.7)) * 75}%`, background: "#3FE08F", borderRadius: 2, opacity: 0.85 }} />
                ))}
              </div>
            ) : (
              <div key={k} style={{ width: `${w}%`, background: c as string, borderRadius: 5 * scala }} />
            ),
          )}
        </div>
      ))}
      <div style={{ position: "absolute" }} />
    </div>
    <div style={{ position: "absolute", left: "58%", bottom: 8 * scala, height: 100 * scala, width: 3 * scala, background: "#FF5C6C" }} />
    {t.evidenzia === "luce" ? null : null}
  </div>
);

export const Telefono: React.FC<{ readonly t: Tema; readonly style?: React.CSSProperties; readonly children: React.ReactNode }> = ({ t, style, children }) => (
  <div
    style={{
      position: "absolute",
      borderRadius: 64,
      padding: 14,
      background: t.evidenzia === "luce" ? "linear-gradient(145deg, #3a4250, #11151b)" : "#141414",
      boxShadow: t.evidenzia === "luce" ? `0 60px 140px rgba(0,0,0,0.7), 0 0 120px ${t.accento}33` : `16px 16px 0 ${t.bordo}`,
      ...style,
    }}
  >
    <div style={{ position: "relative", width: "100%", height: "100%", borderRadius: 52, overflow: "hidden" }}>
      {children}
      <div style={{ position: "absolute", top: 14, left: "50%", translate: "-50% 0", width: 120, height: 32, borderRadius: 16, background: "#000" }} />
    </div>
  </div>
);

export const Adesivo: React.FC<{ readonly t: Tema; readonly colore: string; readonly testoColore?: string; readonly style?: React.CSSProperties; readonly children: React.ReactNode }> = ({
  t,
  colore,
  testoColore = "#0B0E13",
  style,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      fontFamily: fontTitolo,
      fontWeight: 700,
      fontSize: 46,
      padding: "16px 30px",
      borderRadius: t.evidenzia === "luce" ? 999 : 20,
      background: colore,
      color: testoColore,
      border: t.evidenzia === "luce" ? "none" : `4px solid ${t.bordo}`,
      boxShadow: t.evidenzia === "luce" ? `0 20px 60px ${colore}55` : `7px 7px 0 ${t.bordo}`,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

// evidenziatore di sintassi minimale per righe JSX
export const evidenziaRiga = (riga: string, c: Tema["codice"]) => {
  const re = /("[^"]*")|(\{[^}]*\})|(<\/?|\/?>)|([A-Z][A-Za-z]*)|([a-z]+(?==))|([^"{<>A-Z]+|.)/g;
  const out: React.ReactNode[] = [];
  let m: RegExpExecArray | null;
  let k = 0;
  while ((m = re.exec(riga))) {
    const col = m[1] ? c.str : m[2] ? c.graffa : m[3] ? c.testo : m[4] ? c.tag : m[5] ? c.attr : c.testo;
    out.push(
      <span key={k++} style={{ color: col }}>
        {m[0]}
      </span>,
    );
  }
  return out;
};

export const CODICE = [
  '<Scena nome="Gancio" durata={2.5}>',
  "  <Titolo grande>",
  "    Io ti do tutto.",
  "  </Titolo>",
  "  <Telefono rotazione={-14}>",
  "    <ReelFinito />",
  "  </Telefono>",
  "</Scena>",
];

const Editor: React.FC<{ readonly t: Tema; readonly style?: React.CSSProperties }> = ({ t, style }) => (
  <div
    style={{
      position: "absolute",
      borderRadius: t.raggio,
      overflow: "hidden",
      background: t.codice.fondo,
      border: t.evidenzia === "luce" ? `1px solid ${t.bordo}` : `4px solid ${t.bordo}`,
      boxShadow: t.evidenzia === "luce" ? `${t.ombra}, 0 0 100px ${t.accento}22` : t.ombra,
      ...style,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "22px 28px", borderBottom: `2px solid ${t.evidenzia === "luce" ? "rgba(255,255,255,0.08)" : "#2a2824"}` }}>
      {["#FF5F57", "#FEBC2E", "#28C840"].map((x) => (
        <div key={x} style={{ width: 20, height: 20, borderRadius: 10, background: x }} />
      ))}
      <div style={{ marginLeft: 18, fontFamily: fontCodice, fontSize: 28, color: t.codice.numeri === "#3D4652" ? "#8B98A9" : "#A8A39A" }}>Gancio.tsx</div>
      <div style={{ marginLeft: "auto", fontFamily: fontCodice, fontSize: 24, color: "#3FE08F", border: "2px solid #3FE08F66", borderRadius: 999, padding: "4px 16px" }}>
        ✦ Claude sta scrivendo
      </div>
    </div>
    <div style={{ padding: "26px 0", fontFamily: fontCodice, fontSize: 38, lineHeight: 1.55 }}>
      {CODICE.map((r, i) => (
        <div key={i} style={{ display: "flex", whiteSpace: "pre", background: i === 2 ? "rgba(63,224,143,0.10)" : "transparent" }}>
          <span style={{ width: 80, textAlign: "right", paddingRight: 26, color: t.codice.numeri }}>{i + 1}</span>
          <span>{evidenziaRiga(r, t.codice)}</span>
          {i === 2 ? <span style={{ color: "#3FE08F" }}>▍</span> : null}
        </div>
      ))}
    </div>
  </div>
);

const Passi: React.FC<{ readonly t: Tema; readonly attivo: number }> = ({ t, attivo }) => {
  const nomi = ["Copione", "Voce", "Codice", "Render"];
  return (
    <div style={{ position: "absolute", top: 250, left: 80, right: 120, display: "flex", gap: 14 }}>
      {nomi.map((n, i) => {
        const fatto = i < attivo;
        const ora = i === attivo;
        return (
          <div key={n} style={{ flex: 1 }}>
            <div
              style={{
                height: 14,
                borderRadius: 7,
                background: fatto ? t.accento : ora ? `linear-gradient(90deg, ${t.accento} 60%, ${t.evidenzia === "luce" ? "#ffffff22" : "#00000022"} 60%)` : t.evidenzia === "luce" ? "#ffffff22" : "#00000022",
                border: t.evidenzia === "luce" ? "none" : `3px solid ${t.bordo}`,
                boxShadow: ora && t.evidenzia === "luce" ? `0 0 24px ${t.accento}` : "none",
              }}
            />
            <div style={{ marginTop: 14, fontFamily: fontCodice, fontSize: 28, fontWeight: 700, color: ora ? (t.evidenzia === "luce" ? t.accentoTesto : t.testo) : t.muto }}>
              {i + 1} {n}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------- i 3 fotogrammi

export const FotoGancio: React.FC<{ readonly t: Tema }> = ({ t }) => (
  <AbsoluteFill style={{ background: t.sfondo }}>
    <div style={{ position: "absolute", top: 250, left: 80 }}>
      <Etichetta t={t}>SMONTATO IN 30 SECONDI · #01</Etichetta>
    </div>
    <Titolo t={t} style={{ position: "absolute", top: 350, left: 80, right: 120 }}>
      Ti chiedono
      <br />
      un commento.
      <br />
      <Parola t={t}>Io ti do tutto.</Parola>
    </Titolo>
    <Telefono t={t} style={{ left: 250, top: 760, width: 500, height: 900, rotate: "-6deg" }}>
      <ReelFinito t={t} />
    </Telefono>
    <Adesivo t={t} colore={t.evidenzia === "luce" ? "#1c222b" : "#FFFFFF"} testoColore={t.testo} style={{ left: 70, top: 900, rotate: "-8deg", textDecoration: `line-through 6px ${t.rosso}` }}>
      Commenta “EDIT”
    </Adesivo>
    <Adesivo t={t} colore={t.accento} style={{ left: 600, top: 1110, rotate: "7deg" }}>
      ✓ gratis
    </Adesivo>
    <Sottotitolo t={t} prima="l'ha montato" attiva="Claude." />
  </AbsoluteFill>
);

export const FotoProcesso: React.FC<{ readonly t: Tema }> = ({ t }) => (
  <AbsoluteFill style={{ background: t.sfondo }}>
    <Passi t={t} attivo={2} />
    <Titolo t={t} style={{ position: "absolute", top: 370, left: 80, right: 120 }}>
      Claude scrive
      <br />
      <Parola t={t}>il video.</Parola>
    </Titolo>
    <Editor t={t} style={{ left: 60, right: 120, top: 640, rotate: "-2deg" }} />
    <Telefono t={t} style={{ left: 680, top: 860, width: 250, height: 440, rotate: "8deg", padding: 9 }}>
      <ReelFinito t={t} scala={0.5} />
    </Telefono>
    <Sottotitolo t={t} prima="ogni" attiva="animazione" />
  </AbsoluteFill>
);

export const FotoFinale: React.FC<{ readonly t: Tema }> = ({ t }) => (
  <AbsoluteFill style={{ background: t.sfondo }}>
    <div style={{ position: "absolute", top: 300, left: 0, right: 40, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          fontFamily: fontCodice,
          fontWeight: 700,
          fontSize: 230,
          lineHeight: 1,
          color: t.testo,
          textShadow: t.evidenzia === "luce" ? `0 0 60px ${t.accento}55` : `8px 8px 0 ${t.accento}`,
        }}
      >
        {"<"}
        <span style={{ color: t.evidenzia === "luce" ? t.accento : t.accentoTesto }}>b</span>
        {"/>"}
      </div>
    </div>
    <Titolo t={t} style={{ position: "absolute", top: 620, left: 80, right: 120, textAlign: "center", fontSize: 100 }}>
      Il codice è <Parola t={t}>gratis.</Parola>
    </Titolo>
    {/* scheda del repository */}
    <div
      style={{
        position: "absolute",
        top: 820,
        left: 80,
        right: 120,
        padding: "36px 40px",
        borderRadius: t.raggio,
        background: t.pannello,
        border: t.evidenzia === "luce" ? `1px solid ${t.bordo}` : `4px solid ${t.bordo}`,
        boxShadow: t.ombra,
        fontFamily: fontTitolo,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ width: 56, height: 56, borderRadius: 28, background: t.testo, color: t.evidenzia === "luce" ? "#07090D" : "#F2EEE3", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, fontWeight: 700 }}>
          ⌥
        </div>
        <div style={{ fontFamily: fontCodice, fontSize: 38, color: t.testo }}>
          BinoITA / <b>bino-dev-reels</b>
        </div>
      </div>
      <div style={{ fontSize: 36, color: t.muto, marginTop: 20, lineHeight: 1.3 }}>Il codice di ogni reel. Niente “commenta per ricevere”.</div>
      <div style={{ display: "flex", gap: 14, marginTop: 26 }}>
        {["Remotion", "Claude Code", "MIT"].map((x) => (
          <div key={x} style={{ fontFamily: fontCodice, fontSize: 28, padding: "8px 20px", borderRadius: 999, color: t.evidenzia === "luce" ? t.accentoTesto : t.testo, background: t.evidenzia === "luce" ? `${t.accento}1F` : t.accento, border: t.evidenzia === "luce" ? "none" : `3px solid ${t.bordo}` }}>
            {x}
          </div>
        ))}
        <div style={{ marginLeft: "auto", fontSize: 32, color: t.testo, fontWeight: 700 }}>★ Star</div>
      </div>
    </div>
    {/* commento */}
    <div
      style={{
        position: "absolute",
        top: 1180,
        left: 80,
        right: 120,
        display: "flex",
        alignItems: "center",
        gap: 22,
        padding: "26px 32px",
        borderRadius: 999,
        background: t.pannello,
        border: t.evidenzia === "luce" ? `1px solid ${t.bordo}` : `4px solid ${t.bordo}`,
        boxShadow: t.evidenzia === "luce" ? "none" : `7px 7px 0 ${t.bordo}`,
        fontFamily: fontTitolo,
        fontSize: 46,
        color: t.testo,
      }}
    >
      <div style={{ width: 60, height: 60, borderRadius: 30, background: t.accento }} />
      cosa smonto dopo? 👇<span style={{ color: t.accentoTesto }}>|</span>
    </div>
    <div style={{ position: "absolute", top: 1360, left: 0, right: 40, textAlign: "center", fontFamily: fontCodice, fontWeight: 700, fontSize: 56, color: t.testo }}>@bino.devs</div>
  </AbsoluteFill>
);

export const A1 = () => <FotoGancio t={NEON} />;
export const A2 = () => <FotoProcesso t={NEON} />;
export const A3 = () => <FotoFinale t={NEON} />;
export const B1 = () => <FotoGancio t={EDITORIALE} />;
export const B2 = () => <FotoProcesso t={EDITORIALE} />;
export const B3 = () => <FotoFinale t={EDITORIALE} />;
