/**
 * S6 · 1:08–1:20 (f0–360) · Footage chấn thương.
 * Zoom cut dồn dập (log-zoom T7), glitch kỷ luật bounded 6f sync beat (T10),
 * HUD viewfinder (che vỡ hạt + tư liệu đắt), rack-focus mặt→máu→mắt (T12/T13).
 * T7 (zoom cut + beat punch +0.012) · T10 (glitch) · T12 (1 shot 1 move)
 * T9 (impact frame tại beat) · T20.
 * Camera: Anchored→Flowing + Brisk · Archetype Urgency.
 * Footage giữ nguyên bản (logo tự nhiên không che) — DECISIONS §1.
 */
import React from "react";
import { AbsoluteFill, Sequence, Video, interpolate, staticFile} from "remotion";
import { COLORS, ImpactFlash } from "../components/Grade";
import { power4Out, sineInOut } from "../motion/eases";
import { Dust, HUD, PaperGrain, nearestBeatGlobalFrame } from "./teamA-helpers";

const START = 2040;
const DUR = 360;
const FPB = (60 / 86) * 30; // ~20.9f/beat (Ch. II 84–88 BPM)

// 4 zoom-cut segments (~86f each), each a log push-in
const SEG_SCALES = [1.02, 1.16, 1.34, 1.56];
const segAt = (f: number) => Math.min(3, Math.floor(f / 86));

const S6: React.FC<{ frame: number }> = ({ frame }: { frame: number }) => {
  const f = Math.max(0, Math.min(DUR, frame));
  const seg = segAt(f);
  const segF = f - seg * 86;
  const segP = Math.max(0, Math.min(1, segF / 86));

  // log-zoom push-in within segment + beat punch (+0.012/beat decay)
  const beatFrac = (segF % FPB) / FPB;
  const punch = 0.012 * Math.exp(-3 * beatFrac) + (segF < FPB * 0.25 && seg % 1 === 0 ? 0 : 0);
  const zoom = SEG_SCALES[seg] * (1 + 0.07 * power4Out(segP)) * (1 + punch);

  // glitch bursts bounded 6f at segment boundaries (sync beat)
  const glitchAt = [86, 172, 258];
  const glitchWin = glitchAt.find((g) => f >= g && f < g + 6);
  const gl = glitchWin !== undefined ? (f - glitchWin) / 6 : -1;

  // rack-focus mặt→máu→mắt: focus pulses per segment
  const focusPulse = (c: number, w: number) => {
    const d = Math.abs(f - c);
    return d < w ? 3.2 * Math.sin((d / w) * Math.PI) : 0;
  };
  const blur = focusPulse(20, 26) + focusPulse(150, 26) + focusPulse(280, 26);

  // slight drift per segment (one camera move per shot)
  const driftX = [-30, 26, -22, 18][seg] * segP;
  const driftY = [12, -14, 10, -8][seg] * segP;

  const sliceShift = gl >= 0 ? [14, -18, 10, -8, 6, -4][Math.floor(gl * 6)] : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black, overflow: "hidden" }}>
      {/* footage, grade unify */}
      <div
        style={{
          position: "absolute",
          inset: -120,
          transform: `translate(${driftX}px, ${driftY}px) scale(${zoom})`,
          filter: `blur(${blur}px) saturate(0.82) contrast(1.1) brightness(0.96)`,
        }}
      >
        <Sequence from={START} layout="none"><Video src={staticFile("v6/footage/cr7-injury-blood-face.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Sequence>
      </div>

      {/* glitch: RGB split layers, bounded 6f */}
      {gl >= 0 && (
        <>
          <div
            style={{
              position: "absolute",
              inset: -120,
              transform: `translate(${driftX + sliceShift}px, ${driftY}px) scale(${zoom})`,
              mixBlendMode: "screen",
              opacity: 0.45,
              filter: "brightness(0.7) sepia(1) saturate(4) hue-rotate(-50deg)",
            }}
          >
            <Sequence from={START} layout="none"><Video src={staticFile("v6/footage/cr7-injury-blood-face.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Sequence>
          </div>
          <div
            style={{
              position: "absolute",
              inset: -120,
              transform: `translate(${driftX - sliceShift}px, ${driftY}px) scale(${zoom})`,
              mixBlendMode: "screen",
              opacity: 0.45,
              filter: "brightness(0.7) sepia(1) saturate(4) hue-rotate(160deg)",
            }}
          >
            <Sequence from={START} layout="none"><Video src={staticFile("v6/footage/cr7-injury-blood-face.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></Sequence>
          </div>
          {/* slice displacement */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: "38%",
              height: 120,
              transform: `translateX(${-sliceShift * 2}px)`,
              background: "rgba(255,255,255,0.06)",
              clipPath: "inset(0 0 0 0)",
            }}
          />
        </>
      )}

      {/* impact frames at segment hits */}
      <ImpactFlash atFrame={86 + START} dur={2} />
      <ImpactFlash atFrame={172 + START} dur={2} />
      <ImpactFlash atFrame={258 + START} dur={2} />

      {/* red vignette pulse (secondary) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, rgba(0,0,0,0) 52%, rgba(120,10,10,0.35) 100%)",
          opacity: 0.6 + 0.4 * Math.sin((f / 30 / 4) * Math.PI * 2),
        }}
      />

      {/* HUD viewfinder */}
      <HUD frame={f} start={START} label="S06" />

      <PaperGrain opacity={0.1} />
      <Dust frame={f} count={18} seed={16} color="200,200,200" />
    </AbsoluteFill>
  );
};

export default S6;
