import React from "react";
import { AbsoluteFill, Audio, staticFile, useCurrentFrame } from "remotion";
import { DURATION_FRAMES } from "./timeline";
import { Prologue } from "./scenes/Prologue";
import { Island } from "./scenes/Island";
import { Ascent } from "./scenes/Ascent";
import { Machine } from "./scenes/Machine";
import { Immortal } from "./scenes/Immortal";
import { Epilogue } from "./scenes/Epilogue";
import { FilmGrain } from "../components/FilmGrain";
import { Vignette } from "../components/PostFX";

/** v4 "THE 900 CLUB" — 300s paper-cut documentary + WebGL. */
export const CR7V4: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0908" }}>
      <Prologue />
      <Island />
      <Ascent />
      <Machine />
      <Immortal />
      <Epilogue />
      <Vignette />
      <FilmGrain frame={frame} />
      <Audio src={staticFile("v4/score.wav")} />
    </AbsoluteFill>
  );
};

export { DURATION_FRAMES };
