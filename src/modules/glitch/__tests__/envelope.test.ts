import { describe, expect, it } from "vitest";

import { BURST_DURATION, burstEnvelope } from "../utils/envelope";

describe("burstEnvelope", () => {
	const duration = BURST_DURATION;

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
