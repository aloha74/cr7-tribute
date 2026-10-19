/**
 * S27 · 5:04–5:17 (f9120–9510, 390f) — Signature moves 1–2: ĐO LƯỜNG + STROBE.
 * Spec: TREATMENT_V6.md §1 S27 + style frame SF-S27-M1 (bắt buộc theo đúng).
 * T14·T3·T13·T20·T1. Số liệu: STATS_VERIFIED.md §6 (2.56m = ĐẦU chạm bóng; 71cm chân rời đất).
 */
import React from "react";
import { AbsoluteFill, interpolate, Img, staticFile } from "remotion";
import { COLORS, ImpactFlash } from "../components/Grade";
import { Stamp, Counter } from "../components/KineticText";
import { GoldDust, WhipStreak, PeelCover } from "../components/TeamC";
import { expoOut, power3Out, springSnappy } from "../motion/eases";

const START = 9120;
const M2_AT = 180; // 5:10
const BREATH_AT = 360; // 5:16

// P12: 6 poses — crop-left từng pose (asset px), crop width 360
const POSE_LEFT = [0, 305, 635, 930, 1245, 1570];
const POSE_CW = 360;
const POSE_S = 380 / POSE_CW;
const TILE_DW = 380;

const StrobePose: React.FC<{ f: number }> = ({ f }) => {
  const pose = Math.floor((f - M2_AT) / 4) % 6;
  return (
    <div
      style={{
        position: "absolute",
        left: 960 - TILE_DW / 2,
        top: 0,
        width: TILE_DW,
        height: 1080,
        overflow: "hidden",
      }}
    >
      <Img
        src={staticFile("v6/assets/p12-stepover-poses.png")}
        style={{
          position: "absolute",
          left: -POSE_LEFT[pose] * POSE_S,
          top: (1080 - 1280 * POSE_S) / 2,
          width: 1920 * POSE_S,
          maxWidth: "none",
        }}
      />
    </div>
  );
};

const S27: React.FC<{ frame: number }> = ({ frame }) => {
  const f = frame;
  const q = Math.floor(f / 3) * 3;

  // ---- M1 camera: zoom on figure (f0–30) → pull back (f30–60) → push-in 5% (f120–180) ----
  const z1 = interpolate(f, [0, 30], [1.55, 1.55], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const z2 = interpolate(f, [30, 62], [1.55, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: expoOut,
  });
  const z3 = interpolate(f, [120, 180], [1.0, 1.05], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: expoOut,
  });
  const m1Scale = f < 30 ? z1 : f < 120 ? z2 : z3;
  // jump bounce illusion (f0–16): crop rises with bounce-settle, then freeze
  const jumpP = springSnappy(Math.max(0, Math.min(1, f / 16)));
  const jumpY = f < 30 ? (1 - jumpP) * 110 : 0;

  // peel progresses
  const rulerPeel = Math.max(0, Math.min(1, (f - 38) / 24));
  const redPeel = Math.max(0, Math.min(1, (f - 62) / 20));
  const goldPeel = Math.max(0, Math.min(1, (f - 92) / 20));

  // M1→M2 wipe
  const wipeP = Math.max(0, Math.min(1, (f - (M2_AT - 8)) / 16));

  // strobe active window
  const strobing = f >= M2_AT && f < 340;

  // exit ball (match-cut → S28)
  const ballX = interpolate(f, [365, 390], [900, 2100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: expoOut,
  });

  return (
    <AbsoluteFill
      style={{
        background: "#0d0d0f",
        overflow: "hidden",
      }}
    >
      {/* ================= M1: gravity meter (f0–180) ================= */}
      {f < M2_AT + 4 && (
        <div style={{ opacity: 1 - wipeP }}>
          {/* P11 plate */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: -100,
              width: 1920,
              height: 1280,
              transform: `translateY(${jumpY}px) scale(${m1Scale})`,
              transformOrigin: "800px 500px",
            }}
          >
            <Img
              src={staticFile("v6/assets/p11-header-gravity-meter.png")}
              style={{ width: "100%", height: "100%" }}
            />
            {/* covers hide ruler + measure lines until their keyframe */}
            <PeelCover
              progress={rulerPeel}
              left={1250}
              top={-20}
              width={275}
              height={1320}
              peelDir="up"
            />
            <PeelCover
              progress={redPeel}
              left={615}
              top={150}
              width={885}
              height={70}
              peelDir="right"
            />
            <PeelCover
              progress={goldPeel}
              left={655}
              top={1002}
              width={865}
              height={70}
              peelDir="right"
            />
          </div>

          {/* red line label: ĐẦU CHẠM BÓNG · 2.56M (#44) — top-right, clear of the figure */}
          {f >= 70 && (
            <>
              <div
                style={{
                  position: "absolute",
                  left: 1465,
                  top: 52,
                }}
              >
                <Stamp
                  text="ĐẦU CHẠM BÓNG · 2.56M"
                  atFrame={START + 70}
                  fontSize={38}
                  color={COLORS.gold}
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 1560,
                  top: 130,
                  transform: `scale(${springSnappy(Math.max(0, Math.min(1, (f - 74) / 14)))})`,
                  fontFamily: "Anton, sans-serif",
                  fontVariantNumeric: "tabular-nums",
                  fontSize: 104,
                  color: COLORS.goldLight,
                  textShadow: "0 0 40px rgba(212,160,23,0.5)",
                }}
              >
                <Counter
                  from={0}
                  to={2.56}
                  atFrame={START + 74}
                  durFrames={36}
                  fontSize={104}
                  color={COLORS.goldLight}
                  decimals={2}
                />
              </div>
            </>
          )}

          {/* gold line label: CHÂN RỜI ĐẤT · 71CM (#45) — right side, clear of feet */}
          {f >= 100 && (
            <>
              <div
                style={{
                  position: "absolute",
                  left: 1465,
                  top: 890,
                }}
              >
                <Stamp
                  text="CHÂN RỜI ĐẤT · 71CM"
                  atFrame={START + 100}
                  fontSize={38}
                  color="#c9c9d2"
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 1560,
                  top: 770,
                  transform: `scale(${springSnappy(Math.max(0, Math.min(1, (f - 104) / 14)))})`,
                }}
              >
                <Counter
                  from={0}
                  to={71}
                  atFrame={START + 104}
                  durFrames={36}
                  fontSize={104}
                  color={COLORS.ivory}
                />
              </div>
            </>
          )}
          <ImpactFlash atFrame={START + 72} dur={2} />
          <ImpactFlash atFrame={START + 102} dur={2} />
        </div>
      )}

      {/* ================= M2: stepover strobe (f180–360) ================= */}
      {f >= M2_AT - 8 && f < BREATH_AT + 30 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 50% 45%, #1c1210 0%, #0e0b09 55%, #0d0d0f 100%)",
            opacity: wipeP,
          }}
        >
          {f >= M2_AT && <StrobePose f={strobing ? f : 339} />}
          {/* speed lines */}
          {strobing &&
            Array.from({ length: 8 }, (_, i) => {
              const side = i % 2 === 0 ? -1 : 1;
              const y = 260 + i * 90;
              const on = Math.floor((f - M2_AT) / 4 + i) % 2 === 0;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: side < 0 ? 240 : 1230,
                    top: y,
                    width: on ? 260 : 120,
                    height: 7,
                    background: `linear-gradient(${side < 0 ? "90deg" : "270deg"}, transparent, ${COLORS.goldLight})`,
                    opacity: on ? 0.85 : 0.25,
                    transform: `scaleX(${on ? 1 : 0.6})`,
                  }}
                />
              );
            })}
          <div
            style={{
              position: "absolute",
              left: 130,
              top: 120,
              transform: "rotate(-4deg)",
              opacity: interpolate(f, [M2_AT + 8, M2_AT + 24], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <Stamp
              text="ĐẢO CHÂN"
              atFrame={START + M2_AT + 8}
              fontSize={110}
              color={COLORS.gold}
              rotate={-4}
            />
          </div>
          <GoldDust frame={f} seed={27} count={26} />
        </div>
      )}

      {/* ================= breathing 1s (f360–390) ================= */}
      {f >= BREATH_AT && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 50% 45%, #141010 0%, #0d0d0f 70%)",
            opacity: interpolate(f, [BREATH_AT, BREATH_AT + 12], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <StrobePose f={339} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "#000",
              opacity: interpolate(f, [BREATH_AT + 8, BREATH_AT + 30], [0, 0.35], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          />
        </div>
      )}

      {/* exit ball → S28 match-cut (T6) */}
      {f >= 365 && (
        <div
          style={{
            position: "absolute",
            left: ballX - 65,
            top: 830,
            width: 130,
            height: 130,
            overflow: "hidden",
            borderRadius: "50%",
          }}
        >
          <Img
            src={staticFile("v6/assets/p12-stepover-poses.png")}
            style={{
              position: "absolute",
              left: -830 * POSE_S,
              top: -930 * POSE_S,
              width: 1920 * POSE_S,
              maxWidth: "none",
            }}
          />
        </div>
      )}

      {/* whip into M2 */}
      {f >= M2_AT - 8 && f < M2_AT + 8 && (
        <WhipStreak progress={(f - (M2_AT - 8)) / 16} dir={1} height={100} />
      )}
      <GoldDust frame={f} seed={271} count={18} />
    </AbsoluteFill>
  );
};

export default S27;
