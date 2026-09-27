---
order: 4
cwe: 352
owasp: A01
title: OAuth without state or PKCE
category: cross-origin
severity: high
sink: |-
    location.href = `${idp}/authorize?response_type=code&client_id=${id}&redirect_uri=${cb}`
payload: |-
    <img src="https://app.example/callback?code=MY_CODE">
fix: |
    `${idp}/authorize?response_type=code&state=${state}&code_challenge=${challenge}&code_challenge_method=S256`
    // on return: reject unless state matches the one you stored
detect:
    - "response_type=(code|token)"
    - '/authorize\?'
verify: "Start a login, stop at the callback URL, and open it in another browser; if it completes, `state` is not checked."
fineWhen: "A maintained library runs the flow — the provider's SDK, `oidc-client-ts`, Auth.js — and checks `state` and PKCE itself."
refs:
    - https://datatracker.ietf.org/doc/html/rfc9700
    - https://oauth.net/2/pkce/
---

Without `state`, I send your browser to your callback with my code, and you sign in as me — or link your account to mine. RFC 9700 settles it: the code flow, with PKCE, and never tokens in the URL.
