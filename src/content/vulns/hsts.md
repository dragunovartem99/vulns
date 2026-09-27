---
cwe: 319
owasp: A04
title: HTTPS without HSTS
category: network
severity: high
sink: |-
    app.use((req, res) => res.redirect(301, `https://${req.headers.host}${req.url}`))
payload: |-
    # café Wi-Fi: I answer your user's first http:// request myself, and never redirect
fix: |
    Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
detect:
    - 'https://\$\{req\.headers\.host'
    - "return 301 https://"
    - "Strict-Transport-Security"
verify: "Check responses for `Strict-Transport-Security` with a long `max-age`, and the domain on hstspreload.org."
fineWhen: "The header is already sent with a year-long `max-age`, or the domain is on the preload list."
refs:
    - https://cheatsheetseries.owasp.org/cheatsheets/HTTP_Strict_Transport_Security_Cheat_Sheet.html
    - https://hstspreload.org/
---

Your redirect to HTTPS travels over HTTP, so on a network I control it never arrives. I keep your user on plain HTTP and read everything, cookies included. HSTS makes the browser skip HTTP from then on; the preload list covers the first visit too.
