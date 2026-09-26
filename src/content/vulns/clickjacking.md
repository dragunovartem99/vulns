---
order: 6
cwe: 1021
title: Clickjacking
category: browser
severity: medium
sink: |-
    Your page, framed by anyone
payload: |-
    <iframe src="https://bank.example/transfer" style="opacity:0"></iframe>
fix: |
    Content-Security-Policy: frame-ancestors 'none'
    X-Frame-Options: DENY
refs:
    - https://cheatsheetseries.owasp.org/cheatsheets/Clickjacking_Defense_Cheat_Sheet.html
---

An invisible frame of your app sits over a decoy button; the victim clicks "Play" and confirms a transfer. Only a response header stops it — `frame-ancestors` is ignored in a `<meta>` CSP. This very page is hosted on GitHub Pages, which cannot send one: it is framable, and it has nothing worth clicking.
