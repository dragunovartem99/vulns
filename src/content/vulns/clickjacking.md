---
order: 3
cwe: 1021
title: Clickjacking
category: cross-origin
severity: medium
sink: |-
    Your page, framed by anyone
payload: |-
    <iframe src="https://bank.example/transfer" style="opacity:0"></iframe>
fix: |
    Content-Security-Policy: frame-ancestors 'none'
refs:
    - https://cheatsheetseries.owasp.org/cheatsheets/Clickjacking_Defense_Cheat_Sheet.html
---

Your page sits invisible over my “Play” button, and the click confirms a transfer. Only a response header stops me: `frame-ancestors` is ignored in a `<meta>` CSP.
