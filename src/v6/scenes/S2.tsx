/**
 * S2 · 0:18–0:33 (f0–450) · Tuổi thơ — paper-cut assemble back-to-front.
 * T13 (assemble + stop-motion + micro-motion) · T3 (flying text, word-focus)
 * T12 (parallax 3 lớp, camera drift chậm) · T18 (grade + grain unify) · T20.
 * Camera: Motivated + Calm · Archetype Elegance.
 * Biên S1→S2: cậu bé rút thành giấy -> paper assemble dựng quanh cậu.
 */
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS } from "../components/Grade";
import { Stamp } from "../components/KineticText";
import { expoOut, power3Out, sineInOut, springIOS, springSnappy } from "../motion/eases";
import { CropImg, Dust, PaperGrain, paperShadow, q10 } from "./teamA-helpers";

const START = 540;
const DUR = 450;

/** flying word: per-word wave entrance (handwritten feel) */
const FlyingWord: React.FC<{ text: string; atFrame: number; fontSize?: number; color?: string; style?: React.CSSProperties }> = ({
  text, atFrame, fontSize = 54, color = COLORS.ivory, style,
}) => {
  const words = text.split(" ");
  return (
    <div style={{ display: "flex", gap: "0.35em", ...style }}>
      {words.map((w, i) => (
        <FlyChar key={i} text={w} atFrame={atFrame} index={i} fontSize={fontSize} color={color} />
      ))}
    </div>
  );
};
const FlyChar: React.FC<{ text: string; atFrame: number; index: number; fontSize: number; color: string }> = ({
  text, atFrame, index, fontSize, color,
}) => {
  const gf = useCurrentFrame();
  const local = gf - atFrame - index * 3; // stagger 3f per word
  const p = Math.max(0, Math.min(1, local / 18));
  const e = springSnappy(p);
  const x = interpolate(e, [0, 1], [-260, 0]);
  const rot = interpolate(e, [0, 1], [-14, 0]);
  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: "Inter, sans-serif",
        fontStyle: "italic",
        fontWeight: 700,
        fontSize,
        color,
        transform: `translateX(${x}px) rotate(${rot}deg)`,
        opacity: p > 0 ? 1 : 0,
        whiteSpace: "pre",
      }}
    >
      {text}
    </span>
  );
};

const S2: React.FC<{ frame: number }> = ({ frame }: { frame: number }) => {
  const f = Math.max(0, Math.min(DUR, frame));
  const qf = q10(f);

  // assemble timeline (stop-motion quantized)
  const bgP = springIOS(Math.max(0, Math.min(1, qf / 60)));
  const pathP = Math.max(0, Math.min(1, (qf - 60) / 80)); // dirt path draws
  const boyP = springIOS(Math.max(0, Math.min(1, (qf - 140) / 50))); // boy bounce-settle
  const boyMicro = boyP >= 1 ? 6 * Math.sin(((qf - 190) / 30) * Math.PI * 2) * Math.exp(-((qf - 190) / 90)) : 0; // micro-motion after settle
  const lineP = Math.max(0, Math.min(1, (f - 330) / 60)); // đường chạy vẽ dở (60%, heading up-right)
  // parallax drift 3 lớp
  const driftBg = interpolate(f, [0, DUR], [0, 46], { easing: sineInOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const driftMid = interpolate(f, [0, DUR], [0, 110], { easing: sineInOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const driftFg = interpolate(f, [0, DUR], [0, 190], { easing: sineInOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const pathLen = 900;
  const lineLen = 1100;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black, overflow: "hidden" }}>
      {/* LỚP NỀN (0.2x): trời đêm + đồi Funchal paper */}
      <div style={{ position: "absolute", inset: -80, transform: `translateX(${-driftBg}px) scale(${0.94 + 0.06 * bgP})`, opacity: bgP }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, #0a0a10 0%, #141020 55%, #241016 100%)",
          }}
        />
        <svg viewBox="0 0 1920 700" preserveAspectRatio="none" style={{ position: "absolute", bottom: 0, width: "100%", height: 700 }}>
          <path d="M0,700 L0,420 Q300,320 640,380 T1280,340 T1920,400 L1920,700 Z" fill="#171318" />
          <path d="M0,700 L0,520 Q420,440 820,500 T1600,470 L1920,520 L1920,700 Z" fill="#231a16" opacity="0.95" />
          {/* red ground strip (echo P1 red ground) */}
          <path d="M0,700 L0,640 Q480,600 960,630 T1920,620 L1920,700 Z" fill={COLORS.redDeep} opacity="0.85" />
        </svg>
        {/* paper moon */}
        <div
          style={{
            position: "absolute",
            right: 300,
            top: 130,
            width: 130,
            height: 130,
            borderRadius: "50%",
            background: "radial-gradient(circle at 38% 35%, #f5ead0, #cbb98f 70%, #a8946a)",
            boxShadow: "0 0 90px rgba(245,234,208,0.28)",
          }}
        />
      </div>

      {/* LỚP LÓT (0.6x): đường đất vẽ dần */}
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0, transform: `translateX(${-driftMid}px)`, opacity: pathP > 0 ? 1 : 0 }}
      >
        <path
          d="M240,1010 C520,900 700,860 980,880 C1240,898 1420,820 1660,760"
          fill="none"
          stroke="#5a4632"
          strokeWidth={54}
          strokeLinecap="round"
          strokeDasharray={pathLen}
          strokeDashoffset={pathLen * (1 - expoOut(pathP))}
          opacity={0.9}
        />
        <path
          d="M240,1010 C520,900 700,860 980,880 C1240,898 1420,820 1660,760"
          fill="none"
          stroke="#7a5f42"
          strokeWidth={10}
          strokeDasharray="26 20"
          strokeDashoffset={-f * 0.4}
          opacity={0.55}
        />
      </svg>

      {/* LỚP HERO (1.2x): cậu bé quét đường (P1 pose 1) bounce-settle + bóng đổ */}
      <div
        style={{
          position: "absolute",
          left: 620 + driftFg * 0.4,
          bottom: 150 + boyMicro,
          transform: `scale(${Math.max(0.001, boyP)}) rotate(-1.5deg)`,
          transformOrigin: "50% 100%",
          ...paperShadow(26),
          opacity: boyP > 0 ? 1 : 0,
        }}
      >
        <CropImg
          src="/v6/assets/p1-boy-madeira-3poses.png"
          nativeW={1920}
          nativeH={1280}
          cx={10}
          cy={230}
          cw={620}
          ch={890}
          h={620}
        />
      </div>

      {/* stamp "NGHÈO" mực đỏ lệch 3° */}
      <div style={{ position: "absolute", left: 1330, top: 300 }}>
        <Stamp text="NGHÈO" atFrame={220 + START} fontSize={92} color="#c0392b" rotate={-3} />
      </div>

      {/* flying text: "KHÔNG AI CHO CẬU ẤY GÌ CẢ." */}
      <div style={{ position: "absolute", left: 150, top: 180 }}>
        {f >= 250 && (
          <FlyingWord text="KHÔNG AI CHO CẬU ẤY GÌ CẢ." atFrame={250 + START} fontSize={58} color={COLORS.ivory} />
        )}
      </div>

      {/* đường chạy vẽ dở hướng lên (handoff S3) */}
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, opacity: lineP > 0 ? 1 : 0 }}>
        <path
          d="M1150,700 C1300,640 1380,540 1450,430 C1490,360 1520,310 1560,250"
          fill="none"
          stroke={COLORS.gold}
          strokeWidth={9}
          strokeLinecap="round"
          strokeDasharray="30 18"
          strokeDashoffset={lineLen * (1 - expoOut(lineP)) - f * 0.6}
          opacity={0.9}
        />
        {/* đầu bút chì đang vẽ */}
        <circle
          cx={1150 + (1560 - 1150) * expoOut(lineP)}
          cy={700 + (250 - 700) * expoOut(lineP)}
          r={10}
          fill={COLORS.goldLight}
          opacity={lineP < 1 ? 0.95 : 0}
        />
      </svg>

      {/* đáp lại cuối scene: "CẬU ẤY LẤY TẤT CẢ." stamp gold */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 210, display: "flex", justifyContent: "center" }}>
        <Stamp text="CẬU ẤY LẤY TẤT CẢ." atFrame={380 + START} fontSize={76} color={COLORS.gold} rotate={1.5} />
      </div>

      {/* secondary/ambient */}
      <PaperGrain opacity={0.12} />
      <Dust frame={f} count={30} seed={12} />
    </AbsoluteFill>
  );
};

export default S2;
