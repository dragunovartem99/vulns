---
order: 4
cwe: 346
title: postMessage without origin check
category: browser
severity: high
sink: |-
    addEventListener("message", (e) => (el.innerHTML = e.data.html))
payload: |-
    // evil.sh frames or opens your app, then:
    frames[0].postMessage({ html: "<img src=x onerror=alert(1)>" }, "*")
fix: |
    addEventListener("message", (e) => {
      if (e.origin !== "https://trusted.example") return;
      // validate e.data's shape before using it
    });
refs:
    - https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage#security_concerns
    - https://portswigger.net/web-security/dom-based/controlling-the-web-message-source
---

Any page that can get a handle to your window — an opener, a parent frame, a popup — can message it. Check `event.origin` exactly (no `includes`, no `endsWith`), and send with an explicit target origin instead of `"*"`, or secrets leak to whoever holds the frame.
