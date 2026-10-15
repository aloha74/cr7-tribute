import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { KineticText } from "../components/KineticText";
import { Scene } from "../components/Scene";
import { DIM, GOLD, WHITE, fadeInOut, sceneTiming } from "../timeline";

/** Scene 1 — Hero title (0–20s). */
export const Intro: React.FC = () => {
	const frame = useCurrentFrame();
	const { durationInFrames } = sceneTiming("intro");
	const opacity = fadeInOut(frame, durationInFrames, 20, 25);
	const rotation = interpolate(frame, [0, durationInFrames], [0, 45]);
	const scale = interpolate(frame, [0, 90], [1.15, 1], {
		extrapolateRight: "clamp",
	});

	return (
		<Scene>
			{/* Rotating light rays */}
			<AbsoluteFill style={{ justifyContent: "center", alignItems: "center", opacity: opacity * 0.9 }}>
				<div
					style={{
						width: 2600,
						height: 2600,
						borderRadius: "50%",
						background:
							"repeating-conic-gradient(from 0deg, rgba(245,197,24,0.055) 0deg 7deg, transparent 7deg 22deg)",
						transform: `rotate(${rotation}deg) scale(${scale})`,
					}}
				/>
			</AbsoluteFill>

			<div style={{ opacity, display: "flex", flexDirection: "column", alignItems: "center" }}>
				<div
					style={{
						fontFamily: "Inter, sans-serif",
						fontSize: 40,
						letterSpacing: "0.9em",
						color: DIM,
						marginBottom: 30,
					}}
				>
					THE GREATEST OF ALL TIME
				</div>
				<KineticText text="CRISTIANO" frame={frame} fps={30} delay={25} color={GOLD} fontSize={210} />
				<KineticText text="RONALDO" frame={frame} fps={30} delay={55} color={WHITE} fontSize={210} />
				<div
					style={{
						marginTop: 44,
						height: 4,
						width: interpolate(frame, [60, 130], [0, 520], {
							extrapolateLeft: "clamp",
							extrapolateRight: "clamp",
						}),
						background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
					}}
				/>
			</div>
		</Scene>
	);
};
