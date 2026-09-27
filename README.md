# vulns

Frontend vulnerabilities cheatsheet — one card per hole: where it lands, what an attacker sends, how to close it.

**Live:** https://dragunovartem99.github.io/vulns

## Catalog

Every entry carries its MITRE CWE and the OWASP Top 10:2025 category that CWE — or its nearest mapped parent — falls under.

| Category     | Vulnerability                            | CWE                                                      | OWASP    | Severity |
| ------------ | ---------------------------------------- | -------------------------------------------------------- | -------- | -------- |
| injection    | DOM XSS through innerHTML                | [79](https://cwe.mitre.org/data/definitions/79.html)     | A05:2025 | critical |
| injection    | Server state inlined into a script       | [79](https://cwe.mitre.org/data/definitions/79.html)     | A05:2025 | high     |
| injection    | `javascript:` URLs in links              | [79](https://cwe.mitre.org/data/definitions/79.html)     | A05:2025 | high     |
| injection    | Markdown rendered as HTML                | [79](https://cwe.mitre.org/data/definitions/79.html)     | A05:2025 | critical |
| injection    | Client-side template injection           | [1336](https://cwe.mitre.org/data/definitions/1336.html) | A05:2025 | high     |
| injection    | Strings run as code                      | [95](https://cwe.mitre.org/data/definitions/95.html)     | A05:2025 | high     |
| injection    | Uploaded SVG served from your origin     | [79](https://cwe.mitre.org/data/definitions/79.html)     | A05:2025 | high     |
| injection    | Prototype pollution                      | [1321](https://cwe.mitre.org/data/definitions/1321.html) | A08:2025 | high     |
| injection    | DOM clobbering                           | [79](https://cwe.mitre.org/data/definitions/79.html)     | A05:2025 | medium   |
| injection    | CSS exfiltration                         | [200](https://cwe.mitre.org/data/definitions/200.html)   | A01:2025 | medium   |
| injection    | A CSP that stops nothing                 | [693](https://cwe.mitre.org/data/definitions/693.html)   | A06:2025 | high     |
| cross-origin | postMessage without origin check         | [346](https://cwe.mitre.org/data/definitions/346.html)   | A07:2025 | high     |
| cross-origin | postMessage to any origin                | [201](https://cwe.mitre.org/data/definitions/201.html)   | A01:2025 | high     |
| cross-origin | Open redirect                            | [601](https://cwe.mitre.org/data/definitions/601.html)   | A01:2025 | medium   |
| cross-origin | OAuth without state or PKCE              | [352](https://cwe.mitre.org/data/definitions/352.html)   | A01:2025 | high     |
| cross-origin | Clickjacking                             | [1021](https://cwe.mitre.org/data/definitions/1021.html) | A06:2025 | medium   |
| cross-origin | Cross-site request forgery               | [352](https://cwe.mitre.org/data/definitions/352.html)   | A01:2025 | high     |
| cross-origin | CORS reflecting any origin               | [942](https://cwe.mitre.org/data/definitions/942.html)   | A02:2025 | critical |
| secrets      | Tokens in localStorage                   | [922](https://cwe.mitre.org/data/definitions/922.html)   | A01:2025 | high     |
| secrets      | Secrets in the bundle                    | [540](https://cwe.mitre.org/data/definitions/540.html)   | A01:2025 | critical |
| secrets      | Source maps in production                | [540](https://cwe.mitre.org/data/definitions/540.html)   | A01:2025 | medium   |
| secrets      | Tokens in URLs                           | [598](https://cwe.mitre.org/data/definitions/598.html)   | A06:2025 | high     |
| secrets      | Personal pages cached as public          | [524](https://cwe.mitre.org/data/definitions/524.html)   | A01:2025 | critical |
| secrets      | Personal data sent to third parties      | [359](https://cwe.mitre.org/data/definitions/359.html)   | A01:2025 | medium   |
| supply-chain | Malicious dependency                     | [506](https://cwe.mitre.org/data/definitions/506.html)   | A08:2025 | critical |
| supply-chain | Installing releases the minute they ship | [1357](https://cwe.mitre.org/data/definitions/1357.html) | A03:2025 | high     |
| supply-chain | Dependency confusion                     | [427](https://cwe.mitre.org/data/definitions/427.html)   | A08:2025 | high     |
| supply-chain | Third-party script without SRI           | [829](https://cwe.mitre.org/data/definitions/829.html)   | A08:2025 | high     |
| supply-chain | Third-party scripts on the payment page  | [829](https://cwe.mitre.org/data/definitions/829.html)   | A08:2025 | critical |
| logic        | Authorization in the client              | [602](https://cwe.mitre.org/data/definitions/602.html)   | A06:2025 | critical |
| logic        | Regular expression DoS                   | [1333](https://cwe.mitre.org/data/definitions/1333.html) | —        | medium   |

## Catalog as data

Every build also publishes [`catalog.json`](https://dragunovartem99.github.io/vulns/catalog.json): each card in a shape shared with [perf](https://github.com/dragunovartem99/perf) — `bad` (the sink), `good` (the fix) and `attack` code, `detect` regexes, how to `verify`, and when a match is `fineWhen`. The types live in `src/modules/catalog/types.ts`.

## Stack

- [Astro](https://astro.build) static site, no client framework
- WebGL glitch overlay rendered in a worker (`src/modules/glitch`)
- Strict CSP, no third-party requests, fully readable without JavaScript
- Deployed to GitHub Pages under `/vulns`

## Development

Requires Node 24+.

```sh
npm install
npm run dev          # local dev server
npm run build        # static build into dist/
npm run preview      # serve the build
```

Checks (run by the pre-commit hook and CI):

```sh
npm run format:check
npm run types:check
npm run lint:check
npm test
```

## Adding a vulnerability

Add one Markdown file to `src/content/vulns/`. The frontmatter is validated by the schema in `src/content.config.ts`:

```yaml
---
order: 6 # position within its category
cwe: 352 # real MITRE CWE id
owasp: A01 # OWASP Top 10:2025 category of the CWE or its nearest mapped parent; omit if none
title: Cross-site request forgery
category: cross-origin # injection | cross-origin | secrets | supply-chain | logic
severity: high # critical | high | medium
sink: |- # the code in the target's repo
    app.post("/api/email", session, updateEmail)
payload: |-
    <form action="https://app.example/api/email" method="POST">…</form>
fix: |
    Set-Cookie: session=…; SameSite=Lax
detect: # regexes that find the sink; one must match it, none may use lookaround
    - '\.(post|put|patch|delete)\(["'']/'
verify: "While logged in, submit the form from another site."
fineWhen: "The cookie is SameSite=Lax and writes check Sec-Fetch-Site."
refs:
    - https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
---
```

The payload is rendered as text, never as markup.

## Deployment

Merging to `main` runs the same checks as pull requests, then builds and deploys to GitHub Pages via
[pipes](https://github.com/dragunovartem99/pipes).
