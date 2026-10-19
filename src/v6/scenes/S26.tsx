/**
 * S26 · 4:46–5:04 (f8580–9120, 540f) — VS split-screen: ATLETICO vs BAYERN.
 * Spec: TREATMENT_V6.md §1 S26. T14·T3·T4·T12·T13·T20.
 * Số liệu: STATS_VERIFIED.md §4–5 (25/35 + 4 hat-trick · 9/8).
 * Luật phân tầng đọc: label + 1 dòng hero 100%; annotation stagger 1.5s, mỗi cái 100% 1.5s → 40%.
 */
import React from "react";
import { AbsoluteFill, interpolate, Img, staticFile } from "remotion";
import { COLORS, GoldHalo, ImpactFlash } from "../components/Grade";
import { CharSlam, Stamp } from "../components/KineticText";
import { GoldDust, WhipStreak } from "../components/TeamC";
import { expoOut, power3Out, springSnappy } from "../motion/eases";

const START = 8580;
const VS_AT = 90; // 4:49 "VS" slam
const DIP0 = 315; // 4:56.5 dip 1s
const DIP1 = 345; // 4:57.5
const BAYERN_AT = 345; // 4:57.5
const REF_AT = 480; // 5:02 silhouette referee
const WHIP_AT = 505; // exit whip

const Anno: React.FC<{
  text: string;
  at: number; // local frame when it appears
  f: number;
  top: number;
  left: number;
  width: number;
  size?: number;
}> = ({ text, at, f, top, left, width, size = 44 }) => {
  if (f < at) return null;
  const op = interpolate(f, [at + 45, at + 63], [1, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const p = Math.max(0, Math.min(1, (f - at) / 12));
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width,
        opacity: op,
        transform: `translateY(${(1 - springSnappy(p)) * 26}px)`,
        fontFamily: "Inter, sans-serif",
        fontWeight: 600,
        fontSize: size,
        letterSpacing: "0.05em",
        color: COLORS.ivory,
      }}
    >
      {text}
    </div>
  );
};

const Half: React.FC<{
  f: number;
  side: "left" | "right";
  club: string;
  stat: string; // one-line hero stat
  annos: { text: string; at: number }[];
  barMax: number;
  barVal: number;
  enterAt: number;
}> = ({ f, side, club, stat, annos, barMax, barVal, enterAt }) => {
  const ex = Math.max(0, Math.min(1, (f - enterAt) / 16));
  const ee = springSnappy(ex);
  const x = side === "left" ? 90 : 1010;
  const dirIn = side === "left" ? -1 : 1;
  const barP = power3Out(Math.max(0, Math.min(1, (f - enterAt - 14) / 70)));
  const barW = 760 * (barVal / barMax);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: 0,
        width: 820,
        height: 1080,
        opacity: ex,
        transform: `translateX(${(1 - ee) * 120 * dirIn}px)`,
      }}
    >
      <div
        style={{
          marginTop: 210,
          fontFamily: "Anton, sans-serif",
          fontSize: 120,
          letterSpacing: "0.05em",
          color: COLORS.ivory,
        }}
      >
        {club}
      </div>
      <div
        style={{
          fontFamily: "Anton, sans-serif",
          fontVariantNumeric: "tabular-nums",
          fontSize: 96,
          color: COLORS.goldLight,
          textShadow: "0 0 44px rgba(212,160,23,0.4)",
        }}
      >
        {stat}
      </div>
      {/* gold bar vs baseline */}
      <div style={{ marginTop: 34, position: "relative", height: 40 }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 60,
            top: 16,
            height: 8,
            background: "#3a3a40",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 8,
            height: 24,
            width: barW,
            background: "linear-gradient(90deg, #8a5f0c, #f5d67b)",
            boxShadow: "0 0 44px rgba(212,160,23,0.55)",
            transformOrigin: "left",
            transform: `scaleX(${barP})`,
          }}
        />
      </div>
      {annos.map((a) => (
        <Anno
          key={a.text}
          text={a.text}
          at={a.at}
          f={f}
          top={650 + annos.indexOf(a) * 130}
          left={0}
          width={800}
        />
      ))}
    </div>
  );
};

const S26: React.FC<{ frame: number }> = ({ frame }) => {
  const f = frame;

  // dip 1s: darken + freeze (R1B-7)
  const dip = f >= DIP0 && f < DIP1 ? 1 : 0;
  const dipOp = interpolate(f, [DIP0, DIP0 + 8, DIP1 - 8, DIP1], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // exit whip
  const whipP = Math.max(0, Math.min(1, (f - WHIP_AT) / 35));

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 40%, #180f0a 0%, #0e0a07 55%, #0d0d0f 100%)",
        overflow: "hidden",
      }}
    >
      <GoldDust frame={f} seed={26} count={30} />

      {/* breathing 3s (f0–90): near-black, silhouette + halo + grain only */}
      {f < VS_AT + 10 && (
        <div
          style={{
            opacity: interpolate(f, [0, 20, VS_AT - 14, VS_AT + 10], [0, 1, 1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <GoldHalo size={700} opacity={0.4} />
          <Img
            src={staticFile("v6/assets/sil-cr7-entry.png")}
            style={{
              position: "absolute",
              left: 760,
              top: 190,
              width: 400,
              opacity: 0.92,
              filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.6))",
            }}
          />
        </div>
      )}

      {/* VS slam (T3) */}
      {f >= VS_AT && (
        <CharSlam
          text="VS"
          atFrame={START + VS_AT}
          fontSize={340}
          color={COLORS.goldLight}
          staggerMs={60}
          scaleFrom={8}
          style={{
            position: "absolute",
            top: 60,
            left: 0,
            right: 0,
            textShadow: "0 0 90px rgba(212,160,23,0.5)",
            opacity: interpolate(f, [VS_AT, VS_AT + 110], [1, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        />
      )}
      <ImpactFlash atFrame={START + VS_AT + 2} dur={2} />

      {/* divider */}
      {f >= VS_AT && (
        <div
          style={{
            position: "absolute",
            left: 958,
            top: 120,
            bottom: 120,
            width: 4,
            background: `linear-gradient(to bottom, transparent, ${COLORS.gold} 20%, ${COLORS.gold} 80%, transparent)`,
            opacity: interpolate(f, [VS_AT, VS_AT + 30], [0, 0.85], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        />
      )}

      {/* ATLETICO half */}
      {f >= VS_AT + 10 && (
        <Half
          f={f}
          side="left"
          club="ATLETICO"
          stat="25 BÀN / 35 TRẬN"
          barMax={35}
          barVal={25}
          enterAt={VS_AT + 10}
          annos={[
            { text: "4 HAT-TRICK", at: VS_AT + 55 },
            { text: "GHI BÀN 2 TRẬN CHUNG KẾT (2014 · 2016)", at: VS_AT + 100 },
          ]}
        />
      )}

      {/* BAYERN half */}
      {f >= BAYERN_AT && (
        <Half
          f={f}
          side="right"
          club="BAYERN"
          stat="9 BÀN / 8 TRẬN"
          barMax={35}
          barVal={9}
          enterAt={BAYERN_AT}
          annos={[
            { text: "TẠI CHAMPIONS LEAGUE", at: BAYERN_AT + 45 },
            { text: "5 BÀN TRONG 2 LƯỢT TỨ KẾT 2016/17", at: BAYERN_AT + 90 },
          ]}
        />
      )}
      <ImpactFlash atFrame={START + BAYERN_AT + 2} dur={2} />

      {/* dip overlay */}
      {dipOp > 0 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#000",
            opacity: dipOp * 0.45,
          }}
        />
      )}

      {/* referee silhouette (T13) */}
      {f >= REF_AT && (
        <Img
          src={staticFile("v6/assets/sil-cr7-stand.png")}
          style={{
            position: "absolute",
            left: 800,
            top: 150,
            width: 320,
            opacity: interpolate(f, [REF_AT, REF_AT + 24], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            transform: `translateY(${interpolate(
              springSnappy(Math.max(0, Math.min(1, (f - REF_AT) / 20))),
              [0, 1],
              [60, 0]
            )}px)`,
            filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.65))",
          }}
        />
      )}

      {/* exit whip → S27 (T5) */}
      {f >= WHIP_AT && <WhipStreak progress={whipP} dir={1} height={110} />}
    </AbsoluteFill>
  );
};

export default S26;
