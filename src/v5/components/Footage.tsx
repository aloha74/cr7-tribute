import React from "react";
import { interpolate, Video, useCurrentFrame } from "remotion";
import { FPS } from "../cue";

/**
 * Footage cut with continuous zoom (never a static frame).
 * `srcIn`: seconds into the source file. `speed`: playback speed.
 * `crop`: [top,right,bottom,left] fractions to cut away (e.g. watermark).
 */
export const Footage: React.FC<{
  src: string; at: number; dur: number; srcIn?: number; srcFps?: number;
  zoomFrom?: number; zoomTo?: number; speed?: number;
  crop?: [number, number, number, number];
  darken?: number;
}> = ({ src, at, dur, srcIn = 0, srcFps = 25, zoomFrom = 1.05, zoomTo = 1.3, speed = 1, crop = [0, 0, 0, 0], darken = 0 }) => {
  const frame = useCurrentFrame();
  const t = frame / FPS - at;
  if (t < 0 || t > dur) return null;
  const p = Math.min(1, Math.max(0, t / dur));
  const zoom = interpolate(p, [0, 1], [zoomFrom, zoomTo]);
  const [ct, cr, cb, cl] = crop;
  const startFrom = Math.round(srcIn * srcFps);
  return (
    <div style={{ position: "absolute", inset: -80, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})` }}>
        <Video
          src={src}
          startFrom={startFrom}
          playbackRate={speed}
          muted
          style={{
            width: "100%", height: "100%", objectFit: "cover",
            clipPath: `inset(${ct * 100}% ${cr * 100}% ${cb * 100}% ${cl * 100}%)`,
          }}
        />
      </div>
      {darken > 0 && <div style={{ position: "absolute", inset: 0, backgroundColor: "#000", opacity: darken }} />}
    </div>
  );
};
