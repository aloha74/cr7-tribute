/**
 * S3 · 0:33–0:47 (f0–420) · "KHÁT KHAO · KỶ LUẬT · MỒ HÔI"
 * Cậu bé đá bóng rách -> bóng lăn qua 3 thẻ paper (stamp stagger 0.09s).
 * Setup hero object (chưa phải motif morph). Camera follow bóng (motivated).
 * T3 (kinetic triplet + reading hold >=1s) · T13 (stamp + bounce-settle)
 * T12 (camera follow = 1 move duy nhất) · T20 · T1.
 * Biên S2→S3: bóng bay vào từ góc trên-phải (tiếp hướng đường vẽ dở).
 * Biên S3→S4: whip-zoom qua vật — bóng bay vào camera che khung.
 */
import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { COLORS } from "../components/Grade";
import { ImpactFlash } from "../components/Grade";
import { Stamp } from "../components/KineticText";
import { expoOut, power3Out, power4Out, sineInOut, springIOS, springSnappy } from "../motion/eases";
import { CropImg, Dust, PaperGrain, paperShadow, q10 } from "./teamA-helpers";

const START = 990;
const DUR = 420;

// cards along the trail (left->right reading order); ball rolls left->right
const CARDS = [
  { word: "KHÁT KHAO", x: 330, hitAt: 100 },
  { word: "KỶ LUẬT", x: 860, hitAt: 190 },
  { word: "MỒ HÔI", x: 1390, hitAt: 280 },
];
const TRAIL_Y = 740;

const S3: React.FC<{ frame: number }> = ({ frame }: { frame: number }) => {
  const f = Math.max(0, Math.min(DUR, frame));
  const qf = q10(f);

  // ball path: flies in from top-right (f0-40), rolls left->right along trail
  const inP = expoOut(Math.max(0, Math.min(1, f / 40)));
  const flyX = interpolate(inP, [0, 1], [2020, 170]);
  const flyY = interpolate(inP, [0, 1], [330, TRAIL_Y - 58]);
  // roll progress with pauses at cards (12f each)
  const rollRaw = (() => {
    if (f <= 40) return 0;
    let t = f - 40;
    // segments: roll to card, pause 12f, roll, pause, roll, pause, roll to end
    const segs: [number, number, number][] = [
      [170, 330, 60], [330, 330, 12],
      [330, 860, 78], [860, 860, 12],
      [860, 1390, 78], [1390, 1390, 12],
      [1390, 1760, 62],
    ];
    for (const [a, b, d] of segs) {
      if (t <= d) {
        const p = expoOut(Math.max(0, Math.min(1, t / d)));
        return a + (b - a) * p;
      }
      t -= d;
    }
    return 1760;
  })();
  const ballX = f <= 40 ? flyX : rollRaw;
  const ballY = f <= 40 ? flyY : TRAIL_Y - 58 + 10 * Math.sin((rollRaw / 90) * Math.PI * 2);
  const ballRot = rollRaw / 1.15; // rolling rotation (deg-ish)
  // whip-zoom out: f390-420 ball flies into camera
  const whipP = Math.max(0, Math.min(1, (f - 390) / 30));
  const whipScale = whipP > 0 ? Math.exp(interpolate(power4Out(whipP), [0, 1], [0, 3.2])) : 1;
  const whipX = interpolate(whipP, [0, 1], [ballX, 960]);
  const whipY = interpolate(whipP, [0, 1], [ballY, 540]);

  // camera follow ball (motivated, clamped)
  const camX = -Math.max(-170, Math.min(170, (ballX - 960) * 0.32));
  const camEase = sineInOut(Math.max(0, Math.min(1, f / 420)));

  // trail draws as ball passes
  const trailLen = 1600;
  const trailDraw = Math.max(0, Math.min(1, (ballX - 170) / 1590));

  return (
    <AbsoluteFill style={{ backgroundColor: "#101014", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: -220, transform: `translateX(${camX * camEase}px)` }}>
        {/* bg: sân đất paper */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, #0c0c10 0%, #171318 55%, #241a12 100%)",
          }}
        />
        {/* hand-drawn trail */}
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
          <path
            d="M170,740 C480,700 760,780 1060,730 C1320,685 1520,760 1760,720"
            fill="none"
            stroke={COLORS.gold}
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray="24 16"
            strokeDashoffset={trailLen * (1 - trailDraw)}
            opacity={0.75}
          />
        </svg>

        {/* 3 paper cards */}
        {CARDS.map((c) => {
          const since = f - c.hitAt;
          const cardP = springIOS(Math.max(0, Math.min(1, since / 26)));
          const wordOn = since >= 0;
          return (
            <div key={c.word}>
              {cardP > 0 && (
                <div
                  style={{
                    position: "absolute",
                    left: c.x - 190,
                    top: 400,
                    width: 380,
                    height: 220,
                    background: "linear-gradient(160deg, #efe3cc 0%, #d9c9a8 100%)",
                    transform: `scale(${Math.max(0.001, cardP)}) rotate(${-2 + c.x * 0.001}deg)`,
                    transformOrigin: "50% 100%",
                    ...paperShadow(20),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {/* tape strips */}
                  <div style={{ position: "absolute", top: -16, left: 60, width: 110, height: 34, background: "rgba(212,160,23,0.5)", transform: "rotate(-4deg)" }} />
                  <div style={{ position: "absolute", top: -16, right: 60, width: 110, height: 34, background: "rgba(212,160,23,0.5)", transform: "rotate(5deg)" }} />
                </div>
              )}
              {wordOn && (
                <div style={{ position: "absolute", left: c.x - 190, top: 400, width: 380, height: 220, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Stamp
                    text={c.word}
                    atFrame={c.hitAt + START}
                    fontSize={c.word.length > 7 ? 52 : 60}
                    color={COLORS.redDeep}
                    rotate={-2}
                    style={{ border: "none", padding: 0, letterSpacing: "0.04em" }}
                  />
                </div>
              )}
            </div>
          );
        })}

        {/* impact flashes at each card hit */}
        {CARDS.map((c) => (
          <ImpactFlash key={c.word} atFrame={c.hitAt + START} dur={2} />
        ))}

        {/* hero ball (P10 crop) */}
        <div
          style={{
            position: "absolute",
            left: (whipP > 0 ? whipX : ballX) - 62 * whipScale,
            top: (whipP > 0 ? whipY : ballY) - 62 * whipScale,
            width: 124 * whipScale,
            height: 124 * whipScale,
            transform: `rotate(${ballRot}deg)`,
            ...paperShadow(14),
            zIndex: 5,
          }}
        >
          <CropImg
            src="/v6/assets/p10-hero-ball.png"
            nativeW={1920}
            nativeH={1280}
            cx={545}
            cy={305}
            cw={830}
            ch={770}
            h={124 * whipScale}
            circle
          />
        </div>

        {/* boy kicking (P1 pose 2) at start, exits left */}
        <div
          style={{
            position: "absolute",
            left: interpolate(qf, [0, 120], [60, -320], { easing: power3Out, extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            bottom: 130,
            ...paperShadow(22),
            opacity: interpolate(f, [100, 130], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          <CropImg
            src="/v6/assets/p1-boy-madeira-3poses.png"
            nativeW={1920}
            nativeH={1280}
            cx={640}
            cy={230}
            cw={620}
            ch={880}
            h={560}
          />
        </div>
      </div>

      {/* secondary: ball trail glow + ambient dust */}
      <PaperGrain opacity={0.1} />
      <Dust frame={f} count={34} seed={13} />
    </AbsoluteFill>
  );
};

export default S3;
