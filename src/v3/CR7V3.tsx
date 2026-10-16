import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { V3_TIMELINE } from "./timeline";
import { Hook } from "./scenes/Hook";
import { Boy } from "./scenes/Boy";
import { Stages } from "./scenes/Stages";
import { Proof } from "./scenes/Proof";
import { Montage } from "./scenes/Montage";
import { Turn } from "./scenes/Turn";
import { Answer } from "./scenes/Answer";
import { Echo } from "./scenes/Echo";

const SCENES: Record<string, React.FC> = {
  hook: Hook,
  boy: Boy,
  stages: Stages,
  proof: Proof,
  montage: Montage,
  turn: Turn,
  answer: Answer,
  echo: Echo,
};

export const CR7V3: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0a0908" }}>
    {V3_TIMELINE.map((seg) => {
      const Component = SCENES[seg.id];
      return (
        <Sequence key={seg.id} from={seg.start} durationInFrames={seg.end - seg.start}>
          <Component />
        </Sequence>
      );
    })}
    <Audio src={staticFile("anthem-of-victory.mp3")} />
  </AbsoluteFill>
);
