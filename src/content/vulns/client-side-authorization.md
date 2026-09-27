---
cwe: 602
owasp: A06
title: Authorization in the client
category: direct
severity: critical
sink: |-
    {user.role === "admin" && <DeleteButton />}
payload: |-
    fetch("/api/users/42", { method: "DELETE" })
fix: |
    if (!can(session.user, "delete", target)) return res.sendStatus(403);
detect:
    - '\brole\s*===?'
    - "isAdmin"
    - 'permissions?\.'
verify: "As a user without the role, call the endpoint from the console; anything but 403 is the hole."
fineWhen: "The server checks the same rule on every request; the client check only hides the button."
refs:
    - https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
---

I don't click your buttons; I call your API from the console. Every rule — roles, ids, prices — is checked by the server, on every request.
