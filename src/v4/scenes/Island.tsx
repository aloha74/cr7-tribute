import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing } from "remotion";
import { S } from "../timeline";
import { PAPER, PaperDefs, PaperFigure, POSES, Waves, GrainOverlay } from "../components/Paper";
import { Rise, Scrim } from "../components/Kinetic";
import { ActTransition } from "../components/ActTransition";

const step12 = (frame: number) => Math.floor(frame / 2.5) % 2;

/** Torn-edge wipe sweeping across at a shot boundary. */
const TearWipe: React.FC<{ at: number; color?: string }> = ({ at, color = PAPER.ink }) => {
  const frame = useCurrentFrame();
  const t = (frame - at * 30) / 14;
  if (t < 0 || t > 1.2) return null;
  const e = Easing.inOut(Easing.cubic)(Math.min(1, t));
  const x = interpolate(e, [0, 1], [-400, 2200]);
  return (
    <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 50 }}>
      <defs>
        <filter id="wipe-torn" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.03" numOctaves="2" seed="21" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="60" />
        </filter>
      </defs>
      <g transform={`translate(${x} 0)`}>
        <rect x={-2600} y={-100} width={2600} height={1280} fill={color} filter="url(#wipe-torn)" />
      </g>
    </svg>
  );
};

const ShotFrame: React.FC<{ children: React.ReactNode; cam?: string }> = ({ children, cam }) => (
  <div style={{ position: "absolute", inset: -80, transform: cam }}>{children}</div>
);

/* ---------------- Shot 1: the island (30–45) ---------------- */
const ShotIsland: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30 - 30;
  const cam = `translateX(${interpolate(t, [0, 15], [40, -160])}px)`;
  const cloudX = (t * 12) % 2200;
  return (
    <>
      <ShotFrame cam={cam}>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%", display: "block" }}>
        <PaperDefs id="isl" />
        <rect width={1920} height={1080} fill="url(#isl-skyday)" />
        <circle cx={1560} cy={190} r={95} fill={PAPER.gold} filter="url(#isl-torn-sm)" opacity={0.95} />
        <circle cx={1560} cy={190} r={150} fill="url(#isl-glow)" />
        {[-200, 500, 1200].map((cx, i) => (
          <g key={i} transform={`translate(${((cx + cloudX * (0.5 + i * 0.2)) % 2300) - 200} ${150 + i * 70})`} opacity={0.92}>
            <ellipse cx={0} cy={0} rx={150} ry={52} fill={PAPER.white} filter="url(#isl-torn-sm)" />
            <ellipse cx={90} cy={-26} rx={110} ry={44} fill={PAPER.white} filter="url(#isl-torn-sm)" />
          </g>
        ))}
        {/* island */}
        <g filter="url(#isl-pshadow)">
          <path d="M 240 780 Q 420 560 700 600 Q 900 420 1150 520 Q 1420 440 1620 640 Q 1720 730 1660 780 Z"
            fill={PAPER.kraftDeep} filter="url(#isl-torn)" />
          <path d="M 340 740 Q 500 600 740 630 Q 950 480 1180 560 Q 1400 500 1560 660 L 1560 700 Q 900 760 340 700 Z"
            fill="#6f8f4e" filter="url(#isl-torn-sm)" opacity={0.9} />
          {/* mountains */}
          <path d="M 700 620 L 860 380 L 1020 620 Z" fill={PAPER.kraftDark} filter="url(#isl-torn-sm)" />
          <path d="M 800 470 L 860 380 L 920 470 Z" fill={PAPER.white} opacity={0.85} />
          {/* the little house */}
          <g transform="translate(1180 560)">
            <rect x={-70} y={-90} width={140} height={95} fill={PAPER.cream} filter="url(#isl-torn-sm)" />
            <path d="M -90 -90 L 0 -160 L 90 -90 Z" fill={PAPER.redDark} filter="url(#isl-torn-sm)" />
            <rect x={-22} y={-62} width={44} height={40} fill="#ffd98a"
              style={{ filter: "drop-shadow(0 0 22px #ffca5e)" }} />
            <rect x={-58} y={-70} width={26} height={26} fill={PAPER.nightBlue} />
          </g>
          {/* palm */}
          <g transform="translate(420 640)">
            <rect x={-12} y={-150} width={24} height={150} fill={PAPER.kraftDeep} filter="url(#isl-torn-sm)" />
            {[0, 1, 2, 3, 4].map((i) => (
              <ellipse key={i} cx={Math.cos(i * 1.26) * 90} cy={-150 + Math.sin(i * 1.26) * 34} rx={80} ry={20}
                fill="#4e7a3a" transform={`rotate(${i * 72} ${Math.cos(i * 1.26) * 90} ${-150 + Math.sin(i * 1.26) * 34})`}
                filter="url(#isl-torn-sm)" />
            ))}
          </g>
        </g>
        <Waves id="isl" y={800} phase={t * 1.4} />
        <GrainOverlay id="isl" />
      </svg>
      </ShotFrame>
      <Rise at={31} size={60} align="left">Funchal, Madeira. <b>1985.</b></Rise>
    </>
  );
};

/* ---------------- Shot 2: the boy and the ball (45–60) ---------------- */
const ShotBoy: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30 - 45;
  const kickAt = 7; // 52s
  const kt = t - kickAt;
  // ball: rests, then flies in a parabola after the kick
  const ballX = kt < 0 ? 0 : kt * 420;
  const ballY = kt < 0 ? 0 : -(kt * 260 - 320 * kt * kt);
  const pose = kt < 0 ? (step12(frame) ? POSES.walk1 : POSES.walk2) : kt < 0.5 ? POSES.kick : POSES.cheer;
  // coins spill from the pocket as he runs
  const coins = [0, 1, 2, 3, 4].map((i) => {
    const ct = t - 2 - i * 0.7;
    if (ct < 0) return null;
    return { x: 640 + i * 130 + ct * 60, y: 880 - Math.abs(Math.sin(ct * 5)) * 60 - ct * 40, r: 16 };
  });
  return (
    <>
      <ShotFrame cam={`translateX(${interpolate(t, [0, 15], [0, -140])}px)`}>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%", display: "block" }}>
        <PaperDefs id="boy" />
        <rect width={1920} height={1080} fill="url(#boy-skyday)" />
        <ellipse cx={400} cy={200} rx={180} ry={60} fill={PAPER.white} opacity={0.8} filter="url(#boy-torn-sm)" />
        {/* distant houses */}
        {[200, 700, 1500].map((x, i) => (
          <g key={i} transform={`translate(${x} 620)`} opacity={0.75}>
            <rect x={-60} y={-70} width={120} height={75} fill={PAPER.kraftDark} filter="url(#boy-torn-sm)" />
            <path d="M -75 -70 L 0 -125 L 75 -70 Z" fill={PAPER.redDark} filter="url(#boy-torn-sm)" />
          </g>
        ))}
        <rect y={700} width={1920} height={380} fill="#7a9a52" filter="url(#boy-torn-sm)" />
        <rect y={700} width={1920} height={26} fill="#5d7a3e" />
        {/* the boy */}
        <PaperFigure id="boy" x={760} y={920} scale={1.5} pose={pose} shirt={PAPER.red} />
        {/* ball */}
        <g transform={`translate(${860 + ballX} ${880 + ballY})`}>
          <circle r={26} fill={PAPER.white} stroke={PAPER.ink} strokeWidth={4} filter="url(#boy-pshadow-sm)" />
          <path d="M 0 -26 L 8 -8 L 26 -8 L 12 4 L 16 22 L 0 12 L -16 22 L -12 4 L -26 -8 L -8 -8 Z"
            fill={PAPER.ink} transform="scale(0.8)" />
        </g>
        {/* spilled coins — empty pockets */}
        {coins.map((c, i) => c && (
          <g key={i} transform={`translate(${c.x} ${c.y})`} opacity={Math.max(0, 1 - (t - 2 - i * 0.7) * 0.25)}>
            <circle r={c.r} fill={PAPER.gold} stroke={PAPER.goldDeep} strokeWidth={3} filter="url(#boy-pshadow-sm)" />
            <circle r={c.r * 0.55} fill="none" stroke={PAPER.goldDeep} strokeWidth={2} />
          </g>
        ))}
        <GrainOverlay id="boy" />
      </svg>
      </ShotFrame>
      <Rise at={46} size={60} align="left">A poor family. <b>A rich dream.</b></Rise>
    </>
  );
};

/* ---------------- Shot 3: the boat to Lisbon (60–75) ---------------- */
const ShotBoat: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30 - 60;
  const walkX = 300 + Math.min(1, t / 9) * 700;
  const pose = step12(frame) ? POSES.walk1 : POSES.walk2;
  const sailT = Math.max(0, t - 8);
  const boatX = 1050 + sailT * 160;
  const bob = Math.sin(t * 2.2) * 10;
  return (
    <>
      <ShotFrame cam={`translateX(${interpolate(t, [0, 15], [60, -220])}px)`}>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%", display: "block" }}>
        <PaperDefs id="boat" />
        <rect width={1920} height={1080} fill="url(#boat-nightsky)" />
        {[...Array(40)].map((_, i) => (
          <circle key={i} cx={(i * 397) % 1920} cy={(i * 211) % 420} r={2.5}
            fill="#fff" opacity={0.4 + 0.4 * Math.sin(t * 2 + i)} />
        ))}
        <circle cx={300} cy={180} r={70} fill={PAPER.cream} opacity={0.9} filter="url(#boat-torn-sm)" />
        {/* winding path */}
        <path d="M 200 1080 Q 500 800 700 850 Q 950 900 1100 780" fill="none"
          stroke={PAPER.kraft} strokeWidth={90} strokeLinecap="round" filter="url(#boat-torn-sm)" opacity={0.9} />
        {/* walking boy with a small sack */}
        <PaperFigure id="boat" x={walkX} y={960} scale={1.35} pose={pose} shirt={PAPER.red} />
        <g transform={`translate(${walkX - 60} 830) rotate(${Math.sin(t * 5) * 8})`}>
          <rect x={-26} y={-50} width={52} height={60} rx={10} fill={PAPER.kraftDark} filter="url(#boat-torn-sm)" />
        </g>
        {/* the boat */}
        <g transform={`translate(${boatX} ${830 + bob})`}>
          <path d="M -170 0 L 170 0 L 120 110 L -120 110 Z" fill={PAPER.kraftDeep} filter="url(#boat-torn-sm)" />
          <rect x={-8} y={-230} width={16} height={240} fill={PAPER.kraftDeep} />
          <path d="M 8 -230 L 8 -40 L 150 -40 Z" fill={PAPER.cream} filter="url(#boat-torn-sm)" opacity={0.95} />
          <PaperFigure id="boat" x={-40} y={20} scale={0.9} pose={POSES.stand} shirt={PAPER.red} />
        </g>
        <Waves id="boat" y={880} amp={20} phase={t * 1.8} color={PAPER.oceanDark} color2={PAPER.oceanDeep} />
        {/* Lisbon sign */}
        <g transform={`translate(1560 300) rotate(-4)`} opacity={interpolate(sailT, [0, 3], [0, 1])}>
          <rect x={-150} y={-46} width={300} height={92} fill={PAPER.cream} filter="url(#boat-torn-sm)" />
          <text x={0} y={12} textAnchor="middle" fontFamily="'Anton', sans-serif" fontSize={54} fill={PAPER.ink}>LISBON</text>
        </g>
        <GrainOverlay id="boat" />
      </svg>
      </ShotFrame>
      <Rise at={61} size={60} align="left">At 12, he left home. <b>Alone.</b></Rise>
    </>
  );
};

/* ---------------- Shot 4: the heart (75–90) ---------------- */
const ShotHeart: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30 - 75;
  const fixedAt = 8; // laser at 83s
  const racing = t < fixedAt;
  const bpm = racing ? 2.4 : 1.0; // beats per second
  const beat = (t * bpm) % 1;
  const pulse = 1 + Math.sin(beat * Math.PI) * (racing ? 0.22 : 0.08);
  const laserP = interpolate(Math.min(1, Math.max(0, (t - fixedAt) / 1.6)), [0, 1], [0, 1]);
  const glow = racing ? 0 : interpolate(t, [fixedAt, fixedAt + 2], [0, 1]);
  return (
    <>
      <ShotFrame cam={`scale(${interpolate(t, [0, 15], [1, 1.08])})`}>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%", display: "block" }}>
        <PaperDefs id="heart" />
        <rect width={1920} height={1080} fill="#1a0f0e" />
        <rect width={1920} height={1080} fill="url(#heart-nightsky)" opacity={0.55} />
        {/* the racing heart */}
        <g transform={`translate(960 500) scale(${pulse * 2.4})`}>
          <path d="M 0 60 C -90 0 -120 -40 -120 -75 C -120 -115 -85 -135 -55 -135 C -25 -135 -8 -115 0 -95 C 8 -115 25 -135 55 -135 C 85 -135 120 -115 120 -75 C 120 -40 90 0 0 60 Z"
            fill={racing ? "#c0392b" : PAPER.red} filter="url(#heart-torn-sm)"
            style={{ filter: `drop-shadow(0 0 ${30 + glow * 60}px rgba(220,60,40,${0.5 + glow * 0.5}))` }} />
          {/* racing motion rings */}
          {racing && [0, 1, 2].map((i) => {
            const rp = ((t * 2.4 + i / 3) % 1);
            return <circle key={i} r={120 + rp * 160} fill="none" stroke="#e74c3c"
              strokeWidth={6} opacity={(1 - rp) * 0.5} transform="scale(0.42)" />;
          })}
        </g>
        {/* the laser line that fixes it */}
        {t >= fixedAt && (
          <g>
            <line x1={960 - 420 * laserP} y1={500} x2={960 + 420 * laserP} y2={500}
              stroke={PAPER.gold} strokeWidth={10} strokeLinecap="round"
              style={{ filter: "drop-shadow(0 0 26px #f5c518)" }} />
            <circle cx={960 + 420 * laserP} cy={500} r={14} fill="#fff3c4"
              style={{ filter: "drop-shadow(0 0 20px #f5c518)" }} />
          </g>
        )}
        {t >= fixedAt + 1.2 && (
          <text x={960} y={860} textAnchor="middle" fontFamily="'Inter', sans-serif" fontSize={40}
            fill={PAPER.cream} opacity={interpolate(t, [fixedAt + 1.2, fixedAt + 2.5], [0, 1])}>
            steady. strong. unbroken.
          </text>
        )}
        <GrainOverlay id="heart" />
      </svg>
      </ShotFrame>
      <Rise at={76} size={58} align="left">At 15, his heart raced too fast.<br /><b>Surgery fixed it in days.</b></Rise>
    </>
  );
};

/* ---------------- Shot 5: hunger (90–100) ---------------- */
const ShotRun: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30 - 90;
  const pose = step12(frame) ? POSES.run1 : POSES.run2;
  const groundOff = (t * 900) % 480;
  return (
    <>
      <ShotFrame cam={`scale(${interpolate(t, [0, 10], [1, 1.16])})`}>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%", display: "block" }}>
        <PaperDefs id="run" />
        <rect width={1920} height={1080} fill={PAPER.redDark} />
        <rect width={1920} height={1080} fill="url(#run-nightsky)" opacity={0.35} />
        {/* speed lines */}
        {[...Array(26)].map((_, i) => {
          const y = (i * 173) % 1080;
          const x = 1920 - ((t * 2600 + i * 419) % 2400);
          return <rect key={i} x={x} y={y} width={220 + (i % 3) * 120} height={7}
            fill={PAPER.gold} opacity={0.28} transform={`skewX(-18)`} />;
        })}
        {/* scrolling ground */}
        {[-1, 0, 1, 2, 3, 4].map((i) => (
          <g key={i} transform={`translate(${i * 480 - groundOff} 0)`}>
            <rect x={0} y={820} width={240} height={260} fill={PAPER.ink} opacity={0.5} filter="url(#run-torn-sm)" />
          </g>
        ))}
        <rect y={820} width={1920} height={260} fill={PAPER.ink} opacity={0.35} />
        {/* the runner, larger than life */}
        <PaperFigure id="run" x={820} y={880} scale={2.6} pose={pose} shirt={PAPER.red} />
        <GrainOverlay id="run" />
      </svg>
      </ShotFrame>
      <Rise at={91} size={62} align="left">They fixed his heart.<br /><b>Not his hunger.</b></Rise>
    </>
  );
};

export const Island: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  if (t < 29.7 || t > 100.3) return null;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {t >= 30 && t < 45.4 && <ShotIsland />}
      {t >= 45 && t < 60.4 && <ShotBoy />}
      {t >= 60 && t < 75.4 && <ShotBoat />}
      {t >= 75 && t < 90.4 && <ShotHeart />}
      {t >= 90 && <ShotRun />}
      <TearWipe at={45} color={PAPER.skyDark} />
      <TearWipe at={60} color={PAPER.night} />
      <TearWipe at={75} color="#1a0f0e" />
      <TearWipe at={90} color={PAPER.redDark} />
      <Scrim opacity={0.35} />
      <ActTransition at={99.2} />
    </AbsoluteFill>
  );
};
