import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Easing, spring, useVideoConfig } from "remotion";
import { PAPER, PaperDefs, PaperFigure, POSES, GrainOverlay } from "../components/Paper";
import { Rise, Slam, Scrim, Counter } from "../components/Kinetic";
import { ActTransition } from "../components/ActTransition";

const step12 = (frame: number) => Math.floor(frame / 2.5) % 2;

/** Rubber stamp slamming onto paper. */
const Stamp: React.FC<{ at: number; children: React.ReactNode; color?: string; rotate?: number }> = ({
  at, children, color = PAPER.redDark, rotate = -8,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame - at * fps;
  if (t < 0) return null;
  const s = spring({ frame: t, fps, config: { damping: 9, stiffness: 220, mass: 1.1 } });
  const scale = interpolate(s, [0, 1], [2.6, 1]);
  const rot = interpolate(s, [0, 1], [rotate - 14, rotate]);
  const ink = interpolate(Math.min(1, t / 10), [0, 1], [0.55, 1]); // ink settles
  return (
    <div style={{
      position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
      transform: `scale(${scale}) rotate(${rot}deg)`, opacity: ink, pointerEvents: "none",
    }}>
      <div style={{
        border: `10px solid ${color}`, borderRadius: 18, padding: "26px 64px",
        outline: `4px solid ${color}`, outlineOffset: 10,
        fontFamily: "'Anton', sans-serif", fontSize: 120, color, letterSpacing: "0.06em",
        textTransform: "uppercase", background: "rgba(255,255,255,0.06)",
        maskImage: "url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 3 -1'/></filter><rect width='120' height='120' filter='url(%23n)'/></svg>\")",
        maskSize: "120px",
      }}>{children}</div>
    </div>
  );
};

const TearWipe: React.FC<{ at: number; color?: string }> = ({ at, color = PAPER.ink }) => {
  const frame = useCurrentFrame();
  const t = (frame - at * 30) / 14;
  if (t < 0 || t > 1.2) return null;
  const e = Easing.inOut(Easing.cubic)(Math.min(1, t));
  const x = interpolate(e, [0, 1], [-400, 2200]);
  return (
    <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 50 }}>
      <defs>
        <filter id="wipe2-torn" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.008 0.03" numOctaves="2" seed="33" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="60" />
        </filter>
      </defs>
      <g transform={`translate(${x} 0)`}>
        <rect x={-2600} y={-100} width={2600} height={1280} fill={color} filter="url(#wipe2-torn)" />
      </g>
    </svg>
  );
};

/* ---------- 100–115: Manchester, the skinny kid ---------- */
const ShotManchester: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30 - 100;
  // stepover cycle at 12fps
  const poses = [POSES.kick, POSES.walk1, POSES.walk2, POSES.run1];
  const pose = poses[Math.floor(frame / 2.5) % 4];
  const rain = [...Array(60)].map((_, i) => ({
    x: (i * 331) % 2000, y: ((i * 977) % 1100 + t * 900) % 1200 - 60, l: 60 + (i % 5) * 18,
  }));
  return (
    <div style={{ position: "absolute", inset: -80 }}>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%", display: "block" }}>
        <PaperDefs id="mnc" />
        <rect width={1920} height={1080} fill="#5a6a72" />
        <rect width={1920} height={1080} fill="url(#mnc-nightsky)" opacity={0.5} />
        {rain.map((r, i) => (
          <line key={i} x1={r.x} y1={r.y} x2={r.x - 14} y2={r.y + r.l} stroke="#cfe0e8" strokeWidth={3} opacity={0.35} />
        ))}
        {/* old trafford hint: stands */}
        <rect y={560} width={1920} height={220} fill="#3d4a52" filter="url(#mnc-torn-sm)" />
        {[...Array(24)].map((_, i) => (
          <circle key={i} cx={60 + i * 78} cy={620 + (i % 3) * 34} r={13} fill="#2c373d" />
        ))}
        <rect y={780} width={1920} height={300} fill="#4a7a3e" filter="url(#mnc-torn-sm)" />
        <PaperFigure id="mnc" x={960} y={940} scale={1.9} pose={pose} shirt={PAPER.red} shorts={PAPER.white} />
        {/* ball glued to his feet */}
        <g transform={`translate(${1010 + Math.sin(t * 9) * 40} 905)`}>
          <circle r={24} fill={PAPER.white} stroke={PAPER.ink} strokeWidth={4} />
        </g>
        <GrainOverlay id="mnc" />
      </svg>
      <Stamp at={101}>Manchester · 2003</Stamp>
      <Rise at={104} size={58} align="left">A skinny kid <b>with tricks.</b></Rise>
    </div>
  );
};

/* ---------- 115–130: Moscow 2008, the header ---------- */
const ShotMoscow: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30 - 115;
  const jumpP = interpolate(Math.min(1, Math.max(0, (t - 2) / 1.1)), [0, 1], [0, 1]);
  const je = Easing.out(Easing.cubic)(jumpP < 0.5 ? jumpP * 2 : (1 - jumpP) * 2);
  // ball arcs toward goal as he jumps
  const bt = Math.min(1, Math.max(0, (t - 2) / 1.4));
  const ballX = interpolate(bt, [0, 1], [560, 1450]);
  const ballY = interpolate(bt, [0, 1], [700, 420]) - Math.sin(bt * Math.PI) * 160;
  return (
    <div style={{ position: "absolute", inset: -80 }}>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%", display: "block" }}>
        <PaperDefs id="mow" />
        <rect width={1920} height={1080} fill="url(#mow-nightsky)" />
        {[...Array(50)].map((_, i) => (
          <circle key={i} cx={(i * 389) % 1920} cy={(i * 173) % 480} r={2.6} fill="#fff" opacity={0.5} />
        ))}
        {/* stadium bowl */}
        <ellipse cx={960} cy={1150} rx={1150} ry={620} fill="#1d2a3a" filter="url(#mow-torn-sm)" />
        <ellipse cx={960} cy={1150} rx={1150} ry={560} fill="#24344a" filter="url(#mow-torn-sm)" />
        {[...Array(40)].map((_, i) => (
          <circle key={i} cx={120 + i * 44} cy={640 + Math.sin(i * 0.7) * 60} r={12} fill="#31445c" />
        ))}
        {/* goal */}
        <g transform="translate(1450 560)">
          <rect x={-130} y={-180} width={260} height={180} fill="none" stroke={PAPER.white} strokeWidth={10} />
          <path d="M -130 -180 L -190 -230 L 70 -230 L 130 -180" fill="none" stroke={PAPER.white} strokeWidth={6} opacity={0.7} />
        </g>
        {/* the header silhouette */}
        <g transform={`translate(0 ${-je * 260})`}>
          <PaperFigure id="mow" x={980} y={900} scale={2.0} pose={POSES.jump} shirt={"#101318"} shorts={"#101318"} skin={"#0d0f13"} />
        </g>
        {/* ball */}
        <g transform={`translate(${ballX} ${ballY})`} opacity={bt > 0 ? 1 : 0}>
          <circle r={22} fill={PAPER.white} stroke={PAPER.ink} strokeWidth={4}
            style={{ filter: "drop-shadow(0 0 18px rgba(255,255,255,0.7))" }} />
        </g>
        {/* trophy rising */}
        <g transform={`translate(420 ${interpolate(Math.min(1, Math.max(0, (t - 8) / 2)), [0, 1], [300, 0])})`} opacity={t > 8 ? 1 : 0}>
          <g style={{ filter: "drop-shadow(0 0 40px rgba(245,197,24,0.6))" }}>
            <path d="M -60 -120 L 60 -120 L 44 -20 L 20 -20 L 20 40 L 60 70 L -60 70 L -20 40 L -20 -20 L -44 -20 Z"
              fill={PAPER.gold} filter="url(#mow-torn-sm)" />
            <path d="M -60 -120 C -110 -110 -110 -50 -44 -40 M 60 -120 C 110 -110 110 -50 44 -40"
              fill="none" stroke={PAPER.gold} strokeWidth={14} />
            <rect x={-70} y={70} width={140} height={26} fill={PAPER.goldDeep} />
          </g>
        </g>
        <GrainOverlay id="mow" />
      </svg>
      <Rise at={116} size={56} align="left">Moscow, 2008. His header opened the final —<br />decided on penalties. <b>Champion of Europe.</b></Rise>
    </div>
  );
};

/* ---------- 130–145: Ballon d'Or ---------- */
const ShotBallon: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30 - 130;
  const shineX = ((t * 500) % 1400) - 700;
  return (
    <>
    <div style={{ position: "absolute", inset: -80, transform: `scale(${interpolate(t, [0, 15], [1, 1.06])})` }}>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%", display: "block" }}>
        <PaperDefs id="bal" />
        <rect width={1920} height={1080} fill="#141210" />
        <circle cx={960} cy={480} r={430} fill="url(#bal-glow)" opacity={0.5} />
        {/* ribbon */}
        <path d="M 860 -40 L 960 220 L 1060 -40 L 990 -40 L 990 160 L 930 160 L 930 -40 Z"
          fill={PAPER.red} filter="url(#bal-torn-sm)" />
        {/* medal */}
        <g transform={`translate(960 480) rotate(${Math.sin(t * 0.8) * 4})`}>
          <circle r={230} fill={PAPER.gold} filter="url(#bal-torn)" />
          <circle r={230} fill="none" stroke={PAPER.goldDeep} strokeWidth={10} />
          <circle r={185} fill="none" stroke={PAPER.goldDeep} strokeWidth={4} opacity={0.7} />
          <path d="M 0 -120 L 34 -38 L 122 -38 L 52 18 L 78 104 L 0 52 L -78 104 L -52 18 L -122 -38 L -34 -38 Z"
            fill={PAPER.goldDeep} />
          <text y={190} textAnchor="middle" fontFamily="'Anton', sans-serif" fontSize={72} fill={PAPER.goldDeep}>2008</text>
          {/* shine sweep */}
          <g transform={`translate(${shineX} 0)`} opacity={0.55}>
            <rect x={-40} y={-260} width={90} height={520} fill="#fff" transform="skewX(-18)" />
          </g>
        </g>
        {/* confetti */}
        {[...Array(30)].map((_, i) => (
          <rect key={i} x={(i * 397 + t * 60) % 2000 - 40} y={(i * 631 - t * 160) % 1200}
            width={16} height={10} fill={i % 2 ? PAPER.gold : PAPER.red}
            transform={`rotate(${t * 120 + i * 40})`} opacity={0.85} />
        ))}
        <GrainOverlay id="bal" />
      </svg>
    </div>
      <Rise at={131} size={60} align="left">The best in the world. <b>At 23.</b></Rise>
    </>
  );
};

/* ---------- 145–165: Madrid, €94M ---------- */
const ShotMadrid: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30 - 145;
  return (
    <div style={{ position: "absolute", inset: -80 }}>
      <svg viewBox="0 0 1920 1080" style={{ width: "100%", height: "100%", display: "block" }}>
        <PaperDefs id="mad" />
        <rect width={1920} height={1080} fill={PAPER.cream} />
        {/* giant paper numerals counting */}
        <GrainOverlay id="mad" />
      </svg>
      <div style={{ position: "absolute", inset: 0, transform: "translateY(-300px)" }}>
        <Stamp at={146} color={PAPER.redDark}>Madrid · 2009</Stamp>
      </div>
      <Counter at={149} dur={6} to={94} size={380} color={PAPER.redDark} />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 560 }}>
        <div style={{ fontFamily: "'Anton', sans-serif", fontSize: 72, color: PAPER.redDark, letterSpacing: "0.04em" }}>MILLION EUROS</div>
      </div>
      <Rise at={156} until={162} size={56} align="left" color={PAPER.ink}>
        A world record. They bought a star —<br /><b>they got an obsession.</b>
      </Rise>
    </div>
  );
};

export const Ascent: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  if (t < 99.7 || t > 165.4) return null;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {t >= 100 && t < 115.4 && <ShotManchester />}
      {t >= 115 && t < 130.4 && <ShotMoscow />}
      {t >= 130 && t < 145.4 && <ShotBallon />}
      {t >= 145 && <ShotMadrid />}
      <TearWipe at={115} color="#5a6a72" />
      <TearWipe at={130} color="#0d1420" />
      <TearWipe at={145} color={PAPER.cream} />
      <Scrim opacity={0.3} />
      <ActTransition at={164.2} />
    </AbsoluteFill>
  );
};
