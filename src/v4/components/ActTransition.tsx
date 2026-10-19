import React from "react";
import { Sequence } from "remotion";
import { Lottie } from "@remotion/lottie";
import animationData from "../anim/act-transition.json";

/** Hand-authored vector transition: gold line draws across, then bursts.
 *  `at` = global seconds where the 1s transition starts. Internally sequenced
 *  so the Lottie plays from its own frame 0 (the Lottie component follows the
 *  composition clock, so it must sit inside a Sequence). */
export const ActTransition: React.FC<{ at: number; style?: React.CSSProperties }> = ({ at, style }) => (
  <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 60, ...style }}>
    <Sequence from={Math.round(at * 30)} durationInFrames={32}>
      <Lottie animationData={animationData} />
    </Sequence>
  </div>
);
