import { cp, mkdir, writeFile } from "node:fs/promises";

const fingerprintValue = process.env.ANDROID_SHA256_CERT_FINGERPRINTS;

if (!fingerprintValue) {
  throw new Error("ANDROID_SHA256_CERT_FINGERPRINTS must be set for this deploy.");
}

const fingerprints = fingerprintValue
  .split(/[\s,]+/)
  .map((fingerprint) => fingerprint.trim().toUpperCase())
  .filter(Boolean);

if (
  fingerprints.length === 0 ||
  fingerprints.some((fingerprint) => !/^(?:[0-9A-F]{2}:){31}[0-9A-F]{2}$/.test(fingerprint))
) {
  throw new Error(
    "ANDROID_SHA256_CERT_FINGERPRINTS must contain SHA-256 fingerprints as colon-separated hex bytes."
  );
}

await cp("index.html", "dist/index.html");
await cp("join-group", "dist/join-group", { recursive: true });
await mkdir("dist/.well-known", { recursive: true });

const assetLinks = [
  {
    relation: ["delegate_permission/common.handle_all_urls"],
    target: {
      namespace: "android_app",
      package_name: "com.plandoer.sheetsnap",
      sha256_cert_fingerprints: fingerprints,
    },
  },
];

await writeFile(
  "dist/.well-known/assetlinks.json",
  `${JSON.stringify(assetLinks, null, 2)}\n`
);