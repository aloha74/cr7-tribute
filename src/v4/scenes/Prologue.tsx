import React from "react";
import { AbsoluteFill, Video, Sequence, staticFile, useCurrentFrame, interpolate } from "remotion";
import { S } from "../timeline";
import { StadiumFlare } from "../components/StadiumFlare";
import { Slam, Rise, Flash, Scrim } from "../components/Kinetic";
import { ActTransition } from "../components/ActTransition";
import { PAPER } from "../components/Paper";

/** EKG heartbeat line — spikes on each beat (0–7s @60bpm). */
const Ekg: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const beat = t % 1; // 1 beat per second
  // draw progress: line sweeps across 8s
  const prog = Math.min(1, t / 8);
  const x = 240 + prog * 1440;
  // spike shape near each beat
  const spike = (bx: number) => {
    const d = Math.abs(x - bx);
    if (d > 90) return 0;
    const p = 1 - d / 90;
    return Math.sin(p * Math.PI) * 130 * (beat < 0.12 ? 1 : 0.25);
  };
  let bx = 240;
  const spikes: number[] = [];
  for (let i = 0; i < 8; i++) { spikes.push(bx); bx += 180; }
  const yAt = (xx: number) => {
    let y = 540;
    for (const s of spikes) y -= spikeAt(xx, s, t);
    return y;
  };
  const spikeAt = (xx: number, s: number, tt: number) => {
    const d = Math.abs(xx - s);
    if (d > 70) return 0;
    const age = tt - (s - 240) / 180;
    const amp = age < 0 ? 0 : Math.exp(-age * 3);
    return Math.sin((1 - d / 70) * Math.PI) * 150 * amp;
  };
  let d = `M 240 ${yAt(240)}`;
  for (let xx = 240; xx <= x; xx += 12) d += ` L ${xx} ${yAt(xx).toFixed(1)}`;
  return (
    <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <path d={d} fill="none" stroke={PAPER.red} strokeWidth={7} strokeLinecap="round"
        style={{ filter: "drop-shadow(0 0 18px rgba(176,58,46,0.8))" }} />
      <circle cx={x} cy={yAt(x)} r={11} fill="#ff6b5e" style={{ filter: "drop-shadow(0 0 14px #ff6b5e)" }} />
    </svg>
  );
};

export const Prologue: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  if (t > 30.6) return null;
  // slow push-in on the footage world
  const push = interpolate(t, [3, 30], [1, 1.14]);
  const flareOp = interpolate(t, [3, 5.5], [0, 0.85]);
  const footOp = interpolate(t, [3.5, 7], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      {t < 8 && <Ekg />}

      {t >= 3 && (
        <div style={{ position: "absolute", inset: -60, transform: `scale(${push})`, opacity: 1 }}>
          <div style={{ position: "absolute", inset: 0, opacity: flareOp }}>
            <StadiumFlare />
          </div>
          <div style={{ position: "absolute", inset: 0, opacity: footOp }}>
            <Sequence from={90} durationInFrames={840}>
              <Video src={staticFile("v3/clip01.mp4")} muted
                style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </Sequence>
            <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(4,6,10,0.42)" }} />
          </div>
        </div>
      )}

      <Scrim opacity={0.5} />
      <Slam at={8} until={14.6} size={170} color={PAPER.gold}>900+ GOALS.</Slam>
      <Rise at={15} until={21.8} size={58}>No human in football history has done it.</Rise>
      <Flash at={22} />
      <Rise at={22.4} until={24.2} size={64}>This is what <b>impossible</b> looks like.</Rise>
      <Slam at={24.5} size={150} color={PAPER.gold}
        style={{ alignItems: "flex-end", paddingBottom: 190 }}>THE 900 CLUB</Slam>

      {/* straddle into Act 1 */}
      <ActTransition at={29.2} />
    </AbsoluteFill>
  );
};
