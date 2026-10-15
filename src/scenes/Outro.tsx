import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CinematicBg } from "../components/CinematicBg";
import { BeatReveal } from "../components/BeatReveal";
import { Bloom, Vignette, headline, kicker, GOLD } from "../components/PostFX";
import { SceneTransition } from "../components/SceneTransition";
import { FilmGrain } from "../components/FilmGrain";
import { TIMELINE } from "../timeline";

const SEG = TIMELINE.find((s) => s.id === "outro")!;
const DUR = SEG.end - SEG.start;

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <CinematicBg
        src="images/bg/cr7-2013-bg.jpg"
        durationInFrames={DUR}
        zoom={1.06}
        driftY={20}
        grade="gold"
        dim={0.68}
      />
      <AbsoluteFill
        style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}
      >
        <BeatReveal at={204.4} sceneStart={SEG.start} rise={110}>
          <Bloom color={GOLD}>
            <h1 style={{ ...headline(120, GOLD), textAlign: "center" }}>
              Cristiano
              <br />
              Ronaldo
            </h1>
          </Bloom>
        </BeatReveal>
        <div style={{ height: 44 }} />
        <BeatReveal at={207.5} sceneStart={SEG.start}>
          <p style={kicker(32)}>A legend in motion</p>
        </BeatReveal>
        <div style={{ height: 90 }} />
        <BeatReveal at={211.5} sceneStart={SEG.start} punch={false} rise={40}>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 20,
              letterSpacing: "0.18em",
              color: "rgba(255,255,255,0.45)",
              textTransform: "uppercase",
              textAlign: "center",
              lineHeight: 1.9,
            }}
          >
            Photos: Wikimedia Commons (CC BY / CC BY-SA)
            <br />
            Music: “Anthem of Victory” · Pixabay — free for commercial use
          </p>
        </BeatReveal>
      </AbsoluteFill>
      <Vignette />
      <FilmGrain frame={frame} />
      <SceneTransition frame={frame} type={SEG.transition} />
    </AbsoluteFill>
  );
};
