---
order: 2
cwe: 1333
title: Regular expression DoS
category: logic
severity: medium
sink: |-
    /^(\w+\s?)*$/.test(input)
payload: |-
    "a".repeat(40) + "!"
fix: |
    // no nested quantifiers like (a+)+; cap the length first
refs:
    - https://community.owasp.org/attacks/Regular_expression_Denial_of_Service_-_ReDoS
---

Forty characters and your regex tries every way to split them. The tab freezes; on a Node server, it freezes for every user.
