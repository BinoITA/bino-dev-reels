// © 2026 BinoITA (bino.dev, @bino.devs) — CC BY 4.0: se lo riusi, cita "@bino.devs — github.com/BinoITA/bino-dev-reels"
import { Composition, Still } from "remotion";
import { Copertina } from "./Copertina";
import { DURATA, Reel06 } from "./Reel06";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="PromptInjection" component={Reel06} durationInFrames={DURATA} fps={30} width={1080} height={1920} />
    <Still id="Copertina" component={Copertina} width={1080} height={1920} />
  </>
);
