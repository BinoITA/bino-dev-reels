// © 2026 BinoITA (bino.dev, @bino.devs) — CC BY 4.0: se lo riusi, cita "@bino.devs — github.com/BinoITA/bino-dev-reels"
// Reel 02 — "10 stili di animazione con Claude". Titolo fisso, lista 1-10 a sinistra,
// lo stesso razzo ridisegnato in uno stile nuovo a ogni parola della voce, griglia finale per il loop.
// Tempi in frame a 30 fps, presi da tempi.json (inizio di ogni parola, meno 2 frame).
import { Audio } from "@remotion/media";
import { createTikTokStyleCaptions, type Caption } from "@remotion/captions";
import React, { useMemo } from "react";
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  spring,
  staticFile,
  Track,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { STILI } from "./razzi";
import { C, fontCodice, fontTitolo, T } from "./stile";
import tempi from "./tempi.json";

// ---------------------------------------------------------------- tempi (frame assoluti)

export const DURATA = 615;
const BARRA = 50; // "STYLES" barrato
const ANTEPRIMA = 93; // "dieci stili…": carrellata veloce dei 10 stili
const PASSO_ANTEPRIMA = 6;
const PROMPT = 161; // "E i prompt."
export const INIZI = [188, 215, 245, 285, 324, 348, 374, 399, 426, 455]; // Neon … Vetro
export const GRIGLIA = 478; // "I dieci prompt sono nella descrizione"

/** Quale stile c'è sul palco e da quanti frame. */
const statoPalco = (frame: number) => {
  if (frame >= INIZI[0]) {
    const i = INIZI.filter((x) => frame >= x).length - 1;
    return { i, t: frame - INIZI[i] };
  }
  if (frame >= ANTEPRIMA) {
    const i = Math.min(9, Math.floor((frame - ANTEPRIMA) / PASSO_ANTEPRIMA));
    return { i, t: frame - (ANTEPRIMA + i * PASSO_ANTEPRIMA) };
  }
  return { i: 0, t: 999 };
};

// ---------------------------------------------------------------- pezzi

const usaPop = (da: number, smorzamento = 14) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - da, fps, config: { damping: smorzamento } });
};

const Pop: React.FC<{
  readonly da: number;
  readonly style?: React.CSSProperties;
  readonly children: React.ReactNode;
}> = ({ da, style, children }) => {
  const p = usaPop(da);
  return (
    <div
      style={{
        opacity: Math.min(1, p * 1.5),
        scale: String(interpolate(p, [0, 1], [0.6, 1])),
        translate: `0px ${interpolate(p, [0, 1], [40, 0])}px`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Adesivo: React.FC<{
  readonly colore: string;
  readonly style?: React.CSSProperties;
  readonly children: React.ReactNode;
}> = ({ colore, style, children }) => (
  <div
    style={{
      fontFamily: fontTitolo,
      fontWeight: 700,
      fontSize: 44,
      padding: "14px 28px",
      borderRadius: 20,
      background: colore,
      color: T.testo,
      border: `4px solid ${T.bordo}`,
      boxShadow: `7px 7px 0 ${T.bordo}`,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

const Intestazione: React.FC = () => (
  <>
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
        <span
          style={{
            width: 14,
            height: 14,
            borderRadius: 7,
            background: T.rosso,
          }}
        />
        PROMPT GRATIS · #02
      </div>
    </div>
    <div
      style={{
        position: "absolute",
        top: 336,
        left: 60,
        right: 120,
        fontFamily: fontTitolo,
        fontWeight: 700,
        fontSize: 72,
        lineHeight: 1.04,
        letterSpacing: -3,
        color: T.testo,
      }}
    >
      10 stili di animazione
      <br />
      con{" "}
      <span
        style={{
          background: `linear-gradient(transparent 12%, ${T.accento} 12%, ${T.accento} 88%, transparent 88%)`,
          padding: "0 12px",
          margin: "0 -6px",
        }}
      >
        Claude
      </span>
    </div>
  </>
);

const Lista: React.FC = () => {
  const frame = useCurrentFrame();
  const attivo = frame >= INIZI[0] ? statoPalco(frame).i : -1;
  const lampo =
    frame >= ANTEPRIMA && frame < INIZI[0] ? statoPalco(frame).i : -1;
  return (
    <div
      style={{
        position: "absolute",
        top: 540,
        left: 60,
        width: 360,
        height: 840,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {STILI.map((s, i) => {
        const on = i === attivo;
        const fatto = attivo > i;
        const accendi = on
          ? spring({
              frame: frame - INIZI[i],
              fps: 30,
              config: { damping: 12 },
            })
          : 0;
        return (
          <div
            key={s.nome}
            style={{
              height: 72,
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "0 14px",
              borderRadius: 16,
              border: `3px solid ${on || i === lampo ? T.bordo : "#14141433"}`,
              background: on
                ? T.accento
                : i === lampo
                  ? T.giallo
                  : fatto
                    ? T.pannello
                    : "#ffffff80",
              boxShadow: on ? `6px 6px 0 ${T.bordo}` : "none",
              translate: `${accendi * 12}px 0px`,
              scale: String(1 + accendi * 0.04),
              fontFamily: fontTitolo,
              fontWeight: 700,
              fontSize: 30,
              color: on || fatto || i === lampo ? T.testo : T.muto,
            }}
          >
            <span style={{ fontFamily: fontCodice, fontSize: 24, width: 40 }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span style={{ flex: 1, whiteSpace: "nowrap" }}>{s.nome}</span>
            {fatto ? (
              <span style={{ fontSize: 26, color: T.accentoTesto }}>✓</span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

const Palco: React.FC = () => {
  const frame = useCurrentFrame();
  const { i, t } = statoPalco(frame);
  const Stile = STILI[i].Comp;
  const colpo = t < 999 ? interpolate(t, [0, 5], [1.04, 1], C) : 1;
  return (
    <div
      style={{
        position: "absolute",
        left: 450,
        top: 540,
        width: 510,
        height: 840,
        borderRadius: T.raggio,
        border: `4px solid ${T.bordo}`,
        boxShadow: T.ombra,
        overflow: "hidden",
        scale: String(colpo),
        background: "#000",
      }}
    >
      <Stile f={frame} t={t} id={`palco-${i}`} />
      {frame < ANTEPRIMA ? null : (
        <div
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            fontFamily: fontCodice,
            fontWeight: 700,
            fontSize: 24,
            padding: "6px 14px",
            borderRadius: 999,
            background: T.pannello,
            border: `3px solid ${T.bordo}`,
            color: T.testo,
          }}
        >
          {String(i + 1).padStart(2, "0")}/10
        </div>
      )}
    </div>
  );
};

const Gancio: React.FC = () => {
  const frame = useCurrentFrame();
  const barra = interpolate(frame, [BARRA, BARRA + 8], [0, 1], C);
  return (
    <>
      <Pop
        da={-30}
        style={{ position: "absolute", left: 430, top: 572, rotate: "-5deg" }}
      >
        <Adesivo colore="#FFFFFF">
          <span style={{ position: "relative" }}>
            Commenta “STYLES”
            <span
              style={{
                position: "absolute",
                left: -8,
                top: "48%",
                height: 9,
                borderRadius: 5,
                width: `${barra * 108}%`,
                background: T.rosso,
                rotate: "-3deg",
              }}
            />
          </span>
        </Adesivo>
      </Pop>
      <Pop
        da={PROMPT}
        style={{ position: "absolute", left: 470, top: 1200, rotate: "5deg" }}
      >
        <Adesivo colore={T.accento} style={{ fontSize: 46 }}>
          + i prompt, gratis 👇
        </Adesivo>
      </Pop>
    </>
  );
};

const Griglia: React.FC = () => {
  const frame = useCurrentFrame() + GRIGLIA;
  const cella = { w: 168, h: 277 };
  return (
    <AbsoluteFill style={{ background: T.sfondo }}>
      <Intestazione />
      {STILI.map((s, i) => {
        const r = Math.floor(i / 5);
        const c = i % 5;
        const Stile = s.Comp;
        return (
          <Pop
            key={s.nome}
            da={i * 2 - 2}
            style={{
              position: "absolute",
              left: 60 + c * (cella.w + 15),
              top: 548 + r * (cella.h + 62),
            }}
          >
            <div
              style={{
                width: cella.w,
                height: cella.h,
                borderRadius: 16,
                border: `4px solid ${T.bordo}`,
                boxShadow: `6px 6px 0 ${T.bordo}`,
                overflow: "hidden",
                background: "#000",
              }}
            >
              <Stile f={frame} id={`griglia-${i}`} />
            </div>
            <div
              style={{
                marginTop: 8,
                width: cella.w,
                fontFamily: fontTitolo,
                fontWeight: 700,
                fontSize: 21,
                lineHeight: 1.05,
                color: T.testo,
                textAlign: "center",
              }}
            >
              {s.nome}
            </div>
          </Pop>
        );
      })}
      <Pop
        da={14}
        style={{
          position: "absolute",
          left: 60,
          right: 120,
          top: 1236,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Adesivo colore={T.pannello} style={{ fontSize: 48, rotate: "-2deg" }}>
          I 10 prompt? Nella{" "}
          <span
            style={{
              background: T.accento,
              borderRadius: 10,
              padding: "0 10px",
            }}
          >
            descrizione
          </span>{" "}
          👇
        </Adesivo>
      </Pop>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------- sottotitoli (solo gancio e finale: in mezzo parla la lista)

const Sottotitoli: React.FC<{ readonly captions: Caption[] }> = ({
  captions,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { pages } = useMemo(
    () =>
      createTikTokStyleCaptions({
        captions,
        combineTokensWithinMilliseconds: 650,
        breakOnSilenceAfterMilliseconds: 250,
      }),
    [captions],
  );
  if (frame >= INIZI[0] - 2 && frame < GRIGLIA) return null;
  const ms = (frame / fps) * 1000;
  const i = pages.findIndex(
    (p, k) =>
      ms >= p.startMs &&
      ms <
        Math.min(p.startMs + p.durationMs, pages[k + 1]?.startMs ?? Infinity),
  );
  if (i === -1) return null;
  const pagina = pages[i];
  if (ms > pagina.tokens[pagina.tokens.length - 1].toMs + 350) return null;
  const pop = spring({
    frame: frame - Math.round((pagina.startMs / 1000) * fps),
    fps,
    config: { damping: 13 },
  });
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
          fontSize: 64,
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
            <span
              key={k}
              style={{
                whiteSpace: "pre-wrap",
                background: attiva ? T.accento : "transparent",
                borderRadius: 10,
              }}
            >
              {t.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- montaggio

export const Reel02: React.FC = () => {
  const frame = useCurrentFrame();
  const s = (n: string) => staticFile(`suoni/${n}.wav`);
  return (
    <AbsoluteFill style={{ background: T.sfondo }}>
      <AbsoluteFill
        style={{
          transformOrigin: "50% 45%",
          scale: String(interpolate(frame, [0, GRIGLIA], [1, 1.025], C)),
        }}
      >
        <Track name="Scene">
          <Sequence name="Lista e palco" from={0} durationInFrames={GRIGLIA}>
            <Intestazione />
            <Lista />
            <Palco />
          </Sequence>
          <Sequence name="Gancio: adesivi" from={0} durationInFrames={INIZI[0]}>
            <Gancio />
          </Sequence>
        </Track>
      </AbsoluteFill>
      <Sequence
        name="Griglia finale"
        from={GRIGLIA}
        durationInFrames={DURATA - GRIGLIA}
      >
        <Griglia />
      </Sequence>
      <Sequence name="Sottotitoli" from={0} durationInFrames={DURATA}>
        <Sottotitoli captions={tempi.captions as Caption[]} />
      </Sequence>

      <Audio name="Voce" src={staticFile("voce.wav")} />
      <Audio name="Musica (generata)" src={s("musica")} volume={0.12} />
      <Track name="Effetti">
        <Audio
          name="timbro STYLES"
          src={s("timbro")}
          from={BARRA}
          volume={0.5}
        />
        <Audio
          name="whoosh anteprima"
          src={s("whoosh")}
          from={ANTEPRIMA - 6}
          volume={0.3}
        />
        {new Array(10).fill(0).map((_, i) => (
          <Audio
            key={`c${i}`}
            name={`click anteprima ${i + 1}`}
            src={s("click")}
            from={ANTEPRIMA + i * PASSO_ANTEPRIMA}
            volume={0.25}
          />
        ))}
        <Audio name="ding prompt" src={s("ding")} from={PROMPT} volume={0.3} />
        {INIZI.map((x, i) => (
          <Audio
            key={`p${i}`}
            name={`pop stile ${i + 1}`}
            src={s("pop")}
            from={x}
            volume={0.32}
          />
        ))}
        <Audio
          name="whoosh griglia"
          src={s("whoosh")}
          from={GRIGLIA - 6}
          volume={0.35}
        />
        <Audio
          name="ding griglia"
          src={s("ding")}
          from={GRIGLIA + 18}
          volume={0.25}
        />
      </Track>
    </AbsoluteFill>
  );
};
