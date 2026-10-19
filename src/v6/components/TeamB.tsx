/**
 * TEAM B shared helpers — CR7 v6 (S11–S19).
 * Paper-cut grammar (stop-motion 10fps, no CGI motion blur), HUD viewfinder,
 * whip streaks, seeded paper particles, hand-drawn lightning / speed lines.
 */
import React, { useMemo } from "react";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame, Sequence, Video } from "remotion";
import { beatToFrame } from "../motion/beat";
import { power4Out, expoOut, sineInOut, springSnappy } from "../motion/eases";
import { COLORS } from "./Grade";

/** Seeded PRNG (T-bible: deterministic, no Math.random in render) */
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

/** Stop-motion 10fps: quantize frame (paper-cut rule) */
export const sm = (frame: number) => Math.floor(frame / 3) * 3;

/** T1 helper: local-frame -> float beat, via baked beat grid */
export function makeBeatClock(startBeat: number, endBeat: number, sceneStart: number) {
  const n = endBeat - startBeat;
  const frames: number[] = [];
  for (let b = 0; b <= n; b++) frames.push(beatToFrame(startBeat + b) - sceneStart);
  return (local: number) => {
    if (local <= frames[0]) return startBeat;
    if (local >= frames[n]) return endBeat;
    let i = 0;
    while (i < n - 1 && frames[i + 1] < local) i++;
    const t = (local - frames[i]) / Math.max(1, frames[i + 1] - frames[i]);
    return startBeat + i + t;
  };
}

/** Local -> global frame helper for scene components */
export const g = (sceneStart: number, local: number) => sceneStart + local;

/** HUD viewfinder — ONLY S6/S12/S14/S18. Safe-area: >=5% from edges, fades off subject. */
export const HUD: React.FC<{ id: string; hideAt?: [number, number][] }> = ({ id, hideAt }) => {
  const frame = useCurrentFrame();
  const hidden =
    hideAt?.some(([a, b]) => frame >= a && frame < b) ?? false;
  const p = hidden ? 0 : 1;
  const mm = String(Math.floor(frame / 1800)).padStart(2, "0");
  const ss = String(Math.floor((frame % 1800) / 30)).padStart(2, "0");
  const ff = String(frame % 30).padStart(2, "0");
  const corner = (pos: React.CSSProperties): React.CSSProperties => ({
    position: "absolute",
    width: 54,
    height: 54,
    borderColor: "rgba(244,234,216,0.85)",
    ...pos,
  });
  return (
    <AbsoluteFill
      style={{ opacity: interpolate(p, [0, 1], [0, 1]), transition: "none", pointerEvents: "none" }}
    >
      <div style={corner({ left: "5%", top: "9%", borderLeft: "3px solid", borderTop: "3px solid" })} />
      <div style={corner({ right: "5%", top: "9%", borderRight: "3px solid", borderTop: "3px solid" })} />
      <div style={corner({ left: "5%", bottom: "9%", borderLeft: "3px solid", borderBottom: "3px solid" })} />
      <div style={corner({ right: "5%", bottom: "9%", borderRight: "3px solid", borderBottom: "3px solid" })} />
      <div
        style={{
          position: "absolute",
          left: "calc(5% + 70px)",
          top: "9%",
          fontFamily: "Inter, sans-serif",
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: "0.25em",
          color: "rgba(244,234,216,0.9)",
        }}
      >
        {id}
      </div>
      <div
        style={{
          position: "absolute",
          right: "calc(5% + 70px)",
          top: "9%",
          fontFamily: "Inter, sans-serif",
          fontSize: 26,
          fontWeight: 700,
          letterSpacing: "0.2em",
          color: "rgba(244,234,216,0.9)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {mm}:{ss}:{ff}
      </div>
      <div
        style={{
          position: "absolute",
          right: "5%",
          bottom: "9%",
          width: 18,
          height: 18,
          borderRadius: "50%",
          backgroundColor: "#d33",
          opacity: frame % 30 < 15 ? 1 : 0.25,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "5%",
          bottom: "9%",
          fontFamily: "Inter, sans-serif",
          fontSize: 22,
          letterSpacing: "0.3em",
          color: "rgba(244,234,216,0.6)",
        }}
      >
        1080p · 30
      </div>
    </AbsoluteFill>
  );
};

type StreakProps = {
  /** global frame the streak fires (cut point) */
  atFrame: number;
  dur?: number;
  color?: string;
  height?: number;
};

/** T5 whip-streak: light streak fires at the cut, new shot begins at peak */
export const WhipStreak: React.FC<StreakProps> = ({
  atFrame,
  dur = 12,
  color = COLORS.goldLight,
  height = 120,
}) => {
  const frame = useCurrentFrame();
  const local = frame - atFrame;
  if (local < -4 || local > dur) return null;
  const t = Math.max(0, Math.min(1, (local + 4) / (dur + 4)));
  const e = power4Out(t);
  const x = interpolate(e, [0, 1], [-2200, 2200]);
  const peak = Math.sin(Math.min(1, t * 1.15) * Math.PI);
  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          width: 2200,
          height,
          marginTop: -height / 2,
          transform: `translateX(${x}px) skewX(-18deg)`,
          background: `linear-gradient(90deg, transparent 0%, ${color}00 20%, ${color} 50%, ${color}00 80%, transparent 100%)`,
          filter: "blur(8px)",
          opacity: 0.95 * peak,
        }}
      />
      <AbsoluteFill style={{ backgroundColor: "#fff", opacity: 0.55 * Math.pow(peak, 2) }} />
    </AbsoluteFill>
  );
};

type ParticleSpec = {
  angle: number;
  dist: number;
  size: number;
  rot: number;
  spin: number;
  delay: number;
  hue: number;
};

type ParticlesProps = {
  count: number;
  seed: number;
  /** global frame the burst/gather is anchored at */
  atFrame: number;
  dur?: number;
  mode?: "burst" | "gather";
  maxDist?: number;
  color?: string;
  centerX?: number;
  centerY?: number;
};

/** Seeded paper particles: burst outward OR gather inward (S19 handoff) */
export const PaperParticles: React.FC<ParticlesProps> = ({
  count,
  seed,
  atFrame,
  dur = 60,
  mode = "burst",
  maxDist = 700,
  color = COLORS.gold,
  centerX = 960,
  centerY = 540,
}) => {
  const frame = useCurrentFrame();
  const parts = useMemo<ParticleSpec[]>(() => {
    const r = mulberry32(seed);
    return Array.from({ length: count }, () => ({
      angle: r() * Math.PI * 2,
      dist: maxDist * (0.35 + r() * 0.65),
      size: 4 + r() * 14,
      rot: r() * 360,
      spin: (r() - 0.5) * 720,
      delay: r() * 10,
      hue: r(),
    }));
  }, [count, seed, maxDist]);
  const t = (frame - atFrame) / dur;
  if (t < 0 || t > 1.3) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {parts.map((p, i) => {
        const lt = Math.max(0, Math.min(1, (t * dur - p.delay) / (dur - p.delay)));
        const e = mode === "burst" ? expoOut(lt) : 1 - power4Out(lt);
        const d = p.dist * e;
        const x = centerX + Math.cos(p.angle) * d;
        const y = centerY + Math.sin(p.angle) * d * 0.7;
        const op = mode === "burst" ? 1 - lt : Math.min(1, lt * 3);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: p.size,
              height: p.size * (0.5 + p.hue * 0.5),
              backgroundColor: p.hue > 0.75 ? COLORS.goldLight : color,
              transform: `translate(-50%,-50%) rotate(${p.rot + p.spin * lt}deg)`,
              opacity: Math.max(0, Math.min(1, op)),
              boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Hand-drawn lightning bolt (SVG, seeded jitter) — S17 grammar */
export const Lightning: React.FC<{ seed?: number; flash?: boolean; color?: string }> = ({
  seed = 7,
  flash = true,
  color = "#fff7d6",
}) => {
  const d = useMemo(() => {
    const r = mulberry32(seed);
    let x = 960;
    let y = 40;
    let path = `M ${x} ${y}`;
    while (y < 1040) {
      x += (r() - 0.5) * 260;
      y += 90 + r() * 130;
      path += ` L ${x.toFixed(0)} ${y.toFixed(0)}`;
      const bx = x + (r() - 0.5) * 160;
      const by = y + 40 + r() * 90;
      path += ` M ${x.toFixed(0)} ${y.toFixed(0)} l ${(bx - x).toFixed(0)} ${(by - y).toFixed(0)}`;
      path += ` M ${x.toFixed(0)} ${y.toFixed(0)}`;
    }
    return path;
  }, [seed]);
  return (
    <svg
      width="1920"
      height="1080"
      viewBox="0 0 1920 1080"
      style={{
        position: "absolute",
        inset: 0,
        opacity: flash ? 0.95 : 0.4,
        filter: "drop-shadow(0 0 18px rgba(255,240,180,0.9))",
        pointerEvents: "none",
      }}
    >
      <path d={d} stroke={color} strokeWidth={10} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      <path d={d} stroke="#d4a017" strokeWidth={22} fill="none" strokeLinejoin="round" strokeLinecap="round" opacity={0.35} />
    </svg>
  );
};

/** Hand-drawn speed lines (paper-cut grammar: no CGI motion blur) */
export const SpeedLines: React.FC<{
  seed?: number;
  n?: number;
  fromX?: number;
  fromY?: number;
  len?: number;
  color?: string;
  progress?: number;
}> = ({ seed = 3, n = 14, fromX = 300, fromY = 700, len = 420, color = COLORS.ivory, progress = 1 }) => {
  const lines = useMemo(() => {
    const r = mulberry32(seed);
    return Array.from({ length: n }, (_, i) => {
      const y = fromY + (r() - 0.5) * 320;
      const x = fromX + (r() - 0.5) * 120;
      const l = len * (0.5 + r() * 0.7);
      return { x, y, l, w: 3 + r() * 4, o: 0.35 + r() * 0.45, off: (i / n) * 8 };
    });
  }, [seed, n, fromX, fromY, len]);
  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {lines.map((ln, i) => {
        const t = Math.max(0, Math.min(1, progress * 1.2 - ln.off / 10));
        return (
          <line
            key={i}
            x1={ln.x}
            y1={ln.y}
            x2={ln.x + ln.l * t}
            y2={ln.y}
            stroke={color}
            strokeWidth={ln.w}
            strokeLinecap="round"
            opacity={ln.o * t}
          />
        );
      })}
    </svg>
  );
};

/** Torn paper shard for tear transitions */
export const Shard: React.FC<{ seed: number; i: number; atFrame: number; dur?: number }> = ({
  seed,
  i,
  atFrame,
  dur = 30,
}) => {
  const frame = useCurrentFrame();
  const r = mulberry32(seed + i * 131);
  const local = frame - atFrame;
  if (local < 0 || local > dur) return null;
  const t = local / dur;
  const e = expoOut(Math.min(1, t));
  const ang = (i / 8) * Math.PI * 2 + r() * 0.5;
  const d = 300 + e * 700;
  return (
    <div
      style={{
        position: "absolute",
        left: 960 + Math.cos(ang) * d,
        top: 540 + Math.sin(ang) * d * 0.75,
        width: 60 + r() * 90,
        height: 50 + r() * 70,
        backgroundColor: i % 2 ? COLORS.paper : COLORS.gold,
        clipPath: "polygon(0 15%, 35% 0, 100% 25%, 80% 100%, 20% 85%)",
        transform: `translate(-50%,-50%) rotate(${r() * 360 + t * 220}deg)`,
        opacity: 1 - t,
        boxShadow: "0 4px 10px rgba(0,0,0,0.6)",
      }}
    />
  );
};

/** Drifting embers (ambient layer for night paper scenes) */
export const Embers: React.FC<{ seed?: number; count?: number; color?: string }> = ({
  seed = 11,
  count = 26,
  color = "rgba(245,214,123,0.5)",
}) => {
  const frame = useCurrentFrame();
  const parts = useMemo(() => {
    const r = mulberry32(seed);
    return Array.from({ length: count }, () => ({
      x: r() * 1920,
      y: r() * 1080,
      s: 2 + r() * 5,
      sp: 0.3 + r() * 0.9,
      ph: r() * Math.PI * 2,
      amp: 20 + r() * 60,
    }));
  }, [seed, count]);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      {parts.map((p, i) => {
        const y = (p.y - frame * p.sp * 1.6 + 1200) % 1200;
        const x = p.x + Math.sin(frame / 30 + p.ph) * p.amp;
        const tw = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(frame / 18 + p.ph));
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: p.s,
              height: p.s,
              borderRadius: "50%",
              backgroundColor: color,
              opacity: tw * 0.7,
              filter: "blur(1px)",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Score slam text (S11): huge tabular score with spring entrance */
export const ScoreSlam: React.FC<{
  text: string;
  atFrame: number;
  fontSize?: number;
  color?: string;
}> = ({ text, atFrame, fontSize = 300, color = COLORS.ivory }) => {
  const frame = useCurrentFrame();
  const local = frame - atFrame;
  if (local < 0) return null;
  const p = Math.max(0, Math.min(1, local / 16));
  const e = springSnappy(p);
  const scale = interpolate(e, [0, 1], [8, 1]);
  const dip = p < 0.15 ? 1 - 0.05 * Math.sin((p / 0.15) * Math.PI) : 1;
  return (
    <div
      style={{
        fontFamily: "Anton, sans-serif",
        fontVariantNumeric: "tabular-nums",
        fontSize,
        color,
        transform: `scale(${scale * dip})`,
        textShadow: "0 0 60px rgba(212,160,23,0.55), 0 10px 30px rgba(0,0,0,0.8)",
        letterSpacing: "0.02em",
      }}
    >
      {text}
    </div>
  );
};

export { staticFile, COLORS, sineInOut };
export const P10 = "v6/assets/p10-hero-ball.png";
// Ball crop (round paper-cut, fix R1-O1: S11 dùng bản crop tròn thay vì plate)
export const P10_CROP = "v6/assets/p10-hero-ball-crop.png";
export const P9 = "v6/assets/p9-paper-circle-tear.png";

/**
 * Local-scope Video: CR7V6 renders scenes WITHOUT <Sequence>, so a bare <Video>
 * would seek with the GLOBAL composition frame (clamping short clips to their
 * last frame). This wrapper opens a <Sequence> at the video's own start (`at`,
 * global frame) so the video seeks with SLOT-RELATIVE frames:
 *   videoTime = slotLocal/30 * playbackRate + startFrom/30
 * Text/kinetic components OUTSIDE this wrapper keep global frames.
 */
export const LVideo: React.FC<{
  /** global frame where this video's time 0 is */
  at: number;
  dur: number;
  src: string;
  startFrom?: number;
  /** seconds of source video this slot should consume (default 4) */
  srcDur?: number;
  slotFrames: number;
  /** override auto playbackRate (e.g. slow-mo) */
  playbackRate?: number;
  muted?: boolean;
  style?: React.CSSProperties;
}> = ({ at, dur, src, startFrom = 0, srcDur = 4, slotFrames, playbackRate, muted = true, style }) => {
  const rate = playbackRate ?? (srcDur - startFrom / 30) / (slotFrames / 30);
  return (
    <Sequence from={at} durationInFrames={dur}>
      <Video
        src={staticFile(src)}
        startFrom={startFrom}
        playbackRate={rate}
        muted={muted}
        style={style ?? { width: "100%", height: "100%", objectFit: "cover" }}
      />
    </Sequence>
  );
};
