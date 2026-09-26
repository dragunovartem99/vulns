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

`JSON.parse` keeps `__proto__` as a plain key; a recursive merge or query-string parser then does `target["__proto__"]` and writes onto `Object.prototype`. Now `({}).isAdmin` is `true` everywhere. Chained with a gadget — a library reading an unset option into a sink — it becomes XSS.
