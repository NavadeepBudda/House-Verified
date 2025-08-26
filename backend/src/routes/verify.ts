import { Router } from 'express';
import multer from 'multer';
import crypto from 'node:crypto';
import { fetchToBuffer } from '../services/fetchRemote.js';
import { saveBuffer, urlFor } from '../services/storage.js';
import { verifyAsset } from '../services/c2pa.js';
import type { VerificationResponse } from '../types/verification.js';

const upload = multer({ storage: multer.memoryStorage() });
const r = Router();

function thumbprintFromPEM(pem?: string) {
  if (!pem) return undefined;
  const der = pem
    .replace(/-----BEGIN CERTIFICATE-----|-----END CERTIFICATE-----|\n/g, '')
    .trim();
  const buf = Buffer.from(der, 'base64');
  return 'sha256:' + crypto.createHash('sha256').update(buf).digest('hex');
}

r.post('/file', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.json({ 
        state: 'unknown', 
        messages: ['No file provided'],
        raw: { error: 'Missing file' }
      });
    }

    const id = crypto.randomUUID();
    const rel = `uploads/${id}-${req.file.originalname || 'unnamed'}`;
    
    let abs: string;
    try {
      abs = saveBuffer(rel, req.file.buffer);
    } catch (storageError) {
      return res.json({
        state: 'unknown',
        messages: ['Unable to save uploaded file'],
        raw: { error: 'Storage error', details: String(storageError) }
      });
    }

    const v = await verifyAsset(abs);

    const resp: VerificationResponse = {
      state: v.state || 'unknown',
      issuer: v.issuer,
      signedAt: v.signedAt,
      chain: v.chain ?? 'missing',
      assetHash: v.assetHash,
      manifestUrl: v.manifestUrl,
      certThumbprint: thumbprintFromPEM(v.certPem),
      assetUrl: urlFor(rel),
      messages: v.messages || [],
      raw: v.raw
    };
    res.json(resp);
  } catch (e: any) {
    // Never return 500 - always return a valid verification response
    res.json({ 
      state: 'unknown', 
      chain: 'missing',
      messages: ['Verification process encountered an error', String(e.message || e)],
      raw: { error: true, exception: String(e) }
    });
  }
});

r.post('/url', async (req, res) => {
  try {
    const { url } = req.body as { url?: string };
    if (!url) {
      return res.json({ 
        state: 'unknown', 
        messages: ['No URL provided'],
        raw: { error: 'Missing URL' }
      });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (urlError) {
      return res.json({
        state: 'unknown',
        messages: ['Invalid URL format'],
        raw: { error: 'Invalid URL', url }
      });
    }

    let buf: Buffer;
    try {
      buf = await fetchToBuffer(url);
    } catch (fetchError) {
      return res.json({
        state: 'unknown',
        messages: ['Unable to fetch file from URL', String(fetchError)],
        assetUrl: url,
        raw: { error: 'Fetch failed', url, details: String(fetchError) }
      });
    }

    const id = crypto.randomUUID();
    const rel = `fetch/${id}`;
    
    let abs: string;
    try {
      abs = saveBuffer(rel, buf);
    } catch (storageError) {
      return res.json({
        state: 'unknown',
        messages: ['Unable to save fetched file'],
        assetUrl: url,
        raw: { error: 'Storage error', details: String(storageError) }
      });
    }

    const v = await verifyAsset(abs);
    
    const resp: VerificationResponse = {
      state: v.state || 'unknown',
      issuer: v.issuer,
      signedAt: v.signedAt,
      chain: v.chain ?? 'missing',
      assetHash: v.assetHash,
      manifestUrl: v.manifestUrl,
      certThumbprint: v.certPem ? thumbprintFromPEM(v.certPem) : undefined,
      assetUrl: url,
      messages: v.messages || [],
      raw: v.raw
    };
    res.json(resp);
  } catch (e: any) {
    // Never return 500 - always return a valid verification response
    res.json({ 
      state: 'unknown', 
      chain: 'missing',
      messages: ['URL verification process encountered an error', String(e.message || e)],
      assetUrl: req.body?.url,
      raw: { error: true, exception: String(e) }
    });
  }
});

export default r;