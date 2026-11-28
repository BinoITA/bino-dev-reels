// © 2026 BinoITA (bino.dev, @bino.devs) — CC BY 4.0: se lo riusi, cita "@bino.devs — github.com/BinoITA/bino-dev-reels"
// Reel #07 — "Le 5 frasi che ti dice l'AI (e cosa vogliono dire davvero)".
// Una chat sola che scorre come in un'app vera: ogni frase dell'AI arriva dopo i puntini, la "camera" si avvicina,
// sotto entra la scheda TRADUZIONE con timbro ed evidenziatore che si disegna. Poi il dato vero (Stanford, Science 2026)
// con i numeri che girano, il prompt regalato che si scrive da solo e il finale "Mandalo a chi…" con loop sul primo fotogramma.
// Qualità: ombre a due livelli, grana della carta, molle diverse per peso, scia di movimento nei passaggi veloci.
import { Audio } from "@remotion/media";
import { createTikTokStyleCaptions, type Caption } from "@remotion/captions";
import { CameraMotionBlur } from "@remotion/motion-blur";
import { evolvePath, getLength, getPointAtLength, getTangentAtLength } from "@remotion/paths";
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, interpolateColors, Sequence, staticFile, Track, useCurrentFrame } from "remotion";
import { CURVA_ENTRA, CURVA_ESCE, mollaLeggera, mollaPesante } from "./movimento";
import { C, fontCodice, fontTitolo, T } from "./stile";
import tempi from "./tempi.json";

// ---------------------------------------------------------------- tempi (fotogrammi a 30 fps, da tempi.json)

export const DURATA = 1035;
const FPS = 30;

type Frase = {
  readonly n: number;
  readonly tu: number; // arriva il messaggio dell'utente
  readonly tip: number; // l'AI sta scrivendo
  readonly ai: number; // arriva la frase dell'AI (detta dalla voce)
  readonly tr: number; // entra la traduzione
  readonly testoTu: string;
  readonly testoAi: string;
  readonly trad: string;
  readonly ora: string;
};

export const FRASI: readonly Frase[] = [
  { n: 1, tu: 104, tip: 108, ai: 118, tr: 155, testoTu: "Perché il cielo è blu?", testoAi: "Ottima domanda!", trad: "Non so rispondere, intanto ti adulo.", ora: "21:42" },
  { n: 2, tu: 210, tip: 214, ai: 225, tr: 284, testoTu: "Mi sa che hai sbagliato i conti.", testoAi: "Hai perfettamente ragione!", trad: "Così smetti di discutere.", ora: "21:43" },
  { n: 3, tu: 317, tip: 321, ai: 332, tr: 390, testoTu: "Correggi la frase, per favore.", testoAi: "Ecco la versione corretta.", trad: "Identica, con una virgola spostata.", ora: "21:44" },
  { n: 4, tu: 443, tip: 447, ai: 457, tr: 519, testoTu: "Hai sbagliato di nuovo.", testoAi: "Mi scuso per la confusione.", trad: "Lo rifarò uguale.", ora: "21:45" },
  { n: 5, tu: 546, tip: 550, ai: 560, tr: 626, testoTu: "Ok, grazie. Ho finito!", testoAi: "Fammi sapere se hai altre domande.", trad: "Tornerai. Tornano sempre.", ora: "03:07" },
];

const ANZI = 20; // "Anzi no, fa 4."
const TIP0 = 30;
const RAGIONE0 = 46; // secondo "Hai perfettamente ragione!"
const FINE_GANCIO = 104;
const CORONA = 194; // "intanto ti adulo"
const DIGITA_TU = 246; // l'utente prova a ribattere…
const SMETTI = 290; // …e smette
const VIRGOLA = 419;
const TORNANO = 653;
const PUNTINI_ETERNI = 600;
const FATTO = 684;
const RAGIONE = 752;
const PERC = 771;
const SPESSO = 799;
const REGALO = 846;
const GRATIS = 933;
const MANDALO = 958;
const SEMPRE = 980;
const LOOP = 1005;

// righe della traduzione (per tenere ferma l'altezza della scheda mentre "traduce")
const RIGHE = [2, 1, 2, 1, 1];

// la frase attiva (dalla sua comparsa al messaggio dell'utente dopo)
const fineFrase = (i: number) => (i < FRASI.length - 1 ? FRASI[i + 1].tu : FATTO);

// ---------------------------------------------------------------- utilità grafiche

const OMBRA = `14px 14px 0 ${T.bordo}, 0 34px 70px rgba(20,20,20,0.16)`;
const CREMA = "#FFFDF7";
const GIALLINO = "#FFF1B0";

/** Scossa che si smorza: per i timbri che "battono" sulla scheda. */
const scossa = (vf: number, da: number, forza = 7) => {
  const t = vf - da;
  if (t < 0 || t > 12) return [0, 0];
  const s = Math.exp(-t / 3.2);
  return [Math.sin(t * 2.3) * forza * s, Math.cos(t * 2.9) * forza * 0.6 * s];
};

/** Evidenziatore che si disegna da sinistra a destra (anche su più righe). */
const Marcato: React.FC<{ readonly vf: number; readonly da: number; readonly colore?: string; readonly children: React.ReactNode }> = ({
  vf,
  da,
  colore = T.accento,
  children,
}) => {
  const p = interpolate(vf, [da, da + 12], [0, 1], { ...C, easing: CURVA_ENTRA });
  return (
    <span
      style={{
        backgroundImage: `linear-gradient(176deg, transparent 14%, ${colore} 14%, ${colore} 90%, transparent 90%)`,
        backgroundSize: `${p * 100}% 100%`,
        backgroundRepeat: "no-repeat",
        WebkitBoxDecorationBreak: "clone",
        boxDecorationBreak: "clone",
        padding: "0 10px",
        margin: "0 -6px",
      }}
    >
      {children}
    </span>
  );
};

const Chip: React.FC = () => (
  <div
    style={{
      position: "absolute",
      top: 246,
      left: 60,
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
    L'AI TRADOTTA · #07
  </div>
);

/** Cinque tacche in alto a destra: si accendono una per frase. */
const Avanzamento: React.FC<{ readonly vf: number }> = ({ vf }) => {
  const fuori = interpolate(vf, [FATTO, FATTO + 10], [1, 0], C);
  return (
    <div style={{ position: "absolute", top: 268, left: 700, display: "flex", gap: 10, opacity: fuori }}>
      {FRASI.map((f, i) => {
        const p = mollaLeggera(vf, f.ai);
        const attiva = vf >= f.ai && vf < fineFrase(i);
        return (
          <div
            key={f.n}
            style={{
              width: 44,
              height: 16,
              borderRadius: 8,
              border: `3px solid ${T.bordo}`,
              background: interpolateColors(p, [0, 1], [CREMA, attiva ? T.giallo : T.accento]),
              scale: String(1 + (attiva ? 0.12 * Math.sin(vf / 4) * 0.5 + 0.06 : 0)),
            }}
          />
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------- la chat

type Msg = {
  readonly lato: "tu" | "ai";
  readonly testo?: string;
  readonly da: number;
  readonly tip?: number; // da quando l'AI "sta scrivendo"
  readonly fino?: number; // si richiude (solo per i puntini)
  readonly ora?: string;
  readonly frase?: number; // indice della frase in FRASI
  readonly sopra?: number; // spazio sopra la bolla per corone, timbri, contatori
  readonly gag?: "doppio" | "corona" | "scuse";
};

const MESSAGGI: readonly Msg[] = [
  { lato: "tu", testo: "Ciao!", da: -300, ora: "21:39" },
  { lato: "ai", testo: "Ciao! Come posso aiutarti oggi?", da: -300, ora: "21:39" },
  { lato: "tu", testo: "2+2 fa 5.", da: -300, ora: "21:40" },
  { lato: "ai", testo: "Hai perfettamente ragione!", da: -300, ora: "21:40" },
  { lato: "tu", testo: "Anzi no, fa 4.", da: ANZI, ora: "21:41" },
  { lato: "ai", testo: "Hai perfettamente ragione!", da: RAGIONE0, tip: TIP0, ora: "21:41", sopra: 34, gag: "doppio" },
  ...FRASI.flatMap((f, i): Msg[] => [
    { lato: "tu", testo: f.testoTu, da: f.tu, ora: f.ora === "03:07" ? "03:06" : f.ora, sopra: i === 0 ? 86 : 0, gag: i === 0 ? "corona" : undefined },
    { lato: "ai", testo: f.testoAi, da: f.ai, tip: f.tip, ora: f.ora, frase: i, sopra: i === 3 ? 40 : 0, gag: i === 3 ? "scuse" : undefined },
    // frase 2: l'utente prova a ribattere sotto la risposta… e smette
    ...(i === 1 ? [{ lato: "tu" as const, da: 100000, tip: DIGITA_TU, fino: SMETTI }] : []),
  ]),
  { lato: "ai", da: 100000, tip: PUNTINI_ETERNI }, // i puntini che non se ne vanno più
];

const Puntini: React.FC<{ readonly vf: number; readonly forte?: boolean; readonly chiaro?: boolean }> = ({ vf, forte, chiaro }) => (
  <div style={{ display: "flex", gap: 12, padding: "30px 32px" }}>
    {[0, 1, 2].map((i) => {
      const y = Math.max(0, Math.sin(vf / 3 - i * 0.95));
      return (
        <span
          key={i}
          style={{
            width: 17,
            height: 17,
            borderRadius: 9,
            background: chiaro ? CREMA : T.testo,
            opacity: 0.3 + 0.7 * y,
            translate: `0px ${-y * (forte ? 16 : 9)}px`,
          }}
        />
      );
    })}
  </div>
);

const Corona: React.FC<{ readonly vf: number }> = ({ vf }) => {
  if (vf < CORONA) return null;
  const p = mollaLeggera(vf, CORONA);
  const y = interpolate(p, [0, 1], [-190, 0]);
  return (
    <div style={{ position: "absolute", left: -18, top: -92, translate: `0px ${y}px`, rotate: `${interpolate(p, [0, 1], [-38, -14])}deg` }}>
      <svg width={128} height={92} viewBox="0 0 64 46">
        <path d="M4 40 L8 12 L20 26 L32 6 L44 26 L56 12 L60 40 Z" fill={T.giallo} stroke={T.bordo} strokeWidth={3.4} strokeLinejoin="round" />
        <rect x="4" y="37" width="56" height="7" rx="2" fill="#F5B82E" stroke={T.bordo} strokeWidth={3.4} />
        {[[8, 12], [32, 6], [56, 12]].map(([cx, cy]) => (
          <circle key={cx} cx={cx} cy={cy} r={4} fill={T.rosso} stroke={T.bordo} strokeWidth={2.4} />
        ))}
      </svg>
      {[0, 1, 2].map((i) => {
        const s = mollaLeggera(vf, CORONA + 6 + i * 3);
        return (
          <span
            key={i}
            style={{
              position: "absolute",
              left: [-14, 120, 58][i],
              top: [6, 10, -34][i],
              width: 18,
              height: 18,
              background: T.giallo,
              border: `2px solid ${T.bordo}`,
              rotate: "45deg",
              scale: String(s * (1 - interpolate(vf, [CORONA + 20 + i * 3, CORONA + 34], [0, 1], C))),
            }}
          />
        );
      })}
    </div>
  );
};

const Doppio: React.FC<{ readonly vf: number }> = ({ vf }) => {
  const p = mollaLeggera(vf, RAGIONE0 + 6);
  return (
    <div
      style={{
        position: "absolute",
        right: -26,
        top: -30,
        width: 78,
        height: 78,
        borderRadius: "50%",
        border: `5px solid ${T.rosso}`,
        color: T.rosso,
        background: CREMA,
        fontFamily: fontTitolo,
        fontWeight: 700,
        fontSize: 34,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        rotate: "12deg",
        scale: String(interpolate(p, [0, 1], [2.2, 1])),
        opacity: interpolate(vf, [RAGIONE0 + 6, RAGIONE0 + 8], [0, 1], C),
      }}
    >
      ×2
    </div>
  );
};

const Scuse: React.FC<{ readonly vf: number; readonly tr: number }> = ({ vf, tr }) => {
  // il contatore sale mentre la voce dice "Lo rifarò uguale"
  const n = vf < tr ? 1 : Math.min(9, 1 + Math.floor((vf - tr) / 3.2));
  const scatto = vf >= tr ? mollaLeggera(vf, tr + Math.floor((vf - tr) / 3.2) * 3.2) : 1;
  return (
    <div
      style={{
        position: "absolute",
        right: -30,
        top: -36,
        fontFamily: fontCodice,
        fontWeight: 700,
        fontSize: 26,
        letterSpacing: 1,
        padding: "8px 14px",
        borderRadius: 12,
        background: T.rosso,
        color: CREMA,
        border: `3px solid ${T.bordo}`,
        rotate: "6deg",
        scale: String(interpolate(scatto, [0, 1], [1.25, 1])),
      }}
    >
      SCUSE ×{n}
    </div>
  );
};

const Bolla: React.FC<{ readonly vf: number; readonly m: Msg }> = ({ vf, m }) => {
  const tu = m.lato === "tu";
  const fr = m.frase;
  const attiva = fr !== undefined && vf >= m.da && vf < fineFrase(fr);
  const ev = fr !== undefined ? mollaLeggera(vf, m.da) * (1 - interpolate(vf, [fineFrase(fr), fineFrase(fr) + 8], [0, 1], C)) : 0;
  const pop = m.da < 0 ? 1 : mollaLeggera(vf, m.da);
  return (
    <div style={{ alignSelf: tu ? "flex-end" : "flex-start", display: "flex", flexDirection: "column", alignItems: tu ? "flex-end" : "flex-start" }}>
      <div
        style={{
          position: "relative",
          maxWidth: 650,
          padding: "22px 30px",
          fontFamily: fontTitolo,
          fontWeight: 500,
          fontSize: 46,
          lineHeight: 1.18,
          letterSpacing: -0.5,
          color: tu ? CREMA : T.testo,
          background: tu ? T.testo : interpolateColors(ev, [0, 1], ["#FFFFFF", GIALLINO]),
          border: `3px solid ${T.bordo}`,
          borderRadius: tu ? "36px 36px 10px 36px" : "36px 36px 36px 10px",
          boxShadow: tu ? `0 10px 24px rgba(20,20,20,0.18)` : `6px 6px 0 ${T.bordo}${attiva ? `, 0 0 0 ${8 * ev}px rgba(255,217,61,0.45)` : ""}`,
          scale: String(interpolate(pop, [0, 1], [0.72, 1])),
          transformOrigin: tu ? "100% 100%" : "0% 100%",
        }}
      >
        {m.testo}
        {m.gag === "corona" ? <Corona vf={vf} /> : null}
        {m.gag === "doppio" && vf >= RAGIONE0 + 6 ? <Doppio vf={vf} /> : null}
        {m.gag === "scuse" && fr !== undefined ? <Scuse vf={vf} tr={FRASI[fr].tr} /> : null}
      </div>
      <div style={{ fontFamily: fontCodice, fontSize: 22, color: T.muto, marginTop: 8, padding: "0 10px", display: "flex", gap: 8 }}>
        {m.ora}
        {tu ? <span style={{ color: T.accentoTesto, fontWeight: 700 }}>✓✓</span> : null}
      </div>
    </div>
  );
};

/**
 * Un messaggio nella colonna. Lo spazio cresce piano e spinge su quelli prima; la bolla resta intera
 * e sale dal bordo in basso della chat (che la taglia), come in un'app vera.
 */
const Riga: React.FC<{ readonly vf: number; readonly m: Msg }> = ({ vf, m }) => {
  const inizio = m.tip ?? m.da;
  if (vf < inizio) return null;
  const puntini = m.tip !== undefined && vf < m.da;
  const sopra = m.sopra ?? 0;
  let h: number;
  if (m.da < 0) h = 600;
  else if (puntini) h = interpolate(mollaPesante(vf, inizio), [0, 1], [0, 118]);
  else h = interpolate(mollaPesante(vf, m.da), [0, 1], [m.tip !== undefined ? 118 : 0, 330 + sopra]);
  let chiude = 0;
  if (m.fino !== undefined && vf >= m.fino) {
    chiude = mollaPesante(vf, m.fino);
    if (chiude > 0.97) return null;
    h *= 1 - chiude;
  }
  const tu = m.lato === "tu";
  return (
    <div style={{ maxHeight: h, overflow: "visible", display: "flex", flexDirection: "column", flexShrink: 0, marginTop: 22 * Math.min(1, h / 40), opacity: 1 - chiude }}>
      <div style={{ paddingTop: puntini ? 0 : sopra, display: "flex", flexDirection: "column" }}>
        {puntini ? (
          <div
            style={{
              alignSelf: tu ? "flex-end" : "flex-start",
              background: tu ? T.testo : "#FFFFFF",
              border: `3px solid ${T.bordo}`,
              borderRadius: tu ? "36px 36px 10px 36px" : "36px 36px 36px 10px",
              boxShadow: tu ? "none" : `6px 6px 0 ${T.bordo}`,
              marginBottom: 30,
            }}
          >
            <Puntini vf={vf} chiaro={tu} forte={!tu && vf >= TORNANO && m.tip === PUNTINI_ETERNI} />
          </div>
        ) : (
          <Bolla vf={vf} m={m} />
        )}
      </div>
    </div>
  );
};

const Luna: React.FC = () => (
  <span style={{ position: "relative", width: 26, height: 26, display: "inline-block" }}>
    <span style={{ position: "absolute", inset: 0, borderRadius: "50%", background: T.giallo, border: `2px solid ${T.bordo}` }} />
    <span style={{ position: "absolute", left: 8, top: -3, width: 22, height: 22, borderRadius: "50%", background: CREMA }} />
  </span>
);

const Testata: React.FC<{ readonly vf: number }> = ({ vf }) => {
  const scrive = MESSAGGI.some((m) => m.lato === "ai" && m.tip !== undefined && vf >= m.tip && vf < m.da);
  const notte = vf >= FRASI[4].tu;
  const ora = notte ? "03:07" : (FRASI.filter((f) => vf >= f.tu).pop()?.ora ?? "21:41");
  return (
    <div style={{ height: 122, display: "flex", alignItems: "center", gap: 22, padding: "0 30px", borderBottom: `3px solid ${T.bordo}`, background: "#FFFFFF" }}>
      <div
        style={{
          width: 78,
          height: 78,
          borderRadius: "50%",
          background: T.accento,
          border: `3px solid ${T.bordo}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: fontCodice,
          fontWeight: 700,
          fontSize: 30,
        }}
      >
        AI
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ fontFamily: fontTitolo, fontWeight: 700, fontSize: 40, lineHeight: 1 }}>AI</div>
        <div style={{ fontFamily: fontTitolo, fontWeight: 500, fontSize: 26, color: scrive ? T.accentoTesto : T.muto, display: "flex", alignItems: "center", gap: 8 }}>
          {!scrive ? <span style={{ width: 12, height: 12, borderRadius: 6, background: T.accento, border: `2px solid ${T.bordo}` }} /> : null}
          {scrive ? "sta scrivendo…" : "online"}
        </div>
      </div>
      <div style={{ flex: 1 }} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          fontFamily: fontCodice,
          fontWeight: 700,
          fontSize: 28,
          padding: "8px 16px",
          borderRadius: 14,
          border: `2px solid ${notte ? T.bordo : "#14141433"}`,
          background: notte ? "#1D2340" : "#F2EEE3",
          color: notte ? CREMA : T.testo,
        }}
      >
        {notte ? <Luna /> : null}
        {ora}
      </div>
    </div>
  );
};

/** La scheda TRADUZIONE sotto la chat. */
const Traduzione: React.FC<{ readonly vf: number; readonly i: number }> = ({ vf, i }) => {
  const f = FRASI[i];
  const fine = fineFrase(i);
  if (vf < f.ai + 4 || vf >= fine + 2) return null;
  const entra = mollaPesante(vf, f.ai + 4);
  const esce = interpolate(vf, [fine - 8, fine + 2], [0, 1], { ...C, easing: CURVA_ESCE });
  const [sx, sy] = scossa(vf, f.ai + 12);
  const timbro = mollaLeggera(vf, f.ai + 10);
  const arriva = mollaPesante(vf, f.tr);
  const terza = i === 2;
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        top: 1146,
        width: 886,
        translate: `${sx}px ${interpolate(entra, [0, 1], [320, 0]) + esce * 420 + sy}px`,
        opacity: interpolate(vf, [f.ai + 4, f.ai + 8], [0, 1], C) * (1 - esce),
        rotate: `${interpolate(entra, [0, 1], [3, -0.6])}deg`,
      }}
    >
      <div
        style={{
          background: CREMA,
          border: `4px solid ${T.bordo}`,
          borderRadius: 34,
          boxShadow: OMBRA,
          padding: terza ? "58px 44px 30px" : "58px 44px 40px",
        }}
      >
        <div style={{ fontFamily: fontTitolo, fontWeight: 700, fontSize: terza ? 56 : 62, lineHeight: 1.1, letterSpacing: -2, color: T.testo }}>
          {vf < f.tr ? (
            <div style={{ height: RIGHE[i] * 68, display: "flex", alignItems: "center", marginLeft: -32 }}>
              <Puntini vf={vf} />
            </div>
          ) : (
            <div style={{ opacity: interpolate(vf, [f.tr, f.tr + 2], [0, 1], C), translate: `0px ${interpolate(arriva, [0, 1], [24, 0])}px` }}>
              <Marcato vf={vf} da={f.tr + 3}>
                {f.trad}
              </Marcato>
            </div>
          )}
        </div>
        {terza && vf >= VIRGOLA - 16 ? <Virgola vf={vf} /> : null}
      </div>
      {/* timbro TRADUZIONE */}
      <div
        style={{
          position: "absolute",
          left: 34,
          top: -30,
          fontFamily: fontCodice,
          fontWeight: 700,
          fontSize: 30,
          letterSpacing: 4,
          color: T.rosso,
          background: CREMA,
          border: `4px solid ${T.rosso}`,
          borderRadius: 10,
          padding: "6px 16px",
          rotate: "-5deg",
          scale: String(interpolate(timbro, [0, 1], [1.9, 1])),
          opacity: interpolate(vf, [f.ai + 10, f.ai + 12], [0, 1], C),
        }}
      >
        TRADUZIONE
      </div>
      {/* numero della frase */}
      <div
        style={{
          position: "absolute",
          right: 30,
          top: -46,
          width: 96,
          height: 96,
          borderRadius: "50%",
          background: T.giallo,
          border: `4px solid ${T.bordo}`,
          boxShadow: `5px 5px 0 ${T.bordo}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: fontTitolo,
          fontWeight: 700,
          fontSize: 48,
          scale: String(mollaLeggera(vf, f.ai + 8)),
        }}
      >
        {f.n}
      </div>
    </div>
  );
};

/** Frase 3: due versioni identiche, cambia solo dove sta la virgola. */
const Virgola: React.FC<{ readonly vf: number }> = ({ vf }) => {
  const p = interpolate(vf, [VIRGOLA - 2, VIRGOLA + 10], [0, 1], { ...C, easing: CURVA_ENTRA });
  const riga = (etichetta: string, prima: string, dopo: string, cerchio: boolean, ritardo: number) => (
    <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: interpolate(vf, [VIRGOLA - 16 + ritardo, VIRGOLA - 12 + ritardo], [0, 1], C) }}>
      <span style={{ fontFamily: fontCodice, fontWeight: 700, fontSize: 22, color: T.muto, width: 76 }}>{etichetta}</span>
      <span style={{ fontFamily: fontCodice, fontWeight: 400, fontSize: 34, color: T.testo, whiteSpace: "pre" }}>
        {prima}
        <span style={{ position: "relative", display: "inline-block" }}>
          ,
          {cerchio ? (
            <span
              style={{
                position: "absolute",
                left: -12,
                top: -2,
                width: 34,
                height: 40,
                borderRadius: "50%",
                border: `4px solid ${T.rosso}`,
                scale: String(p),
              }}
            />
          ) : null}
        </span>
        {dopo}
      </span>
    </div>
  );
  return (
    <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 8, borderTop: `3px dashed #14141433`, paddingTop: 16 }}>
      {riga("PRIMA", "Ciao", " ti scrivo per il preventivo.", false, 0)}
      {riga("DOPO", "Ciao ti scrivo", " per il preventivo.", true, 4)}
    </div>
  );
};

const ScenaChat: React.FC<{ readonly vf: number }> = ({ vf }) => {
  // la "camera": si avvicina alla frase dell'AI e torna indietro al messaggio dopo
  let zoom = 0;
  for (let i = 0; i < FRASI.length; i++) {
    zoom += 0.032 * mollaPesante(vf, FRASI[i].ai) - 0.032 * mollaPesante(vf, fineFrase(i) - 4);
  }
  const fuori = interpolate(vf, [FATTO, FATTO + 14], [0, 1], { ...C, easing: CURVA_ESCE });
  const [sx, sy] = FRASI.reduce(
    (acc, f) => {
      const [a, b] = scossa(vf, f.ai + 12, 4);
      return [acc[0] + a, acc[1] + b];
    },
    [0, 0],
  );
  const respiro = Math.sin(vf / 40) * 3;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 392,
          width: 886,
          height: 720,
          translate: `${sx}px ${sy + respiro - fuori * 1700}px`,
          rotate: `${-fuori * 6}deg`,
          scale: String(1 + zoom),
          transformOrigin: "50% 90%",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: CREMA,
            border: `4px solid ${T.bordo}`,
            borderRadius: 44,
            boxShadow: OMBRA,
            overflow: "hidden",
          }}
        >
          <Testata vf={vf} />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 122,
              bottom: 0,
              padding: "0 34px 26px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              overflow: "hidden",
              background: "radial-gradient(#14141410 1.6px, transparent 1.6px) 0 0 / 30px 30px, #FBF8F0",
              maskImage: "linear-gradient(to bottom, transparent 0px, black 110px)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0px, black 110px)",
            }}
          >
            {MESSAGGI.map((m, k) => (
              <Riga key={k} vf={vf} m={m} />
            ))}
          </div>
        </div>
      </div>
      {FRASI.map((f, i) => (
        <Traduzione key={f.n} vf={vf} i={i} />
      ))}
      {/* testo a schermo del gancio */}
      {vf < FINE_GANCIO + 10 ? (
        <div
          style={{
            position: "absolute",
            left: 96,
            top: 302,
            translate: `0px ${-interpolate(vf, [FINE_GANCIO - 6, FINE_GANCIO + 6], [0, 1], { ...C, easing: CURVA_ESCE }) * 120}px`,
            opacity: 1 - interpolate(vf, [FINE_GANCIO - 6, FINE_GANCIO + 4], [0, 1], C),
            rotate: `${-2 + Math.sin(vf / 18) * 0.5}deg`,
            fontFamily: fontTitolo,
            fontWeight: 700,
            fontSize: 52,
            letterSpacing: -1,
            padding: "14px 30px",
            borderRadius: 20,
            background: T.giallo,
            border: `4px solid ${T.bordo}`,
            boxShadow: `7px 7px 0 ${T.bordo}`,
            whiteSpace: "nowrap",
          }}
        >
          Le 5 frasi dell'AI, tradotte
        </div>
      ) : null}
    </>
  );
};

// ---------------------------------------------------------------- il dato vero

const ScenaFatto: React.FC<{ readonly vf: number }> = ({ vf }) => {
  const entra = mollaPesante(vf, FATTO + 4);
  const esce = interpolate(vf, [REGALO, REGALO + 12], [0, 1], { ...C, easing: CURVA_ESCE });
  const conta = Math.round(interpolate(vf, [RAGIONE + 4, PERC + 4], [0, 49], { ...C, easing: CURVA_ENTRA }));
  const botta = mollaLeggera(vf, PERC + 4);
  const barra1 = interpolate(mollaPesante(vf, RAGIONE - 14), [0, 1], [0, 1]);
  const barra2 = interpolate(mollaPesante(vf, RAGIONE - 6), [0, 1], [0, 1]);
  const BASE = 404;
  return (
    <div style={{ position: "absolute", inset: 0, translate: `${-esce * 1300}px ${(1 - entra) * 1500}px`, rotate: `${-esce * 4}deg` }}>
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 372,
          fontFamily: fontCodice,
          fontWeight: 700,
          fontSize: 26,
          letterSpacing: 2,
          padding: "10px 18px",
          borderRadius: 12,
          border: `3px solid ${T.bordo}`,
          background: CREMA,
          boxShadow: `5px 5px 0 ${T.bordo}`,
        }}
      >
        STANFORD · 11 MODELLI AI · SCIENCE 2026
      </div>
      <div
        style={{
          position: "absolute",
          left: 44,
          top: 440,
          fontFamily: fontTitolo,
          fontWeight: 700,
          fontSize: 330,
          lineHeight: 1,
          letterSpacing: -18,
          color: T.rosso,
          textShadow: `12px 12px 0 ${T.bordo}`,
          WebkitTextStroke: `6px ${T.bordo}`,
          scale: String(vf >= PERC + 4 ? interpolate(botta, [0, 1], [1.12, 1]) : 1),
          transformOrigin: "20% 60%",
          opacity: interpolate(vf, [RAGIONE, RAGIONE + 4], [0, 1], C),
        }}
      >
        +{conta}%
      </div>
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 802,
          fontFamily: fontTitolo,
          fontWeight: 700,
          fontSize: 60,
          letterSpacing: -2,
          opacity: interpolate(vf, [SPESSO - 6, SPESSO - 2], [0, 1], C),
        }}
      >
        <Marcato vf={vf} da={SPESSO - 2} colore={T.giallo}>
          più spesso di una persona
        </Marcato>
      </div>
      {/* le due barre: quante volte ti dà ragione */}
      {[
        { etichetta: "UNA PERSONA", w: BASE * barra1, colore: CREMA, top: 922 },
        { etichetta: "L'AI", w: BASE * 1.49 * barra2, colore: T.accento, top: 1018 },
      ].map((b) => (
        <div key={b.etichetta} style={{ position: "absolute", left: 60, top: b.top, display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 230, fontFamily: fontCodice, fontWeight: 700, fontSize: 28, letterSpacing: 1 }}>{b.etichetta}</div>
          <div
            style={{
              width: b.w,
              height: 70,
              borderRadius: 14,
              background: b.colore,
              border: b.w > 4 ? `4px solid ${T.bordo}` : "none",
              boxShadow: b.w > 4 ? `6px 6px 0 ${T.bordo}` : "none",
            }}
          />
        </div>
      ))}
      <div style={{ position: "absolute", left: 60, top: 1124, fontFamily: fontCodice, fontSize: 24, color: T.muto, opacity: interpolate(vf, [RAGIONE, RAGIONE + 8], [0, 1], C) }}>
        Cheng e altri, Science, 26/03/2026 · quanto approvano le azioni di chi chiede
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- il regalo

const RIGHE_PROMPT = [
  "Niente complimenti in apertura.",
  "Se ho torto, dimmelo subito.",
  "Cambia idea solo con un motivo nuovo.",
  "Se non sei sicuro, dillo.",
  "Niente «spero ti sia utile».",
];

const ScenaRegalo: React.FC<{ readonly vf: number }> = ({ vf }) => {
  const entra = mollaPesante(vf, REGALO + 2);
  const esce = interpolate(vf, [MANDALO - 4, MANDALO + 8], [0, 1], { ...C, easing: CURVA_ESCE });
  const gratis = mollaLeggera(vf, GRATIS);
  let cursore = -1;
  return (
    <>
      <div
        style={{
          position: "absolute",
          left: 60,
          top: 372,
          width: 886,
          translate: `${(1 - entra) * 1300}px ${-esce * 1700}px`,
          rotate: `${(1 - entra) * 5 - esce * 5}deg`,
          background: CREMA,
          border: `4px solid ${T.bordo}`,
          borderRadius: 40,
          boxShadow: OMBRA,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            background: T.testo,
            color: CREMA,
            padding: "26px 36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: fontCodice,
            fontWeight: 700,
            fontSize: 30,
            letterSpacing: 2,
          }}
        >
          <span>PROMPT ANTI-COMPLIMENTI</span>
          <span style={{ display: "flex", gap: 10 }}>
            {[T.rosso, T.giallo, T.accento].map((c) => (
              <span key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c }} />
            ))}
          </span>
        </div>
        <div style={{ padding: "34px 40px 40px", display: "flex", flexDirection: "column", gap: 22 }}>
          {RIGHE_PROMPT.map((r, i) => {
            const da = REGALO + 12 + i * 14;
            const n = Math.round(interpolate(vf, [da, da + 13], [0, r.length], C));
            if (vf >= da && n < r.length && cursore < 0) cursore = i;
            const vis = vf >= da;
            return (
              <div key={r} style={{ display: "flex", alignItems: "flex-start", gap: 20, opacity: vis ? 1 : 0 }}>
                <span
                  style={{
                    flexShrink: 0,
                    width: 58,
                    height: 58,
                    borderRadius: 16,
                    background: T.accento,
                    border: `3px solid ${T.bordo}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: fontCodice,
                    fontWeight: 700,
                    fontSize: 30,
                    scale: String(mollaLeggera(vf, da)),
                  }}
                >
                  {i + 1}
                </span>
                <span style={{ fontFamily: fontTitolo, fontWeight: 500, fontSize: 46, lineHeight: 1.2, letterSpacing: -0.5, paddingTop: 2 }}>
                  {r.slice(0, n)}
                  {cursore === i && Math.floor(vf / 4) % 2 === 0 ? <span style={{ display: "inline-block", width: 4, height: 46, background: T.testo, verticalAlign: "-6px", marginLeft: 3 }} /> : null}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      {vf >= GRATIS ? (
        <div
          style={{
            position: "absolute",
            left: 380,
            top: 1118,
            translate: `0px ${-esce * 1700}px`,
            rotate: `${interpolate(gratis, [0, 1], [-14, 4])}deg`,
            scale: String(interpolate(gratis, [0, 1], [0.4, 1])),
            fontFamily: fontTitolo,
            fontWeight: 700,
            fontSize: 50,
            padding: "14px 28px",
            borderRadius: 20,
            background: T.accento,
            border: `4px solid ${T.bordo}`,
            boxShadow: `7px 7px 0 ${T.bordo}`,
            whiteSpace: "nowrap",
          }}
        >
          GRATIS · in didascalia ↓
        </div>
      ) : null}
    </>
  );
};

// ---------------------------------------------------------------- finale

const PERCORSO = "M 110 1330 C 300 1180, 180 960, 420 900 S 760 820, 820 560 S 980 300, 1180 250";
const LUNGHEZZA = getLength(PERCORSO);

const ScenaFinale: React.FC<{ readonly vf: number }> = ({ vf }) => {
  const volo = interpolate(vf, [MANDALO + 4, MANDALO + 40], [0, 1], { ...C, easing: (x) => x * x * (3 - 2 * x) });
  const pt = getPointAtLength(PERCORSO, volo * LUNGHEZZA) ?? { x: 0, y: 0 };
  const tg = getTangentAtLength(PERCORSO, Math.max(1, volo * LUNGHEZZA)) ?? { x: 1, y: 0 };
  const angolo = (Math.atan2(tg.y, tg.x) * 180) / Math.PI;
  const scia = evolvePath(volo, PERCORSO);
  const riga = (da: number) => ({ opacity: interpolate(vf, [da, da + 2], [0, 1], C), translate: `0px ${interpolate(mollaPesante(vf, da), [0, 1], [40, 0])}px` });
  return (
    <>
      {/* maschera: la scia compare solo dietro all'aeroplanino */}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: volo > 0 ? 1 : 0 }}>
        <defs>
          <mask id="scia-finale">
            <path d={PERCORSO} fill="none" stroke="#fff" strokeWidth={30} strokeDasharray={scia.strokeDasharray} strokeDashoffset={scia.strokeDashoffset} />
          </mask>
        </defs>
        <path d={PERCORSO} fill="none" stroke={T.testo} strokeWidth={5} strokeLinecap="round" strokeDasharray="2 18" mask="url(#scia-finale)" />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 70,
          top: 560,
          fontFamily: fontTitolo,
          fontWeight: 700,
          fontSize: 124,
          lineHeight: 1.02,
          letterSpacing: -6,
          color: T.testo,
        }}
      >
        <div style={riga(MANDALO)}>Mandalo</div>
        <div style={riga(MANDALO + 4)}>a chi</div>
        <div style={riga(MANDALO + 9)}>
          <Marcato vf={vf} da={SEMPRE - 2}>
            ha sempre
          </Marcato>
        </div>
        <div style={riga(MANDALO + 13)}>
          <Marcato vf={vf} da={SEMPRE + 4}>
            ragione.
          </Marcato>
        </div>
      </div>
      {volo > 0 && volo < 1 ? (
        <div style={{ position: "absolute", left: pt.x - 60, top: pt.y - 44, rotate: `${angolo}deg` }}>
          <svg width={120} height={88} viewBox="0 0 60 44">
            <path d="M2 22 L58 2 L40 42 L30 28 Z" fill={CREMA} stroke={T.bordo} strokeWidth={3.2} strokeLinejoin="round" />
            <path d="M58 2 L30 28 L26 40 L22 25 Z" fill={T.accento} stroke={T.bordo} strokeWidth={3.2} strokeLinejoin="round" />
          </svg>
        </div>
      ) : null}
    </>
  );
};

// ---------------------------------------------------------------- palco intero a un fotogramma dato

const Palco: React.FC<{ readonly f: number }> = ({ f }) => (
  <AbsoluteFill style={{ background: T.sfondo }}>
    <Chip />
    <Avanzamento vf={f} />
    {f < FATTO + 16 ? <ScenaChat vf={f} /> : null}
    {f >= FATTO && f < REGALO + 14 ? <ScenaFatto vf={f} /> : null}
    {f >= REGALO - 2 && f < MANDALO + 10 ? <ScenaRegalo vf={f} /> : null}
    {f >= MANDALO ? <ScenaFinale vf={f} /> : null}
  </AbsoluteFill>
);

/** Versione che legge il fotogramma da sola: serve alla scia di movimento. */
const PalcoVivo: React.FC = () => {
  const f = useCurrentFrame();
  return <Palco f={f} />;
};

// ---------------------------------------------------------------- grana della carta e vignettatura

const Grana: React.FC<{ readonly vf: number }> = ({ vf }) => {
  const seme = Math.floor(vf / 2) % 9;
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.075, mixBlendMode: "multiply", pointerEvents: "none" }}>
      <filter id="grana">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} seed={seme} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grana)" />
    </svg>
  );
};

// ---------------------------------------------------------------- sottotitoli (solo dove il testo non è già sullo schermo)

const FINESTRE: ReadonlyArray<readonly [number, number]> = [
  [0, FINE_GANCIO],
  [FATTO + 6, MANDALO - 2],
];

const sistemaCaptions = (lista: Caption[]): Caption[] => lista.map((c) => ({ ...c, text: c.text.replace(/[«»]/g, "") }));

const Sottotitoli: React.FC<{ readonly captions: Caption[] }> = ({ captions }) => {
  const frame = useCurrentFrame();
  const { pages } = useMemo(
    () => createTikTokStyleCaptions({ captions: sistemaCaptions(captions), combineTokensWithinMilliseconds: 650, breakOnSilenceAfterMilliseconds: 250 }),
    [captions],
  );
  if (!FINESTRE.some(([a, b]) => frame >= a && frame < b)) return null;
  const ms = (frame / FPS) * 1000;
  const i = pages.findIndex((p, k) => ms >= p.startMs && ms < Math.min(p.startMs + p.durationMs, pages[k + 1]?.startMs ?? Infinity));
  if (i === -1) return null;
  const pagina = pages[i];
  if (ms > pagina.tokens[pagina.tokens.length - 1].toMs + 350) return null;
  const pop = mollaLeggera(frame, Math.round((pagina.startMs / 1000) * FPS));
  return (
    <div style={{ position: "absolute", left: 60, right: 120, top: 1420, display: "flex", justifyContent: "center", textAlign: "center", scale: String(0.85 + 0.15 * pop) }}>
      <div
        style={{
          fontFamily: fontTitolo,
          fontWeight: 700,
          fontSize: 56,
          lineHeight: 1.15,
          color: T.testo,
          background: CREMA,
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

const SCIE: ReadonlyArray<readonly [number, number]> = [
  [FATTO - 2, FATTO + 22],
  [REGALO - 4, REGALO + 18],
  [MANDALO - 6, MANDALO + 10],
];

export const Reel07: React.FC = () => {
  const frame = useCurrentFrame();
  const s = (n: string) => staticFile(`suoni/${n}.wav`);
  const ritorno = interpolate(frame, [LOOP, DURATA - 1], [0, 1], C);
  const scia = SCIE.some(([a, b]) => frame >= a && frame < b);
  return (
    <AbsoluteFill style={{ background: T.sfondo }}>
      {scia ? (
        <CameraMotionBlur shutterAngle={200} samples={8}>
          <PalcoVivo />
        </CameraMotionBlur>
      ) : (
        <Palco f={frame} />
      )}
      {ritorno > 0 ? (
        <AbsoluteFill style={{ opacity: ritorno }}>
          <Palco f={0} />
        </AbsoluteFill>
      ) : null}
      <Sequence name="Sottotitoli" from={0} durationInFrames={DURATA}>
        <Sottotitoli captions={tempi.captions as Caption[]} />
      </Sequence>
      <Grana vf={frame} />
      <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at 50% 45%, transparent 62%, rgba(20,20,20,0.10) 100%)" }} />

      <Audio name="Voce" src={staticFile("voce.wav")} />
      <Audio name="Musica (generata)" src={s("musica")} volume={0.1} />
      <Track name="Effetti">
        <Audio name="click anzi" src={s("click")} from={ANZI} volume={0.3} />
        <Audio name="digitazione 0" src={s("digitazione")} from={TIP0} durationInFrames={RAGIONE0 - TIP0} volume={0.14} />
        <Audio name="pop ragione 0" src={s("pop")} from={RAGIONE0} volume={0.28} />
        <Audio name="timbro x2" src={s("timbro")} from={RAGIONE0 + 6} volume={0.35} />
        {FRASI.map((f) => (
          <React.Fragment key={f.n}>
            <Audio name={`click tu ${f.n}`} src={s("click")} from={f.tu} volume={0.3} />
            <Audio name={`digitazione ${f.n}`} src={s("digitazione")} from={f.tip} durationInFrames={f.ai - f.tip} volume={0.14} />
            <Audio name={`pop ai ${f.n}`} src={s("pop")} from={f.ai} volume={0.3} />
            <Audio name={`whoosh traduzione ${f.n}`} src={s("whoosh")} from={f.ai + 2} volume={0.2} />
            <Audio name={`timbro ${f.n}`} src={s("timbro")} from={f.ai + 10} volume={0.36} />
            <Audio name={`pop traduzione ${f.n}`} src={s("pop")} from={f.tr} volume={0.22} />
          </React.Fragment>
        ))}
        <Audio name="ding corona" src={s("ding")} from={CORONA + 4} volume={0.25} />
        <Audio name="digitazione tu" src={s("digitazione")} from={DIGITA_TU} durationInFrames={SMETTI - DIGITA_TU} volume={0.12} />
        <Audio name="pop virgola" src={s("pop")} from={VIRGOLA} volume={0.25} />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => (
          <Audio key={`scuse${k}`} name={`click scuse ${k + 2}`} src={s("click")} from={FRASI[3].tr + Math.round((k + 1) * 3.2)} volume={0.18} />
        ))}
        <Audio name="whoosh fatto" src={s("whoosh")} from={FATTO - 2} volume={0.32} />
        <Audio name="click barre" src={s("click")} from={RAGIONE - 14} volume={0.22} />
        <Audio name="ding 49" src={s("ding")} from={PERC + 4} volume={0.32} />
        <Audio name="whoosh regalo" src={s("whoosh")} from={REGALO - 2} volume={0.3} />
        <Audio name="digitazione prompt" src={s("digitazione")} from={REGALO + 12} durationInFrames={70} volume={0.16} />
        <Audio name="pop gratis" src={s("pop")} from={GRATIS} volume={0.32} />
        <Audio name="whoosh finale" src={s("whoosh")} from={MANDALO - 4} volume={0.3} />
        <Audio name="whoosh aeroplanino" src={s("whoosh")} from={MANDALO + 6} volume={0.18} />
        <Audio name="pop sempre" src={s("pop")} from={SEMPRE} volume={0.28} />
      </Track>
    </AbsoluteFill>
  );
};
