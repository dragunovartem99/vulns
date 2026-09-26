# CLAUDE.md

## Code style

- DO use `type X = {}` aliases, NOT `interface` (sole exception: global declaration merging, e.g. `env.d.ts`)
- DO take a single object parameter instead of 2+ positional arguments
- DO NOT add lint-disable comments — restructure the code until the linter passes
- DO NOT use non-null assertions (`!`) — narrow the type instead
- DO use `//` comments on functions that take parameters or return a value; reserve `/** */` for types, consts, parameterless functions, and the file-level blurb

## Structure

- DO keep every `src/modules/<name>` self-contained: `utils/`, `types.ts`, and an `index.ts` barrel exporting only the public surface
- DO keep pure math in `utils/` so it is testable without a canvas or DOM
- DO keep one vulnerability per file in `src/content/vulns/`, tagged with its real MITRE CWE id; the schema in `src/content.config.ts` is the contract

## Tests

- DO colocate tests: `<dir>/__tests__/<name>.test.ts`, next to the `utils/` they exercise

## Styling

- DO use the tokens in `src/styles/tokens.css` — no raw hex values or magic spacing in components
- DO use red only for danger (payloads, sinks, severity) — its scarcity is the design
- DO respect `prefers-reduced-motion` for anything that animates

## Constraints

- DO NOT ship a client framework — the only client scripts are the glitch overlay and the copy buttons
- DO NOT add inline event handlers, `set:html` on untrusted input, or third-party requests — the site ships a strict CSP and must pass it
- DO keep the page fully readable with JavaScript disabled
- DO keep the overlay canvas `pointer-events: none` and `aria-hidden`
- DO build every internal URL from `import.meta.env.BASE_URL` — the site is served under `/vulns` on GitHub Pages
