---
order: 8
cwe: 352
title: Cross-site request forgery
category: session
severity: high
sink: |-
    Cookie-authenticated POST /api/email
payload: |-
    <form action="https://app.example/api/email" method="POST">
      <input name="email" value="me@evil.sh">
    </form>
    <script>document.forms[0].submit()</script>
fix: |
    Set-Cookie: session=…; SameSite=Lax
    // + reject state changes unless Sec-Fetch-Site is same-origin
    // + or require a per-session CSRF token
refs:
    - https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
    - https://portswigger.net/web-security/csrf/bypassing-samesite-restrictions
---

The browser attaches cookies to cross-site form posts: change the account email, then reset the password. Only Chrome defaults cookies to `SameSite=Lax` — set it explicitly. Even then it misses `GET` endpoints that change state, and sibling subdomains, which count as same-site.
