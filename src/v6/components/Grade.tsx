/**
 * T18 — Unified grade stack (5 layers):
 * bg mesh → assets → graphics → grade (soft-light 0.18 + black gradients) → grain + vignette.
 * "Light is brand": breathing gold halo on paper-cut.
 */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

export const COLORS = {
  red: "#8f1d1d",
  redDeep: "#4a0e0e",
  black: "#0d0d0f",
  gold: "#d4a017",
  goldLight: "#f5d67b",
  paper: "#e8dcc8",
  ivory: "#f4ead8",
} as const;

export const Grade: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  // breathing grain: sine 4-8s cycle
  const breath = 0.5 + 0.5 * Math.sin((frame / 30 / 6) * Math.PI * 2);
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black }}>
      {children}
      {/* grade: soft-light warm + black gradients top/bottom */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 18%, rgba(0,0,0,0) 82%, rgba(0,0,0,0.55) 100%)",
          mixBlendMode: "multiply",
          opacity: 0.55,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at center, rgba(212,160,23,${0.05 + breath * 0.04}) 0%, rgba(0,0,0,0) 70%)`,
          mixBlendMode: "soft-light",
        }}
      />
      {/* vignette breathing */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 100%)",
          opacity: 0.7 + breath * 0.3,
        }}
      />
      {/* procedural grain (SVG turbulence, breathing) */}
      <AbsoluteFill
        style={{ opacity: 0.07 + breath * 0.05, mixBlendMode: "overlay" }}
      >
        <svg width="100%" height="100%">
          <filter id="v6grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" />
          </filter>
          <rect width="100%" height="100%" filter="url(#v6grain)" />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Breathing gold halo for paper-cut heroes ("light is brand") */
export const GoldHalo: React.FC<{ size?: number; opacity?: number }> = ({
  size = 600,
  opacity = 0.35,
}) => {
  const frame = useCurrentFrame();
  const breath = 0.5 + 0.5 * Math.sin((frame / 30 / 5) * Math.PI * 2);
  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        left: "50%",
        top: "50%",
        transform: "translate(-50%,-50%)",
        background: `radial-gradient(circle, rgba(245,214,123,${opacity * (0.7 + breath * 0.6)}) 0%, rgba(212,160,23,0) 65%)`,
        pointerEvents: "none",
      }}
    />
  );
};

/** Impact frame: 1-2 white frames at hit (T9) */
export const ImpactFlash: React.FC<{ atFrame: number; dur?: number }> = ({
  atFrame,
  dur = 2,
}) => {
  const frame = useCurrentFrame();
  const on = frame >= atFrame && frame < atFrame + dur;
  if (!on) return null;
  return <AbsoluteFill style={{ backgroundColor: "#fff", opacity: 0.9 }} />;
};

/** Camera shake with fast decay (T9) */
export const useShake = (atFrame: number, amp = 14, durFrames = 12) => {
  const frame = useCurrentFrame();
  const t = (frame - atFrame) / durFrames;
  if (t < 0 || t > 1) return { x: 0, y: 0 };
  const d = amp * Math.exp(-4 * t);
  return {
    x: d * Math.sin(t * 40),
    y: d * Math.cos(t * 33),
  };
};

/** Beat punch: camera +0.012/beat, +0.03/bar (T7) */
export const useBeatPunch = (
  beat: number,
  beatsPerBar = 4,
  base = 0.012,
  barBoost = 0.03
) => {
  const frac = beat - Math.floor(beat);
  const isBar = Math.floor(beat) % beatsPerBar === 0 && frac < 0.25;
  const punch = (base + (isBar ? barBoost : 0)) * Math.exp(-3 * frac);
  return 1 + punch;
};
