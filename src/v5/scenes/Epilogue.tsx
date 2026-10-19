import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Rise } from "../components/Kinetic";
import { Grade } from "../components/FX";
import { FPS } from "../cue";

const CREDITS = [
  "HUYỀN THOẠI SỐNG · CR7 KINETIC CUT",
  "",
  "TƯ LIỆU HÌNH ẢNH (CC BY 3.0 · Wikimedia Commons)",
  "\u201CAll 48 goals of Cristiano Ronaldo, in 35 league matches for Real Madrid (2014\u201315)\u201D",
  "Drone footage of the Cristiano Ronaldo statue, Funchal Madeira",
  "Training / medical room footage · Tribute montage",
  "",
  "NHẠC NỀN",
  "Sáng tác hoàn toàn bằng code — không dùng sample ngoài",
  "",
  "MINH HỌA PAPER-CUT",
  "Vẽ bằng AI theo phong cách Vox explainer cho video này",
  "",
  "DỰNG PHIM",
  "Remotion — motion graphics bằng code",
  "",
  "Cảm ơn anh — người truyền cảm hứng cho video này.",
];

/** 280–300s: closing line + scrolling credits (attribution ONLY here). */
export const Epilogue: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (t < 280 || t > 300) return null;
  const lt = t - 280;
  // gentle breathing zoom on black-gold bg
  const zoom = 1 + 0.04 * Math.sin(lt * 0.8);
  const scrollP = Math.min(1, Math.max(0, (lt - 4) / 15));
  const yOff = interpolate(scrollP, [0, 1], [700, -700]);
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <div style={{
        position: "absolute", inset: -100,
        background: "radial-gradient(ellipse at 50% 30%, #241407 0%, #060607 65%)",
        transform: `scale(${zoom})`,
      }} />
      <Rise at={280.5} until={285} size={64}>{"Một huyền thoại sống của bóng đá nhân loại."}</Rise>
      <div style={{ position: "absolute", left: 0, right: 0, top: "50%", transform: `translateY(${yOff}px)` }}>
        {CREDITS.map((l, i) => (
          <div key={i} style={{
            textAlign: "center", color: l === "" ? "transparent" : "#cdbf9a",
            fontFamily: l.endsWith("CUT") || l === CREDITS[2] || l === "NHẠC NỀN" || l === "MINH HỌA PAPER-CUT" || l === "DỰNG PHIM" ? "'Anton', sans-serif" : "'Inter', sans-serif",
            fontSize: l === "" ? 18 : 34, margin: "14px 0", letterSpacing: "0.04em",
          }}>{l === "" ? "\u00A0" : l}</div>
        ))}
      </div>
      <Grade />
    </AbsoluteFill>
  );
};
