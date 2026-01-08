import { StickyDeviceShowcase } from "../components/StickyDeviceShowcase";
import { ReportlySceneRenderer, REPORTLY_SCENES } from "../components/ReportlyScenes";

export default function Reportly() {
  return (
    <StickyDeviceShowcase scenes={REPORTLY_SCENES}>
      {(sceneIndex, progress) => (
        <ReportlySceneRenderer sceneIndex={sceneIndex} progress={progress} />
      )}
    </StickyDeviceShowcase>
  );
}
