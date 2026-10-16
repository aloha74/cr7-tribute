import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { PaperBg } from "../components/Paper";
import { Slam, qHeadline } from "../components/Kinetic";
import { PaperPeel } from "../components/PaperPeel";
import { JourneyMap } from "../components/JourneyMap";
import { FilmGrain } from "../../components/FilmGrain";
import { v3seg } from "../timeline";

const SEG = v3seg("stages");

const Stamp: React.FC<{ city: string; year: string; rot: number }> = ({ city, year, rot }) => (
  <div
    style={{
      border: "6px solid #f5c518",
      padding: "18px 44px",
      transform: `rotate(${rot}deg)`,
      backgroundColor: "rgba(20,18,16,0.72)",
      boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      textAlign: "center",
    }}
  >
    <div style={{ ...qHeadline(72, "#f5c518") }}>{city}</div>
    <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 40, color: "#fff" }}>{year}</div>
  </div>
);

/** ACT 2 — the stages. The map keeps travelling; city stamps slam on beats. */
export const Stages: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#141210", overflow: "hidden" }}>
      <PaperBg color="#141210" />

      <div style={{ position: "absolute", left: 210, top: 90 }}>
        <JourneyMap at={48.8} sceneStart={SEG.start} legTime={2.4} count={5} />
      </div>

      <div style={{ position: "absolute", right: 170, top: 150, display: "flex", flexDirection: "column", gap: 54 }}>
        <Slam at={55.7} sceneStart={SEG.start}>
          <Stamp city="Manchester" year="2003" rot={-3} />
        </Slam>
        <Slam at={64.5} sceneStart={SEG.start}>
          <Stamp city="Madrid" year="2009" rot={2.5} />
        </Slam>
        <Slam at={73} sceneStart={SEG.start}>
          <Stamp city="Turin" year="2018" rot={-2} />
        </Slam>
      </div>

      <PaperPeel seed={33} />
      <FilmGrain frame={frame} />
    </AbsoluteFill>
  );
};
