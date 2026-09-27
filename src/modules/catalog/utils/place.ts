import type { Severity } from "../types";

/** Worst first. */
const SEVERITY_RANK: Record<Severity, number> = { critical: 0, high: 1, medium: 2 };

/** What decides an entry's place in its group — nothing set by hand. */
export type Placed = {
	/** Index of its phase in the group's official breakdown; 0 where there is none. */
	phase: number;
	severity: Severity;
	title: string;
};

// Page order within a group: by phase, then the worst first, then by title.
export function byPlace(a: Placed, b: Placed): number {
	return (
		a.phase - b.phase ||
		SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity] ||
		a.title.localeCompare(b.title, "en")
	);
}
