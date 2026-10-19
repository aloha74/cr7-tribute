/**
 * S4 · 0:47–1:00 (f0–390) · Bóng morph → bản đồ 5 thành phố (MOTIF LẦN 1).
 * T6 (morph object→object) · T15 (motif lần 1) · T13 (map assemble)
 * T14 (dashed-line vẽ đường bay) · T17 (J1 audio 0:59.7) · T20.
 * Camera: Motivated→Flowing + Calm→Brisk.
 * Map asset v2 (5 markers, đường thứ 5 tuột khỏi mép). Năm KHÔNG có trong §2 -> chỉ stamp tên thành phố.
 * Biên S4→S5: xé giấy từ giữa (J1 vào trước 8f).
 */
import React from "react";
import { AbsoluteFill, interpolate, staticFile} from "remotion";
import { COLORS, ImpactFlash } from "../components/Grade";
import { Stamp } from "../components/KineticText";
import { expoOut, power3Out, sineInOut, springIOS } from "../motion/eases";
import { Dust, PaperGrain, paperShadow } from "./teamA-helpers";
import { CropImg } from "./teamA-helpers";

const START = 1410;
const DUR = 390;

// markers in SCREEN coords (image 1920×1280 cover-cropped: y-100)
const MARKERS = [
  { x: 505, y: 332, city: "FUNCHAL" },
  { x: 815, y: 448, city: "LISBOA" },
  { x: 1035, y: 428, city: "MANCHESTER" },
  { x: 1055, y: 572, city: "MADRID" },
  { x: 905, y: 897, city: "TURIN" },
];
const BALL_HOME = { x: 880, y: 30 }; // baked ball spot on map image

// nhịp stamp thành phố (đường bay đã vẽ sẵn trong asset v2)
const PATH_START = [80, 128, 176, 224, 272];
const PATH_DUR = 44;

const S4: React.FC<{ frame: number }> = ({ frame }: { frame: number }) => {
  const f = Math.max(0, Math.min(DUR, frame));

  // map assemble: slides in with bounce-settle
  const mapP = springIOS(Math.max(0, Math.min(1, f / 50)));
  const mapY = interpolate(Math.max(0, Math.min(1, f / 50)), [0, 1], [150, 0]);
  // hero ball flies up f25–60, morphs at f60 (ball scale -> 0, map pulses)
  const flyP = expoOut(Math.max(0, Math.min(1, (f - 25) / 35)));
  const ballX = interpolate(flyP, [0, 1], [960, BALL_HOME.x]);
  const ballY = interpolate(flyP, [0, 1], [1250, BALL_HOME.y + 60]);
  const morphP = Math.max(0, Math.min(1, (f - 60) / 18));
  const ballScale = 1 - expoOut(morphP);
  const mapPulse = 1 + 0.045 * Math.sin(Math.min(1, morphP) * Math.PI);
  const morphFlash = f >= 60 && f < 66;
  // J1: f382–390 tear from center begins (audio J1 vào trước 8f)
  const tearP = Math.max(0, Math.min(1, (f - 382) / 8));

  return (
    <AbsoluteFill style={{ backgroundColor: "#0b0b0e", overflow: "hidden" }}>
      {/* map plate: assemble */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${mapY}px) scale(${Math.max(0.001, mapP) * mapPulse})`,
          transformOrigin: "50% 60%",
          ...paperShadow(30),
          opacity: mapP > 0 ? 1 : 0,
          filter: "saturate(0.9) contrast(1.05)",
        }}
      >
        <img
          src={staticFile("v6/assets/p2-map-5cities.png")}
          draggable={false}
          style={{ width: "100%", height: "100%", objectFit: "cover", userSelect: "none" }}
        />
      </div>

      {/* pulsing rings tại markers khi stamp thành phố hiện (đường bay đã vẽ sẵn trong asset v2) */}
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, opacity: mapP > 0 ? 1 : 0 }}>
        {MARKERS.map((m, i) => {
          const done = f >= PATH_START[i] + PATH_DUR * 0.8;
          const pr = 1 + 0.25 * Math.sin(((f - PATH_START[i]) / 12) * Math.PI * 2);
          return done ? (
            <circle key={m.city} cx={m.x} cy={m.y} r={13 * pr} fill="none" stroke={COLORS.gold} strokeWidth={3} />
          ) : null;
        })}
      </svg>

      {/* city name stamps (stagger center-out 50–80ms) */}
      {MARKERS.map((m, i) => {
        const at = PATH_START[i] + PATH_DUR * 0.8 + i * 2;
        if (f < at) return null;
        const above = i % 2 === 0;
        return (
          <div key={m.city} style={{ position: "absolute", left: m.x - 110, top: above ? m.y - 88 : m.y + 30, width: 220, textAlign: "center" }}>
            <Stamp text={m.city} atFrame={at + START} fontSize={38} color={COLORS.ivory} rotate={i % 2 ? 1.5 : -1.5} style={{ border: "none", padding: "2px 10px", background: "rgba(0,0,0,0.55)", borderRadius: 6, textShadow: "0 1px 8px rgba(0,0,0,0.9)" }} />
          </div>
        );
      })}

      {/* hero ball flying up -> morphs into map */}
      {f >= 25 && ballScale > 0.01 && (
        <div
          style={{
            position: "absolute",
            left: ballX - 90 * ballScale,
            top: ballY - 90 * ballScale,
            transform: `scale(${ballScale})`,
            ...paperShadow(16),
            zIndex: 6,
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
            h={180 * ballScale}
            circle
          />
        </div>
      )}
      {morphFlash && <div style={{ position: "absolute", inset: 0, backgroundColor: "#fff", opacity: 0.55 }} />}
      <ImpactFlash atFrame={60 + START} dur={2} />

      {/* text chốt — đặt góc trái-dưới để không đè nhãn TURIN */}
      <div style={{ position: "absolute", left: 130, bottom: 110 }}>
        {f >= 300 && <Stamp text="5 CHẶNG ĐƯỜNG" atFrame={300 + START} fontSize={64} color={COLORS.gold} rotate={-1} />}
      </div>

      {/* J1: tear from center (f382–390) — xé giấy sang S5 */}
      {tearP > 0 && (
        <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, zIndex: 10 }}>
          <path
            d="M960,120 L985,300 L940,470 L990,640 L945,810 L975,960"
            fill="none"
            stroke="#000"
            strokeWidth={26 * tearP}
            strokeLinecap="round"
            opacity={0.9}
          />
          <path
            d="M960,120 L985,300 L940,470 L990,640 L945,810 L975,960"
            fill="none"
            stroke={COLORS.redDeep}
            strokeWidth={10 * tearP}
            strokeLinecap="round"
            opacity={0.9}
          />
        </svg>
      )}

      {/* secondary/ambient */}
      <PaperGrain opacity={0.1} />
      <Dust frame={f} count={30} seed={14} />
      {/* camera: slow push-in toward map (Flowing, gentle) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

export default S4;
