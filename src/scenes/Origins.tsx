import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CinematicBg } from "../components/CinematicBg";
import { BeatReveal } from "../components/BeatReveal";
import { Bloom, Vignette, headline, kicker, GOLD } from "../components/PostFX";
import { SceneTransition } from "../components/SceneTransition";
import { FilmGrain } from "../components/FilmGrain";
import { TIMELINE } from "../timeline";

const SEG = TIMELINE.find((s) => s.id === "origins")!;
const DUR = SEG.end - SEG.start;

export const Origins: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <CinematicBg
        src="images/bg/cr7-portugal-2018-bg.jpg"
        durationInFrames={DUR}
        zoom={1.12}
        driftX={50}
        grade="gold"
        dim={0.6}
      />
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "flex-start",
          flexDirection: "column",
          paddingLeft: 150,
        }}
      >
        <BeatReveal at={19.7} sceneStart={SEG.start}>
          <p style={kicker(30)}>Funchal · Madeira · 1985</p>
        </BeatReveal>
        <div style={{ height: 40 }} />
        <BeatReveal at={26.2} sceneStart={SEG.start}>
          <h1 style={headline(170)}>Sporting CP</h1>
        </BeatReveal>
        <div style={{ height: 30 }} />
        <BeatReveal at={32.5} sceneStart={SEG.start}>
          <p style={{ ...kicker(34), letterSpacing: "0.3em", color: "#fff" }}>
            A boy with a ball
          </p>
        </BeatReveal>
        <div style={{ height: 30 }} />
        <BeatReveal at={41.0} sceneStart={SEG.start}>
          <Bloom color={GOLD}>
            <p style={{ ...headline(64, GOLD), letterSpacing: "0.04em" }}>
              A dream bigger than the island
            </p>
          </Bloom>
        </BeatReveal>
      </AbsoluteFill>
      <Vignette />
      <FilmGrain frame={frame} />
      <SceneTransition frame={frame} type={SEG.transition} />
    </AbsoluteFill>
  );
};
