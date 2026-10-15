import React from "react";
import { AbsoluteFill } from "remotion";

interface FilmGrainProps {
	frame: number;
}

/**
 * Animated film grain overlay using SVG feTurbulence.
 * Drifts slightly with the frame for a living, cinematic texture.
 */
export const FilmGrain: React.FC<FilmGrainProps> = ({ frame }) => {
	const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='280' height='280'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='280' height='280' filter='url(%23n)' opacity='0.55'/></svg>`;
	const shiftX = (frame * 7) % 280;
	const shiftY = (frame * 11) % 280;

	return (
		<AbsoluteFill
			style={{
				pointerEvents: "none",
				opacity: 0.07,
				overflow: "hidden",
			}}
		>
			<div
				style={{
					position: "absolute",
					left: -280,
					top: -280,
					right: -280,
					bottom: -280,
					backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(svg)}")`,
					backgroundRepeat: "repeat",
					transform: `translate(${-shiftX}px, ${-shiftY}px)`,
				}}
			/>
		</AbsoluteFill>
	);
};
