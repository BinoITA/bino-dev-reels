// © 2026 BinoITA (bino.dev, @bino.devs) — CC BY 4.0: se lo riusi, cita "@bino.devs — github.com/BinoITA/bino-dev-reels"
// Il reel completo: 5 scene + voce + sottotitoli.
// I punti di taglio tra le scene seguono le pause del narratore (vedi src/tempi.json).
import { Audio } from "@remotion/media";
import type { Caption } from "@remotion/captions";
import React from "react";
import { AbsoluteFill, Sequence, staticFile, Track } from "remotion";
import { Dissolvenza } from "./componenti";
import { Catena } from "./scene/Catena";
import { Chiusura } from "./scene/Chiusura";
import { Gancio } from "./scene/Gancio";
import { NienteDaCommentare } from "./scene/NienteDaCommentare";
import { Regista } from "./scene/Regista";
import { colori } from "./stile";
import { Sottotitoli } from "./Sottotitoli";
import tempi from "./tempi.json";

const captions = tempi.captions as Caption[];

export const Reel: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: colori.sfondo,
        backgroundImage: "radial-gradient(#ffffff14 2px, transparent 2px)",
        backgroundSize: "44px 44px",
      }}
    >
      <Track name="Scene">
        <Sequence name="1 · Gancio" from={0} durationInFrames={150}>
          <Dissolvenza durata={150}>
            <Gancio />
          </Dissolvenza>
        </Sequence>
        <Sequence name="2 · Niente da commentare" from={150} durationInFrames={150}>
          <Dissolvenza durata={150}>
            <NienteDaCommentare />
          </Dissolvenza>
        </Sequence>
        <Sequence name="3 · Catena" from={300} durationInFrames={237}>
          <Dissolvenza durata={237}>
            <Catena />
          </Dissolvenza>
        </Sequence>
        <Sequence name="4 · Regista" from={537} durationInFrames={150}>
          <Dissolvenza durata={150}>
            <Regista />
          </Dissolvenza>
        </Sequence>
        <Sequence name="5 · Chiusura" from={687} durationInFrames={213}>
          <Dissolvenza durata={240}>
            <Chiusura />
          </Dissolvenza>
        </Sequence>
      </Track>

      {/* voce e sottotitoli insieme: se sposti l'una si sposta anche l'altro */}
      <Sequence name="Narrazione" from={0} durationInFrames={900}>
        <Audio name="Voce (Gemini podcaster)" src={staticFile("voce.wav")} />
        <Sottotitoli captions={captions} />
      </Sequence>
    </AbsoluteFill>
  );
};
