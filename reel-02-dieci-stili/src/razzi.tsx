// © 2026 BinoITA (bino.dev, @bino.devs) — CC BY 4.0: se lo riusi, cita "@bino.devs — github.com/BinoITA/bino-dev-reels"
// Lo stesso razzo che decolla, ridisegnato in 10 stili. Tutto SVG generato dal codice.
// Ogni stile riceve `f` (frame assoluto: il volo continua tra un taglio e l'altro),
// `t` (frame da quando lo stile è sullo schermo) e `id` (prefisso unico per i <defs>).
import React from "react";
import { interpolate, random } from "remotion";
import { C, fontCodice, fontTitolo } from "./stile";

export const W = 510;
export const H = 840;

export type PropsStile = {
  readonly f: number;
  readonly t?: number;
  readonly id: string;
};

// ---------------------------------------------------------------- forma comune (coordinate locali, centro del razzo in 0,0)

const CORPO =
  "M0 -200 C 70 -140 85 -50 80 40 L 80 130 L -80 130 L -80 40 C -85 -50 -70 -140 0 -200 Z";
const ALETTA_S = "M-80 30 L -146 168 L -80 136 Z";
const ALETTA_D = "M80 30 L 146 168 L 80 136 Z";

type Aspetto = {
  corpo: string;
  punta: string;
  finestra: string;
  anello: string;
  alette: string;
  ugello: string;
  fiamma1: string;
  fiamma2: string;
  tratto?: string;
  spessore?: number;
  arrotonda?: boolean; // angoli morbidi (argilla)
};

const fiammata = (f: number) => Math.sin(f * 1.9) * 16 + Math.sin(f * 0.7) * 8;

const Forma: React.FC<{
  readonly id: string;
  readonly f: number;
  readonly a: Aspetto;
}> = ({ id, f, a }) => {
  const k = fiammata(f);
  const tr = (colore: string) =>
    a.tratto
      ? {
          stroke: a.tratto,
          strokeWidth: a.spessore ?? 4,
          strokeLinejoin: "round" as const,
          strokeLinecap: "round" as const,
        }
      : a.arrotonda
        ? { stroke: colore, strokeWidth: 16, strokeLinejoin: "round" as const }
        : {};
  return (
    <g>
      <defs>
        <clipPath id={`${id}-corpo`}>
          <path d={CORPO} />
        </clipPath>
      </defs>
      <path
        d={`M-46 150 Q -34 ${250 + k} 0 ${330 + k} Q 34 ${250 + k} 46 150 Z`}
        fill={a.fiamma1}
        {...tr(a.fiamma1)}
      />
      <path
        d={`M-26 150 Q -18 ${215 + k * 0.6} 0 ${265 + k * 0.6} Q 18 ${215 + k * 0.6} 26 150 Z`}
        fill={a.fiamma2}
      />
      <path d={ALETTA_S} fill={a.alette} {...tr(a.alette)} />
      <path d={ALETTA_D} fill={a.alette} {...tr(a.alette)} />
      <rect
        x={-50}
        y={126}
        width={100}
        height={28}
        rx={6}
        fill={a.ugello}
        {...tr(a.ugello)}
      />
      <path d={CORPO} fill={a.corpo} />
      <g clipPath={`url(#${id}-corpo)`}>
        <rect x={-100} y={-210} width={200} height={122} fill={a.punta} />
        {a.tratto ? (
          <line
            x1={-100}
            x2={100}
            y1={-88}
            y2={-88}
            stroke={a.tratto}
            strokeWidth={a.spessore ?? 4}
          />
        ) : null}
      </g>
      <path d={CORPO} fill="none" {...(a.tratto ? tr(a.corpo) : {})} />
      <circle cx={0} cy={-26} r={40} fill={a.anello} {...tr(a.anello)} />
      <circle
        cx={0}
        cy={-26}
        r={26}
        fill={a.finestra}
        {...(a.tratto ? tr(a.finestra) : {})}
      />
    </g>
  );
};

/** Posizione del razzo: galleggia un po', il resto del mondo scorre verso il basso. */
const posa = (f: number) => ({
  x: W / 2 + Math.sin(f / 17) * 6,
  y: 360 + Math.sin(f / 9) * 10,
  rot: Math.sin(f / 13) * 2.5,
});

const Posa: React.FC<{
  readonly f: number;
  readonly extra?: string;
  readonly children: React.ReactNode;
}> = ({ f, extra = "", children }) => {
  const p = posa(f);
  return (
    <g transform={`translate(${p.x} ${p.y}) rotate(${p.rot}) ${extra}`}>
      {children}
    </g>
  );
};

/** Punti che scendono (stelle, nuvole, scintille): sempre gli stessi per un dato seme. */
const scie = (f: number, n: number, vel: number, seme: string) =>
  new Array(n).fill(0).map((_, i) => {
    const x = random(`${seme}x${i}`) * W;
    const v = vel * (0.5 + random(`${seme}v${i}`));
    const y =
      ((((random(`${seme}y${i}`) * (H + 200) + f * v) % (H + 200)) + H + 200) %
        (H + 200)) -
      100;
    return { i, x, y, r: random(`${seme}r${i}`) };
  });

const Svg: React.FC<{
  readonly sfondo: string;
  readonly children: React.ReactNode;
}> = ({ sfondo, children }) => (
  <svg
    viewBox={`0 0 ${W} ${H}`}
    width="100%"
    height="100%"
    preserveAspectRatio="xMidYMid slice"
    style={{ display: "block" }}
  >
    <rect width={W} height={H} fill={sfondo} />
    {children}
  </svg>
);

// ---------------------------------------------------------------- 1. Neon

export const Neon: React.FC<PropsStile> = ({ f, id }) => {
  const n = "#120d24";
  return (
    <Svg sfondo="#0a0716">
      <defs>
        <filter id={`${id}-luce`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="7" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter={`url(#${id}-luce)`}>
        {scie(f, 26, 9, "neon").map((s) => (
          <line
            key={s.i}
            x1={s.x}
            x2={s.x}
            y1={s.y}
            y2={s.y + 20 + s.r * 60}
            stroke={s.r > 0.5 ? "#22e3ff" : "#ff3df0"}
            strokeWidth={3}
            strokeLinecap="round"
            opacity={0.7}
          />
        ))}
        <Posa f={f}>
          <Forma
            id={id}
            f={f}
            a={{
              corpo: n,
              punta: n,
              finestra: n,
              anello: n,
              alette: n,
              ugello: n,
              fiamma1: "none",
              fiamma2: "none",
              tratto: "#ff3df0",
              spessore: 6,
            }}
          />
          <circle
            cx={0}
            cy={-26}
            r={26}
            fill="none"
            stroke="#22e3ff"
            strokeWidth={6}
          />
          <path
            d={`M-46 156 Q -34 ${250 + fiammata(f)} 0 ${330 + fiammata(f)} Q 34 ${250 + fiammata(f)} 46 156`}
            fill="none"
            stroke="#ffd23f"
            strokeWidth={6}
            strokeLinecap="round"
          />
        </Posa>
      </g>
    </Svg>
  );
};

// ---------------------------------------------------------------- 2. Pixel art

const PIXEL_RAZZO = [
  "       RR       ",
  "      RRRR      ",
  "     RRRRRR     ",
  "     WWWWWW     ",
  "    WWWWWWWW    ",
  "    WWWBBWWW    ",
  "    WWBCCBWW    ",
  "    WWBCCBWW    ",
  "    WWWBBWWW    ",
  "    WWWWWWWW    ",
  "    WWWWWWWW    ",
  "    WWWWWWWW    ",
  "   RWWWWWWWWR   ",
  "  RRWWWWWWWWRR  ",
  "  RRWWWWWWWWRR  ",
  " RRRGGGGGGGGRRR ",
  " RR  GGGGGG  RR ",
];
const PIXEL_FIAMMA = [
  [
    "     YYYYYY     ",
    "     OYYYYO     ",
    "      OYYO      ",
    "       OO       ",
  ],
  [
    "     YYYYYY     ",
    "      YYYY      ",
    "     OYYYYO     ",
    "      OYYO      ",
    "       OO       ",
  ],
];
const PIXEL_COLORI: Record<string, string> = {
  R: "#e43b44",
  W: "#f4f4f4",
  B: "#124e89",
  C: "#2ce8f5",
  G: "#8b9bb4",
  Y: "#feae34",
  O: "#f77622",
};

export const Pixel: React.FC<PropsStile> = ({ f }) => {
  const P = 18;
  const fq = Math.floor(f / 3) * 3; // si muove a scatti, come i vecchi giochi
  const p = posa(fq);
  const x0 = Math.round((p.x - 8 * P) / P) * P;
  const y0 = Math.round((p.y - 9 * P) / P) * P;
  const righe = [...PIXEL_RAZZO, ...PIXEL_FIAMMA[Math.floor(f / 4) % 2]];
  return (
    <Svg sfondo="#1a1c2c">
      <g shapeRendering="crispEdges">
        {scie(fq, 30, 7, "pixel").map((s) => (
          <rect
            key={s.i}
            x={Math.round(s.x / 6) * 6}
            y={Math.round(s.y / 6) * 6}
            width={s.r > 0.7 ? 12 : 6}
            height={s.r > 0.7 ? 12 : 6}
            fill={s.r > 0.85 ? "#feae34" : "#f4f4f4"}
            opacity={0.4 + s.r * 0.6}
          />
        ))}
        {righe.flatMap((riga, r) =>
          riga
            .split("")
            .map((c, k) =>
              c === " " ? null : (
                <rect
                  key={`${r}-${k}`}
                  x={x0 + k * P}
                  y={y0 + r * P}
                  width={P}
                  height={P}
                  fill={PIXEL_COLORI[c]}
                />
              ),
            ),
        )}
      </g>
    </Svg>
  );
};

// ---------------------------------------------------------------- 3. Carta ritagliata

export const Carta: React.FC<PropsStile> = ({ f, id }) => {
  const fq = Math.floor(f / 3) * 3; // stop-motion a 10 fotogrammi al secondo
  const gira = (random(`carta${fq}`) - 0.5) * 4;
  return (
    <Svg sfondo="#8fc9d9">
      <defs>
        <filter id={`${id}-ombra`} x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow
            dx="0"
            dy="10"
            stdDeviation="3"
            floodColor="#000"
            floodOpacity="0.28"
          />
        </filter>
      </defs>
      <g filter={`url(#${id}-ombra)`}>
        {scie(fq, 7, 4, "carta").map((s) => (
          <g
            key={s.i}
            transform={`translate(${s.x} ${s.y}) scale(${0.6 + s.r * 0.6})`}
          >
            <circle cx={-40} cy={10} r={34} fill="#fffaf0" />
            <circle cx={0} cy={-8} r={44} fill="#fffaf0" />
            <circle cx={44} cy={12} r={30} fill="#fffaf0" />
            <rect
              x={-74}
              y={10}
              width={148}
              height={34}
              rx={17}
              fill="#fffaf0"
            />
          </g>
        ))}
        <Posa f={fq} extra={`rotate(${gira})`}>
          <Forma
            id={id}
            f={fq}
            a={{
              corpo: "#fbf6ec",
              punta: "#e4572e",
              finestra: "#2a9d8f",
              anello: "#fbf6ec",
              alette: "#e4572e",
              ugello: "#6d6875",
              fiamma1: "#f4a261",
              fiamma2: "#ffd166",
            }}
          />
        </Posa>
      </g>
    </Svg>
  );
};

// ---------------------------------------------------------------- 4. Progetto tecnico

export const Progetto: React.FC<PropsStile> = ({ f, t = 999, id }) => {
  const b = "#e8f1ff";
  const svela = interpolate(t, [0, 16], [-220, 360], C); // il plotter disegna dall'alto in basso
  const mono = { fontFamily: fontCodice, fill: b, fontSize: 18 } as const;
  return (
    <Svg sfondo="#1f4e8c">
      <defs>
        <pattern
          id={`${id}-g`}
          width="20"
          height="20"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M20 0 L0 0 0 20"
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.1"
            strokeWidth="1"
          />
        </pattern>
        <pattern
          id={`${id}-G`}
          width="100"
          height="100"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M100 0 L0 0 0 100"
            fill="none"
            stroke="#ffffff"
            strokeOpacity="0.25"
            strokeWidth="1.5"
          />
        </pattern>
        <clipPath id={`${id}-svela`}>
          <rect x={-300} y={-300} width={600} height={svela + 300} />
        </clipPath>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}-g)`} />
      <rect width={W} height={H} fill={`url(#${id}-G)`} />
      <Posa f={f * 0.4}>
        <g clipPath={`url(#${id}-svela)`}>
          <Forma
            id={id}
            f={f}
            a={{
              corpo: "#ffffff08",
              punta: "#ffffff10",
              finestra: "none",
              anello: "none",
              alette: "#ffffff08",
              ugello: "none",
              fiamma1: "none",
              fiamma2: "none",
              tratto: b,
              spessore: 3,
            }}
          />
          <line
            x1={-150}
            x2={150}
            y1={-26}
            y2={-26}
            stroke={b}
            strokeWidth={1.5}
            strokeDasharray="10 6 2 6"
          />
          <line
            x1={0}
            x2={0}
            y1={-230}
            y2={360}
            stroke={b}
            strokeWidth={1.5}
            strokeDasharray="10 6 2 6"
          />
        </g>
        {/* quote */}
        <g
          stroke={b}
          strokeWidth={2}
          opacity={interpolate(t, [10, 18], [0, 1], C)}
        >
          <line x1={175} x2={175} y1={-200} y2={154} />
          <line x1={165} x2={185} y1={-200} y2={-200} />
          <line x1={165} x2={185} y1={154} y2={154} />
          <line x1={-80} x2={80} y1={200} y2={200} />
          <line x1={-80} x2={-80} y1={190} y2={210} />
          <line x1={80} x2={80} y1={190} y2={210} />
        </g>
        <g opacity={interpolate(t, [10, 18], [0, 1], C)}>
          <text
            {...mono}
            x={188}
            y={-20}
            transform="rotate(90 188 -20)"
            textAnchor="middle"
          >
            H 354
          </text>
          <text {...mono} x={0} y={232} textAnchor="middle">
            Ø 160
          </text>
        </g>
      </Posa>
      <g transform={`translate(${W - 230} ${H - 96})`}>
        <rect width={210} height={76} fill="none" stroke={b} strokeWidth={2} />
        <line x1={0} x2={210} y1={38} y2={38} stroke={b} strokeWidth={2} />
        <text {...mono} x={12} y={26}>
          TAV. 04 — RAZZO
        </text>
        <text {...mono} x={12} y={64} fontSize={15}>
          scala 1:20 · bino.dev
        </text>
      </g>
    </Svg>
  );
};

// ---------------------------------------------------------------- 5. Glitch

const tinta = (c: string, fondo: string): Aspetto => ({
  corpo: c,
  punta: c,
  finestra: fondo,
  anello: c,
  alette: c,
  ugello: c,
  fiamma1: c,
  fiamma2: fondo,
});

export const Glitch: React.FC<PropsStile> = ({ f, id }) => {
  const fondo = "#0a0a0c";
  const passo = Math.floor(f / 2);
  const forte = random(`gl${passo}`) > 0.55;
  const dx = 6 + random(`gd${passo}`) * (forte ? 22 : 6);
  const strisce = 10;
  const contenuto = (
    <Posa f={f}>
      <g style={{ mixBlendMode: "screen" }} transform={`translate(${-dx} 0)`}>
        <Forma id={`${id}-r`} f={f} a={tinta("#ff1f4b", "#000000")} />
      </g>
      <g style={{ mixBlendMode: "screen" }} transform={`translate(${dx} 0)`}>
        <Forma id={`${id}-c`} f={f} a={tinta("#00f0ff", "#000000")} />
      </g>
    </Posa>
  );
  return (
    <Svg sfondo={fondo}>
      <defs>
        {new Array(strisce).fill(0).map((_, i) => (
          <clipPath key={i} id={`${id}-s${i}`}>
            <rect
              x={-200}
              y={(H / strisce) * i}
              width={W + 400}
              height={H / strisce + 1}
            />
          </clipPath>
        ))}
      </defs>
      {new Array(strisce).fill(0).map((_, i) => {
        const sposta =
          random(`gs${passo}-${i}`) > (forte ? 0.6 : 0.9)
            ? (random(`gx${passo}-${i}`) - 0.5) * 90
            : 0;
        return (
          <g key={i} clipPath={`url(#${id}-s${i})`}>
            <g transform={`translate(${sposta} 0)`}>{contenuto}</g>
          </g>
        );
      })}
      {new Array(5)
        .fill(0)
        .map((_, i) =>
          random(`gb${passo}-${i}`) > 0.6 ? (
            <rect
              key={i}
              x={random(`gbx${passo}-${i}`) * W * 0.6}
              y={random(`gby${passo}-${i}`) * H}
              width={60 + random(`gbw${passo}-${i}`) * 220}
              height={4 + random(`gbh${passo}-${i}`) * 10}
              fill={i % 2 ? "#00f0ff" : "#ff1f4b"}
              opacity={0.7}
            />
          ) : null,
        )}
      <text
        x={24}
        y={96}
        fontFamily={fontCodice}
        fontSize={22}
        fill="#f5f5f5"
        opacity={passo % 3 ? 0.9 : 0.3}
      >
        ERR_0x3F // segnale instabile
      </text>
    </Svg>
  );
};

// ---------------------------------------------------------------- 6. Terminale

const ASCII = [
  "      /\\      ",
  "     /  \\     ",
  "    /    \\    ",
  "    |    |    ",
  "    | () |    ",
  "    |    |    ",
  "    |    |    ",
  "   /|    |\\   ",
  "  / |    | \\  ",
  " /__|____|__\\ ",
  "     \\__/     ",
];
const ASCII_FIAMMA = [
  ["     )**(     ", "      **      ", "      ''      "],
  ["     (**)     ", "     '**'     ", "       .      "],
];

export const Terminale: React.FC<PropsStile> = ({ f, id }) => {
  const verde = "#39ff6a";
  const p = posa(f);
  const righe = [...ASCII, ...ASCII_FIAMMA[Math.floor(f / 3) % 2]];
  const progresso = Math.min(20, Math.floor(((f % 120) / 120) * 21));
  return (
    <Svg sfondo="#020a04">
      <defs>
        <filter id={`${id}-luce`}>
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <pattern
          id={`${id}-righe`}
          width="4"
          height="4"
          patternUnits="userSpaceOnUse"
        >
          <rect width="4" height="2" fill="#000" opacity="0.35" />
        </pattern>
      </defs>
      <g
        filter={`url(#${id}-luce)`}
        fontFamily={fontCodice}
        fill={verde}
        style={{ whiteSpace: "pre" }}
      >
        {scie(f, 22, 6, "term").map((s) => (
          <text key={s.i} x={s.x} y={s.y} fontSize={22} opacity={0.5}>
            {s.r > 0.6 ? "*" : "."}
          </text>
        ))}
        <text x={22} y={96} fontSize={22} xmlSpace="preserve">
          {"bino@dev:~$ ./lancia --razzo"}
          {Math.floor(f / 8) % 2 ? "█" : " "}
        </text>
        {righe.map((r, i) => (
          <text
            key={i}
            x={p.x}
            y={p.y - 230 + i * 40}
            fontSize={34}
            textAnchor="middle"
            xmlSpace="preserve"
            fontWeight={700}
          >
            {r}
          </text>
        ))}
        <text x={22} y={H - 30} fontSize={22} xmlSpace="preserve">
          {`decollo [${"#".repeat(progresso)}${".".repeat(20 - progresso)}]`}
        </text>
      </g>
      <rect width={W} height={H} fill={`url(#${id}-righe)`} />
    </Svg>
  );
};

// ---------------------------------------------------------------- 7. Fumetto

const stella = (punte: number, r1: number, r2: number) =>
  new Array(punte * 2)
    .fill(0)
    .map((_, i) => {
      const a = (Math.PI * i) / punte;
      const r = i % 2 ? r2 : r1;
      return `${Math.cos(a) * r},${Math.sin(a) * r}`;
    })
    .join(" ");

export const Fumetto: React.FC<PropsStile> = ({ f, t = 999, id }) => {
  const scoppio =
    interpolate(t, [2, 8], [0.4, 1], {
      ...C,
      easing: (x) => 1 - (1 - x) ** 3,
    }) *
    (1 + Math.sin(f / 3) * 0.03);
  return (
    <Svg sfondo="#ffd93d">
      <defs>
        <pattern
          id={`${id}-retino`}
          width="18"
          height="18"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="9" cy="9" r="4.5" fill="#f08c00" opacity="0.45" />
        </pattern>
      </defs>
      <rect width={W} height={H} fill={`url(#${id}-retino)`} />
      {scie(f, 12, 22, "fum").map((s) => (
        <rect
          key={s.i}
          x={s.x}
          y={s.y}
          width={12}
          height={70 + s.r * 90}
          rx={6}
          fill="#ffffff"
          stroke="#111"
          strokeWidth={4}
        />
      ))}
      <Posa f={f}>
        <Forma
          id={id}
          f={f}
          a={{
            corpo: "#ffffff",
            punta: "#ef233c",
            finestra: "#4cc9f0",
            anello: "#ffffff",
            alette: "#ef233c",
            ugello: "#3a3a3a",
            fiamma1: "#ff8c1a",
            fiamma2: "#fff275",
            tratto: "#111111",
            spessore: 9,
          }}
        />
      </Posa>
      <g transform={`translate(${W - 128} 128) rotate(-12) scale(${scoppio})`}>
        <polygon
          points={stella(12, 118, 82)}
          fill="#ffffff"
          stroke="#111"
          strokeWidth={6}
          strokeLinejoin="round"
        />
        <text
          textAnchor="middle"
          y={16}
          fontFamily={fontTitolo}
          fontWeight={700}
          fontStyle="italic"
          fontSize={46}
          fill="#111"
        >
          FIUUU!
        </text>
      </g>
    </Svg>
  );
};

// ---------------------------------------------------------------- 8. Argilla

export const Argilla: React.FC<PropsStile> = ({ f, id }) => {
  const g = (n: string) => `url(#${id}-g${n})`;
  const sq = Math.sin(f / 5) * 0.035;
  const grad = (nome: string, chiaro: string, scuro: string) => (
    <radialGradient id={`${id}-g${nome}`} cx="35%" cy="30%" r="80%">
      <stop offset="0%" stopColor={chiaro} />
      <stop offset="100%" stopColor={scuro} />
    </radialGradient>
  );
  return (
    <Svg sfondo="#ffd2bf">
      <defs>
        {grad("corpo", "#fffdf8", "#dcc7ab")}
        {grad("punta", "#ff9a8a", "#d4473a")}
        {grad("finestra", "#c4f0ff", "#2b86b0")}
        {grad("alette", "#ffd08a", "#df7d22")}
        {grad("ugello", "#d8ccc0", "#9c8b7c")}
        {grad("palla", "#fff3c4", "#f5a65b")}
        {grad("palla2", "#d9f5e4", "#6cc49a")}
        <filter id={`${id}-ombra`} x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow
            dx="0"
            dy="18"
            stdDeviation="12"
            floodColor="#8a3b1f"
            floodOpacity="0.3"
          />
        </filter>
      </defs>
      <g filter={`url(#${id}-ombra)`}>
        {scie(f, 8, 5, "arg").map((s) => (
          <circle
            key={s.i}
            cx={s.x}
            cy={s.y}
            r={18 + s.r * 26}
            fill={g(s.r > 0.5 ? "palla" : "palla2")}
          />
        ))}
        <Posa f={f} extra={`scale(${1 + sq} ${1 - sq})`}>
          <Forma
            id={id}
            f={f}
            a={{
              corpo: g("corpo"),
              punta: g("punta"),
              finestra: g("finestra"),
              anello: g("corpo"),
              alette: g("alette"),
              ugello: g("ugello"),
              fiamma1: "#ffb36b",
              fiamma2: "#fff1a8",
              arrotonda: true,
            }}
          />
          <ellipse
            cx={-38}
            cy={-110}
            rx={14}
            ry={34}
            fill="#ffffff"
            opacity={0.55}
            transform="rotate(18 -38 -110)"
          />
          <circle cx={-9} cy={-36} r={8} fill="#ffffff" opacity={0.8} />
        </Posa>
      </g>
    </Svg>
  );
};

// ---------------------------------------------------------------- 9. Matita

export const Matita: React.FC<PropsStile> = ({ f, id }) => {
  const seme = Math.floor(f / 4); // le linee "tremano" ogni 4 fotogrammi, come un disegno a mano
  const grafite = "#2a2a2a";
  const tratteggio = `url(#${id}-h)`;
  const aspetto: Aspetto = {
    corpo: "#fbf8f0",
    punta: tratteggio,
    finestra: tratteggio,
    anello: "#fbf8f0",
    alette: tratteggio,
    ugello: "#fbf8f0",
    fiamma1: "none",
    fiamma2: "none",
    tratto: grafite,
    spessore: 3.5,
  };
  return (
    <Svg sfondo="#fbf8f0">
      <defs>
        <pattern
          id={`${id}-h`}
          width="11"
          height="11"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(40)"
        >
          <line x1="0" y1="0" x2="0" y2="11" stroke={grafite} strokeWidth="2" />
        </pattern>
        <filter id={`${id}-m`} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.035"
            numOctaves="2"
            seed={seme}
          />
          <feDisplacementMap in="SourceGraphic" scale="7" />
        </filter>
      </defs>
      {new Array(20).fill(0).map((_, i) => (
        <line
          key={i}
          x1={0}
          x2={W}
          y1={70 + i * 42}
          y2={70 + i * 42}
          stroke="#a8c5e6"
          strokeWidth={2}
        />
      ))}
      <line x1={62} x2={62} y1={0} y2={H} stroke="#ee8f8f" strokeWidth={2.5} />
      <g filter={`url(#${id}-m)`}>
        {scie(f, 10, 9, "mat").map((s) => (
          <line
            key={s.i}
            x1={s.x}
            x2={s.x}
            y1={s.y}
            y2={s.y + 30 + s.r * 40}
            stroke={grafite}
            strokeWidth={2.5}
            strokeLinecap="round"
            opacity={0.6}
          />
        ))}
        <Posa f={f}>
          <Forma id={id} f={f} a={aspetto} />
          <g transform="translate(3 -2)" opacity={0.45}>
            <Forma
              id={`${id}-2`}
              f={f + 3}
              a={{
                ...aspetto,
                corpo: "none",
                punta: "none",
                finestra: "none",
                anello: "none",
                alette: "none",
                ugello: "none",
              }}
            />
          </g>
        </Posa>
      </g>
    </Svg>
  );
};

// ---------------------------------------------------------------- 10. Vetro

export const Vetro: React.FC<PropsStile> = ({ f, id }) => {
  const p = posa(f);
  const macchie = (
    <>
      <circle
        cx={130 + Math.sin(f / 30) * 60}
        cy={250 + Math.cos(f / 26) * 80}
        r={190}
        fill="#7b5cff"
      />
      <circle
        cx={390 + Math.cos(f / 24) * 50}
        cy={480 + Math.sin(f / 22) * 90}
        r={210}
        fill="#ff5fcf"
      />
      <circle
        cx={220 + Math.sin(f / 20) * 70}
        cy={720 + Math.cos(f / 28) * 50}
        r={170}
        fill="#33d1ff"
      />
    </>
  );
  return (
    <Svg sfondo="#160f33">
      <defs>
        <filter id={`${id}-sf`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="55" />
        </filter>
        <filter id={`${id}-gh`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
        <clipPath id={`${id}-sagoma`}>
          <path d={CORPO} />
          <path d={ALETTA_S} />
          <path d={ALETTA_D} />
          <rect x={-50} y={126} width={100} height={28} rx={6} />
        </clipPath>
        <linearGradient id={`${id}-lustro`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id={`${id}-fiamma`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffd0f0" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#ff5fcf" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g filter={`url(#${id}-sf)`}>{macchie}</g>
      <Posa f={f}>
        {/* vetro smerigliato: le macchie di sfondo, sfocate di più, viste attraverso la sagoma */}
        <g clipPath={`url(#${id}-sagoma)`}>
          <g transform={`rotate(${-p.rot}) translate(${-p.x} ${-p.y})`}>
            <rect width={W} height={H} fill="#2a1f5c" />
            <g filter={`url(#${id}-gh)`} opacity={0.9}>
              {macchie}
            </g>
          </g>
        </g>
        <Forma
          id={id}
          f={f}
          a={{
            corpo: `url(#${id}-lustro)`,
            punta: "#ffffff22",
            finestra: "#bfe9ff66",
            anello: "#ffffff40",
            alette: "#ffffff30",
            ugello: "#ffffff40",
            fiamma1: `url(#${id}-fiamma)`,
            fiamma2: "#ffffffaa",
            tratto: "#ffffffcc",
            spessore: 3,
          }}
        />
      </Posa>
    </Svg>
  );
};

// ---------------------------------------------------------------- elenco

export const STILI: { nome: string; Comp: React.FC<PropsStile> }[] = [
  { nome: "Neon", Comp: Neon },
  { nome: "Pixel art", Comp: Pixel },
  { nome: "Carta ritagliata", Comp: Carta },
  { nome: "Progetto tecnico", Comp: Progetto },
  { nome: "Glitch", Comp: Glitch },
  { nome: "Terminale", Comp: Terminale },
  { nome: "Fumetto", Comp: Fumetto },
  { nome: "Argilla", Comp: Argilla },
  { nome: "Matita", Comp: Matita },
  { nome: "Vetro", Comp: Vetro },
];
