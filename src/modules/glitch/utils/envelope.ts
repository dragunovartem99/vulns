import { hash } from "./random";

/**
 * The idle schedule splits time into slots; each slot holds at most one short
 * burst. Long enough that the page reads as calm, short enough that it never
 * quite feels safe.
 */
export const SLOT_SECONDS = 3.5;

/** Chance a slot holds a burst at all. */
export const BURST_CHANCE = 0.45;

/** How long an idle burst lasts, in seconds. */
export const IDLE_DURATION = 0.22;

/** How long a burst the reader triggered lasts, in seconds. */
export const TRIGGERED_DURATION = 0.45;

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

// The ambient glitching: deterministic in `time`, so every frame of a slot
// agrees on where its burst sits and how strong it is.
export function idleEnvelope({ time }: { time: number }): number {
	const slot = Math.floor(time / SLOT_SECONDS);
	if (hash(slot) >= BURST_CHANCE) return 0;

	const offset = hash(slot + 7919) * (SLOT_SECONDS - IDLE_DURATION);
	const strength = 0.35 + hash(slot + 104_729) * 0.45;
	const start = slot * SLOT_SECONDS + offset;

	return strength * burstEnvelope({ time, start, duration: IDLE_DURATION });
}
