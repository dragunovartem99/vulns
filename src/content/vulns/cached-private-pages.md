---
cwe: 524
owasp: A01
title: Personal pages cached as public
category: direct
severity: critical
sink: |-
    Cache-Control: public, s-maxage=300 # on /account
payload: |-
    curl https://app.example/account # the last visitor's page
fix: |
    Cache-Control: private, no-store
detect:
    - 'Cache-Control:\s*public'
    - "s-maxage"
    - "export const revalidate"
verify: "Load the page signed in, then fetch it with no cookies; if you see your own data, the CDN is sharing it."
fineWhen: "The page shows nothing specific to the user, or the cache key includes the session."
refs:
    - https://portswigger.net/web-security/web-cache-deception
    - https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control
---

Your CDN stored a page with your name on it, and now it serves that page to whoever asks next — me. Anything rendered for a session is `private`, and that includes the API responses behind it.
