import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { tornClipPath } from "./Paper";

const TRANSITION_FRAMES = 18;

/**
 * Paper-peel chapter transition: a kraft paper sheet with a torn leading edge
 * sweeps across, carrying the viewer into the next chapter. The medium IS the
 * transition (no fades, no generic wipes).
 */
export const PaperPeel: React.FC<{ seed?: number }> = ({ seed = 7 }) => {
  const frame = useCurrentFrame();
  if (frame > TRANSITION_FRAMES) return null;

  const x = interpolate(frame, [0, TRANSITION_FRAMES], [-500, 2500], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = interpolate(frame, [TRANSITION_FRAMES - 5, TRANSITION_FRAMES], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ opacity, overflow: "hidden", pointerEvents: "none" }}>
      {/* the sheet */}
      <div
        style={{
          position: "absolute",
          top: -300,
          bottom: -300,
          left: x - 2600,
          width: 2600,
          backgroundColor: "#f4ead8",
          clipPath: tornClipPath(seed, 26, 40),
          transform: "rotate(-4deg)",
          boxShadow: "60px 0 120px rgba(0,0,0,0.5)",
        }}
      />
      {/* torn leading edge highlight */}
      <div
        style={{
          position: "absolute",
          top: -300,
          bottom: -300,
          left: x - 40,
          width: 90,
          backgroundColor: "#fffbeF",
          clipPath: tornClipPath(seed + 3, 30, 40),
          transform: "rotate(-4deg)",
          filter: "blur(2px)",
        }}
      />
    </AbsoluteFill>
  );
};
