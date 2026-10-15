import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { FilmGrain } from "../components/FilmGrain";
import { KineticText } from "../components/KineticText";
import { PhotoLayer } from "../components/PhotoLayer";
import { Scene } from "../components/Scene";
import { SceneTransition } from "../components/SceneTransition";
import { StatCounter } from "../components/StatCounter";
import { DIM, GOLD, WHITE, fadeInOut, sceneTiming } from "../timeline";

/** Scene 5 — Real Madrid era, 450 goals (83–109s). Whip transition in. */
export const Madrid: React.FC = () => {
	const frame = useCurrentFrame();
	const { durationInFrames } = sceneTiming("madrid");
	const opacity = fadeInOut(frame, durationInFrames);
	// Pulsing glow behind the counter
	const glow = 0.5 + 0.5 * Math.sin((frame / 30) * Math.PI * 1.4);

	return (
		<Scene>
			{/* Layer 2 — midground: CR7 free-kick photo (Real Madrid), left side */}
			<PhotoLayer
				src="images/cr7-freekick.jpg"
				frame={frame}
				fps={30}
				durationInFrames={durationInFrames}
				side="left"
			/>

			{/* Pulsing glow accent */}
			<div
				style={{
					position: "absolute",
					width: 1100,
					height: 1100,
					borderRadius: "50%",
					background: `radial-gradient(circle, rgba(245,197,24,${0.1 + glow * 0.08}) 0%, transparent 65%)`,
				}}
			/>

			{/* Layer 3 — foreground: 450 goals counter, right side */}
			<div
				style={{
					opacity,
					position: "absolute",
					right: 130,
					top: "50%",
					transform: "translateY(-50%)",
					display: "flex",
					flexDirection: "column",
					alignItems: "flex-end",
					textAlign: "right",
					maxWidth: 900,
				}}
			>
				<div style={{ fontFamily: "Inter, sans-serif", fontSize: 38, fontWeight: 700, letterSpacing: "0.55em", color: DIM }}>
					REAL MADRID · 2009 — 2018
				</div>
				<div style={{ margin: "40px 0" }}>
					<StatCounter
						from={0}
						to={450}
						frame={frame}
						fps={30}
						duration={180}
						delay={40}
						label="GOALS — ALL-TIME CLUB RECORD"
						color={GOLD}
						fontSize={230}
					/>
				</div>
				<KineticText text="THE GREATEST GOALSCORER IN CLUB HISTORY" frame={frame} fps={30} delay={120} color={WHITE} fontSize={44} align="left" />
				<div
					style={{
						marginTop: 36,
						height: 3,
						width: interpolate(frame, [140, 220], [0, 700], {
							extrapolateLeft: "clamp",
							extrapolateRight: "clamp",
						}),
						background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
					}}
				/>
			</div>

			<FilmGrain frame={frame} />
			<SceneTransition frame={frame} type="whip" />
		</Scene>
	);
};
