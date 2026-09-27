---
cwe: 942
owasp: A02
title: CORS reflecting any origin
category: cross-site
severity: critical
sink: |-
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
payload: |-
    fetch("https://api.example/me", { credentials: "include" })
fix: |
    if (allowed.has(origin)) res.setHeader("Access-Control-Allow-Origin", origin);
detect:
    - "Access-Control-Allow-Origin"
    - 'origin:\s*(true|["'']\*["''])'
    - 'cors\('
verify: '`curl -I -H "Origin: https://example.com" https://api.example/me`: that origin echoed back with credentials allowed is the hole.'
fineWhen: "Origins are compared with an exact allow-list, or credentials are off and the data is public."
refs:
    - https://portswigger.net/web-security/cors
---

You echo my origin with credentials allowed, so my site reads your API as the logged-in user. I also bought `evilexample.com` for your `/example\.com$/` regex.
