/**
 * S5 · 1:00–1:08 (f0–240) · Kinetic triplet: "MÁU." / "NGÃ." / "ĐỨNG DẬY."
 * SIL-0: silence 0.5s f0–15 (near-silence, nền đỏ đen dần hiện).
 * Slam: MÁU. f15–57 (hold→f78) · NGÃ. f78–120 (hold→f141) · ĐỨNG DẬY. f141–183 (hold payoff→f240).
 * T3 (per-word slam + anticipation/follow-through) · T16 (silence trước payoff)
 * T9 (impact frame 1–2f trắng + shake) · T19 (slam = hero gain) · T20.
 * Camera: Locked + Slammed (rung là impact effect, không phải camera move).
 * Biên S4→S5: xé giấy từ giữa -> S5 mở qua vết xé. Biên S5→S6: chữ vỡ thành hạt giấy.
 */
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { COLORS, ImpactFlash, useShake } from "../components/Grade";
import { CharSlam } from "../components/KineticText";
import { sineInOut } from "../motion/eases";
import { Dust, PaperGrain, mulberry32 } from "./teamA-helpers";

const START = 1800;
const DUR = 240;

const WORDS = [
  { text: "MÁU.", at: 15, end: 57, holdTo: 78, size: 300, color: COLORS.ivory },
  { text: "NGÃ.", at: 78, end: 120, holdTo: 141, size: 300, color: COLORS.ivory },
  { text: "ĐỨNG DẬY.", at: 141, end: 183, holdTo: 240, size: 215, color: COLORS.goldLight },
];

/** paper particles for the dissolve handoff (S5→S6) */
const Dissolve: React.FC<{ frame: number }> = ({ frame }) => {
  const parts = React.useMemo(() => {
    const rnd = mulberry32(55);
    return Array.from({ length: 90 }, () => ({
      x: 960 + (rnd() - 0.5) * 900,
      y: 540 + (rnd() - 0.5) * 320,
      vx: (rnd() - 0.5) * 6,
      vy: -(2 + rnd() * 7),
      r: 2 + rnd() * 7,
      rot: rnd() * 360,
      vr: (rnd() - 0.5) * 14,
      shade: rnd(),
    }));
  }, []);
  const p = Math.max(0, Math.min(1, (frame - 200) / 40));
  if (p <= 0) return null;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {parts.map((pt, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: pt.x + pt.vx * p * 40,
            top: pt.y + pt.vy * p * 40,
            width: pt.r * 2,
            height: pt.r * 1.4,
            transform: `rotate(${pt.rot + pt.vr * p * 40}deg)`,
            background: pt.shade > 0.6 ? COLORS.gold : pt.shade > 0.3 ? "#e8dcc8" : "#8f1d1d",
            opacity: 1 - p,
          }}
        />
      ))}
    </div>
  );
};

const S5: React.FC<{ frame: number }> = ({ frame }: { frame: number }) => {
  const f = Math.max(0, Math.min(DUR, frame));

  // red paper bg fades in during silence f0–15 (through the tear)
  const bgIn = interpolate(f, [0, 15], [0, 1], { easing: sineInOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // tear crack down the center at open (matches S4 tear)
  const crackP = interpolate(f, [0, 15], [1, 0], { easing: sineInOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // grain breathes harder between words
  const breath = 0.5 + 0.5 * Math.sin((f / 30 / 3) * Math.PI * 2);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      {/* red paper bg */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: bgIn,
          background:
            "radial-gradient(ellipse at 50% 42%, #7a1616 0%, #4a0e0e 45%, #1c0606 100%)",
        }}
      />
      {/* torn paper edge top */}
      <svg viewBox="0 0 1920 120" preserveAspectRatio="none" style={{ position: "absolute", top: 0, width: "100%", height: 120, opacity: bgIn }}>
        <path d="M0,0 L1920,0 L1920,60 L1820,78 L1700,52 L1560,84 L1420,58 L1280,80 L1140,55 L1000,82 L860,58 L720,80 L580,55 L440,78 L300,58 L160,80 L0,60 Z" fill="#0d0d0f" />
      </svg>
      {/* crack at open */}
      {crackP > 0 && (
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <path
            d="M960,80 L985,300 L940,470 L990,640 L945,810 L975,1000"
            fill="none"
            stroke="#f4ead8"
            strokeWidth={10 * crackP}
            opacity={0.8 * crackP}
          />
        </svg>
      )}

      {/* the three words — camera Locked; shake is impact effect; each word exits when next slams */}
      {WORDS.map((w, wi) => {
        const nextAt = wi + 1 < WORDS.length ? WORDS[wi + 1].at : DUR + 1;
        if (f < w.at || f >= nextAt) return null;
        const shake = useShake(w.at + START, 16, 14);
        const trembleT = f > w.end && f < w.holdTo ? (f - w.end) / (w.holdTo - w.end) : -1;
        const tremble = trembleT >= 0 ? 5 * Math.exp(-4 * trembleT) * Math.sin(trembleT * 46) : 0;
        const dissolveFade = f > 200 ? interpolate(f, [200, 215], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 1;
        if (f < w.at) return null;
        return (
          <div
            key={w.text}
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `translate(${shake.x + tremble}px, ${shake.y}px)`,
              opacity: dissolveFade,
            }}
          >
            <CharSlam
              text={w.text}
              atFrame={w.at + START}
              staggerMs={50}
              scaleFrom={6}
              fontSize={w.size}
              color={w.color}
            />
          </div>
        );
      })}

      {/* impact frames + grain breath */}
      <ImpactFlash atFrame={15 + START} dur={2} />
      <ImpactFlash atFrame={78 + START} dur={2} />
      <ImpactFlash atFrame={141 + START} dur={2} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at center, rgba(212,160,23,${0.04 + breath * 0.05}) 0%, rgba(0,0,0,0) 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* S5→S6: chữ vỡ thành hạt giấy */}
      <Dissolve frame={f} />

      <PaperGrain opacity={0.14} />
      <Dust frame={f} count={22} seed={5} color="244,234,216" />
    </AbsoluteFill>
  );
};

export default S5;
