---
order: 5
cwe: 601
title: Open redirect
category: browser
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

Your trusted domain becomes the launch pad for phishing; on an allowed OAuth `redirect_uri` it forwards the code or token to the attacker. In the browser it is worse: `?next=javascript:…` is XSS. `//evil.sh` is protocol-relative, `/\evil.sh` is normalised by browsers — compare parsed origins, never string prefixes.
