/**
 * S16 · 3:32–3:44 (frames 6360–6720, 360f) · 3-PEAT C1 — grammar STAGGER
 * 2 cúp đầu stagger nhanh (power3.out) + stamp năm · cúp 2018 scale 2× + halo +
 * push-in riêng 1s ("cái khó nhất để lại cuối") · số "3" scale 8×.
 * D2 (3:34–3:38, beats 300–308): halo swell. Mediant 3:40 (beat 312): light accent.
 * T: T3 · T13 · T7 · T4 · T16 · T20
 */
import React from "react";
import { AbsoluteFill, interpolate, staticFile } from "remotion";
import { beatToFrame } from "../motion/beat";
import { power3Out, expoOut } from "../motion/eases";
import { COLORS, ImpactFlash, GoldHalo } from "../components/Grade";
import { CharSlam, Stamp } from "../components/KineticText";
import { PaperParticles, Embers, sm, g } from "../components/TeamB";

const START = 6360;
const bf = (beat: number) => beatToFrame(beat) - START;

const CUP18 = bf(304); // 3:36 — cúp 2018 xuất hiện
const THREE = bf(314); // 3:41 — số "3"
const D2A = bf(300); const D2B = bf(308); // D2 window
const MEDIANT = bf(312); // 3:40 chromatic mediant

/** One trophy crop from P7 (1920x1280) */
const Trophy: React.FC<{
  x0: number; left: number; dropAt: number; label: string; labelAt: number;
  hero?: boolean; heroAt?: number; frame: number;
}> = ({ x0, left, dropAt, label, labelAt, hero, heroAt = 0, frame }) => {
  const smf = Math.floor(frame / 3) * 3;
  const t = Math.max(0, Math.min(1, (smf - dropAt) / 26));
  const e = power3Out(t);
  // overshoot settle after landing
  const over = t >= 1 ? Math.sin((smf - dropAt - 26) / 6) * Math.exp(-(smf - dropAt - 26) / 18) * 14 : 0;
  const y = interpolate(e, [0, 1], [-420, 0]) + over;
  // hero: cúp 2018 scale gấp đôi sau khi rơi
  let scale = 1;
  if (hero && frame > heroAt) {
    const ht = Math.max(0, Math.min(1, (frame - heroAt) / 50));
    scale = 1 + (2 - 1) * power3Out(ht);
  }
  if (t <= 0) return null;
  return (
    <div style={{ position: "absolute", left, top: 40, width: 560, height: 1000, overflow: "hidden" }}>
      <img
        src={staticFile("v6/assets/p7-three-trophies.png")}
        style={{
          position: "absolute",
          left: -x0,
          top: -100 + y,
          width: 1920,
          height: 1280,
          transform: `scale(${scale})`,
          transformOrigin: `${x0 + 280}px 640px`,
          filter: "drop-shadow(0 16px 28px rgba(0,0,0,0.8))",
        }}
      />
      <div style={{ position: "absolute", bottom: 18, width: "100%", display: "flex", justifyContent: "center" }}>
        <Stamp text={label} atFrame={labelAt} fontSize={52} rotate={-2} />
      </div>
    </div>
  );
};

const S16: React.FC<{ frame: number }> = ({ frame }) => {
  const smf = sm(frame);

  // camera push-in riêng 1s cho cúp 2018 (T7)
  const pushT = Math.max(0, Math.min(1, (frame - CUP18) / 30));
  const push = 1 + 0.14 * (1 - Math.pow(1 - pushT, 3));

  // D2: halo swell 3:34–3:38
  const d2 = frame >= D2A && frame < D2B ? 0.5 + 0.5 * Math.sin(((frame - D2A) / (D2B - D2A)) * Math.PI) : 0;

  // exit flip: cúp 2018 xoay (S16→S17 handoff)
  const flipT = Math.max(0, Math.min(1, (frame - 330) / 30));
  const flip = flipT * 90;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0d0d0f", overflow: "hidden" }}>
      {/* bg paper đỏ-đen */}
      <AbsoluteFill
        style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(74,14,14,0.55) 0%, rgba(13,13,15,1) 75%)" }}
      />

      {/* ENTRANCE (T6 — S15→S16 handoff): cúp Euro thu nhỏ đã bay lên góc —
          silhouette gold nhỏ đậu ở góc phải, bob nhẹ rồi tan khi cúp 2016 rơi. */}
      {frame < 40 && (
        <div
          style={{
            position: "absolute",
            left: 1560,
            top: 120 + Math.sin(frame / 6) * 8,
            width: 130,
            height: 170,
            opacity: 1 - Math.max(0, (frame - 10) / 30),
            filter: "drop-shadow(0 0 22px rgba(245,214,123,0.65))",
          }}
        >
          <svg viewBox="0 0 130 170" width="130" height="170">
            <defs>
              <linearGradient id="s16cup" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#f5d67b" />
                <stop offset="1" stopColor="#a97c1f" />
              </linearGradient>
            </defs>
            <path d="M35 12 h60 v38 c0 26 -14 40 -30 40 c-16 0 -30 -14 -30 -40 z" fill="url(#s16cup)" />
            <path d="M35 22 c-20 2 -28 14 -24 32 c3 14 14 20 26 18" fill="none" stroke="#d4a017" strokeWidth="9" />
            <path d="M95 22 c20 2 28 14 24 32 c-3 14 -14 20 -26 18" fill="none" stroke="#d4a017" strokeWidth="9" />
            <rect x="59" y="90" width="12" height="34" fill="#c9992b" />
            <rect x="42" y="124" width="46" height="12" rx="3" fill="#d4a017" />
            <rect x="34" y="136" width="62" height="14" rx="4" fill="url(#s16cup)" />
          </svg>
        </div>
      )}

      <div style={{ position: "absolute", inset: 0, transform: `scale(${push})`, transformOrigin: "78% 45%" }}>
        {/* cúp 2016 + 2017: stagger nhanh */}
        <Trophy x0={120} left={180} dropAt={10} label="2016" labelAt={g(START, 48)} frame={frame} />
        <Trophy x0={600} left={680} dropAt={34} label="2017" labelAt={g(START, 72)} frame={frame} />
        {/* cúp 2018: hero — scale gấp đôi */}
        <div style={{ transform: `rotateY(${flip}deg)`, transformOrigin: "50% 50%" }}>
          <Trophy x0={1240} left={1180} dropAt={CUP18} label="2018" labelAt={g(START, CUP18 + 14)} hero heroAt={CUP18 + 26} frame={frame} />
        </div>
      </div>

      {/* D2 halo + mediant accent */}
      <GoldHalo size={1200} opacity={0.25 + d2 * 0.45} />
      <ImpactFlash atFrame={g(START, MEDIANT)} dur={2} />
      {frame >= D2A && frame < D2B && (
        <PaperParticles count={50} seed={160} atFrame={g(START, D2A)} dur={110} maxDist={640} centerX={1375} centerY={500} />
      )}

      {/* SECONDARY: số "3" scale 8× + text */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <CharSlam text="3" atFrame={g(START, THREE)} fontSize={380} color={COLORS.goldLight} staggerMs={40} scaleFrom={8} />
      </AbsoluteFill>
      <AbsoluteFill style={{ alignItems: "center", paddingTop: 900 }}>
        <Stamp text="3 LẦN LIÊN TIẾP" atFrame={g(START, THREE + 14)} fontSize={64} rotate={-2} />
      </AbsoluteFill>

      {/* AMBIENT */}
      <Embers seed={61} count={24} />
    </AbsoluteFill>
  );
};

export default S16;
