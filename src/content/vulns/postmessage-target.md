---
cwe: 201
owasp: A01
title: postMessage to any origin
category: cross-site
severity: high
sink: |-
    window.opener.postMessage({ token }, "*")
payload: |-
    open("https://app.example/login-popup");
    addEventListener("message", (e) => steal(e.data.token));
fix: |
    window.opener.postMessage({ token }, "https://app.example");
detect:
    - 'postMessage\(.*["'']\*["'']\)'
verify: "Open the page with `window.open` from another origin and log every message it sends back."
fineWhen: "The message carries nothing private, like an iframe's height."
refs:
    - https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage#security_concerns
    - https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html
---

Your login popup hands the token to whoever opened it. I open it from my page, you sign in, and `"*"` delivers the token to me. Name the origin you mean.
