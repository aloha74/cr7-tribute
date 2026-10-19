import React from "react";

/** Paper-cut visual system for v4. Torn edges, grain, drop shadows, palette. */

export const PAPER = {
  kraft: "#d9b382",
  kraftDark: "#b98f5e",
  kraftDeep: "#8f6b3f",
  red: "#b03a2e",
  redDark: "#7e2a22",
  cream: "#f3e9d2",
  ink: "#161310",
  ocean: "#2e5a7a",
  oceanDark: "#1b3548",
  oceanDeep: "#12242f",
  gold: "#f5c518",
  goldDeep: "#c79a10",
  sky: "#e9dcc0",
  skyDark: "#d3c096",
  night: "#0d1420",
  nightBlue: "#14202f",
  white: "#f7f2e4",
};

let filterSeq = 0;

/**
 * SVG defs: torn-edge displacement, paper grain, soft drop shadow.
 * Render once per SVG scene. `id` must be unique per document.
 */
export const PaperDefs: React.FC<{ id: string }> = ({ id }) => (
  <defs>
    <filter id={`${id}-torn`} x="-8%" y="-8%" width="116%" height="116%">
      <feTurbulence type="fractalNoise" baseFrequency="0.012 0.02" numOctaves="2" seed="7" result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale="26" />
    </filter>
    <filter id={`${id}-torn-sm`} x="-8%" y="-8%" width="116%" height="116%">
      <feTurbulence type="fractalNoise" baseFrequency="0.03 0.05" numOctaves="2" seed="11" result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale="12" />
    </filter>
    <filter id={`${id}-pshadow`} x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#000" floodOpacity="0.45" />
    </filter>
    <filter id={`${id}-pshadow-sm`} x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#000" floodOpacity="0.4" />
    </filter>
    {/* paper fibre grain tile */}
    <filter id={`${id}-grain`}>
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" result="n" />
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.06 0" />
      <feComposite operator="over" in2="SourceGraphic" />
    </filter>
    <radialGradient id={`${id}-glow`} cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#fff8e0" stopOpacity="0.9" />
      <stop offset="40%" stopColor="#f5c518" stopOpacity="0.35" />
      <stop offset="100%" stopColor="#f5c518" stopOpacity="0" />
    </radialGradient>
    <linearGradient id={`${id}-sea`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={PAPER.ocean} />
      <stop offset="100%" stopColor={PAPER.oceanDeep} />
    </linearGradient>
    <linearGradient id={`${id}-skyday`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor={PAPER.sky} />
      <stop offset="100%" stopColor={PAPER.skyDark} />
    </linearGradient>
    <linearGradient id={`${id}-nightsky`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#0d1420" />
      <stop offset="100%" stopColor="#1b2a3d" />
    </linearGradient>
  </defs>
);

export const uid = (p: string) => {
  filterSeq += 1;
  return `${p}-${filterSeq}`;
};

/** Full-bleed paper grain overlay (cheap: one rect with the grain filter). */
export const GrainOverlay: React.FC<{ id: string; opacity?: number }> = ({ id, opacity = 1 }) => (
  <rect x={0} y={0} width={1920} height={1080} fill="none" filter={`url(#${id}-grain)`} opacity={opacity} pointerEvents="none" />
);

/** Paper wave band — layered ocean waves. `y` baseline, `amp`, animated by phase. */
export const Waves: React.FC<{ id: string; y: number; amp?: number; phase?: number; color?: string; color2?: string }> = ({
  id, y, amp = 26, phase = 0, color = PAPER.ocean, color2 = PAPER.oceanDark,
}) => {
  const wave = (off: number, a: number, yy: number) => {
    let d = `M -60 ${yy} `;
    for (let x = -60; x <= 1980; x += 120) {
      d += `Q ${x + 60} ${yy - a * Math.sin(phase + x / 300 + off)}, ${x + 120} ${yy} `;
    }
    d += `L 1980 1120 L -60 1120 Z`;
    return d;
  };
  return (
    <g>
      <path d={wave(0, amp, y + 34)} fill={color2} opacity={0.85} filter={`url(#${id}-torn-sm)`} />
      <path d={wave(2.1, amp * 1.25, y)} fill={color} filter={`url(#${id}-torn-sm)`} />
      <path d={wave(4.2, amp * 0.7, y - 26)} fill={PAPER.white} opacity={0.28} />
    </g>
  );
};

/** Simple jointed paper figure (profile, facing right). Pose via limb angles. */
export const PaperFigure: React.FC<{
  id: string;
  x: number; y: number; scale?: number;
  skin?: string; shirt?: string; shorts?: string;
  pose: { torso: number; headTilt: number; armF: number; armB: number; legF: number; legB: number; kneeF: number; kneeB: number };
}> = ({ id, x, y, scale = 1, skin = "#e8b98a", shirt = PAPER.red, shorts = "#f3e9d2", pose }) => {
  const limb = (len: number, w: number, ang: number, col: string) => (
    <rect x={-w / 2} y={0} width={w} height={len} rx={w / 2} fill={col}
      transform={`rotate(${ang})`} filter={`url(#${id}-torn-sm)`} />
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} filter={`url(#${id}-pshadow-sm)`}>
      {/* back leg */}
      <g transform="translate(0 -96)">
        <g transform={`rotate(${pose.legB})`}>{limb(52, 20, 0, skin)}<g transform="translate(0 52)"><g transform={`rotate(${pose.kneeB})`}>{limb(50, 17, 0, skin)}</g></g></g>
      </g>
      {/* back arm */}
      <g transform="translate(0 -168)">
        <g transform={`rotate(${pose.armB})`}>{limb(58, 18, 0, shirt)}<g transform="translate(0 58)"><g transform={`rotate(18)`}>{limb(46, 15, 0, skin)}</g></g></g>
      </g>
      {/* torso */}
      <g transform={`rotate(${pose.torso})`}>
        <rect x={-26} y={-178} width={52} height={92} rx={14} fill={shirt} filter={`url(#${id}-torn-sm)`} />
      </g>
      <rect x={-24} y={-96} width={48} height={30} rx={8} fill={shorts} filter={`url(#${id}-torn-sm)`} />
      {/* front leg */}
      <g transform="translate(0 -96)">
        <g transform={`rotate(${pose.legF})`}>{limb(52, 20, 0, skin)}<g transform="translate(0 52)"><g transform={`rotate(${pose.kneeF})`}>{limb(50, 17, 0, skin)}</g></g></g>
      </g>
      {/* front arm */}
      <g transform="translate(0 -168)">
        <g transform={`rotate(${pose.armF})`}>{limb(58, 18, 0, shirt)}<g transform="translate(0 58)"><g transform={`rotate(-14)`}>{limb(46, 15, 0, skin)}</g></g></g>
      </g>
      {/* head */}
      <g transform={`translate(6 -206) rotate(${pose.headTilt})`}>
        <circle r={30} fill={skin} filter={`url(#${id}-torn-sm)`} />
        <path d="M -30 -6 A 30 30 0 0 1 30 -6 L 30 -16 A 34 34 0 0 0 -30 -16 Z" fill={PAPER.ink} />
        <circle cx={12} cy={2} r={3.4} fill={PAPER.ink} />
      </g>
    </g>
  );
};

export const POSES = {
  stand: { torso: 0, headTilt: 0, armF: 12, armB: -12, legF: 8, legB: -8, kneeF: 6, kneeB: 6 },
  walk1: { torso: 4, headTilt: 2, armF: 34, armB: -30, legF: 38, legB: -30, kneeF: 10, kneeB: 42 },
  walk2: { torso: 4, headTilt: -2, armF: -30, armB: 34, legF: -30, legB: 38, kneeF: 42, kneeB: 10 },
  run1: { torso: 12, headTilt: 4, armF: 62, armB: -58, legF: 64, legB: -52, kneeF: 18, kneeB: 88 },
  run2: { torso: 12, headTilt: -4, armF: -58, armB: 62, legF: -52, legB: 64, kneeF: 88, kneeB: 18 },
  kick: { torso: -8, headTilt: 0, armF: 48, armB: -40, legF: 74, legB: -18, kneeF: 8, kneeB: 30 },
  jump: { torso: -6, headTilt: -8, armF: -70, armB: -80, legF: 30, legB: -34, kneeF: 60, kneeB: 66 },
  cheer: { torso: -10, headTilt: -14, armF: -150, armB: -160, legF: 10, legB: -10, kneeF: 8, kneeB: 8 },
  sideline: { torso: 6, headTilt: 0, armF: 70, armB: 20, legF: 6, legB: -6, kneeF: 4, kneeB: 4 },
};
