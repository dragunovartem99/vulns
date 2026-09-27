---
cwe: 1321
owasp: A08
title: Prototype pollution
category: direct
severity: high
sink: |-
    deepMerge(config, JSON.parse(input))
payload: |-
    { "__proto__": { "isAdmin": true } }
fix: |
    if (key === "__proto__" || key === "constructor") continue;
detect:
    - '[Mm]erge\('
    - '[Ee]xtend\('
    - "__proto__"
    - '\[key\]\s*='
verify: 'Send `{"__proto__":{"polluted":1}}` where the input goes, then check `({}).polluted` in the console.'
fineWhen: "Keys are checked against `__proto__`, `constructor` and `prototype`, the target is a `Map` or `Object.create(null)`, or the merge library is a patched version."
refs:
    - https://portswigger.net/web-security/prototype-pollution
---

`JSON.parse` keeps my `__proto__` key, and your merge writes it onto `Object.prototype`. Now every object in the app says `isAdmin: true`.
