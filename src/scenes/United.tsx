import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CinematicBg } from "../components/CinematicBg";
import { BeatReveal } from "../components/BeatReveal";
import { Bloom, Vignette, Watermark, headline, kicker, GOLD } from "../components/PostFX";
import { SceneTransition } from "../components/SceneTransition";
import { FilmGrain } from "../components/FilmGrain";
import { TIMELINE } from "../timeline";

const SEG = TIMELINE.find((s) => s.id === "united")!;
const DUR = SEG.end - SEG.start;

export const United: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <CinematicBg
        src="images/bg/cr7-scores-bg.jpg"
        durationInFrames={DUR}
        zoom={1.12}
        driftX={-50}
        grade="red"
        dim={0.55}
      />
      <Watermark opacity={0.07}>7</Watermark>
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}
      >
        <BeatReveal at={48.8} sceneStart={SEG.start}>
          <p style={kicker(30)}>2003 · Theatre of Dreams</p>
        </BeatReveal>
        <div style={{ height: 30 }} />
        <BeatReveal at={48.8} sceneStart={SEG.start} rise={120}>
          <h1 style={headline(160)}>Manchester</h1>
        </BeatReveal>
        <BeatReveal at={50.2} sceneStart={SEG.start} rise={120}>
          <Bloom color={GOLD}>
            <h1 style={headline(160, GOLD)}>United</h1>
          </Bloom>
        </BeatReveal>
        <div style={{ height: 34 }} />
        <BeatReveal at={53} sceneStart={SEG.start}>
          <p style={kicker(28, GOLD)}>First Ballon d'Or · 2008</p>
        </BeatReveal>
      </AbsoluteFill>
      <Vignette />
      <FilmGrain frame={frame} />
      <SceneTransition frame={frame} type={SEG.transition} />
    </AbsoluteFill>
  );
};
