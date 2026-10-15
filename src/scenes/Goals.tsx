import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CinematicBg } from "../components/CinematicBg";
import { BeatReveal } from "../components/BeatReveal";
import { Bloom, Vignette, headline, kicker, GOLD } from "../components/PostFX";
import { SceneTransition } from "../components/SceneTransition";
import { FilmGrain } from "../components/FilmGrain";
import { StatCounter } from "../components/StatCounter";
import { TIMELINE, FPS, hitFrame } from "../timeline";

const SEG = TIMELINE.find((s) => s.id === "goals")!;
const DUR = SEG.end - SEG.start;

export const Goals: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <CinematicBg
        src="images/bg/cr7-freekick-bg.jpg"
        durationInFrames={DUR}
        zoom={1.2}
        driftX={-60}
        grade="red"
        dim={0.6}
      />
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}
      >
        <BeatReveal at={155.5} sceneStart={SEG.start}>
          <p style={kicker(32)}>Career goals</p>
        </BeatReveal>
        <div style={{ height: 40 }} />
        <BeatReveal at={158.5} sceneStart={SEG.start} rise={130} punch={false}>
          <StatCounter
            from={0}
            to={892}
            frame={frame}
            fps={FPS}
            duration={330}
            delay={hitFrame(160, SEG.start)}
            suffix="+"
            color={GOLD}
            fontSize={330}
          />
        </BeatReveal>
        <div style={{ height: 40 }} />
        <BeatReveal at={170} sceneStart={SEG.start}>
          <Bloom color={GOLD} blur={34}>
            <h1 style={headline(130, GOLD)}>Relentless</h1>
          </Bloom>
        </BeatReveal>
        <div style={{ height: 24 }} />
        <BeatReveal at={173.5} sceneStart={SEG.start}>
          <p style={kicker(26, "rgba(255,255,255,0.6)")}>And still counting</p>
        </BeatReveal>
      </AbsoluteFill>
      <Vignette />
      <FilmGrain frame={frame} />
      <SceneTransition frame={frame} type={SEG.transition} />
    </AbsoluteFill>
  );
};
