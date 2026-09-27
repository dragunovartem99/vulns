---
order: 3
cwe: 601
owasp: A01
title: Open redirect
category: cross-origin
severity: medium
sink: |-
    location.href = params.get("next")
payload: |-
    /login?next=//evil.sh
fix: |
    const next = new URL(params.get("next") ?? "/", location.origin);
    if (next.origin === location.origin) location.href = next.href;
detect:
    - 'location\.href\s*='
    - 'location\.(assign|replace)\('
    - 'redirect\('
    - 'params\.get\(["''](next|redirect|return|url)'
verify: "Open `/login?next=//example.com` and log in; landing on example.com confirms it."
fineWhen: "The target is compared as a parsed origin, or chosen from a fixed list of paths."
refs:
    - https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html
    - https://portswigger.net/web-security/dom-based/open-redirection
---

Your domain vouches for my phishing page, and in an OAuth `redirect_uri` it hands me the token. `//evil.sh` and `/\evil.sh` both pass a prefix check; compare parsed origins.
