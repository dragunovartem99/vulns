---
order: 5
cwe: 942
title: CORS reflecting any origin
category: cross-origin
severity: critical
sink: |-
    Access-Control-Allow-Origin: <request Origin> + Allow-Credentials: true
payload: |-
    fetch("https://api.example/me", { credentials: "include" })
fix: |
    if (allowed.has(origin)) res.setHeader("Access-Control-Allow-Origin", origin);
refs:
    - https://portswigger.net/web-security/cors
---

You echo my origin with credentials allowed, so my site reads your API as the logged-in user. I also bought `evilexample.com` for your `/example\.com$/` regex.
