import React from "react";

/** Deterministic pseudo-random in [0,1). */
const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/**
 * Builds a torn-paper clip-path polygon: a rectangle whose edges are jittered.
 * `jag` controls how rough the tear is (px), `seed` varies the tear pattern.
 */
export const tornClipPath = (seed = 1, jag = 14, steps = 26): string => {
  const pts: string[] = [];
  // top edge (left → right)
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * 100;
    const y = rand(seed + i) * jag;
    pts.push(`${x.toFixed(2)}% ${(y / 10).toFixed(2)}%`);
  }
  // right edge (top → bottom)
  for (let i = 1; i <= steps; i++) {
    const y = (i / steps) * 100;
    const x = 100 - (rand(seed + 100 + i) * jag) / 10;
    pts.push(`${x.toFixed(2)}% ${y.toFixed(2)}%`);
  }
  // bottom edge (right → left)
  for (let i = 1; i <= steps; i++) {
    const x = 100 - (i / steps) * 100;
    const y = 100 - (rand(seed + 200 + i) * jag) / 10;
    pts.push(`${x.toFixed(2)}% ${y.toFixed(2)}%`);
  }
  // left edge (bottom → top)
  for (let i = 1; i < steps; i++) {
    const y = 100 - (i / steps) * 100;
    const x = (rand(seed + 300 + i) * jag) / 10;
    pts.push(`${x.toFixed(2)}% ${y.toFixed(2)}%`);
  }
  return `polygon(${pts.join(", ")})`;
};

interface TornFrameProps {
  children: React.ReactNode;
  seed?: number;
  jag?: number;
  /** paper mat color showing at the torn edge */
  mat?: string;
  style?: React.CSSProperties;
}

/**
 * A piece of torn paper: the content is clipped with a jagged edge and sits
 * on a slightly larger paper mat with a soft shadow — the paper-cut collage look.
 */
export const TornFrame: React.FC<TornFrameProps> = ({
  children,
  seed = 1,
  jag = 14,
  mat = "#f4ead8",
  style,
}) => (
  <div style={{ position: "relative", ...style }}>
    {/* paper mat */}
    <div
      style={{
        position: "absolute",
        inset: -18,
        backgroundColor: mat,
        clipPath: tornClipPath(seed + 999, jag + 6),
        boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
      }}
    />
    {/* content with torn edge */}
    <div
      style={{
        position: "relative",
        clipPath: tornClipPath(seed, jag),
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  </div>
);

/** Full-bleed paper texture background (kraft/dark). */
export const PaperBg: React.FC<{ color?: string; children?: React.ReactNode }> = ({
  color = "#141210",
  children,
}) => (
  <div style={{ position: "absolute", inset: 0, backgroundColor: color, overflow: "hidden" }}>
    {/* fibre speckle */}
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity: 0.5,
        backgroundImage:
          "radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
        backgroundSize: "7px 7px",
      }}
    />
    {children}
  </div>
);
