/**
 * What the drawing loop draws on: the transferred half of the page canvas in a
 * worker, or the element itself on the main-thread fallback. Both expose the
 * size and `getContext`, which is all the renderer touches.
 */
export type OverlayCanvas = HTMLCanvasElement | OffscreenCanvas;

/** Everything the page tells the overlay. The DOM stays on the page side. */
export type GlitchMessage =
	| { kind: "mount"; canvas: OverlayCanvas }
	| { kind: "resize"; width: number; height: number }
	| { kind: "hidden"; value: boolean }
	| { kind: "still"; value: boolean }
	| { kind: "burst"; strength: number };

/**
 * The other direction. `ready` is the worker answering whether it can get a
 * WebGL2 context — a transferred canvas can never be handed back, so the page
 * must know before it gives one away. `painted` is the first frame on screen,
 * which is what the canvas fades in on.
 */
export type DriverMessage = { kind: "ready"; canRender: boolean } | { kind: "painted" };

/** One frame's worth of shader input. */
export type FrameState = {
	/** Seconds since the overlay started. */
	time: number;
	/** Distortion strength, 0-1: scanline slips and the odd red line. */
	glitch: number;
};
