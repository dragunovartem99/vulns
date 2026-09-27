import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { defineCollection } from "astro:content";

import { detects, isPattern } from "@/modules/catalog";
import { CATEGORIES, OWASP_IDS, SEVERITIES } from "@/taxonomy";

const vulns = defineCollection({
	loader: glob({ pattern: "*.md", base: "./src/content/vulns" }),
	schema: z
		.object({
			/** The MITRE Common Weakness Enumeration entry this falls under. */
			cwe: z.number().int().positive(),
			/** Its OWASP Top 10:2025 category; absent when no parent of the CWE is mapped. */
			owasp: z.enum(OWASP_IDS).optional(),
			title: z.string(),
			category: z.enum(CATEGORIES),
			severity: z.enum(SEVERITIES),
			/** The code in the target's repo where the attack lands. */
			sink: z.string(),
			/** What an attacker sends. Rendered as text, never as markup. */
			payload: z.string(),
			fix: z.string(),
			/** Regexes that find the sink in a codebase — JavaScript and ripgrep alike. */
			detect: z.array(z.string().refine(isPattern, "not a portable regex")).min(1),
			/** How to prove it is exploitable, and that the fix holds. */
			verify: z.string(),
			/** When code that matches `detect` is not a hole. */
			fineWhen: z.string(),
			refs: z.array(z.url()).min(1),
		})
		.refine((data) => detects({ patterns: data.detect, code: data.sink }), {
			message: "no detect pattern matches the sink",
			path: ["detect"],
		}),
});

export const collections = { vulns };
