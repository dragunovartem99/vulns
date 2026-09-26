---
order: 2
cwe: 601
title: Open redirect
category: cross-origin
severity: medium
sink: |-
    location.href = params.get("next")
payload: |-
    /login?next=//evil.sh/fake-login
fix: |
    const next = new URL(params.get("next") ?? "/", location.origin);
    location.href = next.origin === location.origin ? next.href : "/";
refs:
    - https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html
    - https://portswigger.net/web-security/dom-based/open-redirection
---

Your domain lends its trust to a phishing page; on an allowed OAuth `redirect_uri` it hands the code or token to the attacker. In the browser, `?next=javascript:…` is XSS. `//evil.sh` and `/\evil.sh` both leave your site, so compare parsed origins, never string prefixes.
