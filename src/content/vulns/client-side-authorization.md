---
order: 1
cwe: 602
title: Authorization in the client
category: logic
severity: critical
sink: |-
    {user.role === "admin" && <DeleteButton id={42} />}
payload: |-
    // no button needed, just the console:
    fetch("/api/users/42", { method: "DELETE" })
fix: |
    // the API checks every request, whatever the UI shows
    if (!can(session.user, "delete", user)) return res.sendStatus(403);
refs:
    - https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
---

Hiding a button, guarding a route or disabling a field is UX, not security: the attacker has DevTools and `fetch`. Every rule — who may read, change or delete what, prices, limits — must be enforced by the API on every request. That includes ids: `/api/invoices/43` must check that invoice 43 is yours.
