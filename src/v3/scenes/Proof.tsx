import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PaperBg } from "../components/Paper";
import { Slam, Rise, qHeadline } from "../components/Kinetic";
import { GoalsChart } from "../components/GoalsChart";
import { PaperPeel } from "../components/PaperPeel";
import { FilmGrain } from "../../components/FilmGrain";
import { v3seg } from "../timeline";

const SEG = v3seg("proof");

/** ACT 3a — the proof, part 1: data storytelling. Bars draw the argument. */
export const Proof: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#141210", overflow: "hidden" }}>
      <PaperBg color="#141210" />

      <div style={{ position: "absolute", top: 84, width: "100%", textAlign: "center" }}>
        <Rise at={85} sceneStart={SEG.start}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 44, color: "rgba(255,255,255,0.8)", margin: 0 }}>
            The numbers are absurd. Watch them draw themselves.
          </p>
        </Rise>
      </div>

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <div style={{ height: 60 }} />
        <GoalsChart at={89} sceneStart={SEG.start} />
      </AbsoluteFill>

      <div style={{ position: "absolute", bottom: 120, width: "100%", textAlign: "center" }}>
        <Slam at={101.2} sceneStart={SEG.start}>
          <h1 style={qHeadline(84)}>But numbers aren't the story.</h1>
        </Slam>
        <Slam at={104.3} sceneStart={SEG.start}>
          <h1 style={{ ...qHeadline(84, "#f5c518") }}>This is.</h1>
        </Slam>
      </div>

      <PaperPeel seed={45} />
      <FilmGrain frame={frame} />
    </AbsoluteFill>
  );
};
