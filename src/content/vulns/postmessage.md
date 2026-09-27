---
order: 1
cwe: 346
owasp: A07
title: postMessage without origin check
category: cross-origin
severity: high
sink: |-
    addEventListener("message", (e) => (el.innerHTML = e.data))
payload: |-
    frames[0].postMessage("<img src=x onerror=alert(1)>", "*")
fix: |
    if (e.origin !== "https://trusted.example") return;
detect:
    - 'addEventListener\(["'']message'
    - 'onmessage\s*='
verify: "From a page on another origin, frame or open the target and `postMessage` the payload; if it lands, the origin is not checked."
fineWhen: "The handler compares `e.origin` with `===` against a fixed origin before it touches `e.data`."
refs:
    - https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage#security_concerns
    - https://portswigger.net/web-security/dom-based/controlling-the-web-message-source
---

I frame your page or open it in a popup, then message it. Check `e.origin` with `===` — I register domains that pass `includes` and `endsWith`.
