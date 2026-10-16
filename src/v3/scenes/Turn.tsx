import React from "react";
import { AbsoluteFill, Sequence, Video, staticFile, useCurrentFrame, interpolate } from "remotion";
import { PaperBg } from "../components/Paper";
import { Slam, Rise, qHeadline } from "../components/Kinetic";
import { PaperPeel } from "../components/PaperPeel";
import { FilmGrain } from "../../components/FilmGrain";
import { v3seg } from "../timeline";
import { FPS } from "../../timeline";
import { CLIPS } from "../footage";

const SEG = v3seg("turn");
const DUR = SEG.end - SEG.start;

/**
 * THE TURN — the signature shot. The celebration footage starts inside a small
 * torn-paper circle that rips open to full frame on the beat: the paper opens
 * up like the world copying the celebration.
 */
export const Turn: React.FC = () => {
  const frame = useCurrentFrame();

  const open = interpolate(frame, [Math.round(155.5 * FPS) - SEG.start, Math.round(158 * FPS) - SEG.start], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const radius = interpolate(open, [0, 1], [12, 140]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0908", overflow: "hidden" }}>
      <PaperBg color="#0a0908" />
      <Sequence from={0} durationInFrames={DUR}>
        <div
          style={{
            width: "100%",
            height: "100%",
            clipPath: `circle(${radius}% at 50% 46%)`,
          }}
        >
          <Video
            src={staticFile(CLIPS[9])}
            muted
            playbackRate={0.65}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </Sequence>
      <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.3)" }} />

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <Rise at={155.5} sceneStart={SEG.start}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 46, color: "#fff", margin: 0 }}>
            Numbers don't explain
          </p>
        </Rise>
        <Slam at={160} sceneStart={SEG.start}>
          <h1 style={qHeadline(190)}>this.</h1>
        </Slam>
        <div style={{ height: 20 }} />
        <Slam at={170} sceneStart={SEG.start}>
          <h1 style={{ ...qHeadline(300, "#f5c518"), textShadow: "0 0 100px rgba(245,197,24,0.6)" }}>
            SIUUU
          </h1>
        </Slam>
      </AbsoluteFill>

      <PaperPeel seed={69} />
      <FilmGrain frame={frame} />
    </AbsoluteFill>
  );
};
