/**
 * S7 · 1:20–1:35 (f0–450) · Paper-cut #2: MOSCOW 2008 — mưa, penalty, flash trắng.
 * Assemble: nền sân mưa đêm -> P3 plate đặt lên (bounce-settle) -> slow-mo penalty -> flash trắng tại beat.
 * T13 (assemble + particle layer) · T8 (speed ramping, frame chậm nhất đúng beat)
 * T9 (flash trắng + impact frame) · T16 (im lặng 0.3s trước cú sút = silence→payoff mini) · T20.
 * Grammar riêng: particle + slow-mo. Camera: Flowing + Brisk · Urgency.
 */
import React from "react";
import { AbsoluteFill, interpolate, staticFile} from "remotion";
import { COLORS, ImpactFlash } from "../components/Grade";
import { Stamp } from "../components/KineticText";
import { expoOut, power3Out, sineInOut, springIOS } from "../motion/eases";
import { Dust, PaperGrain, Rain, paperShadow, q10, nearestBeatGlobalFrame } from "./teamA-helpers";

const START = 2400;
const DUR = 450;
// cú sút rơi đúng beat nhạc gần nhất (T1)
const KICK_LOCAL = nearestBeatGlobalFrame(START + 360) - START;
// tâm zoom: quả bóng vàng trong P3 (screen coords)
const BALL_CX = 1090;
const BALL_CY = 1030;

const S7: React.FC<{ frame: number }> = ({ frame }: { frame: number }) => {
  const f = Math.max(0, Math.min(DUR, frame));
  const qf = q10(f);

  // plate đặt lên f40–100
  const plateP = springIOS(Math.max(0, Math.min(1, (f - 40) / 60)));
  const plateY = interpolate(Math.max(0, Math.min(1, (f - 40) / 60)), [0, 1], [230, 0]);
  // slow push-in vào bóng f100 -> kick (decelerate vào beat: speed ramp 100%->25%)
  const pushRaw = Math.max(0, Math.min(1, (qf - 100) / Math.max(1, KICK_LOCAL - 100)));
  const pushS = 1 + 0.3 * sineInOut(pushRaw);
  // sau cú sút: giữ zoom + net shake decay 40f
  const sinceKick = f - KICK_LOCAL;
  const netShake = sinceKick >= 0 && sinceKick < 44 ? 16 * Math.exp(-0.14 * sinceKick) * Math.sin(sinceKick * 0.9) : 0;
  // micro-silence 0.3s trước cú sút: dip sáng
  const dip = sinceKick >= -9 && sinceKick < 0 ? 0.3 * Math.sin(((sinceKick + 9) / 9) * Math.PI) : 0;
  // bóng bay vào lưới f kick -> kick+28 (tăng tốc, stop-motion)
  const flyP = Math.max(0, Math.min(1, (qf - KICK_LOCAL) / 28));
  const flyE = flyP * flyP; // accelerate
  const shotX = interpolate(flyE, [0, 1], [BALL_CX, 1640]);
  const shotY = interpolate(flyE, [0, 1], [BALL_CY, 690]) - 160 * Math.sin(flyE * Math.PI);

  return (
    <AbsoluteFill style={{ backgroundColor: "#07070c", overflow: "hidden" }}>
      {/* nền sân mưa đêm */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, #05050a 0%, #0b0d18 50%, #120a10 100%)",
        }}
      />
      {/* stadium glow xa */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "30%",
          width: 1200,
          height: 500,
          transform: "translate(-50%,-50%)",
          background: "radial-gradient(ellipse, rgba(120,140,200,0.14) 0%, rgba(0,0,0,0) 70%)",
        }}
      />
      {/* mưa 200 hạt (seeded) */}
      <Rain frame={f} count={200} seed={77} opacity={0.55} slant={0.22} />

      {/* P3 plate: đặt lên như tờ giấy */}
      {plateP > 0 && (
        <div
          style={{
            position: "absolute",
            inset: -60,
            transform: `translate(${-0 + netShake}px, ${plateY}px)`,
            ...paperShadow(34),
            opacity: plateP,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              transform: `translate(${BALL_CX - BALL_CX * pushS}px, ${BALL_CY - BALL_CY * pushS}px) scale(${pushS})`,
              transformOrigin: "0 0",
              filter: "saturate(0.95) contrast(1.05)",
            }}
          >
            <img
              src={staticFile("v6/assets/p3-rain-penalty.png")}
              draggable={false}
              style={{ width: "100%", height: "100%", objectFit: "cover", userSelect: "none" }}
            />
          </div>
        </div>
      )}

      {/* bóng sút vào lưới (vẽ tay gold, stop-motion) */}
      {flyP > 0 && (
        <div
          style={{
            position: "absolute",
            left: shotX - 34,
            top: shotY - 34,
            width: 68,
            height: 68,
            borderRadius: "50%",
            background: "radial-gradient(circle at 35% 30%, #f5d67b, #d4a017 60%, #8a6410)",
            boxShadow: "0 0 30px rgba(212,160,23,0.7)",
          }}
        />
      )}
      {/* speed lines vẽ tay khi bóng bay */}
      {flyP > 0 && flyP < 1 && (
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M${BALL_CX - 60},${BALL_CY - 40 + i * 46} Q${(BALL_CX + shotX) / 2},${(BALL_CY + shotY) / 2 + i * 40} ${shotX - 40},${shotY + i * 40}`}
              fill="none"
              stroke={COLORS.goldLight}
              strokeWidth={5}
              strokeLinecap="round"
              strokeDasharray="18 14"
              opacity={0.7}
            />
          ))}
        </svg>
      )}

      {/* flash trắng tại beat + impact frame */}
      <ImpactFlash atFrame={KICK_LOCAL + START} dur={2} />
      {dip > 0 && <div style={{ position: "absolute", inset: 0, backgroundColor: "#000", opacity: dip }} />}

      {/* text */}
      <div style={{ position: "absolute", left: 140, top: 110 }}>
        {f >= 120 && <Stamp text="MOSCOW · 2008" atFrame={120 + START} fontSize={68} color={COLORS.ivory} rotate={-2} />}
      </div>

      {/* secondary/ambient */}
      <PaperGrain opacity={0.12} />
      <Dust frame={f} count={24} seed={17} color="180,200,220" />
    </AbsoluteFill>
  );
};

export default S7;
