/**
 * S25 · 4:30–4:46 (f8100–8580, 480f) — 4 kỷ lục C1 kể chuyện.
 * Spec: TREATMENT_V6.md §1 S25. T4·T3·T14·T13·T18·T20.
 * Luật phân tầng đọc: 1 thời điểm chỉ 1 text hero 100%; annotation →40% sau 1.5s.
 * Số liệu: STATS_VERIFIED.md §9 (11 · 67 · 3 · 10).
 */
import React from "react";
import { AbsoluteFill, interpolate, Img, staticFile } from "remotion";
import { COLORS, GoldHalo, ImpactFlash } from "../components/Grade";
import { Stamp, Counter } from "../components/KineticText";
import { GoldDust } from "../components/TeamC";
import { expoOut, power3Out, springSnappy } from "../motion/eases";

const START = 8100;
const BEAT = 120; // 4s per beat

type BeatSpec = {
  num: number;
  unit: string;
  anno: string;
  word: string;
  max: number;
};
const BEATS: BeatSpec[] = [
  { num: 11, unit: "TRẬN LIÊN TIẾP", anno: "6/2017 → 4/2018", word: "KHÔNG AI CẢN NỔI", max: 11 },
  { num: 67, unit: "BÀN KNOCK-OUT", anno: "NHIỀU NHẤT LỊCH SỬ", word: "SINH RA CHO TRẬN LỚN", max: 67 },
  { num: 3, unit: "TRẬN CHUNG KẾT", anno: "2008 · 2014 · 2017", word: "DUY NHẤT", max: 11 },
  { num: 10, unit: "BÀN VS 1 CLB", anno: "VS JUVENTUS · 7 TRẬN", word: "NỖI ÁM ẢNH THÀNH TURIN", max: 67 },
];
// hero strings (approved §2): "11 TRẬN LIÊN TIẾP" / "67 BÀN KNOCK-OUT" /
// "GHI BÀN 3 TRẬN CHUNG KẾT" (beat 3 unit renders "GHI BÀN" + counter + "TRẬN CHUNG KẾT") /
// "10 BÀN VS 1 CLB"

// silhouette stations (left → right), pauses then walks during wipe
const STX = [90, 260, 430, 600];

const Beat: React.FC<{ i: number; spec: BeatSpec; f: number }> = ({ i, spec, f }) => {
  const bf = f - i * BEAT; // local beat frame
  if (bf < -20 || bf > BEAT + 20) return null;

  // wipe in/out (paper edge)
  const wipeIn = interpolate(bf, [-20, 14], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: power3Out,
  });
  const wipeOut = interpolate(bf, [BEAT - 18, BEAT + 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: power3Out,
  });
  const slide = (wipeIn - wipeOut) * 900;

  // layering law: 0–45f counter hero 100%; at 45f annotation→40%, counter→40% scale .7, word-focus hero
  const dim = interpolate(bf, [40, 58], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const heroOp = 1 - dim * 0.6; // counter 100% → 40%
  const heroScale = 1 - dim * 0.3; // → 70%
  const annoOp = 1 - dim * 0.6; // annotation 100% → 40%
  const wordP = Math.max(0, Math.min(1, (bf - 45) / 16));
  const wordOp = wordP;
  const wordScale = interpolate(springSnappy(wordP), [0, 1], [2.2, 1]);

  // counter slam entrance
  const slamP = Math.max(0, Math.min(1, bf / 14));
  const slam = interpolate(springSnappy(slamP), [0, 1], [6, 1]);

  // mini bar
  const barP = power3Out(Math.max(0, Math.min(1, bf / 50)));

  const numX = 1230;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: `translateX(${slide}px)`,
        opacity: 1 - Math.max(wipeIn, wipeOut) * 0.0,
      }}
    >
      {/* torn paper edge at wipe */}
      {(wipeIn > 0 && wipeIn < 1) || (wipeOut > 0 && wipeOut < 1) ? (
        <div
          style={{
            position: "absolute",
            left: wipeIn > wipeOut ? 1920 * (1 - wipeIn) - 40 : 1920 * wipeOut - 40,
            top: -40,
            width: 90,
            height: 1160,
            background: `linear-gradient(90deg, transparent, ${COLORS.gold} 55%, #fff 100%)`,
            filter: "blur(3px)",
            opacity: 0.85,
          }}
        />
      ) : null}

      {/* halo on DUY NHẤT beat (T18) */}
      {i === 2 && (
        <div style={{ position: "absolute", left: 560, top: 120 }}>
          <GoldHalo size={760} opacity={0.42} />
        </div>
      )}

      {/* counter hero */}
      <div
        style={{
          position: "absolute",
          left: numX - 330,
          top: 170,
          width: 660,
          textAlign: "center",
          opacity: heroOp,
          transform: `scale(${slam * heroScale})`,
        }}
      >
        {i === 2 && (
          <div
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: 800,
              fontSize: 54,
              letterSpacing: "0.14em",
              color: COLORS.ivory,
              opacity: heroOp,
            }}
          >
            GHI BÀN
          </div>
        )}
        <Counter
          from={0}
          to={spec.num}
          atFrame={START + i * BEAT + 4}
          durFrames={44}
          fontSize={360}
          color={i === 2 ? COLORS.goldLight : COLORS.ivory}
        />
        <div
          style={{
            fontFamily: "Anton, sans-serif",
            fontSize: 72,
            letterSpacing: "0.1em",
            color: i === 2 ? COLORS.goldLight : COLORS.gold,
            marginTop: -14,
          }}
        >
          {spec.unit}
        </div>
        {/* annotation (100% → 40%) */}
        <div
          style={{
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            fontSize: 46,
            letterSpacing: "0.08em",
            color: COLORS.ivory,
            opacity: annoOp,
            marginTop: 18,
          }}
        >
          {spec.anno}
        </div>
        {/* mini bar vs grayscale baseline (T14) */}
        <div style={{ marginTop: 26, position: "relative", height: 26 }}>
          <div
            style={{
              position: "absolute",
              left: 30,
              right: 30,
              top: 10,
              height: 6,
              background: "#3a3a40",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 30,
              top: 4,
              height: 18,
              width: (600 * spec.num) / spec.max,
              background: "linear-gradient(90deg, #8a5f0c, #f5d67b)",
              boxShadow: "0 0 34px rgba(212,160,23,0.5)",
              transformOrigin: "left",
              transform: `scaleX(${barP})`,
            }}
          />
        </div>
      </div>

      {/* narrative word-focus (hero after 1.5s) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 815,
          textAlign: "center",
          opacity: wordOp,
          transform: `scale(${wordScale})`,
        }}
      >
        <span
          style={{
            fontFamily: "Anton, sans-serif",
            fontSize: 104,
            letterSpacing: "0.06em",
            color: COLORS.goldLight,
            textShadow: "0 0 60px rgba(212,160,23,0.45)",
          }}
        >
          {spec.word}
        </span>
      </div>
    </div>
  );
};

const S25: React.FC<{ frame: number }> = ({ frame }) => {
  const f = frame;
  const q = Math.floor(f / 3) * 3; // stop-motion (T13)

  // silhouette walk: pause at station during beat, walk during wipe
  const beatI = Math.max(0, Math.min(3, Math.floor(f / BEAT)));
  const bf = f - beatI * BEAT;
  const walking = bf > BEAT - 22 || (beatI > 0 && bf < 8);
  const fromX = STX[Math.max(0, beatI - (bf < 8 ? 1 : 0))];
  const toX = STX[Math.min(3, beatI + (bf > BEAT - 22 ? 1 : 0))];
  const wp = walking
    ? power3Out(
        Math.max(0, Math.min(1, (bf > BEAT - 22 ? bf - (BEAT - 22) : bf + 22) / 30))
      )
    : 1;
  const silX = interpolate(wp, [0, 1], [fromX, toX]);
  // stop-motion bob while walking
  const bob = walking ? Math.abs(Math.sin((q / 3) * Math.PI * 0.9)) * -16 : 0;

  // beat index for silhouette opacity (fade at scene edges)
  const edgeOp = interpolate(f, [0, 18, 462, 480], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 40%, #1e150a 0%, #100c07 50%, #0d0d0f 100%)",
        overflow: "hidden",
      }}
    >
      <GoldDust frame={f} seed={25} count={36} />
      {BEATS.map((spec, i) => (
        <Beat key={i} i={i} spec={spec} f={f} />
      ))}
      <ImpactFlash atFrame={START + 6} dur={2} />
      <ImpactFlash atFrame={START + BEAT + 6} dur={2} />
      <ImpactFlash atFrame={START + 2 * BEAT + 6} dur={2} />
      <ImpactFlash atFrame={START + 3 * BEAT + 6} dur={2} />

      {/* narrator silhouette (T13 stop-motion): crop 1 of 3 walk poses, feathered edges */}
      <div style={{ opacity: edgeOp }}>
        <div
          style={{
            position: "absolute",
            left: silX - 140,
            top: 330 + bob,
            width: 280,
            height: 560,
            overflow: "hidden",
            filter: "drop-shadow(0 16px 26px rgba(0,0,0,0.6))",
            WebkitMaskImage:
              "radial-gradient(ellipse 78% 78% at 50% 50%, black 62%, transparent 98%)",
            maskImage:
              "radial-gradient(ellipse 78% 78% at 50% 50%, black 62%, transparent 98%)",
          }}
        >
          <Img
            src={staticFile("v6/assets/sil-cr7-walk-3poses.png")}
            style={{
              position: "absolute",
              left: -(walking ? Math.floor(q / 18) % 3 : 0) * 280,
              top: 0,
              width: 840,
              maxWidth: "none",
            }}
          />
        </div>
      </div>

      {/* progress thread: 4 nodes (secondary layer) */}
      <div
        style={{
          position: "absolute",
          left: 120,
          right: 120,
          bottom: 64,
          height: 4,
          background: "#2c2c30",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: `${(f / 480) * 100}%`,
            background: COLORS.gold,
            boxShadow: "0 0 18px rgba(212,160,23,0.6)",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

export default S25;
