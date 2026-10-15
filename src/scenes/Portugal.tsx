import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CinematicBg } from "../components/CinematicBg";
import { BeatReveal } from "../components/BeatReveal";
import { Bloom, Vignette, headline, kicker, GOLD } from "../components/PostFX";
import { SceneTransition } from "../components/SceneTransition";
import { FilmGrain } from "../components/FilmGrain";
import { TIMELINE } from "../timeline";

const SEG = TIMELINE.find((s) => s.id === "portugal")!;
const DUR = SEG.end - SEG.start;

export const Portugal: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <CinematicBg
        src="images/bg/cr7-portugal-2018-bg.jpg"
        durationInFrames={DUR}
        zoom={1.13}
        driftX={-50}
        grade="red"
        dim={0.62}
      />
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}
      >
        <BeatReveal at={127.5} sceneStart={SEG.start}>
          <p style={kicker(30)}>For country</p>
        </BeatReveal>
        <div style={{ height: 30 }} />
        <BeatReveal at={127.5} sceneStart={SEG.start} rise={120}>
          <h1 style={headline(210)}>Portugal</h1>
        </BeatReveal>
        <div style={{ height: 44 }} />
        <BeatReveal at={137.7} sceneStart={SEG.start} rise={110}>
          <Bloom color={GOLD}>
            <h1 style={headline(150, GOLD)}>Euro 2016</h1>
          </Bloom>
        </BeatReveal>
        <div style={{ height: 36 }} />
        <BeatReveal at={145.5} sceneStart={SEG.start}>
          <p style={kicker(30)}>Champions of Europe</p>
        </BeatReveal>
      </AbsoluteFill>
      <Vignette />
      <FilmGrain frame={frame} />
      <SceneTransition frame={frame} type={SEG.transition} />
    </AbsoluteFill>
  );
};
