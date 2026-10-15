import React from "react";
import { AbsoluteFill } from "remotion";

interface SceneProps {
	children: React.ReactNode;
}

/**
 * Scene wrapper: cinematic dark gradient background + vignette + top light glow.
 * Every scene renders its content centered inside this.
 */
export const Scene: React.FC<SceneProps> = ({ children }) => {
	return (
		<AbsoluteFill
			style={{
				background:
					"radial-gradient(ellipse 90% 70% at 50% 42%, #1c1c26 0%, #0b0b10 62%, #000000 100%)",
				justifyContent: "center",
				alignItems: "center",
				overflow: "hidden",
			}}
		>
			{/* Top light glow */}
			<AbsoluteFill
				style={{
					background:
						"radial-gradient(ellipse 60% 22% at 50% 0%, rgba(245,197,24,0.14) 0%, transparent 70%)",
				}}
			/>
			{/* Vignette */}
			<AbsoluteFill
				style={{
					background:
						"radial-gradient(ellipse at center, transparent 52%, rgba(0,0,0,0.78) 100%)",
				}}
			/>
			{/* Content */}
			<AbsoluteFill
				style={{
					justifyContent: "center",
					alignItems: "center",
					padding: "0 140px",
				}}
			>
				{children}
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
