import React from "react";
import { AbsoluteFill, Sequence, Video, staticFile, useCurrentFrame } from "remotion";
import { PaperBg } from "../components/Paper";
import { Slam, Rise, qHeadline, handNote } from "../components/Kinetic";
import { PaperPeel } from "../components/PaperPeel";
import { FilmGrain } from "../../components/FilmGrain";
import { v3seg } from "../timeline";
import { FPS } from "../../timeline";
import { CLIPS } from "../footage";

const SEG = v3seg("echo");

/** ECHO — bookend the opening question, then credits. */
export const Echo: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0908", overflow: "hidden" }}>
      <PaperBg color="#0a0908" />
      <Sequence from={Math.round(204 * FPS) - SEG.start} durationInFrames={SEG.end - Math.round(204 * FPS)}>
        <Video
          src={staticFile(CLIPS[11])}
          muted
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }}
        />
      </Sequence>
      <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.45)" }} />

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <Slam at={204.4} sceneStart={SEG.start}>
          <h1 style={{ ...qHeadline(220, "#f5c518"), textShadow: "0 0 90px rgba(245,197,24,0.55)" }}>
            900+.
          </h1>
        </Slam>
        <div style={{ height: 26 }} />
        <Rise at={207.5} sceneStart={SEG.start}>
          <h1 style={qHeadline(96)}>How? Like this.</h1>
        </Rise>
        <div style={{ height: 30 }} />
        <Rise at={210} sceneStart={SEG.start}>
          <p style={handNote(34)}>And still counting.</p>
        </Rise>
        <div style={{ height: 80 }} />
        <Rise at={212.5} sceneStart={SEG.start} distance={30}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 20, letterSpacing: "0.14em", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", textAlign: "center", lineHeight: 1.9, margin: 0 }}>
            Footage: “All 48 goals of Cristiano Ronaldo (2014–15)” · CC BY 3.0 via Wikimedia Commons
            <br />
            Music: “Anthem of Victory” · Pixabay — free for commercial use
          </p>
        </Rise>
      </AbsoluteFill>

      <PaperPeel seed={93} />
      <FilmGrain frame={frame} />
    </AbsoluteFill>
  );
};
