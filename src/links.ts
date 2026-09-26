// Resolves a site path against the deploy base (`/vulns` on GitHub Pages), so
// links and assets work wherever the site is mounted.
export function withBase(path: string): string {
	const base = import.meta.env.BASE_URL.replace(/\/$/u, "");
	return `${base}/${path.replace(/^\//u, "")}`;
}
