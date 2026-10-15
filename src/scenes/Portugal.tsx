import React from "react";
import { interpolate, spring, useCurrentFrame } from "remotion";
import { KineticText } from "../components/KineticText";
import { Scene } from "../components/Scene";
import { DIM, GOLD, WHITE, fadeInOut, sceneTiming } from "../timeline";

/** Scene 7 — Portugal, Euro 2016 (140–170s). */
export const Portugal: React.FC = () => {
	const frame = useCurrentFrame();
	const { durationInFrames } = sceneTiming("portugal");
	const opacity = fadeInOut(frame, durationInFrames);
	const trophyPop = spring({ frame: frame - 90, fps: 30, config: { damping: 200 } });
	const shineX = interpolate(frame, [90, 220], [-260, 260], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<Scene>
			{/* Subtle red/green nod to the Portuguese flag */}
			<div
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					height: 10,
					opacity,
					background: "linear-gradient(90deg, #046a38 0 40%, #da291c 40% 100%)",
				}}
			/>
			<div style={{ opacity, display: "flex", flexDirection: "column", alignItems: "center" }}>
				<KineticText text="EURO 2016" frame={frame} fps={30} delay={15} color={GOLD} fontSize={170} />
				<KineticText text="CHAMPIONS" frame={frame} fps={30} delay={45} color={WHITE} fontSize={120} />

				{/* Trophy medallion with shine sweep */}
				<div
					style={{
						position: "relative",
						marginTop: 54,
						width: 240,
						height: 240,
						borderRadius: "50%",
						border: `4px solid ${GOLD}`,
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						transform: `scale(${trophyPop})`,
						overflow: "hidden",
						boxShadow: `0 0 90px rgba(245,197,24,0.35)`,
					}}
				>
					<div style={{ fontFamily: "Anton, sans-serif", fontSize: 92, color: GOLD }}>EURO</div>
					<div
						style={{
							position: "absolute",
							top: -20,
							bottom: -20,
							width: 60,
							left: shineX,
							background: "linear-gradient(105deg, transparent, rgba(255,255,255,0.5), transparent)",
							transform: "skewX(-18deg)",
						}}
					/>
				</div>

				<div style={{ marginTop: 44, fontFamily: "Inter, sans-serif", fontSize: 32, letterSpacing: "0.3em", color: DIM }}>
					ALL-TIME TOP INTERNATIONAL SCORER
				</div>
			</div>
		</Scene>
	);
};
