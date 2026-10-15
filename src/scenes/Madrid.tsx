import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CinematicBg } from "../components/CinematicBg";
import { BeatReveal } from "../components/BeatReveal";
import { Bloom, Vignette, headline, kicker, GOLD } from "../components/PostFX";
import { SceneTransition } from "../components/SceneTransition";
import { FilmGrain } from "../components/FilmGrain";
import { StatCounter } from "../components/StatCounter";
import { TIMELINE, FPS, hitFrame } from "../timeline";

const SEG = TIMELINE.find((s) => s.id === "madrid")!;
const DUR = SEG.end - SEG.start;

export const Madrid: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <CinematicBg
        src="images/bg/cr7-freekick-bg.jpg"
        durationInFrames={DUR}
        zoom={1.1}
        driftX={60}
        grade="gold"
        dim={0.5}
      />
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}
      >
        <BeatReveal at={89.0} sceneStart={SEG.start}>
          <p style={kicker(30)}>2009 · The Galáctico era</p>
        </BeatReveal>
        <div style={{ height: 30 }} />
        <BeatReveal at={89.0} sceneStart={SEG.start} rise={120}>
          <h1 style={headline(190)}>Real Madrid</h1>
        </BeatReveal>
        <div style={{ height: 50 }} />
        <BeatReveal at={98.0} sceneStart={SEG.start} rise={110}>
          <StatCounter
            from={0}
            to={450}
            frame={frame}
            fps={FPS}
            duration={200}
            delay={hitFrame(98.0, SEG.start)}
            label="Goals in 438 games"
            color={GOLD}
            fontSize={220}
          />
        </BeatReveal>
        <div style={{ height: 50 }} />
        <BeatReveal at={104.3} sceneStart={SEG.start}>
          <Bloom color={GOLD}>
            <p style={{ ...headline(54, GOLD), letterSpacing: "0.06em" }}>
              All-time top scorer
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
