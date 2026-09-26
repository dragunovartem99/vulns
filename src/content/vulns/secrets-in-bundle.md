---
order: 2
cwe: 540
title: Secrets in the bundle
category: secrets
severity: critical
sink: |-
    new Stripe(import.meta.env.VITE_STRIPE_SECRET)
payload: |-
    curl -s app.example/assets/index.js | grep -o "sk_live_\w*"
fix: |
    await fetch("/api/charge", { method: "POST", body }); // the key stays on the server
refs:
    - https://vite.dev/guide/env-and-mode
    - https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
---

Minifying is not hiding: I read your bundle too. `VITE_` and `NEXT_PUBLIC_` mean public, not safe — and a leaked key stays mine until you rotate it.
