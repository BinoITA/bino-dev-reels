// Pezzi riutilizzati dalle scene.
import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colori, fontCodice, fontTitolo } from "./stile";

/** Valore 0 -> 1 con molla, a partire dal frame `da` (relativo alla scena). */
export const useEntrata = (da: number, smorzamento = 200) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - da, fps, config: { damping: smorzamento } });
};

/** Compare con un piccolo "pop" dal basso al frame `da`. */
export const Pop: React.FC<{
  readonly da: number;
  readonly style?: React.CSSProperties;
  readonly children: React.ReactNode;
}> = ({ da, style, children }) => {
  const p = useEntrata(da, 14);
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

/** Riquadro scuro con bordo, stile editor. */
export const Pannello: React.FC<{
  readonly style?: React.CSSProperties;
  readonly children: React.ReactNode;
}> = ({ style, children }) => (
  <div
    style={{
      backgroundColor: colori.pannello,
      border: `3px solid ${colori.bordo}`,
      borderRadius: 32,
      boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Etichetta tonda (chip). */
export const Chip: React.FC<{
  readonly colore?: string;
  readonly style?: React.CSSProperties;
  readonly children: React.ReactNode;
}> = ({ colore = colori.accento, style, children }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 14,
      padding: "16px 30px",
      borderRadius: 999,
      border: `3px solid ${colore}`,
      color: colore,
      backgroundColor: `${colore}1A`,
      fontFamily: fontTitolo,
      fontWeight: 700,
      fontSize: 46,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </div>
);

/** Il logo <b/> di bino.dev, in testo. */
export const Logo: React.FC<{ readonly dimensione: number }> = ({ dimensione }) => (
  <div style={{ fontFamily: fontCodice, fontWeight: 700, fontSize: dimensione, lineHeight: 1, color: colori.testo }}>
    {"<"}
    <span style={{ color: colori.accento }}>b</span>
    {"/>"}
  </div>
);

/** Fa entrare e uscire una scena in dissolvenza. */
export const Dissolvenza: React.FC<{ readonly durata: number; readonly children: React.ReactNode }> = ({
  durata,
  children,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: interpolate(frame, [0, 6, durata - 5, durata], [0, 1, 1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      {children}
    </div>
  );
};
