import { Composition, Folder, Still } from "remotion";
import { A1, A2, A3, B1, B2, B3 } from "./anteprime/Anteprime";
import { Reel } from "./Reel";
import { ReelV2 } from "./v2/ReelV2";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="ClaudeMontaIReelV2" component={ReelV2} durationInFrames={585} fps={30} width={1080} height={1920} />
      <Composition id="ClaudeMontaIReel" component={Reel} durationInFrames={900} fps={30} width={1080} height={1920} />
      <Folder name="Anteprime-v2">
        <Still id="A1-Neon-Gancio" component={A1} width={1080} height={1920} />
        <Still id="A2-Neon-Processo" component={A2} width={1080} height={1920} />
        <Still id="A3-Neon-Finale" component={A3} width={1080} height={1920} />
        <Still id="B1-Editoriale-Gancio" component={B1} width={1080} height={1920} />
        <Still id="B2-Editoriale-Processo" component={B2} width={1080} height={1920} />
        <Still id="B3-Editoriale-Finale" component={B3} width={1080} height={1920} />
      </Folder>
    </>
  );
};
