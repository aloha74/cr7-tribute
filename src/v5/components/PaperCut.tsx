import React from "react";
import { Img, interpolate, useCurrentFrame } from "remotion";
import { FPS } from "../cue";

/**
 * Paper-cut scene: single art image with continuous camera drift + slow zoom.
 * Never static: drift + zoom + subtle rotation always in motion.
 * flashBeats: array of seconds where a white flash fires.
 */
export const PaperCut: React.FC<{
  src: string; at: number; dur: number;
  zoomFrom?: number; zoomTo?: number;
  driftX?: number; driftY?: number;
  flashAt?: number[];
  darken?: number;
}> = ({ src, at, dur, zoomFrom = 1.02, zoomTo = 1.22, driftX = 60, driftY = -30, flashAt = [], darken = 0 }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS - at;
  if (t < 0 || t > dur) return null;
  const p = Math.min(1, Math.max(0, t / dur));
  const zoom = interpolate(p, [0, 1], [zoomFrom, zoomTo]);
  // continuous drift with slight ease wobble — never linear-static
  const dx = interpolate(p, [0, 1], [0, driftX]) + Math.sin(t * 1.7) * 6;
  const dy = interpolate(p, [0, 1], [0, driftY]) + Math.cos(t * 1.3) * 6;
  const rot = Math.sin(t * 0.5) * 0.4;
  const flash = flashAt.some((f) => Math.abs(t - f) < 0.09) ? 0.55 : 0;
  return (
    <div style={{ position: "absolute", inset: -120, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom}) translate(${dx}px, ${dy}px) rotate(${rot}deg)` }}>
        <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
      {darken > 0 && <div style={{ position: "absolute", inset: 0, backgroundColor: "#000", opacity: darken }} />}
      {flash > 0 && <div style={{ position: "absolute", inset: 0, backgroundColor: "#fff6d8", opacity: flash, pointerEvents: "none" }} />}
    </div>
  );
};
