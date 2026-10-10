import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
	site: "https://dragunovartem99.github.io",
	// A GitHub Pages project site lives under the repository name, so every
	// internal URL has to be built against it — `import.meta.env.BASE_URL`.
	base: "/vulns",

	trailingSlash: "ignore",

	// Shiki highlights with inline styles, which the CSP below would block.
	markdown: {
		syntaxHighlight: false,
	},

	// Downloaded and self-hosted at build time: no third-party request, which is
	// also what lets the CSP below stay at `'self'`.
	fonts: [
		{
			provider: fontProviders.google(),
			name: "JetBrains Mono",
			cssVariable: "--font-mono",
			weights: [400, 800],
			subsets: ["latin"],
			fallbacks: ["ui-monospace", "monospace"],
		},
	],

	// Pages can't send headers, so the CSP ships as a `<meta>` tag with hashed
	// inline scripts and styles. `frame-ancestors` is ignored there — the one
	// directive out of reach on GitHub Pages (see clickjacking.md).
	security: {
		csp: {
			algorithm: "SHA-256",
			directives: [
				"default-src 'none'",
				"img-src 'self' data:",
				"font-src 'self'",
				"connect-src 'self'",
				"worker-src 'self'",
				"base-uri 'none'",
				"form-action 'none'",
			],
		},
	},
});
