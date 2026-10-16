import React from "react";
import { AbsoluteFill, Sequence, Video, staticFile, useCurrentFrame, interpolate } from "remotion";
import { Slam, Rise, qHeadline, handNote } from "../components/Kinetic";
import { PaperPeel } from "../components/PaperPeel";
import { FilmGrain } from "../../components/FilmGrain";
import { Vignette } from "../../components/PostFX";
import { v3seg } from "../timeline";
import { FPS } from "../../timeline";
import { CLIPS } from "../footage";

const SEG = v3seg("answer");
const DUR = SEG.end - SEG.start;

/** ANSWER — the opening question gets its answer: obsession, not talent. */
export const Answer: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, DUR], [1.1, 1.02]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      <Sequence from={0} durationInFrames={DUR}>
        <Video
          src={staticFile(CLIPS[10])}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})`, filter: "saturate(0.7) brightness(0.75)" }}
        />
      </Sequence>
      <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.4)" }} />

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <Slam at={182.5} sceneStart={SEG.start}>
          <h1 style={qHeadline(150)}>It's not talent.</h1>
        </Slam>
        <div style={{ height: 26 }} />
        <Rise at={187} sceneStart={SEG.start}>
          <h1 style={qHeadline(110)}>It's what you do</h1>
        </Rise>
        <Rise at={190.1} sceneStart={SEG.start}>
          <h1 style={{ ...qHeadline(110, "#f5c518") }}>when nobody's watching.</h1>
        </Rise>
        <div style={{ height: 40 }} />
        <Rise at={197.7} sceneStart={SEG.start}>
          <p style={handNote(34)}>— that's the answer to "how?"</p>
        </Rise>
      </AbsoluteFill>

      <Vignette />
      <PaperPeel seed={81} />
      <FilmGrain frame={frame} />
    </AbsoluteFill>
  );
};
