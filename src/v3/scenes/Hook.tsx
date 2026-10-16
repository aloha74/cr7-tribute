import React from "react";
import { AbsoluteFill, Sequence, Video, staticFile, useCurrentFrame, interpolate } from "remotion";
import { PaperBg } from "../components/Paper";
import { Slam, qHeadline } from "../components/Kinetic";
import { FilmGrain } from "../../components/FilmGrain";
import { Vignette } from "../../components/PostFX";
import { TIMELINE, FPS } from "../../timeline";
import { CLIPS } from "../footage";

const SEG = TIMELINE.find((s) => s.id === "intro")!;
const DUR = SEG.end - SEG.start;

/** Cold open: real goal footage in the first second + the question. No logo reveal. */
export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, DUR], [1.05, 1.14]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0908", overflow: "hidden" }}>
      <PaperBg color="#0a0908" />
      <Sequence from={Math.round(0.7 * FPS)} durationInFrames={DUR}>
        <Video
          src={staticFile(CLIPS[0])}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${zoom})` }}
        />
      </Sequence>
      <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.35)" }} />

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <Slam at={4.3} sceneStart={SEG.start}>
          <h1 style={qHeadline(170)}>900+ goals.</h1>
        </Slam>
        <div style={{ height: 24 }} />
        <Slam at={8.1} sceneStart={SEG.start}>
          <h1 style={qHeadline(110)}>No one in history.</h1>
        </Slam>
        <div style={{ height: 30 }} />
        <Slam at={11.2} sceneStart={SEG.start}>
          <h1 style={{ ...qHeadline(330, "#f5c518"), textShadow: "0 0 90px rgba(245,197,24,0.55), 0 10px 60px rgba(0,0,0,0.6)" }}>
            How?
          </h1>
        </Slam>
      </AbsoluteFill>

      <Vignette />
      <FilmGrain frame={frame} />
    </AbsoluteFill>
  );
};
