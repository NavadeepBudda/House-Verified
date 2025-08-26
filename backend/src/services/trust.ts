import fs from 'node:fs';

const trusted = (process.env.TRUSTED_CERTS ?? '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean)
  .map(p => fs.readFileSync(p, 'utf8'));

export function isTrustedCert(pem: string) {
  return trusted.includes(pem);
}