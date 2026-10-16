import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { PaperBg, TornFrame } from "../components/Paper";
import { Rise, handNote } from "../components/Kinetic";
import { PaperPeel } from "../components/PaperPeel";
import { JourneyMap } from "../components/JourneyMap";
import { FilmGrain } from "../../components/FilmGrain";
import { TIMELINE } from "../../timeline";

const SEG = TIMELINE.find((s) => s.id === "origins")!;

const serif = (size: number, color = "#fff"): React.CSSProperties => ({
  fontFamily: "'Inter', sans-serif",
  fontWeight: 500,
  fontSize: size,
  lineHeight: 1.35,
  color,
  margin: 0,
});

/** ACT 1 — the boy. Slow, intimate. Paper map draws Funchal → Lisbon. */
export const Boy: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#141210", overflow: "hidden" }}>
      <PaperBg color="#141210" />

      <div style={{ position: "absolute", left: 90, top: 120, transform: "scale(0.92)" }}>
        <JourneyMap at={19.7} sceneStart={SEG.start} legTime={4.5} count={2} />
      </div>

      <div style={{ position: "absolute", right: 150, top: 200, width: 560 }}>
        <Rise at={26.2} sceneStart={SEG.start}>
          <TornFrame seed={11} mat="#f4ead8">
            <Img src={staticFile("images/bg/cr7-portugal-2018-bg.jpg")} style={{ width: "100%", display: "block" }} />
          </TornFrame>
        </Rise>
      </div>

      <div style={{ position: "absolute", left: 150, bottom: 170, maxWidth: 900 }}>
        <Rise at={27} sceneStart={SEG.start}>
          <p style={serif(54)}>Before the goals,</p>
        </Rise>
        <Rise at={31} sceneStart={SEG.start}>
          <p style={serif(54)}>there was a boy with</p>
        </Rise>
        <Rise at={34.5} sceneStart={SEG.start}>
          <p style={{ ...serif(54), color: "#f5c518", fontWeight: 800 }}>nothing but a ball.</p>
        </Rise>
        <div style={{ height: 28 }} />
        <Rise at={41} sceneStart={SEG.start}>
          <p style={handNote(32)}>Funchal, Madeira · 1985</p>
        </Rise>
      </div>

      <PaperPeel seed={21} />
      <FilmGrain frame={frame} />
    </AbsoluteFill>
  );
};
