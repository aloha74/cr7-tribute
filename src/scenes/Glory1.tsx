import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CinematicBg } from "../components/CinematicBg";
import { BeatReveal } from "../components/BeatReveal";
import { Bloom, Vignette, headline, kicker, GOLD } from "../components/PostFX";
import { SceneTransition } from "../components/SceneTransition";
import { FilmGrain } from "../components/FilmGrain";
import { StatCounter } from "../components/StatCounter";
import { TIMELINE, FPS, hitFrame } from "../timeline";

const SEG = TIMELINE.find((s) => s.id === "glory1")!;
const DUR = SEG.end - SEG.start;

export const Glory1: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <CinematicBg
        src="images/bg/cr7-ucl-final-2018-bg.jpg"
        durationInFrames={DUR}
        zoom={1.16}
        driftY={-30}
        grade="gold"
        dim={0.75}
      />
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}
      >
        <BeatReveal at={59.5} sceneStart={SEG.start}>
          <p style={kicker(32)}>Glory, by the numbers</p>
        </BeatReveal>
        <div style={{ height: 60 }} />
        <div style={{ display: "flex", flexDirection: "row", gap: 220, alignItems: "flex-start" }}>
          <BeatReveal at={64.5} sceneStart={SEG.start} rise={110}>
            <StatCounter
              from={0}
              to={5}
              frame={frame}
              fps={FPS}
              duration={150}
              delay={hitFrame(64.5, SEG.start)}
              label="Ballon d'Or"
              color={GOLD}
              fontSize={230}
            />
          </BeatReveal>
          <BeatReveal at={69.9} sceneStart={SEG.start} rise={110}>
            <StatCounter
              from={0}
              to={5}
              frame={frame}
              fps={FPS}
              duration={150}
              delay={hitFrame(69.9, SEG.start)}
              label="Champions League"
              color="#ffffff"
              fontSize={230}
            />
          </BeatReveal>
        </div>
        <div style={{ height: 60 }} />
        <BeatReveal at={76} sceneStart={SEG.start}>
          <Bloom color={GOLD}>
            <p style={{ ...headline(58, GOLD), letterSpacing: "0.06em" }}>
              Greatness is earned
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
