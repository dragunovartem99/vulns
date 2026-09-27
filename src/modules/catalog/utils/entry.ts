import type { CatalogEntry, Severity } from "../types";

/** A vulns card as the content collection hands it over. */
export type VulnSource = {
	id: string;
	body?: string;
	data: {
		cwe: number;
		owasp?: string;
		title: string;
		category: string;
		severity: Severity;
		sink: string;
		payload: string;
		fix: string;
		detect: string[];
		verify: string;
		fineWhen: string;
		refs: string[];
	};
};

// One card in the shared catalog shape; `page` is the sheet's absolute URL.
export function toEntry({ entry, page }: { entry: VulnSource; page: string }): CatalogEntry {
	const { data } = entry;
	const owasp = data.owasp === undefined ? [] : [`${data.owasp}:2025`];
	return {
		id: entry.id,
		title: data.title,
		url: `${page}#${entry.id}`,
		group: data.category,
		severity: data.severity,
		anchors: [`CWE-${data.cwe}`, ...owasp],
		bad: { label: "Sink", code: data.sink.trim() },
		good: { label: "Fix", code: data.fix.trim() },
		attack: { label: "Payload", code: data.payload.trim() },
		why: (entry.body ?? "").trim(),
		detect: data.detect,
		verify: data.verify,
		fineWhen: data.fineWhen,
		refs: data.refs,
	};
}
