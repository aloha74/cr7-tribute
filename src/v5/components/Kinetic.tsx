import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { beatAt, beatPhase, FPS } from "../cue";

const CREAM = "#f3e9d2";
const GOLD = "#f5c518";
const RED = "#e63946";

/** Words slam in one per beat — nothing static. */
export const WordStagger: React.FC<{
  at: number; text: string; size?: number; color?: string;
  until?: number; style?: React.CSSProperties; perWordBeats?: number;
}> = ({ at, text, size = 92, color = CREAM, until, style, perWordBeats = 1 }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (t < at) return null;
  if (until !== undefined && t > until) return null;
  const words = text.split(" ");
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", ...style }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.28em", maxWidth: 1500 }}>
        {words.map((w, i) => {
          const wt = beatAt(at, i * perWordBeats);
          const lt = (t - wt) * FPS;
          if (lt < 0) return <span key={i} style={{ opacity: 0 }}>{w}</span>;
          const s = spring({ frame: lt, fps: FPS, config: { damping: 11, stiffness: 220, mass: 0.8 } });
          // subtle idle float so text never freezes
          const float = Math.sin((t - wt) * 6 + i) * 3;
          return (
            <span key={i} style={{
              display: "inline-block",
              fontFamily: "'Anton', sans-serif", fontSize: size, color, textTransform: "uppercase",
              lineHeight: 1, textShadow: "0 10px 60px rgba(0,0,0,0.8)",
              transform: `scale(${interpolate(s, [0, 1], [2.2, 1])}) translateY(${float}px)`,
              opacity: lt < 2 ? lt / 2 : 1,
            }}>{w}</span>
          );
        })}
      </div>
    </div>
  );
};

/** Letters explode in one per beat — for SIUUU. */
export const LetterPop: React.FC<{
  at: number; text: string; size?: number; color?: string; until?: number;
}> = ({ at, text, size = 300, color = GOLD, until }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (t < at) return null;
  if (until !== undefined && t > until) return null;
  const pulse = 1 + 0.06 * Math.sin(t * 10);
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", transform: `scale(${pulse})` }}>
        {text.split("").map((ch, i) => {
          const wt = beatAt(at, i);
          const lt = (t - wt) * FPS;
          if (lt < 0) return <span key={i} style={{ opacity: 0, width: "0.72em" }} />;
          const s = spring({ frame: lt, fps: FPS, config: { damping: 9, stiffness: 260, mass: 0.7 } });
          const jitter = (1 - beatPhase(t)) * 6;
          return (
            <span key={i} style={{
              display: "inline-block", width: "0.72em", textAlign: "center",
              fontFamily: "'Anton', sans-serif", fontSize: size, color,
              textShadow: `0 0 60px rgba(245,197,24,0.8), ${jitter}px 0 0 rgba(230,57,70,0.7), ${-jitter}px 0 0 rgba(0,200,255,0.7), 0 12px 60px rgba(0,0,0,0.9)`,
              transform: `scale(${interpolate(s, [0, 1], [3.2, 1])}) rotate(${interpolate(s, [0, 1], [(i % 2 ? -1 : 1) * 14, 0])}deg)`,
              opacity: lt < 2 ? lt / 2 : 1,
            }}>{ch}</span>
          );
        })}
      </div>
    </div>
  );
};

/** Kinetic counter 0 -> target, ticks on beats. */
export const Counter: React.FC<{
  at: number; dur: number; to: number; size?: number; color?: string; suffix?: string; until?: number;
}> = ({ at, dur, to, size = 420, color = GOLD, suffix = "", until }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (t < at) return null;
  if (until !== undefined && t > until) return null;
  const p = Easing.out(Easing.cubic)(Math.min(1, Math.max(0, (t - at) / dur)));
  const v = Math.round(to * p);
  const pulse = 1 + 0.05 * Math.exp(-4 * beatPhase(t));
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{
        fontFamily: "'Anton', sans-serif", fontSize: size, color, transform: `scale(${pulse})`,
        textShadow: "0 0 90px rgba(245,197,24,0.5), 0 12px 60px rgba(0,0,0,0.85)",
      }}>{v.toLocaleString("en-US")}{suffix}</div>
    </div>
  );
};

/** Single slamming headline (short-lived by design). */
export const Slam: React.FC<{
  at: number; until: number; children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties;
}> = ({ at, until, children, size = 130, color = CREAM, style }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (t < at || t > until) return null;
  const lt = (t - at) * FPS;
  const s = spring({ frame: lt, fps: FPS, config: { damping: 12, stiffness: 170, mass: 0.9 } });
  const outP = Math.max(0, Math.min(1, (until - t) / 0.25));
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: outP, ...style }}>
      <div style={{
        fontFamily: "'Anton', sans-serif", fontSize: size, color, textTransform: "uppercase",
        textAlign: "center", lineHeight: 0.95,
        textShadow: "0 10px 60px rgba(0,0,0,0.8)",
        transform: `scale(${interpolate(s, [0, 1], [2.4, 1])})`,
      }}>{children}</div>
    </div>
  );
};

/** Rising line with staggered children. */
export const Rise: React.FC<{
  at: number; until?: number; children: React.ReactNode; size?: number; color?: string; style?: React.CSSProperties;
}> = ({ at, until, children, size = 46, color = CREAM, style }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (t < at) return null;
  if (until !== undefined && t > until) return null;
  const p = Easing.out(Easing.cubic)(Math.min(1, (t - at) / 0.6));
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 110, display: "flex", justifyContent: "center", opacity: p, ...style }}>
      <div style={{
        fontFamily: "'Inter', sans-serif", fontWeight: 500, fontSize: size, color, textAlign: "center",
        maxWidth: 1400, lineHeight: 1.4, transform: `translateY(${(1 - p) * 50}px)`,
        textShadow: "0 4px 30px rgba(0,0,0,0.85)",
      }}>{children}</div>
    </div>
  );
};

/** 1-3 frame impact flash. */
export const Flash: React.FC<{ at: number; durF?: number; color?: string; peak?: number }> = ({ at, durF = 3, color = "#fff6d8", peak = 0.8 }) => {
  const frame = useCurrentFrame();
  const t = frame - at * FPS;
  if (t < 0 || t > durF) return null;
  return <div style={{ position: "absolute", inset: 0, backgroundColor: color, opacity: peak * (1 - t / durF), pointerEvents: "none" }} />;
};

export const COLORS = { CREAM, GOLD, RED };
