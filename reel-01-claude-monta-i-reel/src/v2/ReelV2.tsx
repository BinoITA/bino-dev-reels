// Reel 01 v2 — stile "Editoriale chiaro". 6 scene sincronizzate con la voce (tempi in tempi.json),
// passi 1-4 con barra di avanzamento, effetti sonori e base musicale generati col codice.
// Tutti i tempi sono in frame a 30 fps, relativi all'inizio di ogni scena.
import { Audio } from "@remotion/media";
import { createTikTokStyleCaptions, type Caption } from "@remotion/captions";
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, Sequence, spring, staticFile, Track, useCurrentFrame, useVideoConfig } from "remotion";
import { Adesivo, CODICE, EDITORIALE, Etichetta, evidenziaRiga, ReelFinito, Telefono, Titolo } from "../anteprime/Anteprime";
import { Pop, useEntrata } from "../componenti";
import { fontCodice, fontTitolo } from "../stile";
import tempi from "./tempi.json";
import volume from "./volume.json";

const T = EDITORIALE;
const C = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// confini delle scene (frame assoluti), presi dalle pause della voce
const S = { gancio: 0, copione: 122, voce: 166, codice: 248, render: 370, finale: 432, fine: 585 };

// ---------------------------------------------------------------- pezzi

/** Scena: sfondo fermo, contenuto che entra da destra e poi si avvicina piano ("camera"). */
const Scena: React.FC<{ readonly durata: number; readonly entrata?: boolean; readonly children: React.ReactNode }> = ({ durata, entrata = true, children }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: T.sfondo }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformOrigin: "50% 45%",
          scale: String(interpolate(frame, [0, durata], [1, 1.035], C)),
          translate: entrata ? `${interpolate(frame, [0, 7], [70, 0], { ...C, easing: (x) => 1 - (1 - x) ** 3 })}px 0px` : "0px 0px",
          opacity: entrata ? interpolate(frame, [0, 3], [0.4, 1], C) : 1,
        }}
      >
        {children}
      </div>
    </AbsoluteFill>
  );
};

/** Evidenziatore verde che "passa" sulla parola dal frame `da`. */
const Evid: React.FC<{ readonly da: number; readonly children: React.ReactNode }> = ({ da, children }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [da, da + 8], [0, 1], { ...C, easing: (x) => 1 - (1 - x) ** 2 });
  return (
    <span
      style={{
        backgroundImage: `linear-gradient(${T.accento}, ${T.accento})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: `${p * 100}% 78%`,
        backgroundPosition: "0 60%",
        padding: "0 12px",
        margin: "0 -6px",
        boxDecorationBreak: "clone",
        WebkitBoxDecorationBreak: "clone",
      }}
    >
      {children}
    </span>
  );
};

const Card: React.FC<{ readonly style?: React.CSSProperties; readonly children: React.ReactNode }> = ({ style, children }) => (
  <div
    style={{
      position: "absolute",
      background: T.pannello,
      border: `4px solid ${T.bordo}`,
      borderRadius: T.raggio,
      boxShadow: T.ombra,
      ...style,
    }}
  >
    {children}
  </div>
);

const Intestazione: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontFamily: fontCodice, fontSize: 30, color: T.muto, paddingBottom: 18, marginBottom: 22, borderBottom: `3px dashed ${T.bordo}33` }}>{children}</div>
);

/** I 4 passi in alto, con la barra del passo attivo che si riempie. */
const Passi: React.FC = () => {
  const frame = useCurrentFrame() + S.copione; // frame assoluto
  const confini = [S.copione, S.voce, S.codice, S.render, S.finale];
  const nomi = ["Copione", "Voce", "Codice", "Render"];
  return (
    <div style={{ position: "absolute", top: 250, left: 80, right: 120, display: "flex", gap: 14 }}>
      {nomi.map((n, i) => {
        const p = interpolate(frame, [confini[i], confini[i + 1] - 4], [0, 1], C);
        const attivo = frame >= confini[i] && frame < confini[i + 1];
        return (
          <div key={n} style={{ flex: 1 }}>
            <div style={{ height: 22, borderRadius: 11, border: `3px solid ${T.bordo}`, background: "#00000010", overflow: "hidden" }}>
              <div style={{ width: `${p * 100}%`, height: "100%", background: T.accento }} />
            </div>
            <div style={{ marginTop: 12, fontFamily: fontCodice, fontSize: 30, fontWeight: 700, color: attivo ? T.testo : T.muto }}>
              {i + 1} {n}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Digita: React.FC<{ readonly testo: string; readonly da: number; readonly a: number; readonly cursore?: boolean }> = ({ testo, da, a, cursore = true }) => {
  const frame = useCurrentFrame();
  const n = Math.floor(interpolate(frame, [da, a], [0, testo.length], C));
  return (
    <>
      {testo.slice(0, n)}
      {cursore && Math.floor(frame / 7) % 2 === 0 ? <span style={{ color: T.accentoTesto }}>|</span> : null}
    </>
  );
};

// ---------------------------------------------------------------- scene

const Gancio: React.FC = () => {
  const frame = useCurrentFrame();
  // il primo fotogramma deve essere già pieno e nitido: etichetta, prima riga e telefono partono "già entrati"
  const tel = useEntrata(-40);
  const barra = interpolate(frame, [66, 76], [0, 1], C);
  return (
    <Scena durata={S.copione} entrata={false}>
      <Pop da={-30} style={{ position: "absolute", top: 250, left: 80 }}>
        <Etichetta t={T}>SMONTATO IN 20 SECONDI · #01</Etichetta>
      </Pop>
      <Titolo t={T} style={{ position: "absolute", top: 350, left: 80, right: 120 }}>
        <Pop da={-30}>Ti chiedono</Pop>
        <Pop da={16}>un commento.</Pop>
        <Pop da={62}>
          <Evid da={66}>Io ti do tutto.</Evid>
        </Pop>
      </Titolo>
      <Telefono
        t={T}
        style={{
          left: 250,
          top: 770 + (1 - tel) * 260 + Math.sin(frame / 16) * 8,
          width: 500,
          height: 900,
          rotate: `${-6 + Math.sin(frame / 24) * 1.2}deg`,
        }}
      >
        <ReelFinito t={T} />
      </Telefono>
      <Pop da={26} style={{ position: "absolute", left: 70, top: 900, rotate: "-8deg" }}>
        <Adesivo t={T} colore="#FFFFFF" testoColore={T.testo} style={{ position: "relative" }}>
          <span style={{ position: "relative" }}>
            Commenta “EDIT”
            <span style={{ position: "absolute", left: -8, top: "48%", height: 9, borderRadius: 5, width: `${barra * 108}%`, background: T.rosso, rotate: "-3deg" }} />
          </span>
        </Adesivo>
      </Pop>
      <Pop da={98} style={{ position: "absolute", left: 590, top: 1110, rotate: "7deg" }}>
        <Adesivo t={T} colore={T.accento} style={{ position: "relative", fontSize: 54 }}>
          ✓ gratis
        </Adesivo>
      </Pop>
    </Scena>
  );
};

const COPIONE = "Ti chiedono un commento per avere la guida. Io ti do tutto. Gratis.\nUno: scrivo il copione.\nDue: una voce AI lo legge.";

const Copione: React.FC = () => (
  <Scena durata={S.voce - S.copione}>
    <Titolo t={T} style={{ position: "absolute", top: 380, left: 80, right: 120 }}>
      Scrivo
      <br />
      <Evid da={24}>il copione.</Evid>
    </Titolo>
    <Card style={{ left: 80, right: 130, top: 680, padding: 44, rotate: "-1.5deg" }}>
      <Intestazione>📄 copione.txt</Intestazione>
      <div style={{ fontFamily: fontTitolo, fontSize: 46, lineHeight: 1.4, color: T.testo, whiteSpace: "pre-wrap", minHeight: 330 }}>
        <Digita testo={COPIONE} da={2} a={40} />
      </div>
    </Card>
    <Pop da={8} style={{ position: "absolute", left: 760, top: 1060, rotate: "10deg", fontSize: 110 }}>
      ✍️
    </Pop>
  </Scena>
);

const Voce: React.FC = () => {
  const frame = useCurrentFrame();
  const assoluto = frame + S.voce;
  const barre = 26;
  const secondi = Math.floor(assoluto / 30);
  return (
    <Scena durata={S.codice - S.voce}>
      <Titolo t={T} style={{ position: "absolute", top: 380, left: 80, right: 120 }}>
        Una voce AI
        <br />
        <Evid da={40}>lo legge.</Evid>
      </Titolo>
      <Card style={{ left: 80, right: 130, top: 680, padding: 44, rotate: "1deg" }}>
        <Intestazione>🎙 Gemini · voce “podcaster”</Intestazione>
        <div style={{ display: "flex", alignItems: "center", gap: 10, height: 260 }}>
          {new Array(barre).fill(0).map((_, i) => {
            const v = (volume as number[])[Math.max(0, assoluto - (barre - 1 - i) * 2)] ?? 0;
            return (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${8 + v * 92}%`,
                  borderRadius: 8,
                  background: i === barre - 1 ? T.accento : T.testo,
                  border: i === barre - 1 ? `3px solid ${T.bordo}` : "none",
                }}
              />
            );
          })}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 26, fontFamily: fontCodice, fontSize: 32, color: T.testo }}>
          <div style={{ width: 64, height: 64, borderRadius: 32, background: T.testo, display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
            <div style={{ width: 9, height: 26, background: T.pannello }} />
            <div style={{ width: 9, height: 26, background: T.pannello }} />
          </div>
          00:{String(secondi).padStart(2, "0")} / 00:18
        </div>
      </Card>
      <Pop da={56} style={{ position: "absolute", left: 110, top: 1265, rotate: "-5deg" }}>
        <Adesivo t={T} colore={T.giallo} style={{ position: "relative" }}>
          ↑ proprio questa che senti
        </Adesivo>
      </Pop>
    </Scena>
  );
};

const Codice: React.FC = () => {
  const frame = useCurrentFrame();
  const totale = CODICE.join("").length;
  let restanti = Math.floor(interpolate(frame, [20, 98], [0, totale], C));
  let cursoreMesso = false;
  return (
    <Scena durata={S.render - S.codice}>
      <Titolo t={T} style={{ position: "absolute", top: 380, left: 80, right: 120 }}>
        Claude scrive
        <br />
        <Evid da={44}>il video.</Evid>
      </Titolo>
      <div
        style={{
          position: "absolute",
          left: 60,
          right: 130,
          top: 660,
          rotate: "-1.5deg",
          borderRadius: T.raggio,
          overflow: "hidden",
          background: T.codice.fondo,
          border: `4px solid ${T.bordo}`,
          boxShadow: T.ombra,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "22px 28px", borderBottom: "2px solid #2a2824" }}>
          {["#FF5F57", "#FEBC2E", "#28C840"].map((x) => (
            <div key={x} style={{ width: 20, height: 20, borderRadius: 10, background: x }} />
          ))}
          <div style={{ marginLeft: 18, fontFamily: fontCodice, fontSize: 28, color: "#A8A39A" }}>Gancio.tsx</div>
          <div
            style={{
              marginLeft: "auto",
              fontFamily: fontCodice,
              fontSize: 24,
              color: "#3FE08F",
              border: "2px solid #3FE08F66",
              borderRadius: 999,
              padding: "4px 16px",
              opacity: 0.55 + 0.45 * Math.abs(Math.sin(frame / 8)),
            }}
          >
            ✦ Claude sta scrivendo
          </div>
        </div>
        <div style={{ padding: "26px 0", fontFamily: fontCodice, fontSize: 38, lineHeight: 1.55, minHeight: 470 }}>
          {CODICE.map((riga, i) => {
            const prima = restanti;
            const mostra = riga.slice(0, Math.max(0, restanti));
            restanti -= riga.length;
            const qui = !cursoreMesso && prima >= 0 && (restanti < 0 || i === CODICE.length - 1);
            if (qui) cursoreMesso = true;
            return (
              <div key={i} style={{ display: "flex", whiteSpace: "pre", background: qui ? "rgba(63,224,143,0.10)" : "transparent" }}>
                <span style={{ width: 80, textAlign: "right", paddingRight: 26, color: T.codice.numeri }}>{i + 1}</span>
                <span>{evidenziaRiga(mostra, T.codice)}</span>
                {qui && Math.floor(frame / 7) % 2 === 0 ? <span style={{ color: "#3FE08F" }}>▍</span> : null}
              </div>
            );
          })}
        </div>
      </div>
      <Pop da={68} style={{ position: "absolute", left: 690, top: 1070, rotate: "8deg" }}>
        <Telefono t={T} style={{ position: "relative", width: 220, height: 390, padding: 8 }}>
          <ReelFinito t={T} scala={0.44} />
        </Telefono>
      </Pop>
      <Pop da={78} style={{ position: "absolute", left: 80, top: 1280, rotate: "-4deg" }}>
        <Adesivo t={T} colore={T.accento} style={{ position: "relative" }}>
          ✓ scritte
        </Adesivo>
      </Pop>
      <Pop da={100} style={{ position: "absolute", left: 340, top: 1292, rotate: "3deg" }}>
        <Adesivo t={T} colore={T.giallo} style={{ position: "relative" }}>
          ✓ animazioni
        </Adesivo>
      </Pop>
    </Scena>
  );
};

const Render: React.FC = () => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [8, 42], [0, 1], { ...C, easing: (x) => 1 - (1 - x) ** 2 });
  const pronto = useEntrata(46, 10);
  return (
    <Scena durata={S.finale - S.render}>
      <Titolo t={T} style={{ position: "absolute", top: 380, left: 80, right: 120 }}>
        <Pop da={-4}>Render.</Pop>
        <Pop da={42}>
          <Evid da={46}>Ed è pronto.</Evid>
        </Pop>
      </Titolo>
      <Card style={{ left: 80, right: 130, top: 680, padding: 40, background: T.codice.fondo }}>
        <div style={{ fontFamily: fontCodice, fontSize: 36, color: "#F5F5F5" }}>
          <span style={{ color: T.accento }}>$</span> npx remotion render
        </div>
        <div style={{ marginTop: 30, height: 40, borderRadius: 20, background: "#2a2824", overflow: "hidden", border: "3px solid #3a3834" }}>
          <div style={{ width: `${p * 100}%`, height: "100%", background: T.accento }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 18, fontFamily: fontCodice, fontSize: 30, color: "#A8A39A" }}>
          <span>frame {Math.round(p * S.fine)}/{S.fine}</span>
          <span style={{ color: p >= 1 ? T.accento : "#A8A39A" }}>{p >= 1 ? "✓ fatto" : `${Math.round(p * 100)}%`}</span>
        </div>
      </Card>
      <div style={{ position: "absolute", left: 290, top: 1010 + (1 - pronto) * 500, rotate: `${-4 + (1 - pronto) * 10}deg`, opacity: Math.min(1, pronto * 2) }}>
        <Telefono t={T} style={{ position: "relative", width: 420, height: 740 }}>
          <ReelFinito t={T} scala={0.85} />
        </Telefono>
      </div>
      <Pop da={48} style={{ position: "absolute", left: 120, top: 1080, rotate: "-10deg" }}>
        <Adesivo t={T} colore={T.accento} style={{ position: "relative", fontSize: 64 }}>
          ✓ PRONTO
        </Adesivo>
      </Pop>
    </Scena>
  );
};

const Finale: React.FC = () => (
  <Scena durata={S.fine - S.finale}>
    <Pop da={-4} style={{ position: "absolute", top: 280, left: 0, right: 40, display: "flex", justifyContent: "center" }}>
      <div style={{ fontFamily: fontCodice, fontWeight: 700, fontSize: 230, lineHeight: 1, color: T.testo, textShadow: `8px 8px 0 ${T.accento}` }}>
        {"<"}
        <span style={{ color: T.accentoTesto }}>b</span>
        {"/>"}
      </div>
    </Pop>
    <Titolo t={T} style={{ position: "absolute", top: 600, left: 80, right: 120, textAlign: "center", fontSize: 100 }}>
      <Pop da={6}>
        Il codice è <Evid da={24}>gratis.</Evid>
      </Pop>
    </Titolo>
    <Pop da={28} style={{ position: "absolute", top: 800, left: 80, right: 130 }}>
      <div style={{ padding: "36px 40px", borderRadius: T.raggio, background: T.pannello, border: `4px solid ${T.bordo}`, boxShadow: T.ombra, fontFamily: fontTitolo }}>
        <div style={{ fontFamily: fontCodice, fontSize: 38, color: T.testo }}>
          BinoITA / <b>bino-dev-reels</b>
        </div>
        <div style={{ fontSize: 36, color: T.muto, marginTop: 18, lineHeight: 1.3 }}>Il codice di ogni reel. Niente “commenta per ricevere”.</div>
        <div style={{ display: "flex", gap: 14, marginTop: 24 }}>
          {["Remotion", "Claude Code", "MIT"].map((x) => (
            <div key={x} style={{ fontFamily: fontCodice, fontSize: 28, padding: "8px 20px", borderRadius: 999, background: T.accento, border: `3px solid ${T.bordo}` }}>
              {x}
            </div>
          ))}
        </div>
      </div>
    </Pop>
    <Pop da={40} style={{ position: "absolute", top: 740, right: 140, rotate: "7deg" }}>
      <Adesivo t={T} colore={T.giallo} style={{ position: "relative", fontSize: 40 }}>
        link in bio ↑
      </Adesivo>
    </Pop>
    <Pop da={60} style={{ position: "absolute", top: 1150, left: 80, right: 130 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 22,
          padding: "26px 32px",
          borderRadius: 999,
          background: T.pannello,
          border: `4px solid ${T.bordo}`,
          boxShadow: `7px 7px 0 ${T.bordo}`,
          fontFamily: fontTitolo,
          fontSize: 48,
          color: T.testo,
        }}
      >
        <div style={{ width: 60, height: 60, borderRadius: 30, background: T.accento, border: `3px solid ${T.bordo}` }} />
        <Digita testo="cosa smonto dopo? 👇" da={64} a={98} />
      </div>
    </Pop>
    <Pop da={106} style={{ position: "absolute", top: 1380, left: 0, right: 40, textAlign: "center", fontFamily: fontCodice, fontWeight: 700, fontSize: 60, color: T.testo }}>
      @bino.devs
    </Pop>
  </Scena>
);

// ---------------------------------------------------------------- sottotitoli

const SottotitoliV2: React.FC<{ readonly captions: Caption[] }> = ({ captions }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { pages } = useMemo(() => createTikTokStyleCaptions({ captions, combineTokensWithinMilliseconds: 650, breakOnSilenceAfterMilliseconds: 250 }), [captions]);
  const ms = (frame / fps) * 1000;
  const i = pages.findIndex((p, k) => ms >= p.startMs && ms < Math.min(p.startMs + p.durationMs, pages[k + 1]?.startMs ?? Infinity));
  if (i === -1) return null;
  const pagina = pages[i];
  if (ms > pagina.tokens[pagina.tokens.length - 1].toMs + 350) return null;
  const pop = spring({ frame: frame - Math.round((pagina.startMs / 1000) * fps), fps, config: { damping: 13 } });
  return (
    <div style={{ position: "absolute", left: 100, right: 140, top: 1420, display: "flex", justifyContent: "center", textAlign: "center", scale: String(0.8 + 0.2 * pop) }}>
      <div
        style={{
          fontFamily: fontTitolo,
          fontWeight: 700,
          fontSize: 68,
          lineHeight: 1.15,
          color: T.testo,
          background: T.pannello,
          border: `4px solid ${T.bordo}`,
          borderRadius: 20,
          padding: "10px 24px",
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

export const ReelV2: React.FC = () => {
  const s = (n: string) => staticFile(`v2/suoni/${n}.wav`);
  return (
    <AbsoluteFill style={{ background: T.sfondo }}>
      <Track name="Scene">
        <Sequence name="1 · Gancio" from={S.gancio} durationInFrames={S.copione - S.gancio}>
          <Gancio />
        </Sequence>
        <Sequence name="2 · Copione" from={S.copione} durationInFrames={S.voce - S.copione}>
          <Copione />
        </Sequence>
        <Sequence name="3 · Voce" from={S.voce} durationInFrames={S.codice - S.voce}>
          <Voce />
        </Sequence>
        <Sequence name="4 · Codice" from={S.codice} durationInFrames={S.render - S.codice}>
          <Codice />
        </Sequence>
        <Sequence name="5 · Render" from={S.render} durationInFrames={S.finale - S.render}>
          <Render />
        </Sequence>
        <Sequence name="6 · Finale" from={S.finale} durationInFrames={S.fine - S.finale}>
          <Finale />
        </Sequence>
      </Track>

      <Sequence name="Passi 1-4" from={S.copione} durationInFrames={S.finale - S.copione}>
        <Passi />
      </Sequence>

      <Sequence name="Sottotitoli" from={0} durationInFrames={S.fine}>
        <SottotitoliV2 captions={tempi.captions as Caption[]} />
      </Sequence>

      {/* audio: voce, base musicale bassa, effetti */}
      <Audio name="Voce" src={staticFile("v2/voce.wav")} />
      <Audio name="Musica (generata)" src={staticFile("v2/suoni/musica.wav")} volume={0.12} />
      <Track name="Effetti">
        <Audio name="pop EDIT" src={s("pop")} from={26} volume={0.45} />
        <Audio name="ding gratis" src={s("ding")} from={99} volume={0.35} />
        <Audio name="whoosh 2" src={s("whoosh")} from={S.copione - 4} volume={0.35} />
        <Audio name="tasti copione" src={s("digitazione")} from={S.copione + 2} durationInFrames={38} volume={0.4} />
        <Audio name="whoosh 3" src={s("whoosh")} from={S.voce - 4} volume={0.35} />
        <Audio name="pop questa" src={s("pop")} from={S.voce + 56} volume={0.4} />
        <Audio name="whoosh 4" src={s("whoosh")} from={S.codice - 4} volume={0.35} />
        <Audio name="tasti codice" src={s("digitazione")} from={S.codice + 20} durationInFrames={60} volume={0.4} />
        <Audio name="pop telefono" src={s("pop")} from={S.codice + 80} volume={0.4} />
        <Audio name="whoosh 5" src={s("whoosh")} from={S.render - 4} volume={0.35} />
        <Audio name="timbro pronto" src={s("timbro")} from={S.render + 48} volume={0.6} />
        <Audio name="ding pronto" src={s("ding")} from={S.render + 50} volume={0.3} />
        <Audio name="whoosh 6" src={s("whoosh")} from={S.finale - 4} volume={0.35} />
        <Audio name="tasti commento" src={s("digitazione")} from={S.finale + 64} durationInFrames={34} volume={0.35} />
      </Track>
    </AbsoluteFill>
  );
};
