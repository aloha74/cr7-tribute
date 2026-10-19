/**
 * S20 · 5:40–5:52 (f10200–10560, 360f) — MOTIF LẦN 3: bóng morph → "900+" + counter.
 * Spec: TREATMENT_V6.md §1 S20. T6·T15·T4·T18·T17·T20. L1: SIUUU tail 18f (audio).
 */
import React from "react";
import { AbsoluteFill, interpolate, Img, staticFile } from "remotion";
import { COLORS, GoldHalo, ImpactFlash } from "../components/Grade";
import { Counter } from "../components/KineticText";
import { GoldDust } from "../components/TeamC";
import { expoOut, springSnappy } from "../motion/eases";

const START = 10200;
const MORPH_AT = 60; // ball → 900+
const COUNT_AT = 130;
const COUNT_END = 280;
const SHRINK_AT = 300;

const S20: React.FC<{ frame: number }> = ({ frame }) => {
  const f = frame;

  // torn edges from S19 tear (fade f0–14)
  const edgeOp = interpolate(f, [0, 14], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ball flies in f0–60 (bounce-settle)
  const flyP = springSnappy(Math.max(0, Math.min(1, f / 46)));
  const ballX = interpolate(flyP, [0, 1], [2300, 960]);
  const ballY = interpolate(flyP, [0, 1], [700, 540]);
  const ballRot = interpolate(flyP, [0, 1], [40, 0]);

  // morph: ball squashes into the number (f60–130)
  const morphP = interpolate(f, [MORPH_AT, MORPH_AT + 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: expoOut,
  });
  const ballScale = 1 - morphP * 0.94;
  const ballOp = 1 - interpolate(f, [MORPH_AT + 40, MORPH_AT + 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // number visible from morph
  const numOp = interpolate(f, [MORPH_AT + 10, MORPH_AT + 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "+" pops when counter finishes
  const plusP = springSnappy(Math.max(0, Math.min(1, (f - COUNT_END) / 12)));

  // slow dolly around number
  const dolly = interpolate(f, [COUNT_AT, SHRINK_AT], [1, 1.09], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: expoOut,
  });

  // shrink to top-left corner (handoff S21, T6)
  const shrinkP = interpolate(f, [SHRINK_AT, 360], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: expoOut,
  });
  const finScale = dolly * (1 - shrinkP * 0.68);
  const finX = shrinkP * -660;
  const finY = shrinkP * -330;
  const finOp = 1 - shrinkP * 0.25;

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 42%, #2a1c0c 0%, #141009 50%, #0d0d0f 100%)",
        overflow: "hidden",
      }}
    >
      <GoldDust frame={f} seed={20} count={54} />

      {/* torn edges from S19 (T21 native move residue) */}
      {edgeOp > 0 && (
        <>
          {[
            { l: -30, t: -30, w: 420, h: 200, r: -14 },
            { l: 1530, t: -40, w: 420, h: 200, r: 12 },
            { l: -40, t: 920, w: 420, h: 200, r: 10 },
            { l: 1540, t: 930, w: 420, h: 200, r: -12 },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: s.l,
                top: s.t,
                width: s.w,
                height: s.h,
                background: "#e8dcc8",
                transform: `rotate(${s.r}deg)`,
                opacity: edgeOp * 0.9,
                clipPath:
                  "polygon(0 20%, 15% 0, 40% 25%, 60% 5%, 85% 30%, 100% 10%, 100% 100%, 0 100%)",
              }}
            />
          ))}
        </>
      )}

      {/* hero ball (P10 crop) */}
      {ballOp > 0 && (
        <div
          style={{
            position: "absolute",
            left: ballX - 220 * ballScale,
            top: ballY - 220 * ballScale,
            width: 440 * ballScale,
            height: 440 * ballScale,
            borderRadius: "50%",
            overflow: "hidden",
            opacity: ballOp,
            transform: `rotate(${ballRot}deg)`,
            boxShadow: "0 30px 70px rgba(0,0,0,0.65), 0 0 90px rgba(212,160,23,0.25)",
          }}
        >
          <Img
            src={staticFile("v6/assets/p10-hero-ball.png")}
            style={{
              position: "absolute",
              left: -600,
              top: -310,
              width: 1920,
              maxWidth: "none",
            }}
          />
        </div>
      )}

      {/* 900+ : counter khổng lồ = con số duy nhất (T4) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: numOp * finOp,
          transform: `translate(${finX}px, ${finY}px) scale(${finScale})`,
        }}
      >
        <GoldHalo size={1100} opacity={0.4} />
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            textShadow: "0 0 140px rgba(212,160,23,0.55)",
          }}
        >
          <Counter
            from={0}
            to={900}
            atFrame={START + COUNT_AT}
            durFrames={COUNT_END - COUNT_AT}
            fontSize={460}
            color={COLORS.goldLight}
          />
          <span
            style={{
              fontFamily: "Anton, sans-serif",
              fontSize: 460 * Math.max(0.001, plusP),
              color: COLORS.goldLight,
              lineHeight: 1,
              marginLeft: 12,
              transform: "translateY(30px)",
              visibility: plusP > 0 ? "visible" : "hidden",
            }}
          >
            +
          </span>
        </div>
      </div>
      <ImpactFlash atFrame={START + MORPH_AT + 30} dur={2} />
    </AbsoluteFill>
  );
};

export default S20;
