import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

import type { Catalog } from "@/modules/catalog";
import { toEntry } from "@/modules/catalog";
import { CATEGORIES } from "@/taxonomy";

// Every card as data, in page order: the file tools and skills read.
export const GET: APIRoute = async ({ site }) => {
	if (!site) throw new Error("`site` must be set in astro.config.ts");
	const page = new URL(`${import.meta.env.BASE_URL.replace(/\/$/u, "")}/`, site).href;
	const cards = (await getCollection("vulns")).toSorted((a, b) => a.data.order - b.data.order);

	const catalog: Catalog = {
		name: "vulns",
		version: 1,
		url: page,
		groups: CATEGORIES.map((id) => ({ id, title: id, phases: [] })),
		entries: CATEGORIES.flatMap((category) =>
			cards.filter((card) => card.data.category === category)
		).map((entry) => toEntry({ entry, page })),
	};

	return new Response(JSON.stringify(catalog, undefined, "\t"), {
		headers: { "Content-Type": "application/json" },
	});
};
