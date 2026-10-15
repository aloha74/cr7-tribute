import React from "react";
import { interpolate, spring, useCurrentFrame } from "remotion";
import { KineticText } from "../components/KineticText";
import { Scene } from "../components/Scene";
import { DIM, GOLD, WHITE, fadeInOut, sceneTiming } from "../timeline";

const MILESTONES = [
	{ year: "1985", label: "MADEIRA", sub: "Born in Funchal, Portugal" },
	{ year: "2002", label: "SPORTING CP", sub: "First-team debut at 17" },
];

/** Scene 2 — Origins timeline (20–50s). */
export const Origins: React.FC = () => {
	const frame = useCurrentFrame();
	const { durationInFrames } = sceneTiming("origins");
	const opacity = fadeInOut(frame, durationInFrames);
	const lineScale = interpolate(frame, [20, 80], [0, 1], {
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});

	return (
		<Scene>
			<div style={{ opacity, display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
				<KineticText text="WHERE IT ALL BEGAN" frame={frame} fps={30} delay={10} color={WHITE} fontSize={96} />

				{/* Timeline line */}
				<div style={{ position: "relative", width: 1200, height: 6, margin: "90px 0 60px" }}>
					<div
						style={{
							position: "absolute",
							inset: 0,
							background: `linear-gradient(90deg, ${GOLD}, rgba(245,197,24,0.25))`,
							transform: `scaleX(${lineScale})`,
							transformOrigin: "left center",
							borderRadius: 3,
						}}
					/>
					{MILESTONES.map((m, i) => {
						const x = i === 0 ? "8%" : "92%";
						const pop = spring({ frame: frame - (60 + i * 70), fps: 30, config: { damping: 200 } });
						return (
							<div key={m.year} style={{ position: "absolute", left: x, top: -14, transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center" }}>
								<div
									style={{
										width: 34,
										height: 34,
										borderRadius: "50%",
										background: GOLD,
										boxShadow: `0 0 40px ${GOLD}`,
										transform: `scale(${pop})`,
									}}
								/>
								<div style={{ marginTop: 26, fontFamily: "Anton, sans-serif", fontSize: 64, color: GOLD, opacity: pop }}>
									{m.year}
								</div>
								<div style={{ fontFamily: "Inter, sans-serif", fontSize: 36, fontWeight: 700, letterSpacing: "0.25em", color: WHITE, opacity: pop }}>
									{m.label}
								</div>
								<div style={{ fontFamily: "Inter, sans-serif", fontSize: 28, color: DIM, opacity: pop }}>
									{m.sub}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</Scene>
	);
};
