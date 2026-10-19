/**
 * S11 · 2:10–2:25 (frames 3900–4350, 450f) · WOLFSBURG 2016 — grammar ĐẾM SỐ
 * Score "0–2" slams to "1–2"→"2–2"→"3–2"; each goal: flash + shake + whip-streak.
 * NO zoom-cut in this scene (B-E19) — only counting grammar + impacts.
 * T: T4 · T5 · T9 · T3 · T13 · T20
 */
import React from "react";
import { AbsoluteFill, interpolate, staticFile, useCurrentFrame } from "remotion";
import { beatToFrame } from "../motion/beat";
import { power4Out } from "../motion/eases";
import { COLORS, ImpactFlash, useShake, GoldHalo } from "../components/Grade";
import { Stamp } from "../components/KineticText";
import {
  WhipStreak,
  PaperParticles,
  Embers,
  ScoreSlam,
  sm,
  g,
  P10_CROP,
} from "../components/TeamB";

const START = 3900;
const bf = (beat: number) => beatToFrame(beat) - START; // local frame

// Goal beats (Ch. III): 149 / 158 / 167
const GOALS = [bf(149), bf(158), bf(167)];
const SCORES = ["1–2", "2–2", "3–2"];

const S11: React.FC<{ frame: number }> = ({ frame }) => {
  const gframe = useCurrentFrame(); // global
  const smf = sm(frame);

  // camera: slow push-in (Flowing) + shake at each goal (T9)
  const push = Math.exp(0.077 * Math.min(1, smf / 450)); // log-zoom, no linear
  const sh1 = useShake(g(START, GOALS[0]), 16, 14);
  const sh2 = useShake(g(START, GOALS[1]), 16, 14);
  const sh3 = useShake(g(START, GOALS[2]), 20, 16);
  const shx = sh1.x + sh2.x + sh3.x;
  const shy = sh1.y + sh2.y + sh3.y;

  // current score
  const scoreIdx = frame < GOALS[0] ? -1 : frame < GOALS[1] ? 0 : frame < GOALS[2] ? 1 : 2;
  const scoreText = scoreIdx < 0 ? "0–2" : SCORES[scoreIdx];
  const scoreAt = scoreIdx < 0 ? g(START, 6) : g(START, GOALS[scoreIdx]);

  // ball flight per goal (whip motivated): sweeps left→right, strikes at goal.
  // 3rd ball: strike phase then accelerates right into the S11→S12 whip-out.
  const activeGoal = scoreIdx < 0 ? 0 : scoreIdx;
  const gAt = GOALS[activeGoal];
  let ballT: number, ballX: number;
  if (activeGoal === 2 && frame > GOALS[2] + 12) {
    const et = Math.max(0, Math.min(1, (frame - (GOALS[2] + 12)) / 37));
    ballT = 0.5;
    ballX = 1300 + 1200 * et * et; // accelerating exit, visible at whip (f440)
  } else {
    ballT = Math.max(0, Math.min(1, (frame - (gAt - 12)) / 24));
    ballX = interpolate(power4Out(ballT), [0, 1], [-500, activeGoal === 2 ? 1300 : 2400]);
  }
  const ballY = 700 - Math.sin(ballT * Math.PI) * 180;
  const ballRot = ballT * 540;
  const ballVisible = !(ballT <= 0 || (activeGoal !== 2 && ballT >= 1));

  // explosion plate punch at each goal (secondary layer)
  const punch = [GOALS[0], GOALS[1], GOALS[2]].reduce((acc, gt) => {
    const t = (frame - gt) / 20;
    if (t < 0 || t > 1) return acc;
    return acc + Math.exp(-4 * t);
  }, 0);

  // breathing ambient light on plate
  const breath = 0.5 + 0.5 * Math.sin((smf / 30 / 5) * Math.PI * 2);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black, overflow: "hidden" }}>
      {/* PRIMARY: paper stadium plate (P4) — slow push-in + shake */}
      <div
        style={{
          position: "absolute",
          inset: -80,
          transform: `translate(${shx}px, ${shy}px) scale(${push + punch * 0.05})`,
        }}
      >
        <img
          src={staticFile("v6/assets/p4-wolfsburg-3goals.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }}
        />
        {/* night tint breathing */}
        <AbsoluteFill
          style={{
            background: `radial-gradient(ellipse at 50% 70%, rgba(143,29,29,${0.25 + breath * 0.15}) 0%, rgba(0,0,0,0.35) 100%)`,
          }}
        />
      </div>

      {/* PRIMARY: hero ball (P10_CROP — bản crop tròn, fix R1-O1) */}
      <div
        style={{
          position: "absolute",
          left: ballX,
          top: ballY,
          width: 150,
          height: 150,
          transform: `translate(-50%,-50%) rotate(${ballRot}deg)`,
          opacity: ballVisible ? 1 : 0,
          filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.7))",
          borderRadius: "50%",
          overflow: "hidden",
        }}
      >
        <img src={staticFile(P10_CROP)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>

      {/* SECONDARY: score slam (T4 grammar — the hero of this scene) */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <ScoreSlam text={scoreText} atFrame={scoreAt} fontSize={310} color={scoreIdx >= 2 ? COLORS.goldLight : COLORS.ivory} />
      </AbsoluteFill>

      {/* SECONDARY: stamp + paper burst at each goal */}
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 130 }}>
        <Stamp text="WOLFSBURG · 2016" atFrame={g(START, 4)} fontSize={64} rotate={-2} />
      </AbsoluteFill>
      {GOALS.map((gt, i) => (
        <React.Fragment key={i}>
          <WhipStreak atFrame={g(START, gt)} dur={12} />
          <ImpactFlash atFrame={g(START, gt)} dur={2} />
          <PaperParticles count={60} seed={100 + i} atFrame={g(START, gt)} dur={46} maxDist={560} centerX={960} centerY={620} />
        </React.Fragment>
      ))}

      {/* SECONDARY: halo swells with each goal */}
      <GoldHalo size={900} opacity={0.22 + punch * 0.3} />

      {/* AMBIENT: embers + grain (Grade) */}
      <Embers seed={21} count={30} />

      {/* EXIT: ball of the 3rd goal flies right + whip out (S11→S12 handoff) */}
      {frame >= 415 && (
        <WhipStreak atFrame={g(START, 440)} dur={14} />
      )}
    </AbsoluteFill>
  );
};

export default S11;
