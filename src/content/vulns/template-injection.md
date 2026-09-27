---
order: 5
cwe: 1336
owasp: A05
title: Client-side template injection
category: injection
severity: high
sink: |-
    <div id="app"><p><?= htmlspecialchars($bio) ?></p></div>
    <script>Vue.createApp({}).mount("#app")</script>
payload: |-
    {{ _openBlock.constructor('alert(document.cookie)')() }}
fix: |
    <div id="app"><p v-pre><?= htmlspecialchars($bio) ?></p></div>
detect:
    - '\.mount\(["'']#'
    - "ng-app"
verify: "Set a field to `{{ 7*7 }}`; if the page shows 49, it is evaluated."
fineWhen: "No server-rendered user text sits inside the mount point, or it sits inside `v-pre` (`ngNonBindable` in Angular)."
refs:
    - https://vuejs.org/guide/best-practices/security
    - https://portswigger.net/kb/issues/00200308_client-side-template-injection
---

Your server escaped my `<` and `>`, not my braces. Vue compiles everything inside the mount point as a template, so my `{{ }}` runs as code. Keep user text out of mount points, or mark it `v-pre`.
