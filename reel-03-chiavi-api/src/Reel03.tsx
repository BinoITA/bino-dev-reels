// © 2026 BinoITA (bino.dev, @bino.devs) — CC BY 4.0: se lo riusi, cita "@bino.devs — github.com/BinoITA/bino-dev-reels"
// Reel 03 — "Cancellare una API key da GitHub non basta". Sei scene sui paragrafi della voce:
// commit che "cancella" la chiave, storia dei commit con il bot, cambiala, tre regole,
// lo script controlla-segreti.py (uscita vera), finale "Mandalo a…" con loop sul primo fotogramma.
// Le chiavi a schermo sono finte e mascherate (AIzaSy•••): non hanno il formato di una chiave vera.
import { Audio } from "@remotion/media";
import { createTikTokStyleCaptions, type Caption } from "@remotion/captions";
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, Sequence, spring, staticFile, Track, useCurrentFrame } from "remotion";
import { C, fontCodice, fontTitolo, T } from "./stile";
import tempi from "./tempi.json";

// ---------------------------------------------------------------- tempi (frame a 30 fps, da tempi.json)

export const DURATA = 900;
const FPS = 30;
const S = { storia: 118, cambia: 241, regole: 350, script: 626, mandalo: 826 }; // inizio scene
const NON_BASTA = 88;
const BOT = 179;
const MINUTO = 220;
const CAMBIALA = 266;
const COPIATA = 304;
const REGOLE = [397, 457, 533];
const CHIUNQUE = 581;
const PUSH = 719;
const STORIA_SCRIPT = 746;
const GRATIS = 783;
const LOOP = 886;

const molla = (vf: number, da: number, smorzamento = 14) =>
  spring({ frame: vf - da, fps: FPS, config: { damping: smorzamento } });

// ---------------------------------------------------------------- pezzi comuni

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
      <span style={{ width: 14, height: 14, borderRadius: 7, background: T.rosso }} />
      SICUREZZA · #03
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

const CHIAVE = "AIzaSy•••••••••";

// ---------------------------------------------------------------- scena 1: il commit che "cancella" la chiave

const Scena1: React.FC<{ readonly vf: number }> = ({ vf }) => {
  const barra = interpolate(vf, [NON_BASTA, NON_BASTA + 8], [0, 1], C);
  const lampeggio = vf > 60 && vf < 110 ? 0.55 + 0.45 * Math.abs(Math.sin((vf - 60) / 5)) : 1;
  return (
    <>
      <Titolo vf={vf} da={-30}>
        Cancellarla
        <br />
        <Evid colore={T.rosso}>non basta.</Evid>
      </Titolo>
      <Pannello style={{ left: 60, top: 580, width: 900, height: 480 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "20px 28px",
            borderBottom: `4px solid ${T.bordo}`,
            background: "#F7F4EC",
          }}
        >
          <Codice style={{ fontSize: 28 }}>src/config.js</Codice>
          <Codice style={{ fontSize: 26, color: T.muto }}>commit 74c74cc</Codice>
        </div>
        <div style={{ padding: "34px 28px", fontFamily: fontTitolo, fontWeight: 700, fontSize: 42 }}>
          “tolgo la chiave dal codice”
        </div>
        <div style={{ background: "#FFE3E1", padding: "26px 28px", opacity: lampeggio }}>
          <Codice style={{ color: "#B3261E", fontSize: 36 }}>{`- const KEY = "${CHIAVE}";`}</Codice>
        </div>
        <div style={{ background: "#DDF7E8", padding: "26px 28px" }}>
          <Codice style={{ color: T.accentoTesto, fontSize: 33 }}>{"+ const KEY = import.meta.env…"}</Codice>
        </div>
      </Pannello>
      <Pop vf={vf} da={-30} style={{ position: "absolute", left: 560, top: 540, rotate: "4deg" }}>
        <Adesivo colore={T.accento} style={{ fontSize: 38 }}>
          <span style={{ position: "relative" }}>
            ✓ chiave cancellata
            <span
              style={{
                position: "absolute",
                left: -8,
                top: "48%",
                height: 8,
                borderRadius: 4,
                width: `${barra * 108}%`,
                background: T.rosso,
                rotate: "-3deg",
              }}
            />
          </span>
        </Adesivo>
      </Pop>
      <Pop vf={vf} da={NON_BASTA + 4} style={{ position: "absolute", left: 170, top: 1150, rotate: "-4deg" }}>
        <Adesivo colore={T.rosso} testo="#FFFFFF" style={{ fontSize: 56 }}>
          È ancora su GitHub
        </Adesivo>
      </Pop>
    </>
  );
};

// ---------------------------------------------------------------- scena 2: storia dei commit e bot

const Scena2: React.FC<{ readonly vf: number }> = ({ vf }) => {
  const secondi = Math.round(interpolate(vf, [BOT, MINUTO], [0, 59], C));
  const trovata = vf >= MINUTO;
  const commit = [
    { h: "74c74cc", m: "tolgo la chiave dal codice", c: false },
    { h: "b6406fa", m: "prima versione dell'app", c: true },
  ];
  return (
    <>
      <Titolo vf={vf} da={S.storia}>
        Resta nella
        <br />
        <Evid colore={T.giallo}>storia dei commit.</Evid>
      </Titolo>
      <Pannello style={{ left: 60, top: 600, width: 900, height: 470, padding: "30px 32px" }}>
        <Codice style={{ fontSize: 30, color: T.muto, marginBottom: 22 }}>git log -p</Codice>
        {commit.map((x, i) => (
          <Pop key={x.h} vf={vf} da={S.storia + 8 + i * 8}>
            <div
              style={{
                marginBottom: 22,
                padding: "18px 22px",
                borderRadius: 18,
                border: `3px solid ${x.c && trovata ? T.rosso : "#14141433"}`,
                background: x.c ? "#FFF4F3" : "#FBFAF6",
              }}
            >
              <Codice style={{ fontSize: 32 }}>
                <span style={{ color: T.accentoTesto }}>{x.h}</span> {x.m}
              </Codice>
              {x.c ? (
                <Codice style={{ fontSize: 32, color: "#B3261E", marginTop: 12 }}>
                  {`+ const KEY = "${CHIAVE}";`}
                </Codice>
              ) : null}
            </div>
          </Pop>
        ))}
      </Pannello>
      <Pop vf={vf} da={BOT - 4} style={{ position: "absolute", left: 560, top: 1020, rotate: "-3deg" }}>
        <Adesivo colore={trovata ? T.rosso : T.pannello} testo={trovata ? "#FFFFFF" : T.testo} style={{ fontSize: 56 }}>
          🤖 {trovata ? "TROVATA" : `00:${String(secondi).padStart(2, "0")}`}
        </Adesivo>
      </Pop>
      <Pop vf={vf} da={MINUTO} style={{ position: "absolute", left: 110, top: 1170, rotate: "2deg" }}>
        <Adesivo colore={T.giallo} style={{ fontSize: 48 }}>
          in meno di 1 minuto
        </Adesivo>
      </Pop>
    </>
  );
};

// ---------------------------------------------------------------- scena 3: cambiala

const Scena3: React.FC<{ readonly vf: number }> = ({ vf }) => {
  const via = interpolate(vf, [CAMBIALA, CAMBIALA + 10], [0, 1], C);
  return (
    <>
      <Titolo vf={vf} da={S.cambia}>
        Se è uscita,
        <br />
        <Evid colore={T.accento}>cambiala.</Evid>
      </Titolo>
      <Pannello style={{ left: 60, top: 600, width: 900, height: 230, padding: "26px 32px" }}>
        <div style={{ fontFamily: fontTitolo, fontWeight: 700, fontSize: 34, color: T.muto }}>Vecchia chiave</div>
        <Codice style={{ fontSize: 40, marginTop: 14, position: "relative", display: "inline-block", color: "#B3261E" }}>
          {CHIAVE}
          <span
            style={{
              position: "absolute",
              left: -6,
              top: "50%",
              height: 8,
              width: `${via * 104}%`,
              background: T.rosso,
              borderRadius: 4,
            }}
          />
        </Codice>
        <Codice style={{ position: "absolute", right: 30, top: 30, fontSize: 30, color: "#B3261E", opacity: via }}>
          REVOCATA
        </Codice>
      </Pannello>
      <Pop vf={vf} da={CAMBIALA + 6} style={{ position: "absolute", inset: 0, transformOrigin: "510px 995px" }}>
        <Pannello style={{ left: 60, top: 880, width: 900, height: 230, padding: "26px 32px", background: "#EFFCF4" }}>
          <div style={{ fontFamily: fontTitolo, fontWeight: 700, fontSize: 34, color: T.accentoTesto }}>
            ↻ Nuova chiave
          </div>
          <Codice style={{ fontSize: 40, marginTop: 14 }}>AIzaSy•••••••••</Codice>
          <Codice style={{ position: "absolute", right: 30, top: 30, fontSize: 30, color: T.accentoTesto }}>
            NEL .env
          </Codice>
        </Pannello>
      </Pop>
      <Pop vf={vf} da={COPIATA} style={{ position: "absolute", left: 110, top: 1170, rotate: "-3deg" }}>
        <Adesivo colore={T.pannello} style={{ fontSize: 44 }}>
          📋 chi l'ha copiata ce l'ha ancora
        </Adesivo>
      </Pop>
    </>
  );
};

// ---------------------------------------------------------------- scena 4: tre regole

const Regola: React.FC<{
  readonly vf: number;
  readonly da: number;
  readonly n: number;
  readonly titolo: React.ReactNode;
  readonly top: number;
  readonly children: React.ReactNode;
}> = ({ vf, da, n, titolo, top, children }) => {
  const attiva = vf >= da;
  const p = molla(vf, da);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transformOrigin: `510px ${top + 115}px`,
        opacity: 0.3 + 0.7 * Math.min(1, p * 1.5),
        scale: String(interpolate(p, [0, 1], [0.94, 1])),
      }}
    >
      <Pannello style={{ left: 60, top, width: 900, height: 230, display: "flex", alignItems: "center", gap: 26, padding: "0 30px" }}>
        <div
          style={{
            width: 84,
            height: 84,
            flexShrink: 0,
            borderRadius: 42,
            border: `4px solid ${T.bordo}`,
            background: attiva ? T.accento : T.pannello,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: fontTitolo,
            fontWeight: 700,
            fontSize: 48,
          }}
        >
          {n}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ opacity: attiva ? 1 : 0 }}>
            <div style={{ fontFamily: fontTitolo, fontWeight: 700, fontSize: 50, letterSpacing: -1 }}>{titolo}</div>
            <div style={{ marginTop: 12 }}>{children}</div>
          </div>
        </div>
      </Pannello>
    </div>
  );
};

const Scena4: React.FC<{ readonly vf: number }> = ({ vf }) => {
  const occhio = molla(vf, CHIUNQUE, 12);
  return (
    <>
      <Titolo vf={vf} da={S.regole}>
        <Evid colore={T.giallo}>3 regole.</Evid>
      </Titolo>
      <Regola vf={vf} da={REGOLE[0]} n={1} top={480} titolo={<>La chiave sta nel <Evid colore={T.accento}>.env</Evid></>}>
        <Codice style={{ fontSize: 32, color: T.muto }}>GEMINI_API_KEY=AIzaSy•••</Codice>
      </Regola>
      <Regola vf={vf} da={REGOLE[1]} n={2} top={750} titolo={<>Il .env sta nel <Evid colore={T.accento}>.gitignore</Evid></>}>
        <Codice style={{ fontSize: 28, color: T.muto }}>node_modules/{"\n"}.env</Codice>
      </Regola>
      <Regola vf={vf} da={REGOLE[2]} n={3} top={1020} titolo={<>Mai nel <Evid colore={T.rosso}>frontend</Evid></>}>
        <Codice style={{ fontSize: 32, color: "#B3261E" }}>VITE_…_KEY → nel browser</Codice>
      </Regola>
      <Pop
        vf={vf}
        da={CHIUNQUE}
        style={{ position: "absolute", left: 600, top: 990, rotate: "5deg", scale: String(0.7 + 0.3 * occhio) }}
      >
        <Adesivo colore={T.rosso} testo="#FFFFFF" style={{ fontSize: 36 }}>
          👀 la vede chiunque
        </Adesivo>
      </Pop>
    </>
  );
};

// ---------------------------------------------------------------- scena 5: lo script (uscita vera di controlla-segreti.py)

type Riga = { t: string; c?: string; da: number };
const RIGHE: Riga[] = [
  { t: "$ python controlla-segreti.py", da: S.script + 4 },
  { t: "controlla-segreti · app-meteo · 4 file", c: T.testo, da: 676 },
  { t: "1. Chiavi nei file", da: 690 },
  { t: "  ✓ nessuna chiave nei file", c: T.accentoTesto, da: 698 },
  { t: "2. Storia dei commit", da: STORIA_SCRIPT - 6 },
  { t: "  ✗ commit b6406fa", c: "#B3261E", da: STORIA_SCRIPT },
  { t: "    src/config.js  chiave Gemini", c: "#B3261E", da: STORIA_SCRIPT + 4 },
  { t: "    → va CAMBIATA sul sito del servizio", c: "#B3261E", da: STORIA_SCRIPT + 8 },
  { t: "3. File .env", da: STORIA_SCRIPT + 16 },
  { t: "  ✗ .env NON è nel .gitignore", c: "#B3261E", da: STORIA_SCRIPT + 20 },
  { t: "4. Frontend", da: STORIA_SCRIPT + 28 },
  { t: "  ! VITE_GEMINI_KEY → nel browser", c: "#9A6B00", da: STORIA_SCRIPT + 32 }, // controlla-segreti: ignora (testo dimostrativo)
];

const Scena5: React.FC<{ readonly vf: number }> = ({ vf }) => {
  const comando = RIGHE[0].t;
  const battute = Math.floor(interpolate(vf, [S.script + 4, S.script + 34], [0, comando.length], C));
  return (
    <>
      <Titolo vf={vf} da={S.script}>
        Controlla
        <br />
        <Evid colore={T.accento}>prima del push.</Evid>
      </Titolo>
      <Pannello style={{ left: 60, top: 560, width: 900, height: 720, background: "#FBFAF6", padding: "26px 30px" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          {[T.rosso, T.giallo, T.accento].map((x) => (
            <span key={x} style={{ width: 20, height: 20, borderRadius: 10, background: x, border: `3px solid ${T.bordo}` }} />
          ))}
        </div>
        {RIGHE.map((r, i) =>
          vf < r.da ? null : (
            <Codice
              key={i}
              style={{
                fontSize: 30,
                lineHeight: 1.45,
                color: r.c ?? (i === 0 ? T.testo : T.testo),
                fontWeight: r.c || i === 0 ? 700 : 700,
                opacity: interpolate(vf, [r.da, r.da + 3], [0, 1], C),
              }}
            >
              {i === 0 ? comando.slice(0, battute) + (vf % 16 < 8 && battute < comando.length ? "▌" : "") : r.t}
            </Codice>
          ),
        )}
      </Pannello>
      <Pop vf={vf} da={GRATIS} style={{ position: "absolute", left: 470, top: 1230, rotate: "4deg" }}>
        <Adesivo colore={T.accento} style={{ fontSize: 52 }}>
          Gratis · link in bio
        </Adesivo>
      </Pop>
      <Pop vf={vf} da={PUSH - 4} style={{ position: "absolute", left: 640, top: 520, rotate: "-4deg" }}>
        <Adesivo colore={T.pannello} style={{ fontSize: 30 }}>
          fatto con Claude
        </Adesivo>
      </Pop>
    </>
  );
};

// ---------------------------------------------------------------- scena 6: mandalo a…

const Scena6: React.FC<{ readonly vf: number }> = ({ vf }) => (
  <>
    <div style={{ opacity: 0.35 }}>
      <Scena5 vf={S.mandalo - 1} />
    </div>
    <Pop vf={vf} da={S.mandalo} style={{ position: "absolute", left: 0, right: 0, top: 880, display: "flex", justifyContent: "center" }}>
      <Adesivo colore={T.giallo} style={{ fontSize: 72, rotate: "-3deg", padding: "22px 36px" }}>
        Mandalo a chi fa
        <br />
        app con l'AI ↗
      </Adesivo>
    </Pop>
  </>
);

// ---------------------------------------------------------------- scena completa a un frame virtuale

const Scena: React.FC<{ readonly vf: number }> = ({ vf }) => {
  const inizio = [0, S.storia, S.cambia, S.regole, S.script, S.mandalo].filter((x) => vf >= x).pop() ?? 0;
  const zoom = interpolate(vf - inizio, [0, 120], [1, 1.02], C);
  return (
    <AbsoluteFill style={{ background: T.sfondo }}>
      <AbsoluteFill style={{ transformOrigin: "50% 45%", scale: String(zoom) }}>
        <Chip />
        {vf < S.storia ? <Scena1 vf={vf} /> : null}
        {vf >= S.storia && vf < S.cambia ? <Scena2 vf={vf} /> : null}
        {vf >= S.cambia && vf < S.regole ? <Scena3 vf={vf} /> : null}
        {vf >= S.regole && vf < S.script ? <Scena4 vf={vf} /> : null}
        {vf >= S.script && vf < S.mandalo ? <Scena5 vf={vf} /> : null}
        {vf >= S.mandalo ? <Scena6 vf={vf} /> : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- sottotitoli ("punto env" → ".env")

const sistemaCaptions = (lista: Caption[]): Caption[] => {
  const out: Caption[] = [];
  for (let i = 0; i < lista.length; i++) {
    const c = lista[i];
    const prossima = lista[i + 1];
    if (c.text.trim().toLowerCase() === "punto" && prossima && /^\s*env/i.test(prossima.text)) {
      out.push({ ...c, text: c.text.replace(/punto/i, "") + prossima.text.trim().replace(/^env/i, ".env"), endMs: prossima.endMs });
      i++;
    } else {
      out.push({ ...c, text: c.text.replace(/\bgitignore/i, ".gitignore") });
    }
  }
  return out;
};

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

export const Reel03: React.FC = () => {
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
        <Audio name="timbro non basta" src={s("timbro")} from={NON_BASTA} volume={0.5} />
        {[S.storia, S.cambia, S.regole, S.script].map((x) => (
          <Audio key={`w${x}`} name={`whoosh scena ${x}`} src={s("whoosh")} from={x - 6} volume={0.3} />
        ))}
        <Audio name="click commit 1" src={s("click")} from={S.storia + 8} volume={0.25} />
        <Audio name="click commit 2" src={s("click")} from={S.storia + 16} volume={0.25} />
        <Audio name="timbro trovata" src={s("timbro")} from={MINUTO} volume={0.45} />
        <Audio name="pop cambiala" src={s("pop")} from={CAMBIALA + 6} volume={0.3} />
        {REGOLE.map((x, i) => (
          <Audio key={`r${i}`} name={`pop regola ${i + 1}`} src={s("pop")} from={x} volume={0.32} />
        ))}
        <Audio name="pop chiunque" src={s("pop")} from={CHIUNQUE} volume={0.25} />
        <Audio name="digitazione comando" src={s("digitazione")} from={S.script + 4} durationInFrames={30} volume={0.25} />
        <Audio name="ding gratis" src={s("ding")} from={GRATIS} volume={0.3} />
        <Audio name="pop mandalo" src={s("pop")} from={S.mandalo} volume={0.32} />
      </Track>
    </AbsoluteFill>
  );
};
