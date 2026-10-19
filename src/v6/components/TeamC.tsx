/**
 * Team C shared helpers — Act IV (S24–S28), Finale (S20–S21), Epilogue (S22–S23).
 * Deterministic: seeded PRNG only (no Math.random), stop-motion 10fps (T13).
 */
import React from "react";
import { AbsoluteFill, Img, interpolate, staticFile } from "remotion";
import { COLORS } from "./Grade";
import { sineInOut, power3Out, springSnappy, expoOut } from "../motion/eases";

/** T13 — stop-motion cadence: posterize to 10fps */
export const sm = (frame: number) => Math.floor(frame / 3) * 3;

/** Deterministic PRNG */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Paper-cut asset image with real drop shadow (T13) */
export const PaperImg: React.FC<{
  src: string;
  style?: React.CSSProperties;
  shadow?: boolean;
}> = ({ src, style, shadow = true }) => (
  <Img
    src={staticFile(src)}
    style={{
      position: "absolute",
      filter: shadow
        ? "drop-shadow(0 18px 30px rgba(0,0,0,0.55)) drop-shadow(0 4px 8px rgba(0,0,0,0.4))"
        : undefined,
      ...style,
    }}
  />
);

/** T5 — gold/white light streak band for whip transitions */
export const WhipStreak: React.FC<{
  progress: number; // 0..1 across the whip
  dir?: 1 | -1;
  color?: string;
  height?: number;
}> = ({ progress, dir = 1, color = "245,214,123", height = 90 }) => {
  const p = Math.max(0, Math.min(1, progress));
  const x = interpolate(p, [0, 1], [-2600 * dir, 2600 * dir]);
  const op = Math.sin(p * Math.PI);
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "42%",
        width: 2400,
        height,
        transform: `translate(calc(-50% + ${x}px), -50%) skewX(${dir * -18}deg)`,
        background: `linear-gradient(90deg, rgba(${color},0) 0%, rgba(${color},${0.85 * op}) 45%, rgba(255,255,255,${0.95 * op}) 50%, rgba(${color},${0.85 * op}) 55%, rgba(${color},0) 100%)`,
        filter: "blur(6px)",
        pointerEvents: "none",
      }}
    />
  );
};

/** Torn paper cover that peels up to reveal what is underneath (M1 ruler/lines) */
export const PeelCover: React.FC<{
  progress: number; // 0 = covered, 1 = peeled away
  width: number;
  height: number;
  left: number;
  top: number;
  peelDir?: "up" | "right";
}> = ({ progress, width, height, left, top, peelDir = "up" }) => {
  const p = Math.max(0, Math.min(1, progress));
  if (p >= 1) return null;
  const e = springSnappy(p);
  const lift =
    peelDir === "up"
      ? interpolate(e, [0, 1], [0, -height - 40])
      : interpolate(e, [0, 1], [0, width + 40]);
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        height,
        transform:
          peelDir === "up" ? `translateY(${lift}px)` : `translateX(${lift}px)`,
        background:
          "linear-gradient(160deg, #1a1a1d 0%, #101012 60%, #0b0b0d 100%)",
        border: `3px solid ${COLORS.gold}`,
        boxShadow: "0 22px 44px rgba(0,0,0,0.7)",
        opacity: 1,
      }}
    />
  );
};

type ParticleSpec = {
  x0: number;
  y0: number;
  size: number;
  rot: number;
  phase: number;
  ring: number; // angle on final ring
  shade: number; // 0 ivory .. 1 gold
};

/** Seeded paper particle field (T13/T5). mode: rise | gather */
export const PaperParticles: React.FC<{
  frame: number;
  seed: number;
  count: number;
  mode: "rise" | "gather";
  startFrame?: number;
  dur?: number;
  area?: { x: number; y: number; w: number; h: number };
  cx?: number;
  cy?: number;
  ringR?: number;
}> = ({
  frame,
  seed,
  count,
  mode,
  startFrame = 0,
  dur = 60,
  area = { x: 700, y: 300, w: 520, h: 600 },
  cx = 960,
  cy = 540,
  ringR = 190,
}) => {
  const parts = React.useMemo<ParticleSpec[]>(() => {
    const rnd = mulberry32(seed);
    return Array.from({ length: count }, () => ({
      x0: area.x + rnd() * area.w,
      y0: area.y + rnd() * area.h,
      size: 5 + rnd() * 16,
      rot: rnd() * 360,
      phase: rnd() * Math.PI * 2,
      ring: rnd() * Math.PI * 2,
      shade: rnd(),
    }));
  }, [seed, count]);
  const p = Math.max(0, Math.min(1, (frame - startFrame) / dur));
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {parts.map((pt, i) => {
        const wob = Math.sin(p * 6 + pt.phase) * 46 * p;
        let x: number;
        let y: number;
        if (mode === "rise") {
          x = pt.x0 + wob;
          y = pt.y0 - p * 340;
        } else {
          // gather: rise first half, converge to ring second half
          const gp = Math.max(0, Math.min(1, (p - 0.45) / 0.55));
          const ge = expoOut(gp);
          const rx = pt.x0 + wob;
          const ry = pt.y0 - Math.min(1, p * 2) * 200;
          x = rx + (cx + Math.cos(pt.ring) * ringR - rx) * ge;
          y = ry + (cy + Math.sin(pt.ring) * ringR - ry) * ge;
        }
        const op =
          p < 0.12 ? p / 0.12 : p > 0.85 ? Math.max(0, 1 - (p - 0.85) / 0.15) : 1;
        const bg =
          pt.shade > 0.6 ? COLORS.goldLight : pt.shade > 0.25 ? COLORS.ivory : "#c9bfae";
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: pt.size,
              height: pt.size * 0.72,
              background: bg,
              transform: `rotate(${pt.rot + p * 260}deg)`,
              opacity: op * 0.92,
              boxShadow: "0 3px 8px rgba(0,0,0,0.5)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Breathing gold dust (ambient layer, T20) */
export const GoldDust: React.FC<{ frame: number; seed?: number; count?: number }> = ({
  frame,
  seed = 7,
  count = 46,
}) => {
  const parts = React.useMemo(() => {
    const rnd = mulberry32(seed);
    return Array.from({ length: count }, () => ({
      x: rnd() * 1920,
      y: rnd() * 1080,
      s: 2 + rnd() * 5,
      ph: rnd() * Math.PI * 2,
      sp: 0.3 + rnd() * 0.7,
    }));
  }, [seed, count]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {parts.map((pt, i) => {
        const t = frame / 30;
        const y = pt.y - ((t * 22 * pt.sp) % 1180) + 60;
        const op = 0.25 + 0.45 * (0.5 + 0.5 * Math.sin(t * 1.4 + pt.ph));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: pt.x + Math.sin(t * 0.7 + pt.ph) * 30,
              top: ((y % 1180) + 1180) % 1180 - 60,
              width: pt.s,
              height: pt.s,
              borderRadius: "50%",
              background: COLORS.goldLight,
              opacity: op,
              filter: "blur(0.6px)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Hand-drawn annotation line (SVG stroke draw-on, T14) */
export const DrawLine: React.FC<{
  progress: number; // 0..1
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  width?: number;
}> = ({ progress, x1, y1, x2, y2, color = COLORS.gold, width = 7 }) => {
  const p = Math.max(0, Math.min(1, progress));
  const e = power3Out(p);
  const cx = x1 + (x2 - x1) * e;
  const cy = y1 + (y2 - y1) * e;
  return (
    <svg
      style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}
      width={1920}
      height={1080}
    >
      <line
        x1={x1}
        y1={y1}
        x2={cx}
        y2={cy}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
      />
    </svg>
  );
};

export { COLORS, sineInOut, power3Out, springSnappy, expoOut, interpolate };
