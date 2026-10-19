/**
 * S28 · 5:17–5:30 (f9510–9900, 390f) — Signature moves 3–4: ẢNH BÁO CHÍ + ĐỒNG HỒ MORPH → SIL-2.
 * Spec: TREATMENT_V6.md §1 S28 + style frame SF-S28-M4 (bắt buộc theo đúng).
 * T13·T14·T3·T16·T17·T19·T20·T5. Số liệu: STATS_VERIFIED.md §4 (penalty 120' 2014 · luân lưu 2016).
 */
import React from "react";
import { AbsoluteFill, interpolate, Img, staticFile } from "remotion";
import { COLORS, GoldHalo, ImpactFlash } from "../components/Grade";
import { CharSlam, Stamp } from "../components/KineticText";
import { GoldDust, PaperParticles } from "../components/TeamC";
import { expoOut, power3Out, springSnappy } from "../motion/eases";

const START = 9510;
const M4_AT = 195; // 5:23.5
const STAMP_2014 = 240; // 5:25 — stamp + freeze-frame penalty 2014
const STAMP_2016 = 285; // 5:26.5 — stamp + strobe 2016
const SIL2_AT = 330; // 5:28

// typewriter caption
const TypeCaption: React.FC<{ text: string; at: number; f: number }> = ({ text, at, f }) => {
  const n = Math.max(0, Math.min(text.length, Math.floor((f - at) / 2)));
  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        fontWeight: 700,
        fontSize: 46,
        letterSpacing: "0.18em",
        color: COLORS.ivory,
      }}
    >
      {text.slice(0, n)}
      <span style={{ opacity: (f % 16) < 8 ? 1 : 0 }}>▌</span>
    </div>
  );
};

// mini pitch SVG (draw-on) — 960 box, replaces the clock in place (morph)
const MiniPitch: React.FC<{ progress: number }> = ({ progress }) => {
  const p = Math.max(0, Math.min(1, progress));
  const dash = (len: number) => ({
    strokeDasharray: len,
    strokeDashoffset: len * (1 - expoOut(p)),
  });
  return (
    <svg
      style={{ position: "absolute", left: 120, top: 60, overflow: "visible" }}
      width={960}
      height={960}
    >
      <rect x={230} y={180} width={500} height={420} fill="none" stroke="#e8dcc8" strokeWidth={14} {...dash(1840)} />
      <rect x={405} y={180} width={150} height={150} fill="none" stroke="#e8dcc8" strokeWidth={10} {...dash(600)} />
      <path d="M 405 480 A 110 110 0 0 0 555 480" fill="none" stroke="#e8dcc8" strokeWidth={10} {...dash(380)} />
      <circle cx={480} cy={405} r={22} fill={COLORS.gold} opacity={p} style={{ filter: "drop-shadow(0 0 26px rgba(212,160,23,0.9))" }} />
    </svg>
  );
};

const S28: React.FC<{ frame: number }> = ({ frame }) => {
  const f = frame;

  // ---- M3: press photo (f0–195) ----
  const photoIn = springSnappy(Math.max(0, Math.min(1, f / 22)));
  const photoOut = interpolate(f, [M4_AT, M4_AT + 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: expoOut,
  });
  const photoScale = interpolate(f, [0, M4_AT], [1, 1.07], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: expoOut,
  });

  // ---- M4: clock panel ----
  const clockIn = interpolate(f, [M4_AT, M4_AT + 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: power3Out,
  });
  // clock MORPHS into mini pitch in place (f225–260, T6)
  const morphP = interpolate(f, [225, 260], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: expoOut,
  });
  const clockScale = 1 - morphP * 0.72;
  const clockOp = 1 - morphP;

  // hand draws line (f205–228), then pitch draws itself
  const handP = interpolate(f, [205, 228], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: expoOut,
  });

  // strobe 3 poses penalty (f285–297)
  const strobeI = f >= STAMP_2016 && f < STAMP_2016 + 12 ? Math.floor((f - STAMP_2016) / 4) % 2 : 0;

  // SIL-2: slow-down + dissolve (f330–390)
  const sil2p = Math.max(0, Math.min(1, (f - SIL2_AT) / 60));
  const dimAll = interpolate(f, [SIL2_AT, SIL2_AT + 30], [0, 0.55], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // RETURN silhouette: enters f285–305, dissolves f360–386
  const retIn = springSnappy(Math.max(0, Math.min(1, (f - STAMP_2016) / 20)));
  const retX = interpolate(retIn, [0, 1], [2050, 1180]);
  const retScale = 0.5 + interpolate(f, [305, 322], [0, 0.28], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: expoOut });
  const retOp = interpolate(f, [360, 386], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // P9 circle forms f368–390
  const circP = springSnappy(Math.max(0, Math.min(1, (f - 368) / 22)));

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 42%, #171310 0%, #0e0c0a 55%, #0d0d0f 100%)",
        overflow: "hidden",
      }}
    >
      <GoldDust frame={f} seed={28} count={30} />

      {/* ================= M3: press photo (f0–195) ================= */}
      {f < M4_AT + 22 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 1 - photoOut,
            transform: `translateX(${-photoOut * 500}px)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 960 - 750,
              top: 60,
              width: 1500,
              transform: `rotate(${(1 - photoIn) * -4}deg) scale(${photoIn * photoScale})`,
              transformOrigin: "50% 20%",
              filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.7))",
            }}
          >
            <Img
              src={staticFile("v6/assets/p13-press-photo-header.png")}
              style={{ width: "100%" }}
            />
          </div>
          {/* caption typewriter */}
          <div style={{ position: "absolute", left: 0, right: 0, top: 890, textAlign: "center" }}>
            <TypeCaption text="ĐÁNH ĐẦU · MADRID 2013" at={34} f={f} />
          </div>
          {f >= 112 && (
            <CharSlam
              text="KHÔNG ĂN MỪNG"
              atFrame={START + 112}
              fontSize={104}
              color={COLORS.goldLight}
              staggerMs={44}
              scaleFrom={6}
              style={{
                position: "absolute",
                top: 950,
                left: 0,
                right: 0,
                textShadow: "0 0 50px rgba(212,160,23,0.45)",
              }}
            />
          )}
          <ImpactFlash atFrame={START + 114} dur={2} />
        </div>
      )}

      {/* ================= M4: clock morph (f195–330) ================= */}
      {f >= M4_AT && sil2p < 0.9 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: clockIn * (1 - dimAll),
          }}
        >
          {/* clock panel (P14 left crop) — morphs into pitch */}
          <div
            style={{
              position: "absolute",
              left: 120,
              top: 60,
              width: 960,
              height: 960,
              overflow: "hidden",
              transform: `scale(${clockScale})`,
              transformOrigin: "480px 480px",
              opacity: clockOp,
              filter: "drop-shadow(0 24px 50px rgba(0,0,0,0.65))",
            }}
          >
            <Img
              src={staticFile("v6/assets/p14-penalty-clock.png")}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: 1920,
                maxWidth: "none",
              }}
            />
            {/* 120:00 on the face */}
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 700,
                textAlign: "center",
                fontFamily: "Inter, sans-serif",
                fontWeight: 800,
                fontSize: 84,
                letterSpacing: "0.1em",
                color: COLORS.ivory,
                textShadow: "0 4px 24px rgba(0,0,0,0.8)",
                opacity: interpolate(f, [M4_AT + 8, M4_AT + 24], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              120:00
            </div>
          </div>

          {/* red hand extends from the clock (f205–228) */}
          {handP > 0 && handP < 1.2 && morphP < 0.6 && (
            <svg
              style={{ position: "absolute", left: 0, top: 0, overflow: "visible" }}
              width={1920}
              height={1080}
            >
              <line
                x1={600}
                y1={540}
                x2={600 + 480 * expoOut(Math.min(1, handP * 1.4))}
                y2={540}
                stroke={COLORS.red}
                strokeWidth={18}
                strokeLinecap="round"
              />
            </svg>
          )}
          {/* mini pitch draws itself as the clock morphs away */}
          {f >= 228 && (
            <div style={{ opacity: morphP }}>
              <MiniPitch progress={(f - 228) / 32} />
            </div>
          )}

          {/* stamp PHÚT 120 · 2014 + penalty freeze-frame */}
          {f >= STAMP_2014 && (
            <>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 90,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Stamp
                  text="PHÚT 120 · 2014"
                  atFrame={START + STAMP_2014}
                  fontSize={72}
                  color={COLORS.gold}
                />
              </div>
              {/* penalty freeze-frame (P14 right crop, reframed: head + torso + kick) */}
              <div
                style={{
                  position: "absolute",
                  left: 1230,
                  top: 130,
                  width: 520,
                  height: 800,
                  overflow: "hidden",
                  opacity: interpolate(f, [STAMP_2014, STAMP_2014 + 16], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                  transform: `scale(${1 + strobeI * 0.05})`,
                  filter: "drop-shadow(0 20px 44px rgba(0,0,0,0.65))",
                }}
              >
                <Img
                  src={staticFile("v6/assets/p14-penalty-clock.png")}
                  style={{
                    position: "absolute",
                    left: -1200 * 0.8,
                    top: 0,
                    width: 2240 * 0.8,
                    maxWidth: "none",
                  }}
                />
              </div>
            </>
          )}
          <ImpactFlash atFrame={START + STAMP_2014 + 2} dur={2} />

          {/* stamp PENALTY QUYẾT ĐỊNH · 2016 + QUYẾT ĐỊNH TRẬN CHUNG KẾT */}
          {f >= STAMP_2016 && (
            <>
              <div
                style={{
                  position: "absolute",
                  left: 150,
                  top: 850,
                }}
              >
                <Stamp
                  text="PENALTY QUYẾT ĐỊNH · 2016"
                  atFrame={START + STAMP_2016}
                  fontSize={58}
                  color={COLORS.gold}
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 150,
                  top: 950,
                  fontFamily: "Anton, sans-serif",
                  fontSize: 44,
                  letterSpacing: "0.1em",
                  color: COLORS.ivory,
                  opacity: interpolate(f, [STAMP_2016 + 10, STAMP_2016 + 26], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              >
                QUYẾT ĐỊNH TRẬN CHUNG KẾT
              </div>
            </>
          )}
        </div>
      )}

      {/* ================= SIL-2: narrator dissolves → paper circle (f330–390) ================= */}
      {f >= SIL2_AT && (
        <>
          <div style={{ position: "absolute", inset: 0, background: "#000", opacity: dimAll * 0.5 }} />
          <GoldHalo size={560} opacity={0.3} />
          {/* RETURN silhouette walks in then dissolves */}
          {f >= STAMP_2016 && retOp > 0 && (
            <Img
              src={staticFile("v6/assets/sil-cr7-return.png")}
              style={{
                position: "absolute",
                left: retX - 400 * retScale,
                top: 540 - 400 * retScale,
                width: 800 * retScale,
                opacity: retOp,
                filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.6))",
              }}
            />
          )}
          {/* ~120 paper particles gather into ring */}
          <PaperParticles
            frame={f}
            seed={28}
            count={120}
            mode="gather"
            startFrame={355}
            dur={31}
            area={{ x: 1000, y: 280, w: 480, h: 560 }}
            cx={960}
            cy={540}
            ringR={165}
          />
          {/* P9 paper circle forms — handoff to S19 (center 960,540 size 380) */}
          {f >= 368 && (
            <Img
              src={staticFile("v6/assets/p9-paper-circle-tear.png")}
              style={{
                position: "absolute",
                left: 960 - 190 * circP,
                top: 540 - 190 * circP,
                width: 380 * circP,
                height: 380 * circP,
                filter: "drop-shadow(0 0 60px rgba(212,160,23,0.35))",
              }}
            />
          )}
        </>
      )}

      {/* heartbeat visual pulse during SIL-2 (T16) */}
      {f >= SIL2_AT && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at 50% 50%, rgba(143,29,29,${0.12 * Math.max(0, Math.sin(((f - SIL2_AT) / 36) * Math.PI * 2))}) 0%, transparent 60%)`,
          }}
        />
      )}
      <GoldDust frame={f} seed={281} count={16} />
    </AbsoluteFill>
  );
};

export default S28;
