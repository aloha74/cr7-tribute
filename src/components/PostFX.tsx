import React from "react";

export const GOLD = "#f5c518";

/** Shared headline style: massive condensed uppercase. */
export const headline = (size: number, color = "#ffffff"): React.CSSProperties => ({
  fontFamily: "'Anton', sans-serif",
  fontSize: size,
  lineHeight: 0.95,
  letterSpacing: "0.01em",
  color,
  textTransform: "uppercase",
  margin: 0,
});

/** Small tracked kicker style. */
export const kicker = (size = 30, color = "rgba(255,255,255,0.75)"): React.CSSProperties => ({
  fontFamily: "'Inter', sans-serif",
  fontSize: size,
  fontWeight: 600,
  letterSpacing: "0.55em",
  textTransform: "uppercase",
  color,
  margin: 0,
});

/**
 * Bloom: renders children twice — a blurred, additive glow copy behind the
 * sharp copy. This is the cheap, reliable stand-in for postprocessing bloom.
 */
export const Bloom: React.FC<{
  children: React.ReactNode;
  color?: string;
  blur?: number;
  opacity?: number;
  style?: React.CSSProperties;
}> = ({ children, color = GOLD, blur = 26, opacity = 0.85, style }) => (
  <div style={{ position: "relative", ...style }}>
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        filter: `blur(${blur}px)`,
        opacity,
        color,
        mixBlendMode: "screen",
      }}
    >
      {children}
    </div>
    <div style={{ position: "relative" }}>{children}</div>
  </div>
);

/** Cinematic vignette overlay. */
export const Vignette: React.FC = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background:
        "radial-gradient(ellipse 105% 90% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 100%)",
    }}
  />
);

/** Giant watermark numeral sitting behind the content. */
export const Watermark: React.FC<{ children: React.ReactNode; opacity?: number }> = ({
  children,
  opacity = 0.1,
}) => (
  <div
    aria-hidden
    style={{
      position: "absolute",
      right: -40,
      bottom: -120,
      fontFamily: "'Anton', sans-serif",
      fontSize: 720,
      lineHeight: 1,
      color: "#ffffff",
      opacity,
      pointerEvents: "none",
      userSelect: "none",
    }}
  >
    {children}
  </div>
);
