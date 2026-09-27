---
cwe: 598
owasp: A06
title: Tokens in URLs
category: supply-chain
severity: high
sink: |-
    https://app.example/reset-password?token=8f3a9c…
payload: |-
    // your analytics, on page load: page_location=https://app.example/reset-password?token=8f3a9c…
fix: |
    const token = params.get("token");
    history.replaceState(null, "", "/reset-password"); // before any third-party script runs
detect:
    - "[?&](token|access_token|api_key|session)="
    - 'params\.get\(["''](token|access_token|api_key)'
verify: "Finish a password-reset or magic-link flow, then search your analytics, logs and history for the token."
fineWhen: "The token is single-use, expires in minutes, and leaves the address bar before any third party can see it."
refs:
    - https://owasp.org/www-community/vulnerabilities/Information_exposure_through_query_strings_in_url
    - https://developer.mozilla.org/en-US/docs/Web/API/History/replaceState
---

A URL is not a secret. It lands in history, server logs, analytics and screenshots, and I need only one of them. Read the token, clear it from the address bar, and let it work once.
