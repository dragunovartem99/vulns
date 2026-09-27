---
cwe: 79
owasp: A05
title: "javascript: URLs in links"
category: content
severity: high
sink: |-
    <a :href="user.website">
payload: |-
    javascript:alert(document.cookie)
fix: |
    const url = new URL(input, location.origin);
    if (url.protocol !== "https:") throw new Error("blocked");
detect:
    - ':href="'
    - 'href=\{'
    - 'location\.href\s*='
    - 'window\.open\('
verify: "Set the field to `javascript:alert(1)` and click the link."
fineWhen: "The URL is parsed and only `https:` (or a fixed list) gets through, or the framework blocks `javascript:` — React 19 and Angular do."
refs:
    - https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
---

I set my “website” to a script and wait for your click. Vue and Svelte pass it through as-is. Parse it with `URL` and allow-list the protocol — string checks I beat with tabs and entities.
