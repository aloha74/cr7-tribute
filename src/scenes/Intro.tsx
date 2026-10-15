import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CinematicBg } from "../components/CinematicBg";
import { BeatReveal } from "../components/BeatReveal";
import { Bloom, Vignette, Watermark, headline, kicker, GOLD } from "../components/PostFX";
import { SceneTransition } from "../components/SceneTransition";
import { FilmGrain } from "../components/FilmGrain";
import { TIMELINE } from "../timeline";

const SEG = TIMELINE.find((s) => s.id === "intro")!;
const DUR = SEG.end - SEG.start;

export const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <CinematicBg
        src="images/bg/cr7-2013-bg.jpg"
        durationInFrames={DUR}
        zoom={1.18}
        driftY={-40}
        grade="gold"
        dim={0.55}
      />
      <Watermark opacity={0.08}>7</Watermark>
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}
      >
        <BeatReveal at={0.7} sceneStart={SEG.start}>
          <p style={kicker(30)}>The making of a legend</p>
        </BeatReveal>
        <div style={{ height: 36 }} />
        <BeatReveal at={4.3} sceneStart={SEG.start}>
          <h1 style={headline(210)}>Cristiano</h1>
        </BeatReveal>
        <BeatReveal at={8.1} sceneStart={SEG.start}>
          <Bloom color={GOLD}>
            <h1 style={headline(210, GOLD)}>Ronaldo</h1>
          </Bloom>
        </BeatReveal>
        <div style={{ height: 40 }} />
        <BeatReveal at={11.2} sceneStart={SEG.start}>
          <p style={kicker(26, "rgba(255,255,255,0.6)")}>Est. 1985 · Madeira</p>
        </BeatReveal>
      </AbsoluteFill>
      <Vignette />
      <FilmGrain frame={frame} />
      <SceneTransition frame={frame} type={SEG.transition} />
    </AbsoluteFill>
  );
};
