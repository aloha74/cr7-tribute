/**
 * S17 · 3:44–3:56 (frames 6720–7080, 360f) · XE ĐẠP JUVE 2018 — SLOW-MO + LIGHTNING
 * Slow-mo 25%: ball travels the dashed curve, slowest frame đúng beat 331 (f195).
 * Lightning SVG flash 3f sync beat + RGB split bounded 8f (KHÔNG dùng tia sét ở S19).
 * Rack-focus: figure nét → bóng nét. T: T8 · T10 · T13 · T12 · T20
 */
import React from "react";
import { AbsoluteFill, interpolate, staticFile } from "remotion";
import { beatToFrame } from "../motion/beat";
import { sineInOut } from "../motion/eases";
import { COLORS, ImpactFlash, GoldHalo } from "../components/Grade";
import { Stamp } from "../components/KineticText";
import { Lightning, SpeedLines, WhipStreak, Embers, sm, g, P10 } from "../components/TeamB";

const START = 6720;
const bf = (beat: number) => beatToFrame(beat) - START;

const SLOWEST = bf(331); // frame chậm nhất đúng beat
const RGB_A = SLOWEST - 4; const RGB_B = SLOWEST + 4; // RGB split bounded 8f

// ball path: quadratic bezier (1700,1200) -> (1900,400) -> (1300,170) -> off (900,-300)
const qbez = (t: number, p0: number, p1: number, p2: number) =>
  (1 - t) * (1 - t) * p0 + 2 * (1 - t) * t * p1 + t * t * p2;

/** warped progress: slow-mo dwell at SLOWEST (25% feel), release after */
function warp(f: number): number {
  if (f < SLOWEST) return 0.45 * sineInOut(f / SLOWEST);
  if (f < SLOWEST + 45) return 0.45 + 0.15 * sineInOut((f - SLOWEST) / 45);
  return 0.6 + 0.4 * sineInOut(Math.min(1, (f - SLOWEST - 45) / (360 - SLOWEST - 45)));
}

const S17: React.FC<{ frame: number }> = ({ frame }) => {
  const smf = sm(frame);

  // camera: slow push-in + drift (slow-mo feel)
  const push = Math.exp(0.0953 * (smf / 360)); // log-zoom, no linear
  const driftX = Math.sin(smf / 90) * 24;

  // ball along curve
  const w = warp(smf);
  const t1 = Math.min(1, w / 0.72);
  const t2 = Math.max(0, (w - 0.72) / 0.28);
  const bx = t2 > 0 ? interpolate(t2, [0, 1], [1300, 900]) : qbez(t1, 1700, 1900, 1300);
  const by = t2 > 0 ? interpolate(t2, [0, 1], [170, -300]) : qbez(t1, 1200, 400, 170);
  const ballSpin = w * 700;

  // rack-focus: figure nét -> bóng nét
  const focusT = Math.max(0, Math.min(1, smf / 360));
  const figBlur = interpolate(focusT, [0, 1], [0, 3]);
  const ballBlur = interpolate(focusT, [0, 1], [7, 0]);

  // lightning flashes: 3f at slowest beat + 3f early sync
  const bolt1 = frame >= SLOWEST - 1 && frame <= SLOWEST + 1;
  const bolt2 = frame >= 40 && frame <= 42;

  // exit: ball flies into camera (S17→S18 whip-zoom handoff)
  const exitT = Math.max(0, Math.min(1, (frame - 318) / 42));
  const exitScale = 1 + exitT * exitT * 9;

  const inRgb = frame >= RGB_A && frame <= RGB_B;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black, overflow: "hidden" }}>
      {/* PRIMARY: paper plate (P8) */}
      <div
        style={{
          position: "absolute",
          inset: -70,
          transform: `translateX(${driftX}px) scale(${push})`,
          filter: `blur(${figBlur}px)`,
        }}
      >
        <img src={staticFile("v6/assets/p8-bicycle-kick.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      {/* RGB split bounded 8f (kỷ luật) */}
      {inRgb && (
        <>
          <div style={{ position: "absolute", inset: -70, transform: `translateX(${driftX - 9}px) scale(${push})`, mixBlendMode: "screen", opacity: 0.55, filter: "brightness(0.6) sepia(1) hue-rotate(-45deg) saturate(4)" }}>
            <img src={staticFile("v6/assets/p8-bicycle-kick.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
          <div style={{ position: "absolute", inset: -70, transform: `translateX(${driftX + 9}px) scale(${push})`, mixBlendMode: "screen", opacity: 0.55, filter: "brightness(0.6) sepia(1) hue-rotate(165deg) saturate(4)" }}>
            <img src={staticFile("v6/assets/p8-bicycle-kick.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </>
      )}

      {/* PRIMARY: hero ball on the dashed curve */}
      {exitT < 1 ? (
        <div
          style={{
            position: "absolute",
            left: exitT > 0 ? 960 : bx,
            top: exitT > 0 ? 540 : by,
            width: 120,
            height: 120,
            transform: `translate(-50%,-50%) scale(${exitT > 0 ? exitScale : 1}) rotate(${ballSpin}deg)`,
            filter: `blur(${ballBlur}px) drop-shadow(0 0 22px rgba(245,214,123,0.75))`,
          }}
        >
          <img src={staticFile(P10)} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
        </div>
      ) : null}

      {/* hand-drawn speed lines trailing the ball */}
      <SpeedLines seed={9} n={12} fromX={bx - 260} fromY={by + 40} len={300} progress={Math.min(1, w * 1.6)} />

      {/* SECONDARY: lightning (bounded, sync beat) */}
      {(bolt1 || bolt2) && <Lightning seed={17} flash />}
      {inRgb && <ImpactFlash atFrame={g(START, RGB_A)} dur={2} />}

      {/* SECONDARY: text */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 120 }}>
        <Stamp text="XE ĐẠP · TURIN 2018" atFrame={g(START, 14)} fontSize={58} rotate={-2} />
      </AbsoluteFill>

      <GoldHalo size={900} opacity={bolt1 ? 0.55 : 0.22} />

      {/* AMBIENT */}
      <Embers seed={71} count={20} />

      {/* EXIT whip-zoom into S18 */}
      <WhipStreak atFrame={g(START, 352)} dur={12} />
    </AbsoluteFill>
  );
};

export default S17;
