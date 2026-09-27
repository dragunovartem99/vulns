import type { Severity } from "@/modules/catalog";
import { byPlace } from "@/modules/catalog";

import type { Category } from "./positions";
import { CATEGORIES } from "./positions";

type Card = { data: { category: Category; severity: Severity; title: string } };

// Every card in page order: position by position, then the worst first — never by hand.
export function pageOrder<T extends Card>(cards: readonly T[]): T[] {
	const place = ({ data }: T) => ({ phase: 0, severity: data.severity, title: data.title });
	return CATEGORIES.flatMap((category) =>
		cards
			.filter((card) => card.data.category === category)
			.toSorted((a, b) => byPlace(place(a), place(b)))
	);
}
