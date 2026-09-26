# vulns

Frontend vulnerabilities cheatsheet — one card per hole: where it lands, what an attacker sends, how to close it.

**Live:** https://dragunovartem99.github.io/vulns

## Catalog

| Category     | Vulnerability                    | CWE                                                      | Severity |
| ------------ | -------------------------------- | -------------------------------------------------------- | -------- |
| injection    | DOM XSS through innerHTML        | [79](https://cwe.mitre.org/data/definitions/79.html)     | critical |
| injection    | `javascript:` URLs in links      | [79](https://cwe.mitre.org/data/definitions/79.html)     | high     |
| injection    | Prototype pollution              | [1321](https://cwe.mitre.org/data/definitions/1321.html) | high     |
| injection    | DOM clobbering                   | [79](https://cwe.mitre.org/data/definitions/79.html)     | medium   |
| injection    | CSS exfiltration                 | [200](https://cwe.mitre.org/data/definitions/200.html)   | medium   |
| browser      | postMessage without origin check | [346](https://cwe.mitre.org/data/definitions/346.html)   | high     |
| browser      | Open redirect                    | [601](https://cwe.mitre.org/data/definitions/601.html)   | medium   |
| browser      | Clickjacking                     | [1021](https://cwe.mitre.org/data/definitions/1021.html) | medium   |
| session      | Tokens in localStorage           | [922](https://cwe.mitre.org/data/definitions/922.html)   | high     |
| session      | Cross-site request forgery       | [352](https://cwe.mitre.org/data/definitions/352.html)   | high     |
| session      | CORS reflecting any origin       | [942](https://cwe.mitre.org/data/definitions/942.html)   | critical |
| supply-chain | Malicious dependency             | [506](https://cwe.mitre.org/data/definitions/506.html)   | critical |
| supply-chain | Third-party script without SRI   | [829](https://cwe.mitre.org/data/definitions/829.html)   | high     |
| logic        | Regular expression DoS           | [1333](https://cwe.mitre.org/data/definitions/1333.html) | medium   |

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
category: session # injection | browser | session | supply-chain | logic
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

Every push to `main` builds and deploys to GitHub Pages via `.github/workflows/deploy.yaml`.
