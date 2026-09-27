---
cwe: 829
owasp: A08
title: Third-party script without SRI
category: supply-chain
severity: high
sink: |-
    <script src="https://cdn.example/lib.js">
payload: |-
    // the CDN, now serving: document.forms[0].onsubmit = steal
fix: |
    <script src="https://cdn.example/lib@3.2.1.js" integrity="sha384-…" crossorigin></script>
detect:
    - '<script[^>]+src="https://'
    - '<link[^>]+href="https://'
verify: "List every `<script src>` on another origin; each one without `integrity` runs whatever that origin serves today."
fineWhen: "The file is self-hosted, or it is served by an origin you deploy yourself."
refs:
    - https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Subresource_Integrity
---

I don't need your server — I buy the CDN. When polyfill.io changed owners, every site embedding it ran the new owner's code. `integrity` rejects a changed byte; self-hosting avoids the question.
