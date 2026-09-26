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
    <script src="https://cdn.example/lib@3.2.1.js"
      integrity="sha384-…" crossorigin="anonymous"></script>
refs:
    - https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Subresource_Integrity
---

A script tag trusts someone else's server completely. When `polyfill.io` changed owners, every site embedding it started serving the new owner's code. An `integrity` hash makes the browser reject any changed byte, but only works for pinned, static files — polyfill.io built its response per browser. Self-hosting avoids the question.
