---
order: 13
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

A script tag is full trust in someone else's server. When a CDN or its domain changes hands — as `polyfill.io` did — every site embedding it serves the new owner's code. An `integrity` hash makes the browser refuse any byte that changed — but only for pinned, static files. polyfill.io served different code per browser, so it could never be hashed. Self-hosting removes the question.
