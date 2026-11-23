// Stile di bino.dev: colori del logo <b/> e font.
import { loadFont as caricaGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as caricaMono } from "@remotion/google-fonts/JetBrainsMono";

export const { fontFamily: fontTitolo } = caricaGrotesk("normal", {
  weights: ["500", "700"],
  subsets: ["latin"],
});

export const { fontFamily: fontCodice } = caricaMono("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

export const colori = {
  sfondo: "#0D1117",
  pannello: "#161B22",
  bordo: "#30363D",
  testo: "#E6EDF3",
  muto: "#8B949E",
  accento: "#3FE08F",
  rosso: "#FF5C5C",
  giallo: "#F2CC60",
  blu: "#58A6FF",
  viola: "#D2A8FF",
};
