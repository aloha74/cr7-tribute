import React from "react";
import { Easing, interpolate } from "remotion";
import { DIM, GOLD } from "../timeline";

interface StatCounterProps {
	from: number;
	to: number;
	frame: number;
	fps: number;
	duration: number;
	delay?: number;
	suffix?: string;
	label?: string;
	color?: string;
	fontSize?: number;
}

/** Animated number counter: eases from `from` to `to` over `duration` frames. */
export const StatCounter: React.FC<StatCounterProps> = ({
	from,
	to,
	frame,
	fps,
	duration,
	delay = 0,
	suffix = "",
	label = "",
	color = GOLD,
	fontSize = 170,
}) => {
	const local = frame - delay;
	const value = interpolate(local, [0, duration], [from, to], {
		easing: Easing.out(Easing.cubic),
		extrapolateLeft: "clamp",
		extrapolateRight: "clamp",
	});
	const display = Math.round(value).toLocaleString("en-US");

	return (
		<div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
			<div
				style={{
					fontFamily: "Anton, sans-serif",
					fontSize,
					color,
					lineHeight: 1,
					textShadow: `0 0 80px ${color}55, 0 8px 40px rgba(0,0,0,0.6)`,
				}}
			>
				{display}
				{suffix}
			</div>
			{label ? (
				<div
					style={{
						marginTop: 18,
						fontFamily: "Inter, sans-serif",
						fontSize: 34,
						fontWeight: 600,
						letterSpacing: "0.35em",
						color: DIM,
					}}
				>
					{label}
				</div>
			) : null}
		</div>
	);
};
