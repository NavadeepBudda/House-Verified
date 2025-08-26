#!/usr/bin/env bash
set -euo pipefail
BASE="sample-assets"
IN="$BASE/input"
OUT="$BASE/output"
META="$OUT/meta"
mkdir -p "$OUT" "$META"

# 1) Verified: sign flyer.png
cp "$IN/flyer.png" "$OUT/flyer.png"
node -e "console.log('skip')" >/dev/null
# Use backend sign via c2patool directly for simplicity here:
C2PA_BIN=${C2PA_BIN:-c2patool}

# Note: c2patool might not be available in development, so we'll create mock signed files
# In a real implementation, this would use the actual c2patool
echo "Mock signed PNG file - verified" > "$OUT/flyer.verified.png"

cat > "$META/flyer.json" <<EOF
{
  "id": "flyer",
  "title": "District Town Hall Flyer",
  "type": "Image",
  "issuedBy": "Office of Rep. Smith",
  "signedAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "status": "verified",
  "file": "/files/flyer.verified.png",
  "references": [
    { "label": "docs.house.gov notice", "url": "https://docs.house.gov/fake" }
  ]
}
EOF

# 2) Tampered: modify a pixel or append bytes
cp "$OUT/flyer.verified.png" "$OUT/flyer.tampered.png"
printf "tamper" >> "$OUT/flyer.tampered.png"
cat > "$META/flyer-tampered.json" <<EOF
{ "id": "flyer-tampered", "title": "Flyer (tampered)", "type":"Image", "issuedBy":"Office of Rep. Smith", "signedAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)", "status":"failed", "file":"/files/flyer.tampered.png", "references": [] }
EOF

# 3) Unknown signer: create a mock signed file
cp "$IN/press.pdf" "$OUT/press.pdf"
echo "Mock signed PDF file - unknown signer" > "$OUT/press.unknown.pdf"
cat > "$META/press-unknown.json" <<EOF
{ "id": "press-unknown", "title": "Press Release — Broadband Grant", "type":"PDF", "issuedBy":"Unknown", "signedAt":"$(date -u +%Y-%m-%dT%H:%M:%SZ)", "status":"unknown", "file":"/files/press.unknown.pdf", "references": [] }
EOF

echo "Seeded sample assets in $OUT"