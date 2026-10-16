import React from "react";
import { useCurrentFrame, spring, interpolate } from "remotion";
import { FPS } from "../../timeline";

interface SlamProps {
  /** absolute hit time in seconds */
  at: number;
  sceneStart: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Vox-style kinetic type: slams in on the beat — big scale punch with a tiny
 * rotation, then settles. Built for questions and verdicts, not body copy.
 */
export const Slam: React.FC<SlamProps> = ({ at, sceneStart, children, style }) => {
  const frame = useCurrentFrame();
  const start = Math.round(at * FPS) - sceneStart;
  const local = frame - start;

  const p = spring({
    frame: local,
    fps: FPS,
    config: { damping: 12, mass: 0.7, stiffness: 220 },
  });

  const scale = interpolate(p, [0, 1], [1.55, 1], { extrapolateRight: "clamp" });
  const rot = interpolate(p, [0, 1], [-4, 0], { extrapolateRight: "clamp" });
  const opacity = interpolate(local, [0, 3], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (local < -2) return null;
  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale}) rotate(${rot}deg)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

interface RiseProps {
  at: number;
  sceneStart: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
  distance?: number;
}

/** Slower, editorial rise for answers and secondary lines. */
export const Rise: React.FC<RiseProps> = ({
  at,
  sceneStart,
  children,
  style,
  distance = 60,
}) => {
  const frame = useCurrentFrame();
  const start = Math.round(at * FPS) - sceneStart;
  const local = frame - start;
  const p = spring({
    frame: local,
    fps: FPS,
    config: { damping: 18, mass: 1, stiffness: 120 },
  });
  const y = interpolate(p, [0, 1], [distance, 0], { extrapolateRight: "clamp" });
  const opacity = interpolate(local, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (local < -2) return null;
  return (
    <div style={{ opacity, transform: `translateY(${y}px)`, ...style }}>{children}</div>
  );
};

export const qHeadline = (size: number, color = "#ffffff"): React.CSSProperties => ({
  fontFamily: "'Anton', sans-serif",
  fontSize: size,
  lineHeight: 0.95,
  color,
  textTransform: "uppercase",
  margin: 0,
  textShadow: "0 10px 60px rgba(0,0,0,0.6)",
});

export const handNote = (size = 34, color = "#f5c518"): React.CSSProperties => ({
  fontFamily: "'Inter', sans-serif",
  fontStyle: "italic",
  fontWeight: 600,
  fontSize: size,
  color,
  margin: 0,
});
