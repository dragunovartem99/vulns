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
    // no nested quantifiers over overlapping classes: (a+)+, (\w+\s?)*
    // cap input length before matching
    // lint: eslint-plugin-regexp / no-super-linear-backtracking
refs:
    - https://community.owasp.org/attacks/Regular_expression_Denial_of_Service_-_ReDoS
---

Backtracking regex engines try every way to split the input before failing, and the number of ways grows exponentially with its length. Forty characters freeze a browser tab; on a Node server, one request freezes it for every user.
