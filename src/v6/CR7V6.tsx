/**
 * CR7 v6 — "900+. BẰNG CÁCH NÀY." (380s, 1080p30, 11400 frames)
 * Scene registry: each scene receives LOCAL frame (0 = scene start).
 */
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import timeline from "./timeline.json";
import { Grade } from "./components/Grade";
import { AudioBed } from "./AudioBed";

// Scene components (filled by scene teams — each file exports default)
import S0 from "./scenes/S0";
import S1 from "./scenes/S1";
import S2 from "./scenes/S2";
import S3 from "./scenes/S3";
import S4 from "./scenes/S4";
import S5 from "./scenes/S5";
import S6 from "./scenes/S6";
import S7 from "./scenes/S7";
import S8 from "./scenes/S8";
import S9 from "./scenes/S9";
import S10 from "./scenes/S10";
import S11 from "./scenes/S11";
import S12 from "./scenes/S12";
import S13 from "./scenes/S13";
import S14 from "./scenes/S14";
import S15 from "./scenes/S15";
import S16 from "./scenes/S16";
import S17 from "./scenes/S17";
import S18 from "./scenes/S18";
import S19 from "./scenes/S19";
import S20 from "./scenes/S20";
import S21 from "./scenes/S21";
import S22 from "./scenes/S22";
import S23 from "./scenes/S23";
import S24 from "./scenes/S24";
import S25 from "./scenes/S25";
import S26 from "./scenes/S26";
import S27 from "./scenes/S27";
import S28 from "./scenes/S28";

const SCENES: Record<string, React.FC<{ frame: number }>> = {
  S0, S1, S2, S3, S4, S5, S6, S7, S8, S9, S10,
  S11, S12, S13, S14, S15, S16, S17, S18,
  S19, S20, S21, S22, S23, S24, S25, S26, S27, S28,
};

const ScenePlayer: React.FC<{ id: string; start: number }> = ({ id, start }) => {
  const frame = useCurrentFrame();
  const local = frame - start;
  const Comp = SCENES[id];
  return <Comp frame={local} />;
};

export const CR7V6: React.FC = () => {
  const frame = useCurrentFrame();
  const scenes = (timeline as any).scenes as { id: string; start: number; dur: number }[];
  return (
    <AbsoluteFill>
      <AudioBed />
      <Grade>
        {scenes.map((s) =>
          frame >= s.start && frame < s.start + s.dur ? (
            <ScenePlayer key={s.id} id={s.id} start={s.start} />
          ) : null
        )}
      </Grade>
    </AbsoluteFill>
  );
};

export const V6_FPS = 30;
export const V6_DURATION = 11400;
export const V6_WIDTH = 1920;
export const V6_HEIGHT = 1080;
