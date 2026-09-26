---
order: 2
cwe: 540
title: Secrets in the bundle
category: secrets
severity: critical
sink: |-
    new Stripe(import.meta.env.VITE_STRIPE_SECRET)
payload: |-
    curl -s https://app.example/assets/index-3f9a1c.js | grep -o "sk_live_[A-Za-z0-9]*"
fix: |
    // VITE_, NEXT_PUBLIC_, PUBLIC_: only for keys that are public by design
    // secret calls go through your server
    await fetch("/api/charge", { method: "POST", body })
refs:
    - https://vite.dev/guide/env-and-mode
    - https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
---

Every variable the bundler inlines ships as plain text to every visitor — minifying is not hiding. The `VITE_`, `NEXT_PUBLIC_` and `PUBLIC_` prefixes mark a value as public, not as safe. Keep secret keys on the server and call it instead. A leaked key must be rotated: removing it from the next build does not unpublish the old one.
