---
cwe: 829
owasp: A08
title: Third-party scripts on the payment page
category: supply-chain
severity: critical
sink: |-
    <script src="https://widgets.example/chat.js"></script> <!-- on /checkout -->
payload: |-
    document.querySelector("[name=card]").addEventListener("change", (e) => send(e.target.value))
fix: |
    <iframe src="https://pay.provider.example/fields"></iframe> <!-- card fields in the provider's origin -->
detect:
    - '<script[^>]+src="https://'
    - 'googletagmanager\.com'
verify: "List every script that runs on sign-in and checkout pages, and who can change each one."
fineWhen: "Card and password fields live in the provider's iframe, and the page ships no script you do not deploy yourself."
refs:
    - https://cheatsheetseries.owasp.org/cheatsheets/Third_Party_Javascript_Management_Cheat_Sheet.html
    - https://owasp.org/www-project-top-10-client-side-security-risks/
---

Every script on the page can read every field. I skip your checkout and compromise the smallest vendor on it. Keep card fields in the payment provider's iframe; PCI DSS 4.0 requires an inventory of every script there.
