// © 2026 BinoITA (bino.dev, @bino.devs) — CC BY 4.0: se lo riusi, cita "@bino.devs — github.com/BinoITA/bino-dev-reels"
// Reel 04 — "Fanno pagare 79 euro per questo. Te lo smonto gratis."
// Un cartone 3D fatto solo di codice: Three.js (forme base) dentro Remotion. Sei scene sui paragrafi della voce.
// Telecamera, pose di Bino ed etichette sono funzioni del frame: il render è identico ogni volta.
import { Audio } from "@remotion/media";
import { createTikTokStyleCaptions, type Caption } from "@remotion/captions";
import { useThree } from "@react-three/fiber";
import { ThreeCanvas } from "@remotion/three";
import React, { useLayoutEffect, useMemo } from "react";
import { AbsoluteFill, Easing, interpolate, Sequence, staticFile, Track, useCurrentFrame } from "remotion";
import * as THREE from "three";
import { C, camminata, ciglia, esploso, molla, morbido, respiro, saluto, salto, vibra } from "./anima";
import { Bino, Luci, Piazzetta, type PosaBino } from "./mondo";
import { fontCodice, fontTitolo, T } from "./stile";
import tempi from "./tempi.json";

// ---------------------------------------------------------------- tempi (frame a 30 fps, dalle parole in tempi.json)

export const DURATA = 870;
const W = 1080;
const H = 1920;
const S = { codice: 127, forme: 255, three: 440, regalo: 641, mandalo: 769 };
const SMONTO = 98;
const GRATIS = 104;
const BLENDER = 137;
const MODELLI = 160;
const TUTTO_CODICE = 194;
const CLAUDE = 231;
const ETICHETTE = { cilindro: 302, cubo: 327, sfera: 349, cubi: 392, coni: 417 };
const ROBOT_FUORI = 268;
const CITTA_FUORI = 374;
const RIGHE_CODICE = [451, 470, 490, 505];
const REMOTION = 516;
const VIDEO = 548;
const PC = 583;
const DESCRIZIONE = 685;
const GITHUB = 745;
const RITORNO = 852; // gli ultimi frame tornano al primo fotogramma

// ---------------------------------------------------------------- dove sta Bino

const P0: [number, number, number] = [0.6, 0, -0.3]; // apertura (e fine, per il loop)
const P1: [number, number, number] = [0.6, 0, 0.9]; // dopo la camminata verso la telecamera
const CAMMINA = [132, 192] as const;
const SALTO_INDIETRO = 820;

const posBino = (f: number): [number, number, number] => {
  if (f < SALTO_INDIETRO) {
    const z = interpolate(f, [CAMMINA[0], CAMMINA[1]], [P0[2], P1[2]], { easing: Easing.inOut(Easing.sin), ...C });
    return [P0[0], 0, z];
  }
  // saltello all'indietro fino al punto di partenza
  const z = interpolate(f, [SALTO_INDIETRO + 6, SALTO_INDIETRO + 22], [P1[2], P0[2]], { easing: Easing.inOut(Easing.quad), ...C });
  return [P0[0], 0, z];
};

// ---------------------------------------------------------------- telecamera (stessa funzione per il 3D e per le etichette)

type Inquadratura = { f: number; pos: [number, number, number]; guarda: [number, number, number]; fov: number };
const INQUADRATURE: Inquadratura[] = [
  // Posizioni calcolate perché Bino stia tra i titoli (sopra y ~500) e i sottotitoli (sotto y 1420).
  { f: 0, pos: [4.65, 8.54, 18.77], guarda: [0.6, 2.3, -0.3], fov: 30 }, // diorama intero, Bino al centro
  { f: 112, pos: [1.82, 4.02, 11.34], guarda: [0.6, 1.45, -0.3], fov: 30 }, // avvicinamento
  { f: 130, pos: [1.82, 4.02, 11.34], guarda: [0.6, 1.45, -0.3], fov: 30 },
  { f: 196, pos: [2.37, 6.16, 17.71], guarda: [0.6, 2.1, 0.9], fov: 30 }, // segue la camminata, lascia spazio agli adesivi
  { f: 250, pos: [-7.52, 5.56, 16.17], guarda: [0.6, 2.1, 0.9], fov: 30 }, // giro a sinistra
  { f: 268, pos: [13.01, 6.62, 29.36], guarda: [0.6, 2.35, 1.5], fov: 22 }, // esploso del robot
  { f: 362, pos: [-8.79, 7.21, 30.41], guarda: [0.6, 2.35, 1.5], fov: 22 }, // orbita lenta attorno ai pezzi
  { f: 388, pos: [4, 17, 27], guarda: [0, 3.0, -1.5], fov: 34 }, // campo largo: si smonta la città
  { f: 436, pos: [2, 16, 26], guarda: [0, 3.2, -1.5], fov: 34 },
  { f: 456, pos: [0.6, 6.13, 23.4], guarda: [0.6, 2.75, 0.9], fov: 30 }, // Bino in basso, il codice sopra
  { f: 638, pos: [2.2, 6.3, 23.0], guarda: [0.6, 2.75, 0.9], fov: 30 },
  { f: 656, pos: [-1.67, 2.49, 13.8], guarda: [0.6, 1.7, 0.9], fov: 32 }, // dal basso, saluto
  { f: 766, pos: [-0.28, 2.53, 13.47], guarda: [0.6, 1.65, 0.9], fov: 32 },
  { f: 790, pos: [1.72, 4.11, 13.65], guarda: [0.6, 1.55, 0.9], fov: 30 },
  { f: RITORNO, pos: [4.65, 8.54, 18.77], guarda: [0.6, 2.3, -0.3], fov: 30 }, // di nuovo il frame 0
];

const lerp3 = (a: number[], b: number[], t: number): [number, number, number] => [
  a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t,
  a[2] + (b[2] - a[2]) * t,
];

export const inquadratura = (f: number) => {
  const lista = INQUADRATURE;
  if (f <= lista[0].f) return lista[0];
  for (let i = 0; i < lista.length - 1; i++) {
    const a = lista[i];
    const b = lista[i + 1];
    if (f >= a.f && f <= b.f) {
      const t = Easing.inOut(Easing.cubic)((f - a.f) / Math.max(1, b.f - a.f));
      return { f, pos: lerp3(a.pos, b.pos, t), guarda: lerp3(a.guarda, b.guarda, t), fov: a.fov + (b.fov - a.fov) * t };
    }
  }
  return lista[lista.length - 1];
};

const camera3 = (f: number) => {
  const q = inquadratura(f);
  const cam = new THREE.PerspectiveCamera(q.fov, W / H, 0.1, 200);
  cam.position.set(...q.pos);
  cam.lookAt(...q.guarda);
  cam.updateMatrixWorld();
  cam.updateProjectionMatrix();
  return cam;
};

/** Dove cade sullo schermo (in pixel) un punto 3D al frame f. */
const proietta = (f: number, p: [number, number, number]) => {
  const v = new THREE.Vector3(...p).project(camera3(f));
  return { x: (v.x * 0.5 + 0.5) * W, y: (-v.y * 0.5 + 0.5) * H };
};

const Telecamera: React.FC<{ readonly f: number }> = ({ f }) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const q = inquadratura(f);
  useLayoutEffect(() => {
    camera.fov = q.fov;
    camera.position.set(...q.pos);
    camera.lookAt(...q.guarda);
    camera.updateProjectionMatrix();
  }, [camera, q.fov, q.pos, q.guarda]);
  return null;
};

// ---------------------------------------------------------------- recitazione di Bino

const kRobot = (f: number) => esploso(f, 0, 1, ROBOT_FUORI, 92).k;
const kCitta = (f: number) => esploso(f, 0, 1, CITTA_FUORI, 50).k;

const posaBino = (f: number): PosaBino => {
  const r = respiro(f);
  const passo = interpolate(f, [CAMMINA[0], CAMMINA[0] + 6, CAMMINA[1] - 8, CAMMINA[1]], [0, 1, 1, 0], C);
  const w = camminata(f - CAMMINA[0], passo, 15);
  // fermata dopo la camminata: l'antenna oscilla e si assesta
  const assesta = vibra(f, CAMMINA[1], 2.4, 0.16);
  // salti di gioia: su "gratis", nel finale; saltello all'indietro per il loop
  const s1 = salto(f, GRATIS - 8, 0.45, 13);
  const s2 = salto(f, S.mandalo + 2, 0.4, 12);
  const s3 = salto(f, S.mandalo + 24, 0.3, 11);
  const s4 = salto(f, SALTO_INDIETRO, 0.35, 16);
  const salti = [s1, s2, s3, s4];
  const sy = salti.reduce((a, s) => a + s.alto, 0);
  const sq = salti.reduce((a, s) => ({ x: a.x * s.scala.x, y: a.y * s.scala.y, z: a.z * s.scala.z }), { x: 1, y: r.petto, z: 1 });
  // espressioni
  const sospetto = f < GRATIS ? morbido(f, 52, 64, 0, 1) * (1 - morbido(f, SMONTO - 4, SMONTO, 0, 1)) : 0;
  const felice = Math.max(
    f >= SMONTO && f < S.codice + 20 ? 1 - morbido(f, S.codice + 10, S.codice + 20, 0, 1) : 0,
    f >= ETICHETTE.cilindro - 30 && f < S.three ? (f > ROBOT_FUORI + 4 && f < ROBOT_FUORI + 80 ? 1 : 0) : 0,
    f >= S.mandalo && f < RITORNO - 4 ? 1 : 0,
  );
  // lampadina: si accende su "tutto codice", resta accesa mentre "scrive", pulsa nel regalo
  const lampadina = Math.max(
    morbido(f, TUTTO_CODICE, TUTTO_CODICE + 8, 0, 1) * (1 - morbido(f, S.forme, S.forme + 10, 0, 1)),
    f >= S.three && f < S.regalo ? 0.7 + 0.3 * Math.sin(f / 4) : 0,
    f >= S.regalo && f < RITORNO ? 0.5 + 0.5 * Math.abs(Math.sin(f / 7)) : 0,
  );
  // braccia: camminata, "scrive" con le mani in avanti, saluto, indica in basso e a destra
  const ciao = saluto(f, S.regalo + 4, 44);
  const scrive = f >= S.three + 6 && f < S.regalo - 6 ? morbido(f, S.three + 6, S.three + 16, 0, 1) * (1 - morbido(f, S.regalo - 16, S.regalo - 6, 0, 1)) : 0;
  const giu = morbido(f, DESCRIZIONE - 6, DESCRIZIONE + 4, 0, 1, Easing.out(Easing.back(1.6))) * (1 - morbido(f, GITHUB - 10, GITHUB - 2, 0, 1));
  const destra = morbido(f, GITHUB - 4, GITHUB + 6, 0, 1, Easing.out(Easing.back(1.6))) * (1 - morbido(f, S.mandalo - 6, S.mandalo, 0, 1));
  const tic = Math.sin(f * 1.3) * 0.25 * scrive;
  const braccioSx: [number, number] = [
    w.braccioSx - 1.2 * scrive + tic - 0.5 * giu,
    0.1 * giu,
  ];
  const braccioDx: [number, number] = [
    w.braccioDx - 1.2 * scrive - tic + ciao.scuoti * 0.3,
    ciao.alza * 2.2 + destra * 1.35 + 0.15 * sospetto,
  ];
  return {
    y: sy + w.su,
    scala: sq,
    rollio: w.rollio + r.ondeggia,
    avanti: w.avanti - 0.05 * scrive,
    girata: w.torsione * 0.5,
    braccioSx,
    braccioDx,
    gambaSx: w.sx.oscilla,
    gambaDx: w.dx.oscilla,
    alzaSx: w.sx.alza,
    alzaDx: w.dx.alza,
    testa: r.testa + 0.08 * sospetto + Math.sin(f / 9) * 0.06 * scrive,
    antenna: Math.sin(f / 7) * 0.05 + assesta * 0.35 - w.avanti * 0.8 + salti.reduce((a, s) => a + (s.alto > 0 ? -0.15 : 0), 0),
    felice,
    sospetto,
    ciglia: felice > 0.5 ? 1 : ciglia(f),
    bocca: 0.3 * scrive * Math.abs(Math.sin(f / 3)),
    lampadina,
    k: kRobot(f),
  };
};

// ---------------------------------------------------------------- la scena 3D

export const Scena3D: React.FC<{ readonly f: number }> = ({ f }) => {
  const [bx, , bz] = posBino(f);
  const autoX = interpolate(f, [S.codice + 4, S.forme - 10], [-8, 8], C);
  const pulsa = f >= RIGHE_CODICE[1] && f < RIGHE_CODICE[1] + 14 ? 1 + 0.08 * Math.sin(((f - RIGHE_CODICE[1]) / 14) * Math.PI) : 1;
  return (
    <>
      <Telecamera f={f} />
      <Luci />
      <Piazzetta f={f} k={kCitta(f)} autoX={autoX} />
      <group position={[bx, 0, bz]} scale={pulsa}>
        <Bino posa={posaBino(f)} />
      </group>
    </>
  );
};

// ---------------------------------------------------------------- 2D: adesivi, etichette, codice

const Pop: React.FC<{
  readonly f: number;
  readonly da: number;
  readonly fino?: number;
  readonly style?: React.CSSProperties;
  readonly children: React.ReactNode;
}> = ({ f, da, fino = 99999, style, children }) => {
  const p = molla(f, da);
  const via = interpolate(f, [fino - 6, fino], [1, 0], C);
  if (f < da - 1 || f > fino) return null;
  return (
    <div
      style={{
        position: "absolute",
        opacity: Math.min(1, p * 1.5) * via,
        scale: String(interpolate(p, [0, 1], [0.6, 1]) * (0.85 + 0.15 * via)),
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
      fontSize: 46,
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

const Barrato: React.FC<{ readonly f: number; readonly da: number; readonly children: React.ReactNode }> = ({ f, da, children }) => (
  <span style={{ position: "relative" }}>
    {children}
    <span
      style={{
        position: "absolute",
        left: -8,
        top: "50%",
        height: 9,
        borderRadius: 5,
        width: `${interpolate(f, [da, da + 7], [0, 108], C)}%`,
        background: T.rosso,
        rotate: "-4deg",
      }}
    />
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
      CARTONI 3D · #04
    </div>
  </div>
);

/** Il gancio a schermo del primo fotogramma: "79 € per questo?" (torna uguale alla fine per il loop). */
const Gancio: React.FC<{ readonly f: number }> = ({ f }) => {
  const inizio = f < S.codice;
  const fine = f >= RITORNO - 2;
  if (!inizio && !fine) return null;
  const apparizione = fine ? interpolate(f, [RITORNO - 2, DURATA - 4], [0, 1], C) : 1;
  return (
    <div style={{ position: "absolute", top: 330, left: 60, right: 120, opacity: apparizione }}>
      <div
        style={{
          display: "inline-block",
          fontFamily: fontTitolo,
          fontWeight: 700,
          fontSize: 88,
          lineHeight: 1.02,
          letterSpacing: -4,
          color: T.testo,
          background: T.pannello,
          border: `4px solid ${T.bordo}`,
          borderRadius: 24,
          boxShadow: `8px 8px 0 ${T.bordo}`,
          padding: "14px 30px 18px",
          rotate: "-1.5deg",
        }}
      >
        <span
          style={{
            background: `linear-gradient(transparent 10%, ${T.rosso} 10%, ${T.rosso} 90%, transparent 90%)`,
            padding: "0 12px",
            margin: "0 -6px",
            color: "#FFFFFF",
          }}
        >
          {fine ? "79 €" : <Barrato f={f} da={SMONTO}>79 €</Barrato>}
        </span>{" "}
        per questo?
      </div>
      {inizio ? (
        <Pop f={f} da={GRATIS} style={{ left: 330, top: 10, rotate: "-8deg" }}>
          <Adesivo colore={T.accento} style={{ fontSize: 64 }}>
            GRATIS
          </Adesivo>
        </Pop>
      ) : null}
    </div>
  );
};

const Etichetta: React.FC<{
  readonly f: number;
  readonly da: number;
  readonly fino: number;
  readonly punto: [number, number, number];
  readonly testo: string;
  readonly lato?: 1 | -1;
  readonly colore?: string;
}> = ({ f, da, fino, punto, testo, lato = 1, colore = T.giallo }) => {
  if (f < da - 1 || f > fino) return null;
  const p = proietta(f, punto);
  const m = molla(f, da);
  const via = interpolate(f, [fino - 6, fino], [1, 0], C);
  const dx = lato * 150;
  const x2 = Math.min(Math.max(p.x + dx, 120), 860);
  const y2 = p.y - 120;
  return (
    <div style={{ position: "absolute", inset: 0, opacity: Math.min(1, m * 1.4) * via }}>
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <line x1={p.x} y1={p.y} x2={p.x + (x2 - p.x) * m} y2={p.y + (y2 - p.y) * m} stroke={T.bordo} strokeWidth={5} />
        <circle cx={p.x} cy={p.y} r={11} fill={colore} stroke={T.bordo} strokeWidth={5} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: x2,
          top: y2,
          translate: "-50% -50%",
          scale: String(0.6 + 0.4 * m),
          rotate: `${lato * -3}deg`,
        }}
      >
        <Adesivo colore={colore} style={{ fontSize: 50 }}>
          {testo}
        </Adesivo>
      </div>
    </div>
  );
};

const RIGHE = [
  { t: "<mesh>", c: T.testo },
  { t: '  <cylinderGeometry args={[0.36, 0.42, 0.62]} />', c: "#0E8F4E" },
  { t: '  <meshStandardMaterial color="#FFD93D" />', c: "#B3261E" },
  { t: "</mesh>", c: T.testo },
];

const CartaCodice: React.FC<{ readonly f: number }> = ({ f }) => {
  const p = molla(f, S.three, { damping: 13, stiffness: 120, mass: 0.7 });
  const via = interpolate(f, [S.regalo - 8, S.regalo], [1, 0], C);
  if (f < S.three - 1 || f > S.regalo) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        top: 330,
        width: 900,
        opacity: via,
        translate: `${interpolate(p, [0, 1], [-1000, 0])}px 0px`,
        rotate: "-1.5deg",
      }}
    >
      <div
        style={{
          background: T.pannello,
          border: `4px solid ${T.bordo}`,
          borderRadius: T.raggio,
          boxShadow: T.ombra,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 26px",
            borderBottom: `4px solid ${T.bordo}`,
            background: "#F7F4EC",
            fontFamily: fontCodice,
            fontWeight: 700,
            fontSize: 26,
          }}
        >
          <span>Bino.tsx · scritto da Claude</span>
          <span style={{ color: T.muto }}>Three.js</span>
        </div>
        <div style={{ padding: "18px 26px 22px" }}>
          {RIGHE.map((r, i) => {
            const da = RIGHE_CODICE[i];
            if (f < da) return <div key={i} style={{ height: 44 }} />;
            const n = Math.floor(interpolate(f, [da, da + 10], [0, r.t.length], C));
            const attiva = f >= da && (i === RIGHE.length - 1 || f < RIGHE_CODICE[i + 1]);
            return (
              <div
                key={i}
                style={{
                  fontFamily: fontCodice,
                  fontWeight: 700,
                  fontSize: 29,
                  lineHeight: "44px",
                  whiteSpace: "pre",
                  color: r.c,
                  background: attiva ? "#3FE08F55" : "transparent",
                  borderRadius: 8,
                }}
              >
                {r.t.slice(0, n)}
              </div>
            );
          })}
        </div>
      </div>
      <Pop f={f} da={REMOTION} style={{ left: 40, top: 300, rotate: "-3deg" }}>
        <Adesivo colore={T.pannello} style={{ fontFamily: fontCodice, fontSize: 34 }}>
          $ npx remotion render{f >= VIDEO ? " → video.mp4 ✓" : ""}
        </Adesivo>
      </Pop>
      <Pop f={f} da={PC} style={{ left: 400, top: 410, rotate: "4deg" }}>
        <Adesivo colore={T.accento}>sul tuo PC · gratis</Adesivo>
      </Pop>
    </div>
  );
};

const Sovrapposizioni: React.FC<{ readonly f: number }> = ({ f }) => {
  const [bx, , bz] = posBino(f);
  const kr = kRobot(f);
  const kc = kCitta(f);
  return (
    <>
      <Chip />
      <Gancio f={f} />
      {/* scena 2: niente Blender, niente modelli scaricati, tutto codice */}
      <Pop f={f} da={BLENDER} fino={S.forme - 2} style={{ left: 60, top: 340, rotate: "-3deg" }}>
        <Adesivo colore={T.pannello} style={{ fontSize: 56 }}>
          <Barrato f={f} da={BLENDER + 10}>Blender</Barrato>
        </Adesivo>
      </Pop>
      <Pop f={f} da={MODELLI} fino={S.forme - 2} style={{ left: 300, top: 470, rotate: "2deg" }}>
        <Adesivo colore={T.pannello} style={{ fontSize: 48 }}>
          <Barrato f={f} da={MODELLI + 12}>modelli scaricati</Barrato>
        </Adesivo>
      </Pop>
      <Pop f={f} da={TUTTO_CODICE} fino={S.forme - 2} style={{ left: 120, top: 600, rotate: "-2deg" }}>
        <Adesivo colore={T.accento} style={{ fontSize: 60 }}>
          ✓ tutto codice
        </Adesivo>
      </Pop>
      <Pop f={f} da={CLAUDE} fino={S.forme - 2} style={{ left: 560, top: 720, rotate: "4deg" }}>
        <Adesivo colore={T.giallo} style={{ fontSize: 40 }}>
          scritto da Claude
        </Adesivo>
      </Pop>
      {/* scena 3: le forme */}
      <Pop f={f} da={S.forme} fino={CITTA_FUORI - 2} style={{ left: 60, top: 330 }}>
        <div
          style={{
            fontFamily: fontTitolo,
            fontWeight: 700,
            fontSize: 80,
            letterSpacing: -3,
            lineHeight: 1.02,
            background: T.pannello,
            border: `4px solid ${T.bordo}`,
            borderRadius: 24,
            boxShadow: `8px 8px 0 ${T.bordo}`,
            padding: "12px 28px 16px",
            rotate: "-1.5deg",
          }}
        >
          Solo{" "}
          <span style={{ background: `linear-gradient(transparent 10%, ${T.giallo} 10%, ${T.giallo} 90%, transparent 90%)`, padding: "0 10px" }}>
            forme base.
          </span>
        </div>
      </Pop>
      <Etichetta f={f} da={ETICHETTE.cilindro} fino={S.forme + 118} punto={[bx, 0.78 + 0.35 * kr, bz + 0.9 * kr]} testo="cilindro" lato={-1} />
      <Etichetta f={f} da={ETICHETTE.cubo} fino={S.forme + 118} punto={[bx - 0.45, 1.58 + 1.2 * kr, bz + 0.8 * kr + 0.5]} testo="cubo" lato={-1} colore={T.accento} />
      <Etichetta f={f} da={ETICHETTE.sfera} fino={S.forme + 118} punto={[bx, 1.58 + 1.2 * kr + 0.5 + 0.8 * kr + 0.36, bz + 1.1 * kr]} testo="sfera" lato={1} colore={T.pannello} />
      <Etichetta f={f} da={ETICHETTE.cubi} fino={S.three - 2} punto={[-1.6 - 0.56 * kc, 3.4 * kc + 2.4, -4.2]} testo="cubi" lato={-1} colore={T.accento} />
      <Etichetta f={f} da={ETICHETTE.coni} fino={S.three - 2} punto={[3.8 + 1.2 * kc, 2.6 * kc + 1.2, 0.2]} testo="coni" lato={1} />
      {/* scena 4: il codice */}
      <CartaCodice f={f} />
      {/* scena 5: il regalo */}
      <Pop f={f} da={DESCRIZIONE} fino={S.mandalo - 2} style={{ left: 60, top: 340, rotate: "-3deg" }}>
        <Adesivo colore={T.accento} style={{ fontSize: 54 }}>
          Prompt → descrizione 👇
        </Adesivo>
      </Pop>
      <Pop f={f} da={GITHUB} fino={S.mandalo - 2} style={{ left: 260, top: 480, rotate: "3deg" }}>
        <Adesivo colore={T.pannello} style={{ fontSize: 46 }}>
          Codice → GitHub ↗
        </Adesivo>
      </Pop>
      {/* scena 6: mandalo a… */}
      <Pop f={f} da={S.mandalo} fino={RITORNO - 4} style={{ left: 0, right: 0, top: 360, display: "flex", justifyContent: "center" }}>
        <Adesivo colore={T.giallo} style={{ fontSize: 64, rotate: "-3deg", padding: "20px 34px", textAlign: "center" }}>
          Mandalo a chi stava
          <br />
          per pagare 79 € ↗
        </Adesivo>
      </Pop>
    </>
  );
};

// ---------------------------------------------------------------- sottotitoli

const Sottotitoli: React.FC<{ readonly captions: Caption[] }> = ({ captions }) => {
  const frame = useCurrentFrame();
  const { pages } = useMemo(
    () => createTikTokStyleCaptions({ captions, combineTokensWithinMilliseconds: 650, breakOnSilenceAfterMilliseconds: 250 }),
    [captions],
  );
  if (frame >= RITORNO - 4) return null;
  const ms = (frame / 30) * 1000;
  const i = pages.findIndex((p, k) => ms >= p.startMs && ms < Math.min(p.startMs + p.durationMs, pages[k + 1]?.startMs ?? Infinity));
  if (i === -1) return null;
  const pagina = pages[i];
  if (ms > pagina.tokens[pagina.tokens.length - 1].toMs + 350) return null;
  const pop = molla(frame, Math.round((pagina.startMs / 1000) * 30), { damping: 13, stiffness: 140, mass: 0.6 });
  return (
    <div style={{ position: "absolute", left: 60, right: 120, top: 1430, display: "flex", justifyContent: "center", scale: String(0.8 + 0.2 * pop) }}>
      <div
        style={{
          fontFamily: fontTitolo,
          fontWeight: 700,
          fontSize: 56,
          lineHeight: 1.15,
          color: T.testo,
          background: T.pannello,
          border: `4px solid ${T.bordo}`,
          borderRadius: 20,
          padding: "8px 24px",
          boxShadow: `6px 6px 0 ${T.bordo}`,
          textAlign: "center",
        }}
      >
        {pagina.tokens.map((t, k) => (
          <span key={k} style={{ whiteSpace: "pre-wrap", background: ms >= t.fromMs && ms < t.toMs + 60 ? T.accento : "transparent", borderRadius: 10 }}>
            {t.text}
          </span>
        ))}
      </div>
    </div>
  );
};

// ---------------------------------------------------------------- montaggio

export const Reel04: React.FC = () => {
  const f = useCurrentFrame();
  const s = (n: string) => staticFile(`suoni/${n}.wav`);
  return (
    <AbsoluteFill style={{ background: T.sfondo }}>
      <ThreeCanvas
        width={W}
        height={H}
        shadows="soft"
        dpr={1}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
        camera={{ fov: 30, near: 0.1, far: 200, position: [1.6, 5.2, 12.5] }}
      >
        <Scena3D f={f} />
      </ThreeCanvas>
      {/* vignettatura leggera: unisce 3D e 2D */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(60,40,20,0.18))" }} />
      <Sovrapposizioni f={f} />
      <Sequence name="Sottotitoli" from={0} durationInFrames={DURATA}>
        <Sottotitoli captions={tempi.captions as Caption[]} />
      </Sequence>

      <Audio name="Voce" src={staticFile("voce.wav")} />
      <Audio name="Musica (generata)" src={s("musica")} volume={0.12} />
      <Track name="Effetti">
        <Audio name="timbro 79 euro" src={s("timbro")} from={SMONTO} volume={0.5} />
        <Audio name="pop gratis" src={s("pop")} from={GRATIS} volume={0.35} />
        {[BLENDER + 10, MODELLI + 12].map((x) => (
          <Audio key={x} name={`timbro barrato ${x}`} src={s("timbro")} from={x} volume={0.3} />
        ))}
        <Audio name="ding tutto codice" src={s("ding")} from={TUTTO_CODICE} volume={0.3} />
        <Audio name="whoosh esploso robot" src={s("whoosh")} from={ROBOT_FUORI - 4} volume={0.35} />
        {Object.values(ETICHETTE).map((x) => (
          <Audio key={x} name={`pop etichetta ${x}`} src={s("pop")} from={x} volume={0.28} />
        ))}
        <Audio name="whoosh esploso città" src={s("whoosh")} from={CITTA_FUORI - 4} volume={0.35} />
        <Audio name="digitazione codice" src={s("digitazione")} from={RIGHE_CODICE[0]} durationInFrames={70} volume={0.22} />
        <Audio name="ding video" src={s("ding")} from={VIDEO} volume={0.3} />
        <Audio name="pop descrizione" src={s("pop")} from={DESCRIZIONE} volume={0.3} />
        <Audio name="pop github" src={s("pop")} from={GITHUB} volume={0.3} />
        <Audio name="pop mandalo" src={s("pop")} from={S.mandalo} volume={0.35} />
      </Track>
    </AbsoluteFill>
  );
};
