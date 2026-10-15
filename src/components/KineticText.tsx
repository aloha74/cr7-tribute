import React from "react";
import { interpolate, spring } from "remotion";
import { WHITE } from "../timeline";

interface KineticTextProps {
	text: string;
	frame: number;
	fps: number;
	delay?: number;
	color?: string;
	fontSize?: number;
	fontWeight?: number;
	letterSpacing?: string;
	fontFamily?: string;
	align?: "center" | "left";
}

/**
 * Kinetic typography: each word flies in with a spring,
 * rising from below with a slight overshoot.
 */
export const KineticText: React.FC<KineticTextProps> = ({
	text,
	frame,
	fps,
	delay = 0,
	color = WHITE,
	fontSize = 72,
	fontWeight = 800,
	letterSpacing = "0.08em",
	fontFamily = "Anton, sans-serif",
	align = "center",
}) => {
	const words = text.split(" ");

	return (
		<div
			style={{
				display: "flex",
				flexWrap: "wrap",
				justifyContent: align === "center" ? "center" : "flex-start",
				gap: "0.35em",
			}}
		>
			{words.map((word, i) => {
				const wordFrame = frame - delay - i * 7;
				const progress = spring({
					frame: wordFrame,
					fps,
					config: { damping: 200, stiffness: 120, mass: 0.6 },
				});
				const opacity = interpolate(wordFrame, [0, 10], [0, 1], {
					extrapolateLeft: "clamp",
					extrapolateRight: "clamp",
				});
				return (
					<span
						key={`${word}-${i}`}
						style={{
							display: "inline-block",
							color,
							fontSize,
							fontWeight,
							letterSpacing,
							fontFamily,
							opacity,
							transform: `translateY(${(1 - progress) * 90}px) scale(${
								0.5 + 0.5 * progress
							}) rotate(${(1 - progress) * -6}deg)`,
							textShadow: "0 6px 40px rgba(0,0,0,0.6)",
						}}
					>
						{word}
					</span>
				);
			})}
		</div>
	);
};
