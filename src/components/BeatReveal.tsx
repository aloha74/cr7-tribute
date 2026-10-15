import React from "react";
import { useCurrentFrame, spring, interpolate } from "remotion";
import { FPS, hitFrame } from "../timeline";

interface BeatRevealProps {
  /** absolute hit time in seconds (from HITS) */
  at: number;
  /** scene start frame — converts `at` to a local frame */
  sceneStart: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  /** extra punch scale right on the hit */
  punch?: boolean;
  /** rise distance in px */
  rise?: number;
}

/**
 * Text/object entrance snapped to a musical hit: masked rise + spring settle,
 * with a tiny scale "punch" exactly on the beat — the motion-design staple
 * that makes edits feel glued to the music.
 */
export const BeatReveal: React.FC<BeatRevealProps> = ({
  at,
  sceneStart,
  children,
  style,
  punch = true,
  rise = 90,
}) => {
  const frame = useCurrentFrame();
  const start = hitFrame(at, sceneStart);
  const local = frame - start;

  const progress = spring({
    frame: local,
    fps: FPS,
    config: { damping: 16, mass: 0.9, stiffness: 160 },
  });

  const y = interpolate(progress, [0, 1], [rise, 0], { extrapolateRight: "clamp" });
  const opacity = interpolate(local, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // punch: quick 6% scale pop decaying over ~10 frames after the hit
  const punchScale = punch
    ? 1 + 0.07 * Math.exp(-Math.max(0, local) / 4) * (local >= 0 ? 1 : 0)
    : 1;

  if (local < -2) return null;

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${y}px) scale(${punchScale})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
