---
order: 6
cwe: 359
owasp: A01
title: Personal data sent to third parties
category: secrets
severity: medium
sink: |-
    analytics.track("signup", { email, phone })
payload: |-
    // I breach your analytics vendor, not you
fix: |
    analytics.track("signup", { plan }); // ids and facts, not identities
detect:
    - '\.track\('
    - 'gtag\('
    - 'dataLayer\.push\('
    - '\.identify\('
verify: "Use the product once and read, in the Network panel, what each vendor receives — session replay included."
fineWhen: "The fields are pseudonymous ids, and session replay masks every input by default."
refs:
    - https://cheatsheetseries.owasp.org/cheatsheets/User_Privacy_Protection_Cheat_Sheet.html
    - https://owasp.org/www-project-top-10-privacy-risks/
---

Every vendor you send email addresses to is one more company I can breach to get them. Session replay is worse: it records what people type. Send ids and facts, and mask inputs.
