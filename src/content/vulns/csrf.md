---
order: 4
cwe: 352
title: Cross-site request forgery
category: cross-origin
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

Browsers attach cookies to form posts from other sites, so a hidden form can change the victim's email, then reset their password. Only Chromium defaults cookies to `SameSite=Lax` — set it explicitly. Even then, `GET` endpoints that change state and sibling subdomains, which count as same-site, stay exposed.
