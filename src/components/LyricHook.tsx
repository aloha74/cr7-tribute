import React from "react";
import { interpolate, spring } from "remotion";
import { GOLD } from "../timeline";

interface LyricHookProps {
	text: string;
	frame: number;
	fps: number;
	delay?: number;
	fontSize?: number;
}

/**
 * Short lyric-hook line: words pop in with springs + gold glow.
 * Only original, self-written hook phrases are used across the video
 * (no song lyrics): "GREATNESS IS EARNED" (glory1),
 * "RELENTLESS" (goals), "BUILT BY SACRIFICE" (legacy).
 */
export const LyricHook: React.FC<LyricHookProps> = ({
	text,
	frame,
	fps,
	delay = 0,
	fontSize = 54,
}) => {
	const words = text.split(" ");

	return (
		<div
			style={{
				display: "flex",
				flexWrap: "wrap",
				justifyContent: "center",
				gap: "0.4em",
			}}
		>
			{words.map((word, i) => {
				const wordFrame = frame - delay - i * 8;
				const pop = spring({
					frame: wordFrame,
					fps,
					config: { damping: 200, stiffness: 170, mass: 0.55 },
				});
				const opacity = interpolate(wordFrame, [0, 8], [0, 1], {
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
				});
				return (
					<span
						key={`${word}-${i}`}
						style={{
							display: "inline-block",
							fontFamily: "Anton, sans-serif",
							fontSize,
							letterSpacing: "0.14em",
							color: GOLD,
							opacity,
							transform: `translateY(${(1 - pop) * 60}px) scale(${0.6 + 0.4 * pop})`,
							textShadow: `0 0 34px ${GOLD}88, 0 0 90px ${GOLD}44, 0 4px 18px rgba(0,0,0,0.7)`,
						}}
					>
						{word}
					</span>
				);
			})}
		</div>
	);
};
