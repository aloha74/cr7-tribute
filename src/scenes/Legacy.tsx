import React from "react";
import { interpolate, spring, useCurrentFrame } from "remotion";
import { FilmGrain } from "../components/FilmGrain";
import { LyricHook } from "../components/LyricHook";
import { PhotoLayer } from "../components/PhotoLayer";
import { Scene } from "../components/Scene";
import { SceneTransition } from "../components/SceneTransition";
import { DIM, GOLD, WHITE, fadeInOut, sceneTiming } from "../timeline";

/** Scene 9 — Legacy: the SIUUU celebration (175–201s). Flash transition in. */
export const Legacy: React.FC = () => {
	const frame = useCurrentFrame();
	const { durationInFrames } = sceneTiming("legacy");
	const opacity = fadeInOut(frame, durationInFrames);
	const letters = "SIUUU".split("");
	// Shockwave ring expanding on the jump
	const shock = interpolate(frame, [70, 170], [0.2, 1.6], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const shockOpacity = interpolate(frame, [70, 170], [0.7, 0], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<Scene>
			{/* Layer 1 — background: celebration photo, dimmed full plate */}
			<PhotoLayer
				src="images/cr7-celebration.jpg"
				frame={frame}
				fps={30}
				durationInFrames={durationInFrames}
				side="full"
			/>
			{/* Shockwave */}
			<div
				style={{
					position: "absolute",
					width: 900,
					height: 900,
					borderRadius: "50%",
					border: `6px solid ${GOLD}`,
					opacity: shockOpacity * opacity,
					transform: `scale(${shock})`,
				}}
			/>
			<div style={{ opacity, display: "flex", flexDirection: "column", alignItems: "center" }}>
				<div style={{ display: "flex", gap: 18 }}>
					{letters.map((ch, i) => {
						const bounce = spring({
							frame: frame - (30 + i * 9),
							fps: 30,
							config: { damping: 120, stiffness: 160 },
						});
						const jumpY = spring({
							frame: frame - (120 + i * 6),
							fps: 30,
							config: { damping: 200 },
						});
						return (
							<span
								key={i}
								style={{
									display: "inline-block",
									fontFamily: "Anton, sans-serif",
									fontSize: 250,
									color: i === 0 ? GOLD : WHITE,
									transform: `translateY(${(1 - bounce) * 160 - jumpY * 46}px) scale(${0.4 + 0.6 * bounce})`,
									textShadow: `0 0 90px ${GOLD}55, 0 10px 40px rgba(0,0,0,0.7)`,
								}}
							>
								{ch}
							</span>
						);
					})}
				</div>
				<div style={{ marginTop: 44 }}>
					<LyricHook text="BUILT BY SACRIFICE" frame={frame} fps={30} delay={210} fontSize={40} />
				</div>
				<div
					style={{
						marginTop: 44,
						fontFamily: "Inter, sans-serif",
						fontSize: 36,
						letterSpacing: "0.5em",
						color: DIM,
						opacity: interpolate(frame, [150, 200], [0, 1], {
							extrapolateLeft: "clamp",
							extrapolateRight: "clamp",
						}),
					}}
				>
					THE LEGACY LIVES ON
				</div>
			</div>

			<FilmGrain frame={frame} />
			<SceneTransition frame={frame} type="flash" />
		</Scene>
	);
};
