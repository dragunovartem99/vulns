# vulns

Frontend vulnerabilities cheatsheet — one card per hole: where it lands, what an attacker sends, how to close it.

**Live:** https://dragunovartem99.github.io/vulns

## Catalog

| Category     | Vulnerability                      | CWE                                                      | Severity |
| ------------ | ---------------------------------- | -------------------------------------------------------- | -------- |
| injection    | DOM XSS through innerHTML          | [79](https://cwe.mitre.org/data/definitions/79.html)     | critical |
| injection    | Server state inlined into a script | [79](https://cwe.mitre.org/data/definitions/79.html)     | high     |
| injection    | `javascript:` URLs in links        | [79](https://cwe.mitre.org/data/definitions/79.html)     | high     |
| injection    | Prototype pollution                | [1321](https://cwe.mitre.org/data/definitions/1321.html) | high     |
| injection    | DOM clobbering                     | [79](https://cwe.mitre.org/data/definitions/79.html)     | medium   |
| injection    | CSS exfiltration                   | [200](https://cwe.mitre.org/data/definitions/200.html)   | medium   |
| cross-origin | postMessage without origin check   | [346](https://cwe.mitre.org/data/definitions/346.html)   | high     |
| cross-origin | Open redirect                      | [601](https://cwe.mitre.org/data/definitions/601.html)   | medium   |
| cross-origin | Clickjacking                       | [1021](https://cwe.mitre.org/data/definitions/1021.html) | medium   |
| cross-origin | Cross-site request forgery         | [352](https://cwe.mitre.org/data/definitions/352.html)   | high     |
| cross-origin | CORS reflecting any origin         | [942](https://cwe.mitre.org/data/definitions/942.html)   | critical |
| secrets      | Tokens in localStorage             | [922](https://cwe.mitre.org/data/definitions/922.html)   | high     |
| secrets      | Secrets in the bundle              | [540](https://cwe.mitre.org/data/definitions/540.html)   | critical |
| supply-chain | Malicious dependency               | [506](https://cwe.mitre.org/data/definitions/506.html)   | critical |
| supply-chain | Third-party script without SRI     | [829](https://cwe.mitre.org/data/definitions/829.html)   | high     |
| logic        | Authorization in the client        | [602](https://cwe.mitre.org/data/definitions/602.html)   | critical |
| logic        | Regular expression DoS             | [1333](https://cwe.mitre.org/data/definitions/1333.html) | medium   |

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
order: 8 # position within its category
cwe: 352 # real MITRE CWE id
title: Cross-site request forgery
category: cross-origin # injection | cross-origin | secrets | supply-chain | logic
severity: high # critical | high | medium
sink: |-
    Cookie-authenticated POST /api/email
payload: |-
    <form action="https://app.example/api/email" method="POST">…</form>
fix: |
    Set-Cookie: session=…; SameSite=Lax
refs:
    - https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
---
```

The payload is rendered as text, never as markup.

## Deployment

Merging to `main` runs the same checks as pull requests, then builds and deploys to GitHub Pages via
[pipes](https://github.com/dragunovartem99/pipes).
