---
order: 5
cwe: 1021
owasp: A06
title: Clickjacking
category: cross-origin
severity: medium
sink: |-
    res.setHeader("Content-Security-Policy", "default-src 'self'")
payload: |-
    <iframe src="https://bank.example/transfer" style="opacity:0"></iframe>
fix: |
    Content-Security-Policy: frame-ancestors 'none'
detect:
    - "Content-Security-Policy"
    - "X-Frame-Options"
    - "frame-ancestors"
verify: "Frame the page from another origin; if it renders, it can be clickjacked."
fineWhen: "The response sends `frame-ancestors` or `X-Frame-Options`, or the page has nothing worth clicking — a public article."
refs:
    - https://cheatsheetseries.owasp.org/cheatsheets/Clickjacking_Defense_Cheat_Sheet.html
---

Your page sits invisible over my “Play” button, and the click confirms a transfer. Only a response header stops me: `frame-ancestors` is ignored in a `<meta>` CSP.
