/**
 * The page side: picks where the loop runs, hands it the canvas, and forwards
 * what only the DOM can see — size, visibility, motion preference, bursts.
 */

import type { DriverMessage, GlitchMessage } from "./types";

/** How long the page itself shakes on a triggered burst, in ms. */
const SHAKE_MS = 260;

/** A burst inside this window of the last one is dropped, so hover spam cannot strobe. */
const COOLDOWN_MS = 600;

type Port = (message: GlitchMessage, transfer?: Transferable[]) => void;

let port: Port | null = null;
let lastBurst = Number.NEGATIVE_INFINITY;
const motion = matchMedia("(prefers-reduced-motion: reduce)");

function receive({ message, canvas }: { message: DriverMessage; canvas: HTMLCanvasElement }): void {
	if (message.kind === "painted") canvas.classList.add("is-painted");
}

function workerIsPlausible(): boolean {
	return (
		typeof Worker !== "undefined" &&
		typeof OffscreenCanvas !== "undefined" &&
		"transferControlToOffscreen" in HTMLCanvasElement.prototype
	);
}

// The fallback: the same loop on the main thread, fetched only where it runs.
async function runLocally({ canvas }: { canvas: HTMLCanvasElement }): Promise<Port> {
	const { handleGlitchMessage, setReporter } = await import("./handler");
	setReporter({ send: (message) => receive({ message, canvas }) });
	handleGlitchMessage({ message: { kind: "mount", canvas } });
	return (message) => handleGlitchMessage({ message });
}

// Waits for the worker to say it can render before transferring the canvas —
// the transfer is one-way, and a worker that cannot draw would strand it.
function runInWorker({ canvas }: { canvas: HTMLCanvasElement }): Promise<Port> {
	const worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });

	return new Promise((resolve) => {
		worker.addEventListener("message", (event: MessageEvent<DriverMessage>) => {
			const message = event.data;
			if (message.kind !== "ready") {
				receive({ message, canvas });
				return;
			}

			if (!message.canRender) {
				worker.terminate();
				resolve(runLocally({ canvas }));
				return;
			}

			const offscreen = canvas.transferControlToOffscreen();
			worker.postMessage({ kind: "mount", canvas: offscreen }, [offscreen]);
			resolve((outbound, transfer = []) => worker.postMessage(outbound, transfer));
		});
	});
}

function listen({ canvas, send }: { canvas: HTMLCanvasElement; send: Port }): void {
	send({ kind: "still", value: motion.matches });
	motion.addEventListener("change", () => send({ kind: "still", value: motion.matches }));

	const syncHidden = (): void => send({ kind: "hidden", value: document.hidden });
	syncHidden();
	document.addEventListener("visibilitychange", syncHidden);
	addEventListener("pageshow", syncHidden);

	// Observed rather than read from `clientWidth`, so a resize never forces a
	// layout flush.
	new ResizeObserver(([box]) => {
		send({ kind: "resize", width: box.contentRect.width, height: box.contentRect.height });
	}).observe(canvas);
}

// Mounts the overlay once; later calls are no-ops.
export async function mountGlitch({ canvas }: { canvas: HTMLCanvasElement }): Promise<void> {
	if (port) return;

	const send = await (workerIsPlausible() ? runInWorker({ canvas }) : runLocally({ canvas }));
	port = send;
	listen({ canvas, send });
}

// A burst the reader caused. A light one only disturbs the glass; a full one
// jolts the page with it. Ignored under reduced motion and inside the cooldown.
export function burst({ strength }: { strength: number }): void {
	const now = performance.now();
	if (motion.matches || now - lastBurst < COOLDOWN_MS) return;
	lastBurst = now;

	port?.({ kind: "burst", strength });
	if (strength < 1) return;

	const root = document.documentElement;
	root.classList.add("is-glitching");
	setTimeout(() => root.classList.remove("is-glitching"), SHAKE_MS);
}
