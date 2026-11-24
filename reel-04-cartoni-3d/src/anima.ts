// © 2026 BinoITA (bino.dev, @bino.devs) — CC BY 4.0: se lo riusi, cita "@bino.devs — github.com/BinoITA/bino-dev-reels"
// Animazione "da cartone" come funzioni pure del frame (niente stato, niente orologio):
// camminata con peso, schiaccia e allunga, anticipazione, oscillazioni smorzate, battito di ciglia, saluto, salto.
// Ogni posa dipende solo dal numero del frame, così il render di Remotion è sempre identico.
import { Easing, interpolate, spring } from "remotion";

export const FPS = 30;
const TAU = Math.PI * 2;
export const C = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Molla con rimbalzo che parte al frame "da" (0 → 1). */
export const molla = (f: number, da: number, config = { damping: 9, stiffness: 140, mass: 0.6 }) =>
  spring({ frame: f - da, fps: FPS, config });

/** Passaggio morbido da "a" a "b" tra i frame da e a. */
export const morbido = (f: number, da: number, a: number, valDa: number, valA: number, e = Easing.inOut(Easing.cubic)) =>
  interpolate(f, [da, a], [valDa, valA], { easing: e, ...C });

/** Risposta di una molla smorzata a un "colpo" al frame t0: 0 → 1 con oscillazione che si spegne. */
export const smorzata = (f: number, t0: number, hz = 2.5, zeta = 0.25) => {
  const t = Math.max(0, (f - t0) / FPS);
  const w = TAU * hz;
  const wd = w * Math.sqrt(1 - zeta * zeta);
  return 1 - Math.exp(-zeta * w * t) * (Math.cos(wd * t) + ((zeta * w) / wd) * Math.sin(wd * t));
};

/** Oscillazione che si spegne dopo t0 (per antenne e code dopo una fermata). */
export const vibra = (f: number, t0: number, hz = 2.2, zeta = 0.18) => {
  const t = Math.max(0, (f - t0) / FPS);
  return f < t0 ? 0 : Math.exp(-zeta * TAU * hz * t) * Math.sin(TAU * hz * t);
};

/** Volume costante: se si allunga in altezza si stringe in larghezza. */
export const schiaccia = (s: number) => ({ x: 1 / Math.sqrt(s), y: s, z: 1 / Math.sqrt(s) });

/** Numero pseudo-casuale ma fisso (0..1) per l'indice n. */
export const caso = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Camminata: tutto deriva da una sola fase. intensita 0 = fermo, 1 = cammina. */
export const camminata = (f: number, intensita = 1, periodo = 16) => {
  const p = (f / periodo) * TAU;
  const k = intensita;
  const gamba = (ph: number) => {
    const s = Math.sin(p + ph);
    const c = Math.cos(p + ph);
    return { oscilla: s * 0.6 * k, alza: Math.pow(Math.max(0, c), 1.5) * 0.12 * k };
  };
  return {
    su: Math.abs(Math.cos(p)) * 0.07 * k, // su e giù, due volte per passo
    rollio: Math.sin(p) * 0.07 * k,
    torsione: Math.sin(p) * 0.08 * k,
    avanti: 0.1 * k,
    sx: gamba(0),
    dx: gamba(Math.PI),
    braccioSx: -Math.sin(p - 0.5) * 0.65 * k,
    braccioDx: Math.sin(p - 0.5) * 0.65 * k,
    contatto: Math.pow(1 - Math.abs(Math.sin(p)), 6) * k, // 1 quando un piede tocca terra
  };
};

/** Respiro e piccoli movimenti da fermo: il personaggio non sembra mai congelato. */
export const respiro = (f: number) => ({
  petto: 1 + Math.sin((f / FPS) * TAU * 0.28) * 0.02,
  ondeggia: Math.sin(f / 45) * 0.025,
  testa: Math.sin(f / 60 + 1) * 0.04,
});

/** Battito di ciglia a intervalli naturali (2-5 s), chiusura di 4 frame. Ritorna 1 aperti, ~0 chiusi. */
export const ciglia = (f: number) => {
  let t = 20;
  for (let k = 0; k < 400 && t <= f; k++) {
    if (f >= t && f < t + 4) return 0.08 + 0.92 * (1 - Math.sin((Math.PI * (f - t)) / 4));
    t += Math.round(60 + caso(k) * 90);
  }
  return 1;
};

/** Saluto con anticipazione e rimbalzo. Ritorna quanto è alzato il braccio (0..1) e lo scuotimento della mano. */
export const saluto = (f: number, t0: number, durata = 54) => {
  const u = f - t0;
  if (u < 0 || u > durata) return { alza: 0, scuoti: 0 };
  const su = interpolate(u, [0, 8], [0, 1], { easing: Easing.out(Easing.back(1.8)), ...C });
  const giu = interpolate(u, [durata - 10, durata], [1, 0], { easing: Easing.in(Easing.quad), ...C });
  return { alza: Math.min(su, giu), scuoti: Math.sin(u * 0.9) * 0.45 * Math.min(1, u / 8) * (u < durata - 10 ? 1 : 0) };
};

/** Saltello: accovacciata (anticipazione), parabola con allungamento, atterraggio schiacciato che si assesta. */
export const salto = (f: number, t0: number, altezza = 0.5, aria = 14) => {
  const u = f - t0;
  const prep = 6;
  let y = 0;
  let s = 1;
  if (u < 0) return { alto: 0, scala: schiaccia(1) };
  if (u < prep) s = morbido(u, 0, prep, 1, 0.82, Easing.inOut(Easing.quad));
  else if (u < prep + aria) {
    const t = (u - prep) / aria;
    y = 4 * t * (1 - t) * altezza;
    s = 1 + 0.16 * Math.sin(Math.PI * t) * (t < 0.5 ? 1 : 0.4);
  } else {
    const l = u - prep - aria;
    s = 1 - 0.22 * Math.exp(-l / 3) * Math.cos(l * 0.6);
  }
  return { alto: y, scala: schiaccia(s) };
};

/** Esploso coreografato per il pezzo i di n: escono uno alla volta, fluttuano, rientrano al contrario con rimbalzo. */
export const esploso = (f: number, i: number, n: number, inizio: number, tenuta: number) => {
  const fuori = molla(f, inizio + i * 4, { damping: 12, stiffness: 120, mass: 0.7 });
  const dentro = molla(f, inizio + tenuta + (n - 1 - i) * 2, { damping: 8, stiffness: 170, mass: 0.6 });
  const k = Math.max(0, fuori - dentro);
  const galleggia = Math.sin(f / 22 + i * 1.7);
  return { k, y: galleggia * 0.06 * k, rot: galleggia * 0.15 * k };
};
