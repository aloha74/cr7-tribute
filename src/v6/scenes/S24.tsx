/**
 * S24 · 4:10–4:30 (f7500–8100, 600f) — VUA CHAMPIONS LEAGUE: 6 mùa vua phá lưới.
 * Spec: TREATMENT_V6.md §1 S24. T14·T4·T3·T6·T9·T13·T7·T20.
 * Số liệu: STATS_VERIFIED.md §1–3 (12·17·10*·16·12·15, 140 vs 129).
 */
import React from "react";
import { AbsoluteFill, interpolate, Img, staticFile } from "remotion";
import { COLORS, GoldHalo, ImpactFlash } from "../components/Grade";
import { CharSlam, Stamp, Counter } from "../components/KineticText";
import { GoldDust, DrawLine } from "../components/TeamC";
import { expoOut, power3Out, springSnappy } from "../motion/eases";

const START = 7500;
const DATA = [
  { v: 12, s: "12/13", gold: false },
  { v: 17, s: "13/14", gold: true },
  { v: 10, s: "14/15", gold: false },
  { v: 16, s: "15/16", gold: false },
  { v: 12, s: "16/17", gold: false },
  { v: 15, s: "17/18", gold: false },
];
const BW = 150;
const GAP = 42;
const CHART_W = DATA.length * BW + (DATA.length - 1) * GAP; // 1110
const X0 = (1920 - CHART_W) / 2;
const BASE_Y = 830;
const PX = 480 / 17;

const S24: React.FC<{ frame: number }> = ({ frame }) => {
  const f = frame; // local
  const q = Math.floor(f / 3) * 3; // stop-motion quantize for paper moves (T13)

  // ---- phase windows (frames) ----
  const P_BARS = 90;
  const P_DUEL = 330;
  const P_SIL = 510;

  // title phase exit
  const titleOut = interpolate(f, [P_BARS, P_BARS + 24], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // bars phase exit
  const barsOut = interpolate(f, [P_DUEL, P_DUEL + 28], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // duel phase exit — keep 140 visible while silhouette stands beside it; fade only at very end
  const duelOut = interpolate(f, [588, 600], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // camera: fly across bars (x drift) then zoom into bar 17 — then release back to 1 for duel (T14)
  const bar17x = X0 + BW + GAP + BW / 2; // center of column 17 (index 1)
  const camP = interpolate(f, [P_BARS + 30, P_DUEL - 10, P_DUEL + 30, P_DUEL + 70], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: expoOut,
  });
  const camX = interpolate(camP, [0, 0.55, 1], [160, -60, 0]);
  const camScale = interpolate(camP, [0, 0.55, 1], [1, 1.06, 1.42]);
  const pivotX = 960 - bar17x;

  // end: zoom into "140" covering frame (handoff S25, T6)
  const endZoom = interpolate(f, [560, 600], [1, 2.6], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: expoOut,
  });

  const shakeT = (f - 152) / 14; // impact shake at 17-bar hit (T9)
  const shake =
    shakeT >= 0 && shakeT <= 1
      ? 16 * Math.exp(-4 * shakeT) * Math.sin(shakeT * 36)
      : 0;

  return (
    <AbsoluteFill
      style={{
        background:
          "radial-gradient(ellipse at 50% 38%, #241708 0%, #120d06 45%, #0d0d0f 100%)",
        overflow: "hidden",
      }}
    >
      <GoldDust frame={f} seed={24} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${camX * camP + shake}px, ${shake * 0.6}px) scale(${camScale})`,
          transformOrigin: `${bar17x + pivotX * (1 - camP)}px 560px`,
        }}
      >
        {/* ============ PHASE 1: title slam (f0–90) ============ */}
        {f < P_BARS + 24 && (
          <div style={{ opacity: titleOut }}>
            <GoldHalo size={900} opacity={0.3} />
            <CharSlam
              text="VUA CHAMPIONS LEAGUE"
              atFrame={START + 2}
              fontSize={118}
              color={COLORS.ivory}
              staggerMs={36}
              scaleFrom={8}
              style={{ position: "absolute", top: 250, left: 0, right: 0 }}
            />
            <CharSlam
              text="6"
              atFrame={START + 12}
              fontSize={560}
              color={COLORS.goldLight}
              staggerMs={0}
              scaleFrom={8}
              style={{
                position: "absolute",
                top: 330,
                left: 0,
                right: 0,
                textShadow: "0 0 120px rgba(212,160,23,0.5)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 905,
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Stamp text="6 MÙA LIÊN TIẾP" atFrame={START + 40} fontSize={64} />
            </div>
          </div>
        )}

        {/* ============ PHASE 2: bars (f90–330) ============ */}
        {f >= P_BARS && f < P_DUEL + 28 && (
          <div style={{ opacity: barsOut }}>
            {DATA.map((d, i) => {
              const g0 = P_BARS + 8 + i * 12; // stagger 12f
              const gp = Math.max(0, Math.min(1, (f - g0) / 40));
              const ge = power3Out(gp);
              const h = d.v * PX * ge;
              const x = X0 + i * (BW + GAP);
              const top = BASE_Y - h;
              // counter on bar top
              const cp = Math.max(0, Math.min(1, (f - g0 - 6) / 30));
              return (
                <div key={d.s}>
                  {/* bar */}
                  <div
                    style={{
                      position: "absolute",
                      left: x,
                      top,
                      width: BW,
                      height: Math.max(1, h),
                      background: d.gold
                        ? "linear-gradient(to top, #8a5f0c, #d4a017 55%, #f5d67b)"
                        : "linear-gradient(to top, #2c2c30, #4a4a52 60%, #6b6b75)",
                      borderTop: `5px solid ${d.gold ? COLORS.goldLight : "#9a9aa4"}`,
                      boxShadow: d.gold
                        ? "0 0 70px rgba(212,160,23,0.55), 0 16px 30px rgba(0,0,0,0.5)"
                        : "0 16px 30px rgba(0,0,0,0.5)",
                    }}
                  />
                  {/* counter number */}
                  <div
                    style={{
                      position: "absolute",
                      left: x,
                      top: top - 118,
                      width: BW,
                      textAlign: "center",
                      fontFamily: "Anton, sans-serif",
                      fontVariantNumeric: "tabular-nums",
                      fontSize: d.gold ? 108 : 84,
                      color: d.gold ? COLORS.goldLight : COLORS.ivory,
                      opacity: cp,
                      transform: `scale(${0.6 + 0.4 * springSnappy(cp)})`,
                      textShadow: d.gold
                        ? "0 0 40px rgba(212,160,23,0.6)"
                        : "0 4px 18px rgba(0,0,0,0.6)",
                    }}
                  >
                    {Math.round(d.v * expoOut(cp))}
                  </div>
                  {/* season label */}
                  <div
                    style={{
                      position: "absolute",
                      left: x,
                      top: BASE_Y + 26,
                      width: BW,
                      textAlign: "center",
                      fontFamily: "Inter, sans-serif",
                      fontWeight: 700,
                      fontSize: 40,
                      letterSpacing: "0.06em",
                      color: d.gold ? COLORS.gold : "#b9b9c2",
                      opacity: gp,
                    }}
                  >
                    {d.s}
                  </div>
                  {/* annotation: record 17 */}
                  {d.gold && f >= g0 + 44 && (
                    <div
                      style={{
                        position: "absolute",
                        left: x - 60,
                        top: top - 235,
                        transform: "rotate(-4deg)",
                      }}
                    >
                      <Stamp
                        text="KỶ LỤC 17 BÀN/MÙA"
                        atFrame={START + g0 + 44}
                        fontSize={34}
                        color={COLORS.gold}
                        rotate={-4}
                      />
                    </div>
                  )}
                  {/* annotation: shared golden boot 14/15 — đặt TRÊN đỉnh cột (tránh mép dưới + camera zoom) */}
                  {d.s === "14/15" && f >= g0 + 52 && (
                    <div
                      style={{
                        position: "absolute",
                        left: x - 130,
                        top: top - 140,
                        transform: "rotate(-2deg)",
                      }}
                    >
                      <Stamp
                        text="ĐỒNG VUA PHÁ LƯỚI · MESSI & NEYMAR"
                        atFrame={START + g0 + 52}
                        fontSize={26}
                        color="#c9c9d2"
                        rotate={-2}
                        style={{ borderWidth: 3, padding: "6px 16px" }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
            {/* hand-drawn underline under chart (T14 annotation) */}
            <DrawLine
              progress={(f - P_BARS - 20) / 60}
              x1={X0 - 30}
              y1={BASE_Y + 4}
              x2={X0 + CHART_W + 30}
              y2={BASE_Y + 4}
              color={COLORS.gold}
              width={6}
            />
            {/* axis */}
            <div
              style={{
                position: "absolute",
                left: X0 - 40,
                top: BASE_Y,
                width: CHART_W + 80,
                height: 6,
                background: "#3a3a40",
              }}
            />
          </div>
        )}
        <ImpactFlash atFrame={START + 152} dur={2} />

        {/* ============ PHASE 3: 140 vs 129 (f330–510) ============ */}
        {f >= P_DUEL && (
          <div
            style={{
              opacity: duelOut,
              transform: `scale(${endZoom})`,
              transformOrigin: "550px 365px",
            }}
          >
            <GoldHalo size={1000} opacity={0.35} />
            {/* 140 gold */}
            <div style={{ position: "absolute", left: 200, top: 200, width: 900 }}>
              <Counter
                from={0}
                to={140}
                atFrame={START + P_DUEL + 30}
                durFrames={130}
                fontSize={330}
                color={COLORS.goldLight}
              />
              <div
                style={{
                  width: 700,
                  height: 34,
                  marginTop: 8,
                  background: "linear-gradient(90deg, #8a5f0c, #f5d67b)",
                  boxShadow: "0 0 60px rgba(212,160,23,0.5)",
                  transformOrigin: "left",
                  transform: `scaleX(${power3Out(Math.max(0, Math.min(1, (f - P_DUEL - 30) / 90)))})`,
                }}
              />
            </div>
            {/* 129 grayscale */}
            <div style={{ position: "absolute", left: 200, top: 690, width: 900 }}>
              <Counter
                from={0}
                to={129}
                atFrame={START + P_DUEL + 44}
                durFrames={130}
                fontSize={170}
                color="#8f8f99"
              />
              <div
                style={{
                  width: 700 * (129 / 140),
                  height: 22,
                  marginTop: 6,
                  background: "#55555e",
                  transformOrigin: "left",
                  transform: `scaleX(${power3Out(Math.max(0, Math.min(1, (f - P_DUEL - 44) / 90)))})`,
                }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                top: 905,
                left: 0,
                right: 0,
                display: "flex",
                justifyContent: "center",
                opacity: interpolate(f, [P_DUEL + 120, P_DUEL + 160], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              <Stamp
                text="NHIỀU NHẤT MỌI THỜI ĐẠI"
                atFrame={START + P_DUEL + 120}
                fontSize={66}
                color={COLORS.gold}
              />
            </div>
          </div>
        )}

        {/* ============ PHASE 4: silhouette narrator (f510–600) ============ */}
        {f >= P_SIL && (
          <div
            style={{
              opacity: interpolate(f, [P_SIL, P_SIL + 20], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            <Img
              src={staticFile("v6/assets/sil-cr7-entry.png")}
              style={{
                position: "absolute",
                left: interpolate(
                  springSnappy(Math.max(0, Math.min(1, (q - P_SIL) / 46))),
                  [0, 1],
                  [-420, 180]
                ),
                top: 170,
                width: 480,
                filter: "drop-shadow(0 18px 30px rgba(0,0,0,0.6))",
              }}
            />
          </div>
        )}
      </div>

      <GoldDust frame={f} seed={99} count={24} />
    </AbsoluteFill>
  );
};

export default S24;
