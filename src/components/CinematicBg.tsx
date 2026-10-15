import React from "react";
import { Img, staticFile, useCurrentFrame, interpolate } from "remotion";

export type GradeKind = "gold" | "red" | "cool" | "dark";

const GRADE_TINT: Record<GradeKind, string> = {
  gold: "rgba(245, 179, 1, 0.10)",
  red: "rgba(227, 62, 43, 0.12)",
  cool: "rgba(60, 120, 200, 0.10)",
  dark: "rgba(0, 0, 0, 0.0)",
};

interface CinematicBgProps {
  src: string;
  durationInFrames: number;
  /** zoom at the end of the scene, 1 = static */
  zoom?: number;
  /** horizontal drift in px over the scene */
  driftX?: number;
  /** vertical drift in px over the scene */
  driftY?: number;
  grade?: GradeKind;
  /** extra black overlay opacity 0..1 for text legibility */
  dim?: number;
}

/**
 * Full-bleed 16:9 background with a slow Ken Burns move and a cinematic grade.
 * Photos are pre-cropped to 1920x1080 (see public/images/bg/) so nothing is
 * awkwardly covered — the frame is always intentional.
 */
export const CinematicBg: React.FC<CinematicBgProps> = ({
  src,
  durationInFrames,
  zoom = 1.12,
  driftX = 0,
  driftY = 0,
  grade = "gold",
  dim = 0.45,
}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateRight: "clamp",
  });
  const scale = interpolate(progress, [0, 1], [1, zoom]);
  const x = interpolate(progress, [0, 1], [0, driftX]);
  const y = interpolate(progress, [0, 1], [0, driftY]);

  return (
    <div
      style={{
        position: "absolute",
        inset: -80,
        overflow: "hidden",
        backgroundColor: "#000",
      }}
    >
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: `scale(${scale}) translate(${x}px, ${y}px)`,
          transformOrigin: "center",
        }}
      />
      {/* cinematic grade: tint wash */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: GRADE_TINT[grade],
          mixBlendMode: "overlay",
        }}
      />
      {/* legibility scrim: darker at edges, readable center */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 90% 75% at 50% 45%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: `rgba(0,0,0,${dim})`,
        }}
      />
    </div>
  );
};
