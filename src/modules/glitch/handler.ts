/**
 * The drawing loop, identical wherever it runs: fed plain messages, it owns the
 * context and the clock. `worker.ts` wires it to `postMessage`; the main-thread
 * fallback calls it directly.
 */

import { createRenderer } from "./renderer";
import type { Renderer } from "./renderer";
import type { DriverMessage, GlitchMessage } from "./types";
import { burstEnvelope, idleEnvelope, TRIGGERED_DURATION } from "./utils/envelope";

/**
 * The buffer is drawn at half the CSS size and stretched. Grain and scanlines
 * are meant to be coarse, so the lost resolution is the look — and it is a
 * quarter of the fill rate.
 */
const RESOLUTION_SCALE = 0.5;

/** Nothing on screen moves faster than 24 steps a second, so 30 fps is plenty. */
const FRAME_MS = 1000 / 30;

let renderer: Renderer | null = null;
let report: (message: DriverMessage) => void = () => {};
let painted = false;
let hidden = false;
let still = false;
let burstStart = Number.NEGATIVE_INFINITY;
let burstStrength = 0;
let lastFrame = 0;
let pending = false;

const epoch = performance.now();

const seconds = (now: number): number => (now - epoch) / 1000;

export function setReporter({ send }: { send: (message: DriverMessage) => void }): void {
	report = send;
}

function draw(now: number): void {
	if (!renderer) return;

	const time = seconds(now);
	const glitch = still
		? 0
		: Math.max(
				idleEnvelope({ time }),
				burstStrength *
					burstEnvelope({ time, start: burstStart, duration: TRIGGERED_DURATION })
			);

	// Under reduced motion the one frame drawn is frozen at t = 0, so the grain
	// never shifts between redraws on resize.
	renderer.draw({ time: still ? 0 : time, glitch });

	if (!painted) {
		painted = true;
		report({ kind: "painted" });
	}
}

function tick(now: number): void {
	pending = false;
	if (hidden || still) return;

	if (now - lastFrame >= FRAME_MS) {
		lastFrame = now;
		draw(now);
	}
	schedule();
}

function schedule(): void {
	if (pending || hidden || still || !renderer) return;
	pending = true;
	requestAnimationFrame(tick);
}

export function handleGlitchMessage({ message }: { message: GlitchMessage }): void {
	switch (message.kind) {
		case "mount":
			renderer ??= createRenderer({ canvas: message.canvas });
			break;
		case "resize":
			renderer?.resize({
				width: Math.max(1, Math.round(message.width * RESOLUTION_SCALE)),
				height: Math.max(1, Math.round(message.height * RESOLUTION_SCALE)),
			});
			// Resizing clears the buffer; a stopped loop would leave it empty.
			draw(performance.now());
			break;
		case "hidden":
			hidden = message.value;
			break;
		case "still":
			still = message.value;
			if (still) draw(performance.now());
			break;
		case "burst":
			burstStart = seconds(performance.now());
			burstStrength = message.strength;
			break;
	}
	schedule();
}
