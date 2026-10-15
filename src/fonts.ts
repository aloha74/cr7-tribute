import { continueRender, delayRender } from "remotion";
import "@fontsource/anton"; // self-hosted, no network at render time
import "@fontsource/inter/400.css";
import "@fontsource/inter/700.css";

/**
 * Block rendering until the bundled fonts are ready.
 * Fonts come from @fontsource (npm), so renders work offline.
 */
export const loadLocalFonts = (): void => {
	const handle = delayRender("Loading local fonts");

	Promise.all([
		document.fonts.load('100px Anton'),
		document.fonts.load('16px Inter'),
		document.fonts.load('700 16px Inter'),
	])
		.catch((err) => {
			// eslint-disable-next-line no-console
			console.error("Font loading failed, continuing anyway:", err);
		})
		.finally(() => continueRender(handle));
};
