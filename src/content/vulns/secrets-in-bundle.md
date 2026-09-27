---
cwe: 540
owasp: A01
title: Secrets in the bundle
category: direct
severity: critical
sink: |-
    new Stripe(import.meta.env.VITE_STRIPE_SECRET)
payload: |-
    curl -s app.example/assets/index.js | grep -o "sk_live_\w*"
fix: |
    await fetch("/api/charge", { method: "POST", body }); // the key stays on the server
detect:
    - '(VITE|NEXT_PUBLIC|PUBLIC|REACT_APP)_\w*(SECRET|PRIVATE|TOKEN)'
    - "sk_live_"
    - "BEGIN (RSA )?PRIVATE KEY"
verify: 'Build for production and `grep -rE "sk_live|SECRET|PRIVATE KEY" dist/`.'
fineWhen: "The key is public by design: a Stripe publishable key, a Firebase config, a maps key restricted by referrer."
refs:
    - https://vite.dev/guide/env-and-mode
    - https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
---

Minifying is not hiding: I read your bundle too. `VITE_` and `NEXT_PUBLIC_` mean public, not safe — and a leaked key stays mine until you rotate it.
