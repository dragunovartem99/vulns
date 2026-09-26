/** How long a burst lasts, in seconds. */
export const BURST_DURATION = 0.45;

// A sharp attack and a ragged decay, 0-1 across `duration`, zero outside it.
// Stepped into a few levels so it jumps rather than fades — glitches do not ease.
export function burstEnvelope({
	time,
	start,
	duration,
}: {
	time: number;
	start: number;
	duration: number;
}): number {
	const t = (time - start) / duration;
	if (t < 0 || t >= 1) return 0;

	const decay = t < 0.15 ? 1 : 1 - (t - 0.15) / 0.85;
	return Math.ceil(decay * 4) / 4;
}
