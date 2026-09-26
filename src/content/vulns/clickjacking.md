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
    X-Frame-Options: DENY
refs:
    - https://cheatsheetseries.owasp.org/cheatsheets/Clickjacking_Defense_Cheat_Sheet.html
---

Your app sits in an invisible frame over a decoy button; the victim clicks “Play” and confirms a transfer. Only a response header stops it — `frame-ancestors` is ignored in a `<meta>` CSP. This page is on GitHub Pages, which cannot send that header: it can be framed, but has nothing worth clicking.
