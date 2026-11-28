// © 2026 BinoITA (bino.dev, @bino.devs) — CC BY 4.0: se lo riusi, cita "@bino.devs — github.com/BinoITA/bino-dev-reels"
// Stile "Editoriale chiaro" di bino.dev: font e colori.
import { loadFont as caricaGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as caricaMono } from "@remotion/google-fonts/JetBrainsMono";

export const { fontFamily: fontTitolo } = caricaGrotesk("normal", { weights: ["500", "700"], subsets: ["latin"] });
export const { fontFamily: fontCodice } = caricaMono("normal", { weights: ["400", "700"], subsets: ["latin"] });

export const T = {
  sfondo: "radial-gradient(#00000012 2px, transparent 2px) 0 0 / 40px 40px, #F2EEE3",
  testo: "#141414",
  muto: "#5E5A52",
  accento: "#3FE08F",
  accentoTesto: "#0E8F4E",
  pannello: "#FFFFFF",
  bordo: "#141414",
  ombra: "12px 12px 0 #141414",
  raggio: 28,
  rosso: "#FF4D4D",
  giallo: "#FFD93D",
};

export const C = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
