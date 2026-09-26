---
order: 1
cwe: 602
title: Authorization in the client
category: logic
severity: critical
sink: |-
    {user.role === "admin" && <DeleteButton />}
payload: |-
    fetch("/api/users/42", { method: "DELETE" })
fix: |
    if (!can(session.user, "delete", target)) return res.sendStatus(403);
refs:
    - https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
---

I don't click your buttons; I call your API from the console. Every rule — roles, ids, prices — is checked by the server, on every request.
