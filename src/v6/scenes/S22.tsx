/**
 * S22 · 6:00–6:10 (f10800–11100, 300f) — Premium reveal + D4.
 * Spec: TREATMENT_V6.md §1 S22. T16·T3·T20·T18.
 * D4 (6:04–6:08, local 120–240): breakdown → duck; "900+" tách parallax theo tiếng sân.
 */
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { COLORS, GoldHalo } from "../components/Grade";
import { GoldDust } from "../components/TeamC";
import { easePremium } from "../motion/eases";

const START = 10800;
const D4_0 = 120; // 6:04
const D4_1 = 240; // 6:08

const WORDS = ["MỘT", "HUYỀN", "THOẠI", "CÒN", "ĐANG", "VIẾT", "TIẾP."];
const KEY = new Set([1, 2, 5, 6]); // HUYỀN THOẠI · VIẾT TIẾP.

// "900+" ghost chars behind text
const GHOST = ["9", "0", "0", "+"];
const DRIFT: Array<[number, number]> = [
  [-170, -120],
  [150, -170],
  [-140, 150],
  [180, 130],
];

const S22: React.FC<{ frame: number }> = ({ frame }) => {
  const f = frame;

  // halo bloom from S21's dot (T6 handoff)
  const haloP = interpolate(f, [0, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easePremium,
  });

  // word-focus: stagger in, then non-key dim to 40%
  const focusP = interpolate(f, [110, 170], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easePremium,
  });

  // ghost 900+: assemble (f0–120) → split parallax (D4) → gather (f240–300)
  const asmP = interpolate(f, [0, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easePremium,
  });
  const splitP = interpolate(f, [D4_0, D4_0 + 40, D4_1 - 30, D4_1 + 10], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // slow drift camera (Premium)
  const driftX = Math.sin((f / 30 / 9) * Math.PI * 2) * 26;
  const driftY = Math.cos((f / 30 / 11) * Math.PI * 2) * 16;

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 45%, #1d1712 0%, #100d0a 55%, #0d0d0f 100%)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: -60,
          transform: `translate(${driftX}px, ${driftY}px)`,
        }}
      >
        <div style={{ opacity: haloP }}>
          <GoldHalo size={1250} opacity={0.5} />
        </div>

        {/* ghost 900+ */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0.15,
          }}
        >
          {GHOST.map((ch, i) => {
            const ap = easePremium(Math.max(0, Math.min(1, (f - i * 22) / 90)));
            const [dx, dy] = DRIFT[i];
            return (
              <span
                key={i}
                style={{
                  fontFamily: "Anton, sans-serif",
                  fontSize: 560,
                  color: COLORS.goldLight,
                  transform: `translate(${(1 - ap) * 120 * (i % 2 ? 1 : -1) + dx * splitP}px, ${(1 - ap) * 80 + dy * splitP}px) scale(${0.7 + 0.3 * ap})`,
                  opacity: ap,
                  margin: "0 6px",
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>

        {/* headline word-focus */}
        <div
          style={{
            position: "absolute",
            top: 400,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "0.28em",
            padding: "0 120px",
          }}
        >
          {WORDS.map((w, i) => {
            const p = easePremium(Math.max(0, Math.min(1, (f - 20 - i * 7) / 40)));
            const key = KEY.has(i);
            const dim = key ? 1 : 1 - focusP * 0.6;
            return (
              <span
                key={w}
                style={{
                  fontFamily: "Anton, sans-serif",
                  fontSize: 128,
                  letterSpacing: "0.05em",
                  color: key ? COLORS.goldLight : COLORS.ivory,
                  opacity: p * dim,
                  transform: `translateY(${(1 - p) * 60}px)`,
                  textShadow: key
                    ? "0 0 60px rgba(212,160,23,0.5)"
                    : "0 6px 34px rgba(0,0,0,0.6)",
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
      </div>
      <GoldDust frame={f} seed={22} count={30} />
    </AbsoluteFill>
  );
};

export default S22;
