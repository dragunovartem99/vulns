import { describe, expect, it } from "vitest";

import {
	burstEnvelope,
	IDLE_DURATION,
	idleEnvelope,
	SLOT_SECONDS,
	TRIGGERED_DURATION,
} from "../utils/envelope";
import { hash } from "../utils/random";

const STEP = 0.005;

// The idle envelope, sampled every STEP seconds across [from, to).
function sample({ from, to }: { from: number; to: number }): number[] {
	const count = Math.floor((to - from) / STEP);
	return Array.from({ length: count }, (_, i) => idleEnvelope({ time: from + i * STEP }));
}

function risingEdges(values: number[]): number {
	return values.filter((value, i) => value > 0 && (i === 0 || values[i - 1] === 0)).length;
}

function activeSeconds(values: number[]): number {
	return values.filter((value) => value > 0).length * STEP;
}

describe("hash", () => {
	it("stays in [0, 1)", () => {
		for (let n = -1000; n < 1000; n++) {
			const value = hash(n);
			expect(value).toBeGreaterThanOrEqual(0);
			expect(value).toBeLessThan(1);
		}
	});

	it("is stable for the same input", () => {
		expect(hash(42)).toBe(hash(42));
	});
});

describe("burstEnvelope", () => {
	const duration = TRIGGERED_DURATION;

	it("is zero before the start and from the end on", () => {
		expect(burstEnvelope({ time: 0.99, start: 1, duration })).toBe(0);
		expect(burstEnvelope({ time: duration, start: 0, duration })).toBe(0);
	});

	it("hits full strength immediately", () => {
		expect(burstEnvelope({ time: 1, start: 1, duration })).toBe(1);
	});

	it("never rises once it starts decaying", () => {
		let previous = 1;
		for (let t = 0; t < duration; t += duration / 50) {
			const value = burstEnvelope({ time: t, start: 0, duration });
			expect(value).toBeLessThanOrEqual(previous);
			previous = value;
		}
	});
});

describe("idleEnvelope", () => {
	it("stays within [0, 1]", () => {
		for (let t = 0; t < 600; t += 0.01) {
			const value = idleEnvelope({ time: t });
			expect(value).toBeGreaterThanOrEqual(0);
			expect(value).toBeLessThanOrEqual(1);
		}
	});

	it("holds at most one burst per slot, no longer than the idle duration", () => {
		for (let slot = 0; slot < 200; slot++) {
			const values = sample({ from: slot * SLOT_SECONDS, to: (slot + 1) * SLOT_SECONDS });
			expect(risingEdges(values)).toBeLessThanOrEqual(1);
			expect(activeSeconds(values)).toBeLessThanOrEqual(IDLE_DURATION + STEP);
		}
	});

	it("is quiet most of the time", () => {
		const values = sample({ from: 0, to: 1000 });
		const quiet = values.filter((value) => value === 0).length;
		expect(quiet / values.length).toBeGreaterThan(0.9);
	});
});
