/** How bad it gets, on one scale for every catalog: perf's impact, vulns' severity. */
export type Severity = "critical" | "high" | "medium";

/** A piece of code and the role it plays: slow or fast, sink, payload or fix. */
export type Snippet = {
	label: string;
	code: string;
	lang?: string;
};

/** One entry in the shape every catalog shares — the contract a skill reads. */
export type CatalogEntry = {
	id: string;
	title: string;
	/** Where it lives on the site. */
	url: string;
	/** The chapter or category it belongs to. */
	group: string;
	/** Where in its group, when the group is split further. */
	phase?: string;
	severity: Severity;
	/** The outside references it maps to: metrics, CWE, OWASP Top 10. */
	anchors: string[];
	/** The code to look for in a codebase. */
	bad: Snippet;
	/** What replaces it. */
	good: Snippet;
	/** What an attacker sends, when there is one. */
	attack?: Snippet;
	/** Why it matters, as Markdown. */
	why: string;
	/** Regexes that find candidates — JavaScript and ripgrep read them alike. */
	detect: string[];
	/** How to confirm it, and that the fix worked. */
	verify: string;
	/** When code that matches `detect` is not a problem. */
	fineWhen: string;
	refs: string[];
};

export type CatalogGroup = {
	id: string;
	title: string;
	/** What belongs here, in one line. */
	summary: string;
	/** The group's official breakdown, in order; empty when it has none. */
	phases: { id: string; title: string }[];
};

/** Why entries are grouped as they are: the rule, and the sources it rests on. */
export type CatalogBasis = {
	rule: string;
	sources: string[];
};

/** The whole sheet as data, served as `catalog.json`. */
export type Catalog = {
	name: string;
	/** Bumped when the shape of an entry changes. */
	version: 1;
	url: string;
	basis: CatalogBasis;
	groups: CatalogGroup[];
	entries: CatalogEntry[];
};
