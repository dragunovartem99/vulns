---
order: 2
cwe: 829
title: Third-party script without SRI
category: supply-chain
severity: high
sink: |-
    <script src="https://cdn.example/lib.js">
payload: |-
    // the CDN, now serving: document.forms[0].onsubmit = steal
fix: |
    <script src="https://cdn.example/lib@3.2.1.js" integrity="sha384-…" crossorigin></script>
refs:
    - https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Subresource_Integrity
---

I don't need your server — I buy the CDN. When polyfill.io changed owners, every site embedding it ran the new owner's code. `integrity` rejects a changed byte; self-hosting avoids the question.
