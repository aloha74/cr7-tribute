import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig, Easing } from "remotion";

/** Kinetic type: words slam in like a headline. */
export const Slam: React.FC<{
  at: number; // seconds, global
  until?: number; // seconds, global — hide after
  children: React.ReactNode;
  size?: number; color?: string;
  style?: React.CSSProperties;
}> = ({ at, until, children, size = 120, color = "#f3e9d2", style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - at * fps;
  if (t < 0) return null;
  if (until !== undefined && frame > until * fps) return null;
  const s = spring({ frame: t, fps, config: { damping: 12, stiffness: 160, mass: 0.9 } });
  const scale = interpolate(s, [0, 1], [2.6, 1]);
  const rot = interpolate(s, [0, 1], [-4, 0]);
  const opacity = t < 2 ? t / 2 : 1;
  return (
    <div style={{
      position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
      opacity, transform: `scale(${scale}) rotate(${rot}deg)`, ...style,
    }}>
      <div style={{
        fontFamily: "'Anton', sans-serif", fontSize: size, color, textTransform: "uppercase",
        letterSpacing: "0.01em", textAlign: "center", lineHeight: 0.95,
        textShadow: "0 10px 60px rgba(0,0,0,0.75), 0 2px 0 rgba(0,0,0,0.4)",
      }}>{children}</div>
    </div>
  );
};

/** Lines rise in from below, staggered. */
export const Rise: React.FC<{
  at: number; until?: number; children: React.ReactNode; size?: number; color?: string;
  width?: number; align?: "left" | "center"; style?: React.CSSProperties; dur?: number;
}> = ({ at, until, children, size = 54, color = "#f3e9d2", width, align = "center", style, dur = 18 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - at * fps;
  if (t < 0) return null;
  if (until !== undefined && frame > until * fps) return null;
  const p = Math.min(1, t / dur);
  const e = Easing.out(Easing.cubic)(p);
  return (
    <div style={{
      position: "absolute", left: 0, right: 0, bottom: 120, display: "flex",
      justifyContent: align === "center" ? "center" : "flex-start",
      paddingLeft: align === "left" ? 110 : 0,
      opacity: p, transform: `translateY(${(1 - e) * 60}px)`, ...style,
    }}>
      <div style={{
        fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: size, color,
        maxWidth: width ?? 1300, textAlign: align, lineHeight: 1.35,
        textShadow: "0 4px 30px rgba(0,0,0,0.8)",
      }}>{children}</div>
    </div>
  );
};

/** Giant number slam with punch. */
export const NumberSlam: React.FC<{ at: number; value: string; size?: number; color?: string }> = ({
  at, value, size = 340, color = "#f5c518",
}) => (
  <Slam at={at} size={size} color={color}>
    <span style={{ WebkitTextStroke: "3px rgba(0,0,0,0.55)" }}>{value}</span>
  </Slam>
);

/** Counting number (e.g. 0 -> 140). */
export const Counter: React.FC<{ at: number; dur: number; from?: number; to: number; size?: number; color?: string }> = ({
  at, dur, from = 0, to, size = 380, color = "#f5c518",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - at * fps;
  if (t < 0) return null;
  const p = Easing.out(Easing.cubic)(Math.min(1, t / (dur * fps)));
  const v = Math.round(from + (to - from) * p);
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{
        fontFamily: "'Anton', sans-serif", fontSize: size, color,
        textShadow: "0 0 80px rgba(245,197,24,0.45), 0 10px 60px rgba(0,0,0,0.8)",
      }}>{v}</div>
    </div>
  );
};

/** Full-screen impact flash (1–3 frames). */
export const Flash: React.FC<{ at: number; durF?: number; color?: string; peak?: number }> = ({
  at, durF = 3, color = "#fff6d8", peak = 0.85,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - at * fps;
  if (t < 0 || t > durF) return null;
  const o = peak * (1 - t / durF);
  return <div style={{ position: "absolute", inset: 0, backgroundColor: color, opacity: o, pointerEvents: "none" }} />;
};

/** Letterbox-free vignette handled in PostFX; this adds a bottom text scrim. */
export const Scrim: React.FC<{ opacity?: number }> = ({ opacity = 0.55 }) => (
  <div style={{
    position: "absolute", left: 0, right: 0, bottom: 0, height: 420, pointerEvents: "none",
    background: `linear-gradient(to top, rgba(0,0,0,${opacity}), rgba(0,0,0,0))`,
  }} />
);
