// © 2026 BinoITA (bino.dev, @bino.devs) — CC BY 4.0: se lo riusi, cita "@bino.devs — github.com/BinoITA/bino-dev-reels"
import { Composition, Still } from "remotion";
import { Copertina } from "./Copertina";
import { DURATA, Reel04 } from "./Reel04";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Cartoni3D" component={Reel04} durationInFrames={DURATA} fps={30} width={1080} height={1920} />
    <Still id="Copertina" component={Copertina} width={1080} height={1920} />
  </>
);
