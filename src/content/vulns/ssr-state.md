---
order: 2
cwe: 79
owasp: A05
title: Server state inlined into a script
category: injection
severity: high
sink: |-
    <script>window.__STATE__ = ${JSON.stringify(state)}</script>
payload: |-
    </script><script>alert(document.cookie)</script>
fix: |
    JSON.stringify(state).replaceAll("<", "\\u003c")
detect:
    - "__(STATE|INITIAL_STATE|APOLLO_STATE)__"
    - '<script>.*\$\{'
verify: "Set a stored field to `</script><script>alert(1)</script>` and reload the server-rendered page."
fineWhen: "The framework serialises the state and escapes `<` — Next, Nuxt and SvelteKit do."
refs:
    - https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
    - https://github.com/yahoo/serialize-javascript
---

I put that in my bio. `JSON.stringify` leaves `</script>` alone, so my bio closes your tag and opens mine. Escape `<`, or let the framework's serialiser do it.
