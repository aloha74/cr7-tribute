/**
 * S1 · 0:05–0:18 (f0–390) · "FUNCHAL · MADEIRA · 1985"
 * Drone pullback + parallax 3 lớp (T12) + counter-motion + rack-focus (T13).
 * T12 (parallax + counter-motion) · T3 (text stamp) · T13 (rack-focus) · T20 (ambient) · T1.
 * Camera: Motivated + Calm · Archetype Elegance.
 * Footage SD 854×450 -> upscale + grade unify (giữ nguyên bản, không che logo).
 */
import React from "react";
import { AbsoluteFill, Video, interpolate, staticFile } from "remotion";
import { COLORS } from "../components/Grade";
import { Stamp } from "../components/KineticText";
import { power3Out, sineInOut, springIOS } from "../motion/eases";
import { CropImg, Dust, PaperGrain, paperShadow, q10 } from "./teamA-helpers";

const START = 150;
const DUR = 390;

const S1: React.FC<{ frame: number }> = ({ frame }: { frame: number }) => {
  const f = Math.max(0, Math.min(DUR, frame));
  const qf = q10(f);

  // pullback: zoom 1.5 -> 1.32 (cover base 1.07 baked in), slow drift right = counter-motion (boy runs left)
  const zoom = interpolate(f, [0, DUR], [1.5, 1.32], { easing: power3Out, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const bgDrift = interpolate(f, [0, DUR], [0, 130], { easing: sineInOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // rack-focus: footage blur 0 -> 2.5 (statue softens), boy blur 5 -> 0 (boy sharpens)
  const bgBlur = interpolate(f, [0, DUR], [0, 2.5], { easing: sineInOut });
  const boyBlur = interpolate(f, [40, 200], [5, 0], { easing: power3Out, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // boy runs left at 1.2x (stop-motion), mid hill at 0.6x
  const boyX = interpolate(qf, [60, 360], [1560, 380], { easing: sineInOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const boyBob = 8 * Math.sin((qf / 6) * Math.PI * 2); // running bounce, on twos
  const midDrift = interpolate(f, [0, DUR], [0, 78], { easing: sineInOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // boy slides in (bounce-settle) f40-70
  const boyEnterP = Math.max(0, Math.min(1, (f - 40) / 30));
  const boyEnter = springIOS(boyEnterP);
  // transitions biên: mở từ đen 12f (S0→S1 match-cut xuyên đen) · đóng: posterize rút thành giấy (S1→S2)
  const openBlack = interpolate(f, [0, 12], [1, 0], { easing: sineInOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const posterP = interpolate(f, [368, 390], [0, 1], { easing: sineInOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const footageSat = 0.92 * (1 - posterP) + 0.12 * posterP;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black, overflow: "hidden" }}>
      {/* BG 0.2x: drone footage, pullback + counter-motion drift */}
      <div
        style={{
          position: "absolute",
          inset: -160,
          transform: `translateX(${bgDrift}px) scale(${1.07 * zoom})`,
          filter: `blur(${bgBlur}px) saturate(${footageSat}) contrast(${1.04 + posterP * 0.12})`,
        }}
      >
        <Video
          src={staticFile("v6/footage/cr7-drone-selfie-4k.mp4")}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
      {/* paper tint khi rút thành giấy */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#8a7a5e",
          opacity: posterP * 0.35,
          mixBlendMode: "multiply",
        }}
      />

      {/* MID 0.6x: paper hill silhouette strip */}
      <svg
        viewBox="0 0 1920 300"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          left: -60 + midDrift,
          bottom: 0,
          width: 2060,
          height: 300,
          opacity: 0.92,
        }}
      >
        <path
          d="M0,300 L0,210 Q240,150 480,190 T960,170 T1440,200 T1920,160 L1920,300 Z"
          fill="#1a1214"
        />
        <path
          d="M0,300 L0,250 Q320,205 640,235 T1280,225 T1920,240 L1920,300 Z"
          fill="#2b1a12"
          opacity="0.9"
        />
      </svg>

      {/* FG 1.2x: paper-cut boy running left (P1 pose 3 crop, flipped to face travel direction) */}
      <div
        style={{
          position: "absolute",
          left: boyX,
          bottom: 120 + boyBob,
          transform: `scaleX(-1) scale(${boyEnter}) rotate(-2deg)`,
          ...paperShadow(22),
          filter: `blur(${boyBlur}px) drop-shadow(0 22px 20px rgba(0,0,0,0.55))`,
          opacity: boyEnterP > 0 ? 1 : 0,
          border: "3px solid rgba(232,220,200,0.85)",
        }}
      >
        <CropImg
          src="/v6/assets/p1-boy-madeira-3poses.png"
          nativeW={1920}
          nativeH={1280}
          cx={1340}
          cy={280}
          cw={330}
          ch={720}
          h={400}
        />
      </div>

      {/* stamp text */}
      <div style={{ position: "absolute", left: 140, top: 120 }}>
        <Stamp
          text="FUNCHAL · MADEIRA · 1985"
          atFrame={90 + START}
          fontSize={64}
          color={COLORS.ivory}
          rotate={-2}
        />
      </div>

      {/* secondary: paper grain on footage + ambient dust */}
      <PaperGrain opacity={0.1} />
      <Dust frame={f} count={30} seed={11} />
      {/* ambient: slow cloud light sweep */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(105deg, rgba(212,160,23,0) 40%, rgba(212,160,23,${
            0.05 + 0.03 * Math.sin((f / 30 / 8) * Math.PI * 2)
          }) 55%, rgba(212,160,23,0) 70%)`,
        }}
      />
      {/* mở từ đen 12f (S0→S1) */}
      <div style={{ position: "absolute", inset: 0, backgroundColor: COLORS.black, opacity: openBlack }} />
    </AbsoluteFill>
  );
};

export default S1;
