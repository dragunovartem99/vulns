import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

/** Where in the stack the hole is — also the order sections appear in. */
export const CATEGORIES = ["injection", "browser", "session", "supply-chain", "logic"] as const;

/** How bad it gets when it lands. Red density on the card scales with it. */
export const SEVERITIES = ["critical", "high", "medium"] as const;

const vulns = defineCollection({
	loader: glob({ pattern: "*.md", base: "./src/content/vulns" }),
	schema: z.object({
		/** Position within its category. */
		order: z.number().int().positive(),
		/** The MITRE Common Weakness Enumeration entry this falls under. */
		cwe: z.number().int().positive(),
		title: z.string(),
		category: z.enum(CATEGORIES),
		severity: z.enum(SEVERITIES),
		/** The API or place the attack lands in. */
		sink: z.string(),
		/** What an attacker sends. Rendered as text, never as markup. */
		payload: z.string(),
		fix: z.string(),
		refs: z.array(z.url()).min(1),
	}),
});

export const collections = { vulns };
