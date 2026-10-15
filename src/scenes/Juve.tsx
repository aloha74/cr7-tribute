import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CinematicBg } from "../components/CinematicBg";
import { BeatReveal } from "../components/BeatReveal";
import { Bloom, Vignette, headline, kicker, GOLD } from "../components/PostFX";
import { SceneTransition } from "../components/SceneTransition";
import { FilmGrain } from "../components/FilmGrain";
import { TIMELINE } from "../timeline";

const SEG = TIMELINE.find((s) => s.id === "juve")!;
const DUR = SEG.end - SEG.start;

export const Juve: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <CinematicBg
        src="images/bg/cr7-juve-2019-bg.jpg"
        durationInFrames={DUR}
        zoom={1.16}
        driftY={-30}
        grade="cool"
        dim={0.55}
      />
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}
      >
        <BeatReveal at={112.0} sceneStart={SEG.start}>
          <p style={kicker(30)}>2018 · A new kingdom</p>
        </BeatReveal>
        <div style={{ height: 30 }} />
        <BeatReveal at={112.0} sceneStart={SEG.start} rise={120}>
          <h1 style={headline(200)}>Juventus</h1>
        </BeatReveal>
        <div style={{ height: 40 }} />
        <BeatReveal at={115.2} sceneStart={SEG.start}>
          <Bloom color={GOLD}>
            <p style={{ ...headline(72, GOLD), letterSpacing: "0.05em" }}>
              101 goals · 2 Scudetti
            </p>
          </Bloom>
        </BeatReveal>
        <div style={{ height: 26 }} />
        <BeatReveal at={118.5} sceneStart={SEG.start}>
          <p style={kicker(26, "rgba(255,255,255,0.6)")}>Turin's king</p>
        </BeatReveal>
      </AbsoluteFill>
      <Vignette />
      <FilmGrain frame={frame} />
      <SceneTransition frame={frame} type={SEG.transition} />
    </AbsoluteFill>
  );
};
