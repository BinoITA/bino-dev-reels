// movimento.tsx: movimenti con un nome per i reel in Remotion (licenza MIT, © 2026 BinoITA).
// Si copia in src/ di ogni reel nuovo. Nasce da una prova del 25/11/2026:
// con un solo "Pop" per tutto, il movimento sembra fatto dall'AI.
//
// Le regole in breve:
//  - una curva per tipo di movimento (entra, esce, si sposta);
//  - la durata dipende da distanza e peso;
//  - un elemento guida e gli altri reagiscono con ritardi irregolari;
//  - il testo compare di taglio;
//  - le pause restano vive.
import React from "react";
import { Easing, interpolate, spring } from "remotion";

export const FPS = 30;
const C = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// ---------------------------------------------------------------- curve (valori da ritoccare a occhio)

/** Entra: parte veloce e frena. */
export const CURVA_ENTRA = Easing.bezier(0.16, 1, 0.3, 1);
/** Esce: parte piano e accelera. */
export const CURVA_ESCE = Easing.in(Easing.cubic);
/** Si sposta da un punto a un altro: accelera e frena. */
export const CURVA_SPOSTA = Easing.inOut(Easing.cubic);

/** Molla leggera: icone, adesivi. Scatta e supera di poco il punto. */
export const mollaLeggera = (vf: number, da: number) =>
  spring({ frame: vf - da, fps: FPS, config: { mass: 0.6, damping: 9, stiffness: 190 } });
/** Molla pesante: schede, blocchi grandi. Più lenta, arriva senza rimbalzo. */
export const mollaPesante = (vf: number, da: number) =>
  spring({ frame: vf - da, fps: FPS, config: { mass: 1.6, damping: 26, stiffness: 120 } });

/** Durata in fotogrammi in base alla distanza: 5 per le cose vicine, fino a 18 per gli spostamenti lunghi. */
export const durataDaDistanza = (px: number) => Math.round(Math.min(18, Math.max(5, 5 + px / 70)));

/**
 * Ritardi irregolari per n elementi, in fotogrammi: il primo guida, gli altri seguono.
 * Esempio: ritardi(4) = [0, 3, 5, 10]. Il seme cambia lo schema da un gruppo all'altro.
 */
export const ritardi = (n: number, seme = 0) => {
  const passi = [3, 2, 5, 2, 4, 3, 6, 2];
  const out = [0];
  for (let i = 1; i < n; i++) out.push(out[i - 1] + passi[(i - 1 + seme) % passi.length]);
  return out;
};

// ---------------------------------------------------------------- componenti

type Da = "basso" | "alto" | "sinistra" | "destra";
const spostamento = (da: Da, px: number): [number, number] =>
  da === "basso" ? [0, px] : da === "alto" ? [0, -px] : da === "sinistra" ? [-px, 0] : [px, 0];

/**
 * Fa entrare un elemento.
 *  - modo "taglio": compare di colpo, in 2 fotogrammi (testo da leggere: è la scelta di base);
 *  - modo "leggero": molla con piccolo sorpasso (adesivi, icone, la parola chiave);
 *  - modo "pesante": arriva da lontano, lento, e si ferma secco (schede, blocchi, foto).
 */
export const Entra: React.FC<{
  readonly vf: number;
  readonly da: number;
  readonly modo?: "taglio" | "leggero" | "pesante";
  readonly dove?: Da;
  readonly px?: number;
  readonly style?: React.CSSProperties;
  readonly children: React.ReactNode;
}> = ({ vf, da, modo = "taglio", dove = "basso", px, style, children }) => {
  let opacita = 1;
  let scala = 1;
  let x = 0;
  let y = 0;
  if (modo === "taglio") {
    opacita = interpolate(vf, [da, da + 2], [0, 1], C);
  } else if (modo === "leggero") {
    const p = mollaLeggera(vf, da);
    opacita = interpolate(vf, [da, da + 3], [0, 1], C);
    scala = interpolate(p, [0, 1], [0.55, 1]);
    [x, y] = spostamento(dove, (px ?? 24) * (1 - p));
  } else {
    const p = mollaPesante(vf, da);
    opacita = interpolate(vf, [da, da + 4], [0, 1], C);
    [x, y] = spostamento(dove, (px ?? 140) * (1 - p));
  }
  return (
    <div style={{ opacity: opacita, scale: String(scala), translate: `${x}px ${y}px`, ...style }}>{children}</div>
  );
};

/** Fa uscire un elemento: accelera e dura circa due terzi dell'entrata. */
export const Esce: React.FC<{
  readonly vf: number;
  readonly da: number;
  readonly durata?: number;
  readonly dove?: Da;
  readonly px?: number;
  readonly style?: React.CSSProperties;
  readonly children: React.ReactNode;
}> = ({ vf, da, durata = 8, dove = "alto", px = 80, style, children }) => {
  const p = interpolate(vf, [da, da + durata], [0, 1], { ...C, easing: CURVA_ESCE });
  const [x, y] = spostamento(dove, px * p);
  return <div style={{ opacity: 1 - p, translate: `${x}px ${y}px`, ...style }}>{children}</div>;
};

/**
 * Pausa viva: mentre la scena si ferma per farsi leggere, l'elemento respira appena
 * (scala ±1,2% e qualche pixel di deriva). Il seme evita che tutti respirino insieme.
 */
export const Viva: React.FC<{
  readonly vf: number;
  readonly seme?: number;
  readonly style?: React.CSSProperties;
  readonly children: React.ReactNode;
}> = ({ vf, seme = 0, style, children }) => {
  const t = vf / FPS;
  const scala = 1 + 0.012 * Math.sin(t * 1.7 + seme * 1.3);
  const y = 3 * Math.sin(t * 1.1 + seme * 2.1);
  return <div style={{ scale: String(scala), translate: `0px ${y}px`, ...style }}>{children}</div>;
};
