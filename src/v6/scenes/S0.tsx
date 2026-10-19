/**
 * S0 · 0:00–0:05 (f0–150) · "900+" — signature shot: dolly xuyên chữ.
 * T3 (CharSlam + anticipation/follow-through) · T4 (counter 0→900) · T7 (dolly = log-zoom)
 * T16 (SIL-1) · T22 (signature shot) · T20 (ambient grain breath).
 * Camera: Locked + Slammed · Archetype Surprise.
 */
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { COLORS, GoldHalo } from "../components/Grade";
import { CharSlam, Counter } from "../components/KineticText";
import { expoOut, sineInOut } from "../motion/eases";
import { Dust } from "./teamA-helpers";

const START = 0;
const DUR = 150;

const S0: React.FC<{ frame: number }> = ({ frame }: { frame: number }) => {
  const f = Math.max(0, Math.min(DUR, frame));

  // Dolly 2 pha: f12–70 assemble + push nhẹ (1 -> 1.4, chữ đọc được);
  // f70–150 xuyên qua chữ (1.4 -> 3.4 log). Hold f105–150 dời về rule-of-thirds phải.
  const pa = Math.max(0, Math.min(1, (f - 12) / (70 - 12)));
  const pb = Math.max(0, Math.min(1, (f - 70) / (150 - 70)));
  const p2 = Math.max(0, Math.min(1, (f - 105) / (150 - 105)));
  const dolly =
    Math.exp(interpolate(expoOut(pa), [0, 1], [0, Math.log(1.4)])) *
    Math.exp(interpolate(expoOut(pb), [0, 1], [0, Math.log(3.4 / 1.4)]));
  // reposition toward rule-of-thirds (right) during hold
  const tx = interpolate(sineInOut(p2), [0, 1], [0, 300]);
  // heartbeat pulse on halo (72bpm -> 25f period), subtle
  const pulse = 1 + 0.035 * Math.sin((f / 25) * Math.PI * 2);
  // slow radial drift (ambient)
  const driftX = 60 * Math.sin((f / 30 / 9) * Math.PI * 2);
  const driftY = 30 * Math.cos((f / 30 / 11) * Math.PI * 2);
  // f0–12: màn đen tuyệt đối (fix R1#3) — ambient/halo fade in sau f12
  const ambientIn = interpolate(f, [12, 36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black, overflow: "hidden" }}>
      {/* ambient: faint radial drift behind text */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "46%",
          width: 1500,
          height: 1500,
          transform: `translate(calc(-50% + ${driftX}px), calc(-50% + ${driftY}px))`,
          background:
            "radial-gradient(circle, rgba(143,29,29,0.5) 0%, rgba(74,14,14,0.25) 40%, rgba(0,0,0,0) 70%)",
          opacity: ambientIn,
        }}
      />
      <div
        style={{
          transform: `scale(${pulse})`,
          position: "absolute",
          inset: 0,
          opacity: ambientIn,
        }}
      >
        <GoldHalo size={1100} opacity={0.3} />
      </div>

      {/* Primary: "900+" assemble + dolly through */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateX(${tx}px) scale(${dolly})`,
        }}
      >
        <CharSlam
          text="900+"
          atFrame={12 + START}
          staggerMs={60}
          scaleFrom={8}
          fontSize={520}
          color={COLORS.ivory}
        />
      </div>

      {/* Secondary: counter 0 -> 900, bottom corner */}
      {f >= 12 && (
        <div style={{ position: "absolute", right: 130, bottom: 90 }}>
          <Counter
            from={0}
            to={900}
            atFrame={12 + START}
            durFrames={105 - 12}
            fontSize={72}
            color={COLORS.goldLight}
          />
        </div>
      )}

      {/* Ambient: dust drift (T20) — grain/vignette breath come from Grade */}
      <Dust frame={f} count={26} seed={3} />
    </AbsoluteFill>
  );
};

export default S0;
