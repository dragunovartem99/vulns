/** Lookaround and backreferences: JavaScript has them, ripgrep's default engine does not. */
const NON_PORTABLE = /\(\?<?[=!]|\\[1-9]|\\k</u;

// True when a string compiles as a regex that JavaScript and ripgrep read alike;
// an empty one, which matches everything, is not a pattern.
export function isPattern(source: string): boolean {
	if (NON_PORTABLE.test(source)) return false;
	try {
		return new RegExp(source, "u").source !== "(?:)";
	} catch {
		return false;
	}
}

// True when at least one pattern finds the code — an entry must catch its own example.
export function detects({ patterns, code }: { patterns: string[]; code: string }): boolean {
	return patterns.some((pattern) => isPattern(pattern) && new RegExp(pattern, "mu").test(code));
}
