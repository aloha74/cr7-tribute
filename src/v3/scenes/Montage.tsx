import React from "react";
import { AbsoluteFill, Sequence, Video, staticFile, useCurrentFrame } from "remotion";
import { PaperPeel } from "../components/PaperPeel";
import { Rise } from "../components/Kinetic";
import { FilmGrain } from "../../components/FilmGrain";
import { Vignette } from "../../components/PostFX";
import { v3seg, } from "../timeline";
import { FPS } from "../../timeline";
import { CLIPS } from "../footage";

const SEG = v3seg("montage");

/** Each clip lands on a music hit, labelled with HOW the goal was scored —
 *  the montage makes the Vox argument: every way to score, mastered. */
const CUTS: { hit: number; clip: number; label: string }[] = [
  { hit: 108.3, clip: 1, label: "left foot" },
  { hit: 112.0, clip: 2, label: "header" },
  { hit: 115.2, clip: 3, label: "free kick" },
  { hit: 124.3, clip: 4, label: "volley" },
  { hit: 127.5, clip: 5, label: "chip" },
  { hit: 137.7, clip: 6, label: "long range" },
  { hit: 140.9, clip: 7, label: "tap-in" },
  { hit: 145.5, clip: 8, label: "bicycle" },
];

export const Montage: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      {CUTS.map((c, i) => {
        const from = Math.round(c.hit * FPS) - SEG.start;
        const nextHit = i < CUTS.length - 1 ? CUTS[i + 1].hit : 152.4;
        const dur = Math.round((nextHit - c.hit) * FPS);
        return (
          <Sequence key={i} from={from} durationInFrames={dur}>
            <Video
              src={staticFile(CLIPS[c.clip])}
              muted
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.25)" }} />
            <div style={{ position: "absolute", left: 90, bottom: 90 }}>
              <Rise at={c.hit + 0.4} sceneStart={SEG.start} distance={40}>
                <span
                  style={{
                    fontFamily: "'Anton', sans-serif",
                    fontSize: 64,
                    color: "#f5c518",
                    textTransform: "uppercase",
                    textShadow: "0 8px 40px rgba(0,0,0,0.7)",
                  }}
                >
                  {c.label}
                </span>
              </Rise>
            </div>
          </Sequence>
        );
      })}

      <Vignette />
      <PaperPeel seed={57} />
      <FilmGrain frame={frame} />
    </AbsoluteFill>
  );
};
