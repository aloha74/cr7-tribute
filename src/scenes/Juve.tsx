import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { FilmGrain } from "../components/FilmGrain";
import { KineticText } from "../components/KineticText";
import { PhotoLayer } from "../components/PhotoLayer";
import { Scene } from "../components/Scene";
import { SceneTransition } from "../components/SceneTransition";
import { DIM, WHITE, fadeInOut, sceneTiming } from "../timeline";

/** Scene 6 — Juventus (109–122s). Flash transition in. */
export const Juve: React.FC = () => {
	const frame = useCurrentFrame();
	const { durationInFrames } = sceneTiming("juve");
	const opacity = fadeInOut(frame, durationInFrames);
	const stripeShift = interpolate(frame, [0, durationInFrames], [0, -120]);

	return (
		<Scene>
			{/* Layer 1 — background: diagonal black/white stripes drifting */}
			<div
				style={{
					position: "absolute",
					inset: -300,
					opacity: 0.1 * opacity,
					background:
						"repeating-linear-gradient(115deg, #ffffff 0px, #ffffff 46px, #000000 46px, #000000 92px)",
					transform: `translateX(${stripeShift}px)`,
				}}
			/>
			{/* Layer 2 — midground: CR7 Juventus 2019 photo, right side */}
			<PhotoLayer
				src="images/cr7-juve-2019.jpg"
				frame={frame}
				fps={30}
				durationInFrames={durationInFrames}
				side="right"
			/>
			{/* Layer 3 — foreground: typography, left side */}
			<div
				style={{
					opacity,
					position: "absolute",
					left: 120,
					top: "50%",
					transform: "translateY(-50%)",
					display: "flex",
					flexDirection: "column",
					alignItems: "flex-start",
					maxWidth: 980,
				}}
			>
				<div style={{ fontFamily: "Inter, sans-serif", fontSize: 38, fontWeight: 700, letterSpacing: "0.55em", color: DIM }}>
					2018 — 2021
				</div>
				<div style={{ margin: "34px 0" }}>
					<KineticText text="JUVENTUS" frame={frame} fps={30} delay={25} color={WHITE} fontSize={200} align="left" />
				</div>
				<KineticText text="CONQUERING ITALY" frame={frame} fps={30} delay={70} color={WHITE} fontSize={52} align="left" />
				<div style={{ marginTop: 30, fontFamily: "Inter, sans-serif", fontSize: 30, color: DIM }}>
					Back-to-back Serie A titles · 101 goals in 134 games
				</div>
			</div>

			<FilmGrain frame={frame} />
			<SceneTransition frame={frame} type="flash" />
		</Scene>
	);
};
