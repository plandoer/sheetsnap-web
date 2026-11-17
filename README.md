# Sheet Snap Deep Link Website

This is a small static website that supports Android App Links for Sheet Snap.

## Pages

- `/` serves the website home page.
- `/join-group` provides a fallback for joining a group. It reads the `name` and `token` query parameters and opens the Sheet Snap app using its `sheetsnap://` link. When Android verifies the website and the app is installed, Android can open the app directly instead.
- `/.well-known/assetlinks.json` identifies the Android app and the signing certificate fingerprints authorized to handle links for this website.

## Build

Run the build with Node.js and set `ANDROID_SHA256_CERT_FINGERPRINTS` to one or more SHA-256 certificate fingerprints. Separate multiple fingerprints with commas or whitespace. Each fingerprint must use colon-separated hexadecimal bytes.

```sh
ANDROID_SHA256_CERT_FINGERPRINTS="AA:BB:...:FF" node build.mjs
```

The build stops with an error if the variable is missing or a fingerprint is invalid. It copies the site pages and generates `assetlinks.json` using the supplied fingerprints.

## Output

`dist/` is the generated output folder. It contains the files to serve:

- `dist/index.html`
- `dist/join-group/index.html`
- `dist/.well-known/assetlinks.json`

The source files remain in the project root and `join-group/`. The build recreates the relevant files in `dist/`; do not edit generated files there directly.
