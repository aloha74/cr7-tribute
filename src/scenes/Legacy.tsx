import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CinematicBg } from "../components/CinematicBg";
import { BeatReveal } from "../components/BeatReveal";
import { Bloom, Vignette, headline, kicker, GOLD } from "../components/PostFX";
import { SceneTransition } from "../components/SceneTransition";
import { FilmGrain } from "../components/FilmGrain";
import { TIMELINE } from "../timeline";

const SEG = TIMELINE.find((s) => s.id === "legacy")!;
const DUR = SEG.end - SEG.start;

export const Legacy: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <CinematicBg
        src="images/bg/cr7-celebration-bg.jpg"
        durationInFrames={DUR}
        zoom={1.14}
        driftY={-40}
        grade="gold"
        dim={0.55}
      />
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}
      >
        <BeatReveal at={182.5} sceneStart={SEG.start} rise={140}>
          <Bloom color={GOLD} blur={40}>
            <h1 style={headline(280, GOLD)}>SIUUU</h1>
          </Bloom>
        </BeatReveal>
        <div style={{ height: 50 }} />
        <BeatReveal at={187.0} sceneStart={SEG.start}>
          <h1 style={headline(110)}>Built by</h1>
        </BeatReveal>
        <BeatReveal at={190.1} sceneStart={SEG.start}>
          <h1 style={headline(110)}>sacrifice</h1>
        </BeatReveal>
        <div style={{ height: 44 }} />
        <BeatReveal at={197.7} sceneStart={SEG.start}>
          <p style={kicker(28, GOLD)}>The work never stops</p>
        </BeatReveal>
      </AbsoluteFill>
      <Vignette />
      <FilmGrain frame={frame} />
      <SceneTransition frame={frame} type={SEG.transition} />
    </AbsoluteFill>
  );
};
