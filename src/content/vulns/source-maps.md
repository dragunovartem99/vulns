---
cwe: 540
owasp: A01
title: Source maps in production
category: direct
severity: medium
sink: |-
    build: { sourcemap: true }
payload: |-
    curl -s app.example/assets/index.js.map | jq -r '.sourcesContent[]'
fix: |
    build: { sourcemap: "hidden" } // upload to the error tracker, then delete the .map files
detect:
    - 'sourcemap:\s*true'
    - 'devtool:\s*["''](source-map|eval)'
    - 'productionBrowserSourceMaps:\s*true'
verify: "Request any bundle URL with `.map` appended; a 200 means your source is public."
fineWhen: "The code is open source anyway."
refs:
    - https://vite.dev/config/build-options#build-sourcemap
    - https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
---

Minifying hid nothing if the map ships beside it. I read your original source: comments, internal endpoints, feature flags, the admin routes you forgot. Give maps to your error tracker, not to me.
