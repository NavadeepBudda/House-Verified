export type VerificationResponse = {
  state: 'verified' | 'failed' | 'unknown';
  issuer?: string;        // display name
  signedAt?: string;      // ISO 8601
  chain?: 'valid' | 'missing' | 'revoked';
  assetHash?: string;     // sha256:...
  manifestUrl?: string;
  references?: { label: string; url: string }[];
  certThumbprint?: string; // sha256 thumbprint
  assetUrl?: string;      // if asset stored/known
  messages?: string[];    // errors/warnings
  raw?: any;              // full tool output
};