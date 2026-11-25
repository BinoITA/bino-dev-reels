// © 2026 BinoITA (bino.dev, @bino.devs) — CC BY 4.0: se lo riusi, cita "@bino.devs — github.com/BinoITA/bino-dev-reels"
// Reel 05 — "Smetti di pagare queste 3 app". Sei scene sui paragrafi della voce:
// le 3 app con il cartellino "abbonamento" che diventa "gratis", il QR code che scade e quello che non scade,
// unisci PDF senza caricare niente, dividi le spese, i 3 file che si aprono e funzionano, finale "Mandalo a…" con loop.
// Le app a schermo sono ricostruite dalle app vere in app/ (stessi testi e stessi conti). Il QR a schermo è vero.
import { Audio } from "@remotion/media";
import { createTikTokStyleCaptions, type Caption } from "@remotion/captions";
import qrcode from "qrcode-generator";
import React, { useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, spring, staticFile, Track, useCurrentFrame } from "remotion";
import { C, fontCodice, fontTitolo, T } from "./stile";
import tempi from "./tempi.json";

// ---------------------------------------------------------------- tempi (frame a 30 fps, da tempi.json)

export const DURATA = 930;
const FPS = 30;
const S = { qr: 118, pdf: 348, spese: 530, file: 703, mandalo: 826 }; // inizio scene
const CLAUDE = 65;
const GRATIS = 94;
const SCADERE = 203;
const PROVA = 233;
const QUESTO = 250;
const LINK = 269;
const NON_SCADE = 316;
const UNIRE = 373;
const NON_CARICATI = 426;
const RESTANO = 484;
const ILLIMITATE = 588;
const CHI_DA = 616;
const MINIMO = 669;
const APRI = 736;
const FUNZIONANO = 750;
const DIDASCALIA = 773;
const LOOP = 906;

const LINK_QR = "https://github.com/BinoITA/bino-dev-reels";

const molla = (vf: number, da: number, smorzamento = 14) =>
  spring({ frame: vf - da, fps: FPS, config: { damping: smorzamento } });

// ---------------------------------------------------------------- pezzi comuni (come nel reel 03)

const Pop: React.FC<{
  readonly vf: number;
  readonly da: number;
  readonly style?: React.CSSProperties;
  readonly children: React.ReactNode;
}> = ({ vf, da, style, children }) => {
  const p = molla(vf, da);
  return (
    <div
      style={{
        opacity: Math.min(1, p * 1.5),
        scale: String(interpolate(p, [0, 1], [0.7, 1])),
        translate: `0px ${interpolate(p, [0, 1], [36, 0])}px`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Adesivo: React.FC<{
  readonly colore: string;
  readonly testo?: string;
  readonly style?: React.CSSProperties;
  readonly children: React.ReactNode;
}> = ({ colore, testo = T.testo, style, children }) => (
  <div
    style={{
      fontFamily: fontTitolo,
      fontWeight: 700,
      fontSize: 44,
      padding: "12px 26px",
      borderRadius: 20,
      background: colore,
      color: testo,
      border: `4px solid ${T.bordo}`,
      boxShadow: `7px 7px 0 ${T.bordo}`,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

const Pannello: React.FC<{ readonly style?: React.CSSProperties; readonly children: React.ReactNode }> = ({
  style,
  children,
}) => (
  <div
    style={{
      position: "absolute",
      background: T.pannello,
      border: `4px solid ${T.bordo}`,
      borderRadius: T.raggio,
      boxShadow: T.ombra,
      overflow: "hidden",
      ...style,
    }}
  >
    {children}
  </div>
);

const Codice: React.FC<{ readonly style?: React.CSSProperties; readonly children: React.ReactNode }> = ({
  style,
  children,
}) => (
  <div style={{ fontFamily: fontCodice, fontWeight: 700, fontSize: 30, whiteSpace: "pre", ...style }}>
    {children}
  </div>
);

const Evid: React.FC<{ readonly colore: string; readonly children: React.ReactNode }> = ({ colore, children }) => (
  <span
    style={{
      background: `linear-gradient(transparent 10%, ${colore} 10%, ${colore} 90%, transparent 90%)`,
      padding: "0 12px",
      margin: "0 -6px",
    }}
  >
    {children}
  </span>
);

const Chip: React.FC = () => (
  <div style={{ position: "absolute", top: 250, left: 60 }}>
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        fontFamily: fontCodice,
        fontWeight: 700,
        fontSize: 28,
        letterSpacing: 2,
        color: T.testo,
        padding: "12px 22px",
        borderRadius: 999,
        border: `3px solid ${T.bordo}`,
        background: T.giallo,
        boxShadow: `5px 5px 0 ${T.bordo}`,
      }}
    >
      <span style={{ width: 14, height: 14, borderRadius: 7, background: T.accento, border: `2px solid ${T.bordo}` }} />
      APP GRATIS · #05
    </div>
  </div>
);

/** Titolo grande della scena (sotto il chip). */
const Titolo: React.FC<{ readonly vf: number; readonly da: number; readonly children: React.ReactNode }> = ({
  vf,
  da,
  children,
}) => (
  <Pop
    vf={vf}
    da={da}
    style={{
      position: "absolute",
      top: 330,
      left: 60,
      right: 120,
      fontFamily: fontTitolo,
      fontWeight: 700,
      fontSize: 88,
      lineHeight: 1.02,
      letterSpacing: -4,
      color: T.testo,
    }}
  >
    {children}
  </Pop>
);

/** Numero dell'app (1, 2, 3) nel titolo. */
const Num: React.FC<{ readonly n: number }> = ({ n }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      width: 96,
      height: 96,
      borderRadius: 48,
      marginRight: 22,
      verticalAlign: "8px",
      background: T.accento,
      border: `4px solid ${T.bordo}`,
      fontSize: 60,
      letterSpacing: 0,
    }}
  >
    {n}
  </span>
);

/** Finestra del browser con il nome del file dell'app in alto. */
const Finestra: React.FC<{
  readonly file: string;
  readonly style?: React.CSSProperties;
  readonly children: React.ReactNode;
}> = ({ file, style, children }) => (
  <Pannello style={{ background: "#F2EEE3", ...style }}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "16px 22px",
        borderBottom: `4px solid ${T.bordo}`,
        background: T.pannello,
      }}
    >
      {[T.rosso, T.giallo, T.accento].map((x) => (
        <span key={x} style={{ width: 20, height: 20, borderRadius: 10, background: x, border: `3px solid ${T.bordo}` }} />
      ))}
      <Codice
        style={{
          marginLeft: 14,
          fontSize: 26,
          padding: "4px 18px",
          borderRadius: 999,
          background: "#F2EEE3",
          border: `2px solid #14141433`,
        }}
      >
        {file}
      </Codice>
    </div>
    <div style={{ position: "relative", padding: "26px 28px" }}>{children}</div>
  </Pannello>
);

/** Scheda bianca dentro le app, come nelle pagine vere. */
const Scheda: React.FC<{ readonly style?: React.CSSProperties; readonly children: React.ReactNode }> = ({
  style,
  children,
}) => (
  <div
    style={{
      background: "#FFFDF7",
      border: `4px solid ${T.bordo}`,
      borderRadius: 20,
      boxShadow: `7px 7px 0 ${T.bordo}`,
      padding: "20px 24px",
      ...style,
    }}
  >
    {children}
  </div>
);

const Bottone: React.FC<{ readonly colore?: string; readonly premuto?: boolean; readonly style?: React.CSSProperties; readonly children: React.ReactNode }> = ({
  colore = T.accento,
  premuto = false,
  style,
  children,
}) => (
  <div
    style={{
      fontFamily: fontTitolo,
      fontWeight: 700,
      fontSize: 32,
      textAlign: "center",
      padding: "16px 22px",
      borderRadius: 999,
      background: colore,
      border: `4px solid ${T.bordo}`,
      boxShadow: premuto ? `2px 2px 0 ${T.bordo}` : `6px 6px 0 ${T.bordo}`,
      translate: premuto ? "4px 4px" : "0px 0px",
      ...style,
    }}
  >
    {children}
  </div>
);

// ---------------------------------------------------------------- QR code vero (qrcode-generator, la stessa libreria di app/qr.html)

const useMatrice = (testo: string) =>
  useMemo(() => {
    const q = qrcode(0, "M");
    q.addData(testo);
    q.make();
    const n = q.getModuleCount();
    return Array.from({ length: n }, (_, r) => Array.from({ length: n }, (_, c) => q.isDark(r, c)));
  }, [testo]);

/** Disegna il QR. "mostra" (0..1) fa comparire i quadratini in un ordine mescolato ma sempre uguale. */
const Qr: React.FC<{
  readonly testo: string;
  readonly lato: number;
  readonly colore?: string;
  readonly mostra?: number;
}> = ({ testo, lato, colore = T.testo, mostra = 1 }) => {
  const m = useMatrice(testo);
  const n = m.length;
  const bordo = 3;
  let d = "";
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const ordine = ((r * 73 + c * 151 + r * c * 7) % 101) / 101;
      if (m[r][c] && ordine < mostra) d += `M${c + bordo} ${r + bordo}h1v1h-1z`;
    }
  }
  const tot = n + bordo * 2;
  return (
    <svg width={lato} height={lato} viewBox={`0 0 ${tot} ${tot}`} shapeRendering="crispEdges" style={{ display: "block" }}>
      <rect width={tot} height={tot} fill="#FFFFFF" />
      <path d={d} fill={colore} />
    </svg>
  );
};

// ---------------------------------------------------------------- cursore

const Cursore: React.FC<{
  readonly vf: number;
  readonly punti: ReadonlyArray<readonly [number, number, number]>; // [frame, x, y]
  readonly clic: readonly number[];
}> = ({ vf, punti, clic }) => {
  const f = punti.map((p) => p[0]);
  const opz = { ...C, easing: Easing.inOut(Easing.cubic) };
  const x = interpolate(vf, f, punti.map((p) => p[1]), opz);
  const y = interpolate(vf, f, punti.map((p) => p[2]), opz);
  const premuto = clic.some((k) => vf >= k && vf < k + 5);
  const onda = clic.map((k) => vf - k).find((t) => t >= 0 && t < 14);
  return (
    <div style={{ position: "absolute", left: x, top: y, pointerEvents: "none" }}>
      {onda !== undefined ? (
        <div
          style={{
            position: "absolute",
            left: -30 - onda * 2,
            top: -30 - onda * 2,
            width: 60 + onda * 4,
            height: 60 + onda * 4,
            borderRadius: "50%",
            border: `5px solid ${T.accento}`,
            opacity: 1 - onda / 14,
          }}
        />
      ) : null}
      <svg width={58} height={70} viewBox="0 0 29 35" style={{ scale: premuto ? "0.85" : "1", transformOrigin: "0 0" }}>
        <path d="M2 2 L2 28 L9 21 L14 32 L19 30 L14 19 L24 19 Z" fill="#FFFFFF" stroke={T.bordo} strokeWidth={2.6} strokeLinejoin="round" />
      </svg>
    </div>
  );
};

/** Barra rossa che cancella un testo (da 0 a 1). */
const Barrato: React.FC<{ readonly p: number }> = ({ p }) => (
  <span
    style={{
      position: "absolute",
      left: -8,
      top: "48%",
      height: 8,
      borderRadius: 4,
      width: `${p * 110}%`,
      background: T.rosso,
      rotate: "-4deg",
    }}
  />
);

// ---------------------------------------------------------------- scena 1: le 3 app con il cartellino

/** Le tre app in miniatura: servono anche alla copertina. */
export const TreApp: React.FC<{ readonly vf: number; readonly gratis: number; readonly top: number }> = ({ vf, gratis, top }) => {
  const app = [
    { nome: "QR code", file: "qr.html", rot: -3 },
    { nome: "Unisci PDF", file: "pdf.html", rot: 2 },
    { nome: "Dividi spese", file: "spese.html", rot: -1 },
  ];
  return (
    <>
      {app.map((a, i) => {
        const giro = interpolate(vf, [gratis + i * 3, gratis + i * 3 + 8], [0, 1], C);
        const barra = interpolate(vf, [gratis - 6 + i * 3, gratis + i * 3], [0, 1], C);
        return (
          <Pop key={a.file} vf={vf} da={-30 + i * 2} style={{ position: "absolute", left: 60 + i * 305, top, rotate: `${a.rot}deg` }}>
            <Pannello style={{ position: "relative", width: 290, height: 500, background: "#F2EEE3" }}>
              <div style={{ display: "flex", gap: 7, padding: "12px 14px", borderBottom: `3px solid ${T.bordo}`, background: T.pannello }}>
                {[T.rosso, T.giallo, T.accento].map((x) => (
                  <span key={x} style={{ width: 13, height: 13, borderRadius: 7, background: x, border: `2px solid ${T.bordo}` }} />
                ))}
              </div>
              <div style={{ height: 320, display: "flex", alignItems: "center", justifyContent: "center", scale: "1.22" }}>
                {i === 0 ? (
                  <div style={{ border: `3px solid ${T.bordo}`, borderRadius: 10, overflow: "hidden" }}>
                    <Qr testo={LINK_QR} lato={170} />
                  </div>
                ) : i === 1 ? (
                  <div style={{ position: "relative", width: 170, height: 180 }}>
                    {[0, 1, 2].map((k) => (
                      <div
                        key={k}
                        style={{
                          position: "absolute",
                          left: 20 + k * 22,
                          top: 10 + k * 16,
                          width: 100,
                          height: 130,
                          background: "#FFFFFF",
                          border: `3px solid ${T.bordo}`,
                          borderRadius: 10,
                          rotate: `${(k - 1) * 6}deg`,
                        }}
                      >
                        <Codice style={{ fontSize: 22, margin: "10px 0 0 12px", color: T.rosso }}>PDF</Codice>
                        {[0, 1, 2].map((r) => (
                          <div key={r} style={{ margin: "8px 12px 0", height: 7, borderRadius: 4, background: "#1414142E", width: 60 - r * 12 }} />
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {["Giò → Luca", "Giò → Marta"].map((t) => (
                      <div key={t} style={{ fontFamily: fontTitolo, fontWeight: 700, fontSize: 26, padding: "8px 14px", borderRadius: 12, border: `3px solid ${T.bordo}`, background: T.giallo }}>
                        {t}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div style={{ fontFamily: fontTitolo, fontWeight: 700, fontSize: 36, textAlign: "center", letterSpacing: -1 }}>{a.nome}</div>
            </Pannello>
            {/* cartellino: "abbonamento" che si gira in "gratis" */}
            <div
              style={{
                position: "absolute",
                left: 30,
                top: 452,
                rotate: `${-a.rot * 2 + 3}deg`,
                scale: `${Math.abs(1 - giro * 2)} 1`,
              }}
            >
              <Adesivo
                colore={giro < 0.5 ? T.rosso : T.accento}
                testo={giro < 0.5 ? "#FFFFFF" : T.testo}
                style={{ fontSize: 34, padding: "8px 18px", position: "relative" }}
              >
                {giro < 0.5 ? (
                  <span style={{ position: "relative" }}>
                    € / mese
                    <Barrato p={barra} />
                  </span>
                ) : (
                  "GRATIS"
                )}
              </Adesivo>
            </div>
          </Pop>
        );
      })}
    </>
  );
};

const Scena1: React.FC<{ readonly vf: number }> = ({ vf }) => (
  <>
    <Titolo vf={vf} da={-30}>
      Smetti di
      <br />
      <Evid colore={T.rosso}>pagarle.</Evid>
    </Titolo>
    <TreApp vf={vf} gratis={GRATIS} top={600} />
    <Pop vf={vf} da={CLAUDE} style={{ position: "absolute", left: 140, top: 1200, rotate: "-3deg" }}>
      <Adesivo colore={T.giallo} style={{ fontSize: 54 }}>
        Rifatte con Claude
      </Adesivo>
    </Pop>
  </>
);

// ---------------------------------------------------------------- scena 2: il QR code

const Scena2: React.FC<{ readonly vf: number }> = ({ vf }) => {
  const nostro = vf >= QUESTO - 2;
  if (!nostro) {
    // il QR di un sito con la prova gratuita: i giorni scendono, poi "scaduto"
    const giorni = Math.round(interpolate(vf, [SCADERE, PROVA], [14, 0], C));
    const timbro = molla(vf, PROVA + 3, 11);
    return (
      <>
        <Titolo vf={vf} da={S.qr - 8}>
          <Num n={1} />
          Il QR code
        </Titolo>
        <Pop vf={vf} da={S.qr - 4} style={{ position: "absolute", inset: 0 }}>
          <Pannello style={{ left: 150, top: 560, width: 720, height: 560, rotate: "-2deg", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 34 }}>
            <div style={{ fontFamily: fontTitolo, fontWeight: 700, fontSize: 46 }}>Pizzeria Il Forno</div>
            <div style={{ fontFamily: fontTitolo, fontWeight: 500, fontSize: 30, color: T.muto, marginBottom: 22 }}>Inquadra per il menù</div>
            <div style={{ border: `4px solid ${T.bordo}`, borderRadius: 14, overflow: "hidden", opacity: vf >= PROVA + 3 ? 0.35 : 1 }}>
              <Qr testo="https://qr-prova.example/r/7f2k9" lato={330} colore="#3A3A3A" />
            </div>
          </Pannello>
        </Pop>
        <Pop vf={vf} da={SCADERE - 4} style={{ position: "absolute", left: 560, top: 520, rotate: "4deg" }}>
          <Adesivo colore={giorni > 3 ? T.giallo : T.rosso} testo={giorni > 3 ? T.testo : "#FFFFFF"} style={{ fontSize: 40 }}>
            prova gratis: {giorni} gg
          </Adesivo>
        </Pop>
        {vf >= PROVA + 3 ? (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 760,
              display: "flex",
              justifyContent: "center",
              opacity: Math.min(1, timbro * 2),
              scale: String(interpolate(timbro, [0, 1], [2.2, 1])),
            }}
          >
            <div
              style={{
                fontFamily: fontTitolo,
                fontWeight: 700,
                fontSize: 110,
                letterSpacing: 4,
                color: T.rosso,
                border: `10px solid ${T.rosso}`,
                borderRadius: 24,
                padding: "6px 34px",
                rotate: "-12deg",
                background: "#FFFFFFD9",
              }}
            >
              SCADUTO
            </div>
          </div>
        ) : null}
        <Pop vf={vf} da={SCADERE} style={{ position: "absolute", left: 110, top: 1170, rotate: "-2deg" }}>
          <Adesivo colore={T.pannello} style={{ fontSize: 40 }}>
            …e il volantino è già stampato
          </Adesivo>
        </Pop>
      </>
    );
  }
  // la nostra app: il link si scrive, il QR si disegna, non scade
  const testo = LINK_QR.replace("https://", "");
  const battute = Math.floor(interpolate(vf, [QUESTO + 4, LINK + 14], [0, testo.length], C));
  const mostra = interpolate(vf, [QUESTO + 10, LINK + 30], [0, 1], C);
  return (
    <>
      <Titolo vf={vf} da={QUESTO - 2}>
        <Num n={1} />
        Il QR code
        <br />
        <Evid colore={T.accento}>che non scade.</Evid>
      </Titolo>
      <Pop vf={vf} da={QUESTO - 2} style={{ position: "absolute", inset: 0 }}>
        <Finestra file="qr.html" style={{ left: 60, top: 580, width: 900, height: 700 }}>
          <Scheda>
            <div style={{ fontFamily: fontTitolo, fontWeight: 700, fontSize: 28, marginBottom: 10 }}>Link o testo</div>
            <Codice
              style={{
                fontSize: 30,
                padding: "12px 16px",
                border: `3px solid ${T.bordo}`,
                borderRadius: 12,
                background: "#FFFFFF",
                outline: vf >= LINK && vf < LINK + 30 ? `5px solid ${T.giallo}` : "none",
              }}
            >
              {testo.slice(0, battute)}
              {battute < testo.length && vf % 16 < 8 ? "▌" : ""}
            </Codice>
          </Scheda>
          <div style={{ display: "flex", gap: 28, marginTop: 26, alignItems: "center" }}>
            <div style={{ border: `4px solid ${T.bordo}`, borderRadius: 16, overflow: "hidden", flexShrink: 0 }}>
              <Qr testo={LINK_QR} lato={330} mostra={mostra} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 20, flex: 1 }}>
              <Bottone>Scarica PNG</Bottone>
              <Bottone colore={T.giallo}>Scarica SVG</Bottone>
              <div style={{ fontFamily: fontTitolo, fontWeight: 500, fontSize: 26, color: T.muto, lineHeight: 1.25 }}>
                Il link è dentro il disegno: nessun sito in mezzo.
              </div>
            </div>
          </div>
        </Finestra>
      </Pop>
      <Pop vf={vf} da={NON_SCADE} style={{ position: "absolute", left: 120, top: 1240, rotate: "-3deg" }}>
        <Adesivo colore={T.accento} style={{ fontSize: 60 }}>
          ✓ Non scade mai
        </Adesivo>
      </Pop>
    </>
  );
};

// ---------------------------------------------------------------- scena 3: unisci PDF

const FILE_PDF = [
  { nome: "fattura.pdf", info: "2 pag." },
  { nome: "contratto.pdf", info: "3 pag." },
  { nome: "documento.jpg", info: "foto" },
];

const Scena3: React.FC<{ readonly vf: number }> = ({ vf }) => {
  const UNISCI = 462;
  const premuto = vf >= UNISCI && vf < UNISCI + 6;
  const fatto = vf >= UNISCI + 8;
  const nuvola = molla(vf, NON_CARICATI, 12);
  const croce = interpolate(vf, [NON_CARICATI + 8, NON_CARICATI + 16], [0, 1], C);
  return (
    <>
      <Titolo vf={vf} da={S.pdf - 8}>
        <Num n={2} />
        Unisci
        <br />
        <Evid colore={T.accento}>i PDF.</Evid>
      </Titolo>
      <Pop vf={vf} da={S.pdf - 4} style={{ position: "absolute", inset: 0 }}>
        <Finestra file="pdf.html" style={{ left: 60, top: 580, width: 900, height: 700 }}>
          <Scheda>
            <div
              style={{
                border: `4px dashed ${T.bordo}`,
                borderRadius: 16,
                padding: "22px 0",
                textAlign: "center",
                fontFamily: fontTitolo,
                fontWeight: 700,
                fontSize: 30,
                background: vf >= UNIRE - 4 && vf < UNIRE + 30 ? T.accento : "#FFFFFF",
              }}
            >
              Trascina qui PDF e foto
            </div>
            <div style={{ marginTop: 16 }}>
              {FILE_PDF.map((f, i) => {
                const da = UNIRE + i * 7;
                const p = molla(vf, da, 13);
                return vf < da ? (
                  <div key={f.nome} style={{ height: 82 }} />
                ) : (
                  <div
                    key={f.nome}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      height: 70,
                      marginBottom: 12,
                      padding: "0 18px",
                      border: `3px solid ${T.bordo}`,
                      borderRadius: 14,
                      background: "#FFFFFF",
                      opacity: Math.min(1, p * 1.5),
                      translate: `0px ${interpolate(p, [0, 1], [-60, 0])}px`,
                    }}
                  >
                    <span
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 22,
                        border: `3px solid ${T.bordo}`,
                        background: T.giallo,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: fontCodice,
                        fontWeight: 700,
                        fontSize: 24,
                      }}
                    >
                      {i + 1}
                    </span>
                    <span style={{ fontFamily: fontTitolo, fontWeight: 700, fontSize: 32, flex: 1 }}>{f.nome}</span>
                    <Codice style={{ fontSize: 24, color: T.muto }}>{f.info}</Codice>
                  </div>
                );
              })}
            </div>
            <Bottone premuto={premuto} colore={fatto ? T.giallo : T.accento} style={{ marginTop: 6 }}>
              {fatto ? "✓ uniti.pdf · 6 pagine" : "Unisci 6 pagine e scarica"}
            </Bottone>
          </Scheda>
        </Finestra>
      </Pop>
      <Cursore
        vf={vf}
        punti={[
          [S.pdf, 980, 1300],
          [UNISCI - 14, 620, 1170],
          [UNISCI + 30, 640, 1190],
        ]}
        clic={[UNISCI]}
      />
      {/* "non vengono caricati": la nuvola barrata */}
      {vf >= NON_CARICATI ? (
        <div
          style={{
            position: "absolute",
            left: 680,
            top: 360,
            rotate: "6deg",
            opacity: Math.min(1, nuvola * 1.5),
            scale: String(0.6 + 0.4 * nuvola),
          }}
        >
          <Adesivo colore={T.pannello} style={{ fontSize: 40, position: "relative" }}>
            <span style={{ position: "relative" }}>
              ☁ upload
              <Barrato p={croce} />
            </span>
          </Adesivo>
        </div>
      ) : null}
      <Pop vf={vf} da={RESTANO} style={{ position: "absolute", left: 100, top: 1240, rotate: "-2deg" }}>
        <Adesivo colore={T.accento} style={{ fontSize: 50 }}>
          🔒 Restano sul tuo PC
        </Adesivo>
      </Pop>
    </>
  );
};

// ---------------------------------------------------------------- scena 4: dividi le spese

// Gli stessi conti di app/spese.html: 90 € benzina (Marta), 120,50 € cena (Luca), 12 € gelati (Giò), divisi tra tutti e tre.
const SPESE_LISTA = [
  { cosa: "Benzina", chi: "Marta", euro: "90,00 €" },
  { cosa: "Cena", chi: "Luca", euro: "120,50 €" },
  { cosa: "Gelati", chi: "Giò", euro: "12,00 €" },
];
const BONIFICI = ["Giò dà 46,33 € a Luca", "Giò dà 15,83 € a Marta"];

const Scena4: React.FC<{ readonly vf: number }> = ({ vf }) => {
  const contatore = Math.round(interpolate(vf, [ILLIMITATE, ILLIMITATE + 22], [3, 99], { ...C, easing: Easing.in(Easing.quad) }));
  return (
    <>
      <Titolo vf={vf} da={S.spese - 8}>
        <Num n={3} />
        Dividi
        <br />
        <Evid colore={T.accento}>le spese.</Evid>
      </Titolo>
      <Pop vf={vf} da={S.spese - 4} style={{ position: "absolute", inset: 0 }}>
        <Finestra file="spese.html" style={{ left: 60, top: 580, width: 900, height: 700 }}>
          <Scheda style={{ padding: "16px 22px" }}>
            {SPESE_LISTA.map((s, i) => {
              const da = S.spese + 2 + i * 6;
              return (
                <div
                  key={s.cosa}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom: i < 2 ? "3px dashed #14141426" : "none",
                    opacity: interpolate(vf, [da, da + 5], [0, 1], C),
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: fontTitolo, fontWeight: 700, fontSize: 32 }}>{s.cosa}</div>
                    <div style={{ fontFamily: fontTitolo, fontWeight: 500, fontSize: 22, color: T.muto }}>pagata da {s.chi} · divisa tra tutti</div>
                  </div>
                  <Codice style={{ fontSize: 32 }}>{s.euro}</Codice>
                </div>
              );
            })}
          </Scheda>
          <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 18 }}>
            {BONIFICI.map((b, i) => (
              <Pop key={b} vf={vf} da={CHI_DA + 6 + i * 14}>
                <div
                  style={{
                    fontFamily: fontTitolo,
                    fontWeight: 700,
                    fontSize: 40,
                    padding: "18px 24px",
                    borderRadius: 16,
                    border: `4px solid ${T.bordo}`,
                    background: T.giallo,
                    boxShadow: `6px 6px 0 ${T.bordo}`,
                  }}
                >
                  {b}
                </div>
              </Pop>
            ))}
          </div>
        </Finestra>
      </Pop>
      <Pop vf={vf} da={ILLIMITATE} style={{ position: "absolute", left: 600, top: 520, rotate: "5deg" }}>
        <Adesivo colore={T.rosso} testo="#FFFFFF" style={{ fontSize: 38 }}>
          spese oggi: {contatore >= 99 ? "∞" : contatore}
        </Adesivo>
      </Pop>
      <Pop vf={vf} da={MINIMO} style={{ position: "absolute", left: 110, top: 1250, rotate: "-3deg" }}>
        <Adesivo colore={T.accento} style={{ fontSize: 52 }}>
          Solo 2 bonifici, al centesimo
        </Adesivo>
      </Pop>
    </>
  );
};

// ---------------------------------------------------------------- scena 5: tre file, li apri e funzionano

const FILE_APP = ["qr.html", "pdf.html", "spese.html"];

const Scena5: React.FC<{ readonly vf: number }> = ({ vf }) => (
  <>
    <Titolo vf={vf} da={S.file - 8}>
      3 file.
      <br />
      <Evid colore={T.accento}>Li apri e vanno.</Evid>
    </Titolo>
    {FILE_APP.map((f, i) => {
      const ok = vf >= FUNZIONANO + i * 5;
      const pOk = molla(vf, FUNZIONANO + i * 5, 11);
      return (
        <Pop key={f} vf={vf} da={S.file - 4 + i * 5} style={{ position: "absolute", left: 80 + i * 300, top: 620 }}>
          <div style={{ position: "relative", width: 260, height: 330 }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: ok ? "#EFFCF4" : T.pannello,
                border: `4px solid ${T.bordo}`,
                borderRadius: "20px 64px 20px 20px",
                boxShadow: `9px 9px 0 ${T.bordo}`,
              }}
            />
            <div style={{ position: "absolute", left: 30, top: 60 }}>
              <Codice style={{ fontSize: 46, color: T.accentoTesto }}>{"</>"}</Codice>
              {[0, 1, 2, 3].map((r) => (
                <div key={r} style={{ marginTop: 16, height: 10, borderRadius: 5, background: "#14141426", width: 180 - r * 30 }} />
              ))}
            </div>
            {ok ? (
              <div
                style={{
                  position: "absolute",
                  right: -18,
                  top: -22,
                  width: 82,
                  height: 82,
                  borderRadius: 41,
                  background: T.accento,
                  border: `4px solid ${T.bordo}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: fontTitolo,
                  fontWeight: 700,
                  fontSize: 50,
                  scale: String(pOk),
                }}
              >
                ✓
              </div>
            ) : null}
          </div>
          <Codice style={{ fontSize: 30, textAlign: "center", marginTop: 20, width: 260 }}>{f}</Codice>
        </Pop>
      );
    })}
    <Cursore
      vf={vf}
      punti={[
        [S.file, 900, 1250],
        [APRI - 8, 220, 800],
        [APRI + 20, 230, 810],
      ]}
      clic={[APRI, APRI + 6]}
    />
    <Pop vf={vf} da={APRI + 4} style={{ position: "absolute", left: 90, top: 1060, rotate: "-2deg" }}>
      <Adesivo colore={T.pannello} style={{ fontSize: 34 }}>
        niente account · niente installazioni
      </Adesivo>
    </Pop>
    <Pop vf={vf} da={DIDASCALIA} style={{ position: "absolute", left: 140, top: 1190, rotate: "3deg" }}>
      <Adesivo colore={T.giallo} style={{ fontSize: 50 }}>
        ↓ Link e prompt in didascalia
      </Adesivo>
    </Pop>
  </>
);

// ---------------------------------------------------------------- scena 6: mandalo a…

const Scena6: React.FC<{ readonly vf: number }> = ({ vf }) => (
  <>
    <div style={{ opacity: 0.3 }}>
      <Scena5 vf={S.mandalo - 1} />
    </div>
    <Pop vf={vf} da={S.mandalo} style={{ position: "absolute", left: 0, right: 0, top: 820, display: "flex", justifyContent: "center" }}>
      <Adesivo colore={T.giallo} style={{ fontSize: 70, rotate: "-3deg", padding: "22px 36px", lineHeight: 1.12 }}>
        Mandalo a chi paga
        <br />
        per fare un QR ↗
      </Adesivo>
    </Pop>
  </>
);

// ---------------------------------------------------------------- scena completa a un frame virtuale

const Scena: React.FC<{ readonly vf: number }> = ({ vf }) => {
  const inizio = [0, S.qr, QUESTO - 2, S.pdf, S.spese, S.file, S.mandalo].filter((x) => vf >= x).pop() ?? 0;
  const zoom = interpolate(vf - inizio, [0, 120], [1, 1.02], C);
  return (
    <AbsoluteFill style={{ background: T.sfondo }}>
      <AbsoluteFill style={{ transformOrigin: "50% 45%", scale: String(zoom) }}>
        <Chip />
        {vf < S.qr ? <Scena1 vf={vf} /> : null}
        {vf >= S.qr && vf < S.pdf ? <Scena2 vf={vf} /> : null}
        {vf >= S.pdf && vf < S.spese ? <Scena3 vf={vf} /> : null}
        {vf >= S.spese && vf < S.file ? <Scena4 vf={vf} /> : null}
        {vf >= S.file && vf < S.mandalo ? <Scena5 vf={vf} /> : null}
        {vf >= S.mandalo ? <Scena6 vf={vf} /> : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- sottotitoli

const sistemaCaptions = (lista: Caption[]): Caption[] =>
  lista.map((c) => ({ ...c, text: c.text.replace(/\btre\b/gi, "3") }));

const Sottotitoli: React.FC<{ readonly captions: Caption[] }> = ({ captions }) => {
  const frame = useCurrentFrame();
  const { pages } = useMemo(
    () =>
      createTikTokStyleCaptions({
        captions: sistemaCaptions(captions),
        combineTokensWithinMilliseconds: 650,
        breakOnSilenceAfterMilliseconds: 250,
      }),
    [captions],
  );
  if (frame >= S.mandalo - 2) return null;
  const ms = (frame / FPS) * 1000;
  const i = pages.findIndex(
    (p, k) => ms >= p.startMs && ms < Math.min(p.startMs + p.durationMs, pages[k + 1]?.startMs ?? Infinity),
  );
  if (i === -1) return null;
  const pagina = pages[i];
  if (ms > pagina.tokens[pagina.tokens.length - 1].toMs + 350) return null;
  const pop = molla(frame, Math.round((pagina.startMs / 1000) * FPS), 13);
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 120,
        top: 1420,
        display: "flex",
        justifyContent: "center",
        textAlign: "center",
        scale: String(0.8 + 0.2 * pop),
      }}
    >
      <div
        style={{
          fontFamily: fontTitolo,
          fontWeight: 700,
          fontSize: 58,
          lineHeight: 1.15,
          color: T.testo,
          background: T.pannello,
          border: `4px solid ${T.bordo}`,
          borderRadius: 20,
          padding: "8px 24px",
          boxShadow: `6px 6px 0 ${T.bordo}`,
        }}
      >
        {pagina.tokens.map((t, k) => {
          const attiva = ms >= t.fromMs && ms < t.toMs + 60;
          return (
            <span key={k} style={{ whiteSpace: "pre-wrap", background: attiva ? T.accento : "transparent", borderRadius: 10 }}>
              {t.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- montaggio

export const Reel05: React.FC = () => {
  const frame = useCurrentFrame();
  const s = (n: string) => staticFile(`suoni/${n}.wav`);
  const ritorno = interpolate(frame, [LOOP, DURATA - 1], [0, 1], C);
  return (
    <AbsoluteFill style={{ background: T.sfondo }}>
      <Scena vf={frame} />
      {ritorno > 0 ? (
        <AbsoluteFill style={{ opacity: ritorno }}>
          <Scena vf={0} />
        </AbsoluteFill>
      ) : null}
      <Sequence name="Sottotitoli" from={0} durationInFrames={DURATA}>
        <Sottotitoli captions={tempi.captions as Caption[]} />
      </Sequence>

      <Audio name="Voce" src={staticFile("voce.wav")} />
      <Audio name="Musica (generata)" src={s("musica")} volume={0.12} />
      <Track name="Effetti">
        <Audio name="pop claude" src={s("pop")} from={CLAUDE} volume={0.3} />
        {[0, 1, 2].map((i) => (
          <Audio key={`g${i}`} name={`ding gratis ${i + 1}`} src={s("ding")} from={GRATIS + i * 3} volume={0.22} />
        ))}
        {[S.qr, QUESTO - 2, S.pdf, S.spese, S.file].map((x) => (
          <Audio key={`w${x}`} name={`whoosh scena ${x}`} src={s("whoosh")} from={x - 6} volume={0.3} />
        ))}
        <Audio name="timbro scaduto" src={s("timbro")} from={PROVA + 3} volume={0.5} />
        <Audio name="digitazione link" src={s("digitazione")} from={QUESTO + 4} durationInFrames={34} volume={0.25} />
        <Audio name="ding non scade" src={s("ding")} from={NON_SCADE} volume={0.3} />
        {[0, 1, 2].map((i) => (
          <Audio key={`f${i}`} name={`pop file ${i + 1}`} src={s("pop")} from={UNIRE + i * 7} volume={0.28} />
        ))}
        <Audio name="timbro upload" src={s("timbro")} from={NON_CARICATI + 8} volume={0.35} />
        <Audio name="click unisci" src={s("click")} from={462} volume={0.35} />
        <Audio name="pop restano" src={s("pop")} from={RESTANO} volume={0.3} />
        <Audio name="pop contatore" src={s("pop")} from={ILLIMITATE} volume={0.25} />
        {[0, 1].map((i) => (
          <Audio key={`b${i}`} name={`pop bonifico ${i + 1}`} src={s("pop")} from={CHI_DA + 6 + i * 14} volume={0.3} />
        ))}
        <Audio name="ding minimo" src={s("ding")} from={MINIMO} volume={0.28} />
        <Audio name="click apri 1" src={s("click")} from={APRI} volume={0.35} />
        <Audio name="click apri 2" src={s("click")} from={APRI + 6} volume={0.35} />
        {[0, 1, 2].map((i) => (
          <Audio key={`ok${i}`} name={`ding file ${i + 1}`} src={s("ding")} from={FUNZIONANO + i * 5} volume={0.2} />
        ))}
        <Audio name="pop didascalia" src={s("pop")} from={DIDASCALIA} volume={0.3} />
        <Audio name="pop mandalo" src={s("pop")} from={S.mandalo} volume={0.32} />
      </Track>
    </AbsoluteFill>
  );
};
