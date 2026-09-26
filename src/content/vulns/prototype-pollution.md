---
order: 4
cwe: 1321
title: Prototype pollution
category: injection
severity: high
sink: |-
    deepMerge(config, JSON.parse(input))
payload: |-
    { "__proto__": { "isAdmin": true } }
fix: |
    if (key === "__proto__" || key === "constructor") continue;
refs:
    - https://portswigger.net/web-security/prototype-pollution
---

`JSON.parse` keeps my `__proto__` key, and your merge writes it onto `Object.prototype`. Now every object in the app says `isAdmin: true`.
