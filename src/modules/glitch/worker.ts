/**
 * The worker entry: the loop runs here, off the main thread, so scrolling and
 * the page's own work never cost the overlay a frame — or the other way round.
 */

import { handleGlitchMessage, setReporter } from "./handler";
import type { DriverMessage, GlitchMessage } from "./types";

function send(message: DriverMessage): void {
	postMessage(message);
}

// Whether this worker can actually render, not merely exist: some engines have
// `OffscreenCanvas` but no WebGL2 on it off the main thread.
function canRender(): boolean {
	try {
		return new OffscreenCanvas(1, 1).getContext("webgl2") !== null;
	} catch {
		return false;
	}
}

addEventListener("message", (event: MessageEvent<GlitchMessage>) => {
	handleGlitchMessage({ message: event.data });
});

setReporter({ send });
send({ kind: "ready", canRender: canRender() });
