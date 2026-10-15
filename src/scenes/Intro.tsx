import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { FilmGrain } from "../components/FilmGrain";
import { KineticText } from "../components/KineticText";
import { PhotoLayer } from "../components/PhotoLayer";
import { Scene } from "../components/Scene";
import { DIM, GOLD, WHITE, fadeInOut, sceneTiming } from "../timeline";

/** Scene 1 — Hero title (0–17s). Photo background + rotating rays + hero type. */
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
			{/* Layer 1 — background: CR7 2013 photo, dimmed + blurred */}
			<PhotoLayer
				src="images/cr7-2013.jpg"
				frame={frame}
				fps={30}
				durationInFrames={durationInFrames}
				side="full"
			/>

			{/* Layer 2 — midground: rotating light rays */}
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

			{/* Layer 3 — foreground: hero typography */}
			<div style={{ opacity, display: "flex", flexDirection: "column", alignItems: "center" }}>
				<div
					style={{
						fontFamily: "Inter, sans-serif",
						fontSize: 40,
						letterSpacing: "1.1em",
						fontWeight: 600,
						color: DIM,
						marginBottom: 30,
						textIndent: "1.1em",
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

			<FilmGrain frame={frame} />
		</Scene>
	);
};
