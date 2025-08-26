#!/usr/bin/env bash
set -euo pipefail
mkdir -p backend/keys
# Private key
openssl ecparam -genkey -name prime256v1 -noout -out backend/keys/sign.key
# Self-signed cert (CN=House Test Signer)
openssl req -x509 -new -key backend/keys/sign.key -sha256 -days 3650 \
  -subj "/C=US/O=U.S. House of Representatives/OU=Prototype/CN=House Test Signer" \
  -out backend/keys/sign.crt

# Derive a thumbprint to reference in UI
openssl x509 -noout -fingerprint -sha256 -in backend/keys/sign.crt | sed 's/://g' > backend/keys/sign.crt.sha256.txt