/**
 * S23 · 6:10–6:20 (f11100–11400, 300f) — End credits (attribution CHỈ ở đây).
 * Spec: TREATMENT_V6.md §1 S23. T3·T16·T20·T18.
 * Picardy Bbm→Bb major (6:15–6:20, local 150–300): gold light rises → fade to black.
 */
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { COLORS } from "../components/Grade";
import { GoldDust } from "../components/TeamC";
import { springSnappy, easePremium } from "../motion/eases";

const START = 11100;

const LINES = [
  "TƯ LIỆU: WIKIMEDIA COMMONS (CC BY 3.0)",
  "NHẠC: SOẠN BẰNG CODE · PHỐI KHÍ GIAO HƯỞNG",
  "DỰNG: REMOTION",
  "VIDEO TRI ÂN — TƯ LIỆU ĐÃ GHI NGUỒN ĐẦY ĐỦ",
];

const S23: React.FC<{ frame: number }> = ({ frame }) => {
  const f = frame;

  // slow scroll
  const scrollY = interpolate(f, [0, 300], [40, -140], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easePremium,
  });

  // Picardy: gold light rises f150–270, fade to black f270–300
  const picardy = interpolate(f, [150, 270], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easePremium,
  });
  const fadeBlack = interpolate(f, [272, 300], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ background: "#0a0a0c", overflow: "hidden" }}>
      <GoldDust frame={f} seed={23} count={36} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 54,
          transform: `translateY(${scrollY}px)`,
        }}
      >
        {LINES.map((line, i) => {
          const at = 14 + i * 24; // 80ms stagger
          const p = springSnappy(Math.max(0, Math.min(1, (f - at) / 26)));
          return (
            <div
              key={line}
              style={{
                fontFamily: "Inter, sans-serif",
                fontWeight: i === 3 ? 800 : 600,
                fontSize: i === 3 ? 44 : 52,
                letterSpacing: "0.1em",
                color: i === 3 ? COLORS.goldLight : COLORS.ivory,
                opacity: p,
                transform: `translateY(${(1 - p) * 44}px)`,
                textAlign: "center",
                padding: "0 100px",
              }}
            >
              {line}
            </div>
          );
        })}
      </div>

      {/* Picardy resolve: gold light rises */}
      {picardy > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(to top, rgba(212,160,23,${0.34 * picardy}) 0%, rgba(245,214,123,${0.12 * picardy}) 45%, transparent 75%)`,
          }}
        />
      )}
      {/* fade to black */}
      {fadeBlack > 0 && (
        <div style={{ position: "absolute", inset: 0, background: "#000", opacity: fadeBlack }} />
      )}
    </AbsoluteFill>
  );
};

export default S23;
