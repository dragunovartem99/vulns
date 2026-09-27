---
cwe: 1333
title: Regular expression DoS
category: direct
severity: medium
sink: |-
    /^(\w+\s?)*$/.test(input)
payload: |-
    "a".repeat(40) + "!"
fix: |
    // no nested quantifiers like (a+)+; cap the length first
detect:
    - '\([^)]*[+*][^)]*\)[+*]'
    - 'new RegExp\('
verify: 'Time the regex on `"a".repeat(25) + "!"`, then on 26 characters; if the time doubles, it backtracks.'
fineWhen: "The input is capped short before matching, or the engine does not backtrack (RE2, Rust)."
refs:
    - https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS
---

Forty characters and your regex tries every way to split them. The tab freezes; on a Node server, it freezes for every user.
