---
order: 6
cwe: 352
owasp: A01
title: Cross-site request forgery
category: cross-origin
severity: high
sink: |-
    app.post("/api/email", session, updateEmail)
payload: |-
    <form method="POST" action="https://app.example/api/email"><input name="email" value="me@evil.sh"></form>
    <script>document.forms[0].submit()</script>
fix: |
    Set-Cookie: session=…; SameSite=Lax
    // and reject writes unless Sec-Fetch-Site is same-origin
detect:
    - '\.(post|put|patch|delete)\(["'']/'
verify: "While logged in, submit the payload form from another site; if the email changes, the request is forgeable."
fineWhen: "The cookie is `SameSite=Lax` or `Strict`, no sibling subdomain is untrusted, and writes check `Sec-Fetch-Site` or a token — or auth is a header the browser never adds on its own."
refs:
    - https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
    - https://portswigger.net/web-security/csrf/bypassing-samesite-restrictions
---

Your browser attaches the cookie to my form post: I change the email, then reset the password. Only Chromium defaults to `SameSite=Lax`, and your subdomains count as same-site.
