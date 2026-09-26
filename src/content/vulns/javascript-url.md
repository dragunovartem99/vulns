---
order: 3
cwe: 79
title: "javascript: URLs in links"
category: injection
severity: high
sink: |-
    <a :href="user.website">
payload: |-
    javascript:alert(document.cookie)
fix: |
    const url = new URL(input, location.origin);
    if (url.protocol !== "https:") throw new Error("blocked");
refs:
    - https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
---

I set my “website” to a script and wait for your click. Vue and Svelte pass it through as-is. Parse it with `URL` and allow-list the protocol — string checks I beat with tabs and entities.
