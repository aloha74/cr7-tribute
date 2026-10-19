import React from "react";
import { useCurrentFrame } from "remotion";
import { beatPhase, FPS } from "../cue";

/** Conditional visibility window for static layers. */
export const Show: React.FC<{ at: number; until: number; children: React.ReactNode }> = ({ at, until, children }) => {
  const t = useCurrentFrame() / FPS;
  if (t < at || t > until) return null;
  return <>{children}</>;
};

/** Screen shake synced to beats. Wraps any children. */
export const Shake: React.FC<{ at: number; until: number; amp?: number; children: React.ReactNode }> = ({ at, until, amp = 14, children }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (t < at || t > until) return null;
  const p = Math.exp(-3.2 * beatPhase(t));
  // deterministic pseudo-random per frame
  const r = (n: number) => {
    const x = Math.sin(frame * 127.1 + n * 311.7) * 43758.5453;
    return (x - Math.floor(x)) * 2 - 1;
  };
  return (
    <div style={{ position: "absolute", inset: -40, transform: `translate(${r(1) * amp * p}px, ${r(2) * amp * p}px) rotate(${r(3) * 0.6 * p}deg)` }}>
      {children}
    </div>
  );
};

/** Glitch slices: horizontal strips offset randomly, active in bursts. */
export const Glitch: React.FC<{ at: number; until: number; intensity?: number; children: React.ReactNode }> = ({ at, until, intensity = 1, children }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const r = (n: number) => {
    const x = Math.sin(frame * 91.7 + n * 179.3) * 24634.6345;
    return (x - Math.floor(x)) * 2 - 1;
  };
  if (t < at || t > until) return null;
  const burst = (frame % 9) < 5; // glitch comes in bursts
  if (!burst) return <>{children}</>;
  const strips = 5;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {Array.from({ length: strips }).map((_, i) => (
        <div key={i} style={{
          position: "absolute", left: -60, right: -60, top: `${(i / strips) * 100}%`, height: `${100 / strips}%`,
          overflow: "hidden", transform: `translateX(${r(i) * 46 * intensity}px)`,
        }}>
          <div style={{ position: "absolute", left: 60, right: 60, top: `${-(i / strips) * 100 * strips}%`, height: `${strips * 100}%`, transform: `translateX(${-r(i) * 46 * intensity}px)` }}>
            {children}
          </div>
        </div>
      ))}
      {/* RGB split overlay */}
      <div style={{ position: "absolute", inset: 0, mixBlendMode: "screen", opacity: 0.5, transform: `translateX(${r(9) * 10}px)`, filter: "sepia(1) saturate(4) hue-rotate(-50deg)" }}>
        {children}
      </div>
    </div>
  );
};

/** Lightning bolt SVG flashing on beats. */
export const Lightning: React.FC<{ at: number; until: number; x?: number; flip?: boolean; scale?: number }> = ({ at, until, x = 200, flip, scale = 1 }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (t < at || t > until) return null;
  const o = Math.exp(-2.5 * beatPhase(t));
  if (o < 0.05) return null;
  return (
    <svg viewBox="0 0 200 900" style={{
      position: "absolute", left: x, top: -40, height: 1160, opacity: o,
      transform: `scaleX(${flip ? -1 : 1}) scale(${scale})`,
      filter: "drop-shadow(0 0 24px rgba(245,197,24,0.9))", pointerEvents: "none",
    }}>
      <polyline points="110,0 60,220 120,220 50,480 115,480 40,760 100,760 70,900"
        fill="none" stroke="#ffe9a8" strokeWidth="14" strokeLinejoin="round" />
      <polyline points="110,0 60,220 120,220 50,480 115,480 40,760 100,760 70,900"
        fill="none" stroke="#f5c518" strokeWidth="5" strokeLinejoin="round" />
    </svg>
  );
};

/** Vignette + animated grain so no frame is ever perfectly still. */
export const Grade: React.FC = () => {
  const frame = useCurrentFrame();
  const r = (n: number) => {
    const x = Math.sin(frame * 13.7 + n * 71.3) * 19483.37;
    return x - Math.floor(x);
  };
  return (
    <>
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.5) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 0.05, transform: `translate(${r(1) * 8}px, ${r(2) * 8}px)`, backgroundImage: "repeating-conic-gradient(rgba(255,255,255,0.6) 0% 25%, transparent 0% 50%)", backgroundSize: "4px 4px" }} />
    </>
  );
};

/** Whip-pan transition band between acts. */
export const Whip: React.FC<{ at: number; dur?: number; color?: string }> = ({ at, dur = 0.35, color = "#0d0d0f" }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  if (t < at || t > at + dur) return null;
  const p = (t - at) / dur;
  const x = (1 - p) * 220 - 10;
  return (
    <div style={{ position: "absolute", inset: -60, pointerEvents: "none", transform: `translateX(${x}%) skewX(-12deg)`, background: `linear-gradient(90deg, transparent, ${color} 30%, ${color} 70%, transparent)` }} />
  );
};
