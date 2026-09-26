---
order: 3
cwe: 1321
title: Prototype pollution
category: injection
severity: high
sink: |-
    deepMerge(config, JSON.parse(input))
payload: |-
    { "__proto__": { "isAdmin": true } }
fix: |
    for (const key of Object.keys(source)) {
      if (["__proto__", "constructor", "prototype"].includes(key)) continue;
      // …
    }
    // untrusted key sets → Map or Object.create(null)
refs:
    - https://portswigger.net/web-security/prototype-pollution
---

`JSON.parse` keeps `__proto__` as an ordinary key. A recursive merge then writes through it onto `Object.prototype`, and `({}).isAdmin` is `true` everywhere. Combined with a library that reads an unset option into a sink, it becomes XSS.
