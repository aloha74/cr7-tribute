/**
 * S21 · 5:52–6:00 (f10560–10800, 240f) — Đáp án vòng lại: "900+. BẰNG CÁCH NÀY."
 * Spec: TREATMENT_V6.md §1 S21. T3·T6·T15·T20.
 * Vòng tròn giấy SIUUU (P9) thu nhỏ thành dấu chấm của câu (T6/T15 khép motif).
 */
import React from "react";
import { AbsoluteFill, interpolate, Img, staticFile } from "remotion";
import { COLORS, GoldHalo } from "../components/Grade";
import { CharSlam } from "../components/KineticText";
import { GoldDust } from "../components/TeamC";
import { expoOut, springSnappy } from "../motion/eases";

const START = 10560;
const ANSWER_AT = 60; // "BẰNG CÁCH NÀY." slam
const DOT_AT = 140; // vòng tròn thu thành dấu chấm

const WORDS = ["BẰNG", "CÁCH", "NÀY"];

const S21: React.FC<{ frame: number }> = ({ frame }) => {
  const f = frame;

  // "900+." : từ góc trái (cuối S20) settle về giữa (f0–30), hold 2s
  const settleP = interpolate(f, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: expoOut,
  });
  const headScale = interpolate(settleP, [0, 1], [0.32, 1]);
  const headX = interpolate(settleP, [0, 1], [-660, 0]);
  const headY = interpolate(settleP, [0, 1], [-330, 0]);

  // answer words slam (per-word stagger 80ms)
  // dot: P9 circle 150px → 46px (+ gold glow so it reads as the period)
  const dotP = interpolate(f, [DOT_AT, DOT_AT + 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: expoOut,
  });
  const dotSize = interpolate(dotP, [0, 1], [150, 46]);

  // camera: dolly → Locked
  const camScale = interpolate(f, [0, 150], [1.06, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: expoOut,
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 42%, #241a0d 0%, #120e08 55%, #0d0d0f 100%)",
        overflow: "hidden",
      }}
    >
      <GoldDust frame={f} seed={21} count={40} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${camScale})`,
          transformOrigin: "960px 540px",
        }}
      >
        <GoldHalo size={900} opacity={0.32} />

        {/* 900+. */}
        <div
          style={{
            position: "absolute",
            top: 300,
            left: 0,
            right: 0,
            textAlign: "center",
            transform: `translate(${headX}px, ${headY}px) scale(${headScale})`,
            fontFamily: "Anton, sans-serif",
            fontSize: 210,
            color: COLORS.goldLight,
            textShadow: "0 0 110px rgba(212,160,23,0.5)",
            letterSpacing: "0.04em",
          }}
        >
          900+.
        </div>

        {/* BẰNG CÁCH NÀY + dot */}
        {f >= ANSWER_AT && (
          <div
            style={{
              position: "absolute",
              top: 580,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 34,
            }}
          >
            {WORDS.map((w, i) => {
              const at = ANSWER_AT + 8 + i * 2.4; // ~80ms stagger
              const p = springSnappy(Math.max(0, Math.min(1, (f - at) / 14)));
              return (
                <span
                  key={w}
                  style={{
                    fontFamily: "Anton, sans-serif",
                    fontSize: 168,
                    color: COLORS.ivory,
                    letterSpacing: "0.05em",
                    transform: `scale(${interpolate(p, [0, 1], [5, 1])})`,
                    opacity: p > 0 ? 1 : 0,
                    textShadow: "0 6px 40px rgba(0,0,0,0.6)",
                  }}
                >
                  {w}
                </span>
              );
            })}
            {/* dấu chấm = vòng tròn giấy P9 thu nhỏ (T6/T15) */}
            <span
              style={{
                width: 170,
                height: 170,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: f >= DOT_AT ? 1 : 0,
              }}
            >
              <Img
                src={staticFile("v6/assets/p9-paper-circle-tear.png")}
                style={{
                  width: dotSize,
                  height: dotSize,
                  transform: `rotate(${dotP * 120}deg)`,
                  filter: "drop-shadow(0 0 26px rgba(212,160,23,0.65)) brightness(1.35)",
                }}
              />
            </span>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

export default S21;
