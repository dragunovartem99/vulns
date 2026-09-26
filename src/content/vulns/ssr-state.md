---
order: 2
cwe: 79
title: Server state inlined into a script
category: injection
severity: high
sink: |-
    <script>window.__STATE__ = ${JSON.stringify(state)}</script>
payload: |-
    </script><script>alert(document.cookie)</script>
fix: |
    JSON.stringify(state).replaceAll("<", "\\u003c")
refs:
    - https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html
    - https://github.com/yahoo/serialize-javascript
---

I put that in my bio. `JSON.stringify` leaves `</script>` alone, so my bio closes your tag and opens mine. Escape `<`, or let the framework's serialiser do it.
