/**
 * S10 · 2:05–2:10 (f0–150) · Breathing + false stop.
 * f0–90: breathing (paper-cut CR7 đứng giữa sân trống — chỉ grain + mưa nhẹ thở).
 * f90–135: false stop — im lặng 1.5s (~2.1 beats), near-silence.
 * f135–150: L2 — tail timpani roll kéo 12f (pulse ring).
 * f148–150: impact frame trắng 2f — taiko nổ downbeat 2:10 (hard cut sang S11).
 * T16 (silence trước payoff) · T20 (breathing) · T9 (impact frame) · T17 (L-cut visual).
 * Camera: Locked + Stately.
 * NOTE: dùng tạm sil-cr7-stand.png (asset manifest ghi cho S26) — silhouette paper-cut CR7 generic;
 * team B quyết định asset riêng nếu cần.
 */
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { COLORS, ImpactFlash } from "../components/Grade";
import { sineInOut } from "../motion/eases";
import { CropImg, Dust, PaperGrain, Rain, paperShadow, q10 } from "./teamA-helpers";

const START = 3750;
const DUR = 150;

const S10: React.FC<{ frame: number }> = ({ frame }: { frame: number }) => {
  const f = Math.max(0, Math.min(DUR, frame));
  const qf = q10(f);

  // false stop: f90–135 tối dần về near-black
  const darkP = interpolate(f, [90, 108], [0, 1], { easing: sineInOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const darkOut = interpolate(f, [135, 148], [1, 0.55], { easing: sineInOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dark = Math.min(darkP, 1) * (f >= 135 ? darkOut / 1 : 1);
  const rainFade = 1 - interpolate(f, [90, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // silhouette sway (stop-motion, thở)
  const sway = 5 * Math.sin((qf / 30 / 5) * Math.PI * 2);
  const silDim = 1 - 0.75 * darkP * (f < 135 ? 1 : 0.4);
  // L2 pulse ring f135–150
  const l2p = f >= 135 ? (f - 135) / 15 : -1;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0e", overflow: "hidden" }}>
      {/* sân trống paper */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, #0a0a10 0%, #12101a 55%, #181209 100%)",
          opacity: silDim,
        }}
      />
      {/* vạch sân mờ */}
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, opacity: 0.28 * silDim }}>
        <ellipse cx={960} cy={760} rx={420} ry={130} fill="none" stroke="#3a3a44" strokeWidth={5} />
        <line x1={0} y1={760} x2={1920} y2={760} stroke="#3a3a44" strokeWidth={4} />
      </svg>

      {/* mưa nhẹ (streak S9 tan thành mưa) */}
      <div style={{ opacity: rainFade }}>
        <Rain frame={f} count={60} seed={101} opacity={0.4} slant={0.15} />
      </div>

      {/* silhouette paper-cut CR7 đứng giữa sân (crop bỏ khung đỏ của asset, giữ figure + nền đen) */}
      <div
        style={{
          position: "absolute",
          left: 960 - 140 + sway,
          bottom: 170,
          ...paperShadow(26),
          opacity: silDim,
        }}
      >
        <CropImg
          src="/v6/assets/sil-cr7-stand.png"
          nativeW={1280}
          nativeH={1920}
          cx={300}
          cy={120}
          cw={680}
          ch={1800}
          h={710}
        />
      </div>

      {/* L2: pulse ring timpani tail */}
      {l2p >= 0 && (
        <div
          style={{
            position: "absolute",
            left: 960 - 260 * (0.4 + l2p),
            top: 540 - 260 * (0.4 + l2p),
            width: 520 * (0.4 + l2p),
            height: 520 * (0.4 + l2p),
            borderRadius: "50%",
            border: `3px solid rgba(212,160,23,${0.5 * (1 - l2p)})`,
          }}
        />
      )}

      {/* false stop: near-black, chỉ grain thở */}
      <div style={{ position: "absolute", inset: 0, backgroundColor: "#000", opacity: f >= 90 && f < 135 ? darkP : f >= 135 ? 1 - darkOut : 0 }} />

      {/* taiko downbeat 2:10: impact frame 2f */}
      <ImpactFlash atFrame={148 + START} dur={2} />

      <PaperGrain opacity={0.14} />
      <Dust frame={f} count={20} seed={20} />
    </AbsoluteFill>
  );
};

export default S10;
