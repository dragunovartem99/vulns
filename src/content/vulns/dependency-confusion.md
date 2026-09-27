---
order: 3
cwe: 427
owasp: A08
title: Dependency confusion
category: supply-chain
severity: high
sink: |-
    "acme-ui": "^1.0.0" // on your private registry only
payload: |-
    npm publish # acme-ui@99.0.0, on the public registry
fix: |
    "@acme/ui": "^1.0.0"
    // .npmrc: @acme:registry=https://npm.acme.internal
detect:
    - 'registry\s*='
    - '"[a-z][a-z0-9-]*": "[~^]?\d'
verify: "For each private package, run `npm view <name>` against the public registry; an unscoped name that is free there is mine to claim."
fineWhen: "Every private package is scoped to an org you own on the public registry, and that scope is pinned to your registry."
refs:
    - https://medium.com/@alex.birsan/dependency-confusion-4a5d60fec610
    - https://docs.npmjs.com/about-scopes
---

Your private package has no scope, so I publish the same name publicly with a higher version, and a registry that mirrors both prefers mine. Scope internal packages to an org you own, and pin the scope.
