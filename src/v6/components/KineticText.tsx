/**
 * T3 — Kinetic typography: per-char/per-word entrance with spring,
 * stagger, anticipation dip + follow-through. NEVER opacity-only.
 */
import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { springSnappy, expoOut } from "../motion/eases";
import { COLORS } from "./Grade";

type SlamProps = {
  text: string;
  atFrame: number; // global frame when slam starts
  fontSize?: number;
  color?: string;
  staggerMs?: number; // per-char stagger
  scaleFrom?: number;
  style?: React.CSSProperties;
};

/** Per-character slam: chars assemble with stagger + spring overshoot */
export const CharSlam: React.FC<SlamProps> = ({
  text,
  atFrame,
  fontSize = 120,
  color = COLORS.ivory,
  staggerMs = 40,
  scaleFrom = 8,
  style,
}) => {
  const frame = useCurrentFrame();
  const chars = text.split("");
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Anton, sans-serif",
        fontSize,
        color,
        ...style,
      }}
    >
      {chars.map((ch, i) => {
        const local = frame - atFrame - (i * staggerMs * 30) / 1000;
        const p = Math.max(0, Math.min(1, local / 14));
        const e = springSnappy(p);
        const scale = interpolate(e, [0, 1], [scaleFrom, 1]);
        const opacity = p > 0 ? 1 : 0;
        // anticipation dip in the first 15%
        const dip = p < 0.15 ? 1 - 0.05 * Math.sin((p / 0.15) * Math.PI) : 1;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              transform: `scale(${scale * dip})`,
              opacity,
              whiteSpace: "pre",
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
};

type StampProps = {
  text: string;
  atFrame: number;
  fontSize?: number;
  color?: string;
  rotate?: number; // degrees, e.g. -3 for ink stamp feel
  style?: React.CSSProperties;
};

/** Ink stamp: quick scale-in with slight rotation */
export const Stamp: React.FC<StampProps> = ({
  text,
  atFrame,
  fontSize = 72,
  color = COLORS.gold,
  rotate = -3,
  style,
}) => {
  const frame = useCurrentFrame();
  const local = frame - atFrame;
  const p = Math.max(0, Math.min(1, local / 10));
  const e = springSnappy(p);
  if (local < 0) return null;
  return (
    <div
      style={{
        fontFamily: "Anton, sans-serif",
        fontSize,
        color,
        transform: `rotate(${rotate}deg) scale(${interpolate(e, [0, 1], [1.6, 1])})`,
        opacity: p,
        border: `4px solid ${color}`,
        padding: "8px 28px",
        letterSpacing: "0.08em",
        ...style,
      }}
    >
      {text}
    </div>
  );
};

type CounterProps = {
  from?: number;
  to: number;
  atFrame: number;
  durFrames: number;
  fontSize?: number;
  color?: string;
  decimals?: number;
  style?: React.CSSProperties;
};

/** Animated counter with tabular-nums (T4) */
export const Counter: React.FC<CounterProps> = ({
  from = 0,
  to,
  atFrame,
  durFrames,
  fontSize = 160,
  color = COLORS.goldLight,
  decimals = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const p = Math.max(0, Math.min(1, (frame - atFrame) / durFrames));
  // critically damped spring feel: smooth ease-out
  const e = expoOut(p);
  const val = from + (to - from) * e;
  return (
    <div
      style={{
        fontFamily: "Anton, sans-serif",
        fontVariantNumeric: "tabular-nums",
        fontSize,
        color,
        ...style,
      }}
    >
      {val.toFixed(decimals)}
    </div>
  );
};
