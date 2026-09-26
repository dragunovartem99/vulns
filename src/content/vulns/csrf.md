---
order: 4
cwe: 352
title: Cross-site request forgery
category: cross-origin
severity: high
sink: |-
    Cookie-authenticated POST /api/email
payload: |-
    <form method="POST" action="https://app.example/api/email"><input name="email" value="me@evil.sh"></form>
    <script>document.forms[0].submit()</script>
fix: |
    Set-Cookie: session=…; SameSite=Lax
    // and reject writes unless Sec-Fetch-Site is same-origin
refs:
    - https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
    - https://portswigger.net/web-security/csrf/bypassing-samesite-restrictions
---

Your browser attaches the cookie to my form post: I change the email, then reset the password. Only Chromium defaults to `SameSite=Lax`, and your subdomains count as same-site.
