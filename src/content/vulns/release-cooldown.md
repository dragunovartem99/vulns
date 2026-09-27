---
cwe: 1357
owasp: A03
title: Installing releases the minute they ship
category: supply-chain
severity: high
sink: |-
    "ui-kit": "^4.2.0"
payload: |-
    // ui-kit@4.2.1, published 20 minutes ago with a stolen token
fix: |
    minimumReleaseAge: 1440 # pnpm-workspace.yaml: skip versions younger than a day
detect:
    - '"[~^]\d'
    - "npm update"
verify: "Check that the lockfile is committed and CI installs with `npm ci`, then check how new a version an update is allowed to take."
fineWhen: "A committed lockfile pins every version, CI installs from it, and updates arrive through a bot with a cooldown — Renovate `minimumReleaseAge`, Dependabot `cooldown`."
refs:
    - https://pnpm.io/supply-chain-security
    - https://docs.renovatebot.com/configuration-options/#minimumreleaseage
---

Hijacked releases are usually caught and pulled within hours. With a caret range and no cooldown, your next install takes mine inside that window. Lock the versions, and let new ones age a day.
