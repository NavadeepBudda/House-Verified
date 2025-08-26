import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import crypto from 'node:crypto';
import { saveBuffer } from '../services/storage.js';
import { signAsset } from '../services/c2pa.js';

const upload = multer({ storage: multer.memoryStorage() });
const r = Router();

r.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.json({ 
        ok: false, 
        error: 'No file provided for signing',
        details: 'Please upload a file to sign'
      });
    }

    const id = crypto.randomUUID();
    const inputRel = `to-sign/${id}-${req.file.originalname || 'unnamed'}`;
    const outputRel = `signed/${id}-${req.file.originalname || 'unnamed'}`;
    
    let inAbs: string;
    try {
      inAbs = saveBuffer(inputRel, req.file.buffer);
    } catch (storageError) {
      return res.json({ 
        ok: false, 
        error: 'Unable to save file for signing',
        details: String(storageError)
      });
    }

    const outAbs = path.resolve(process.env.STORAGE_DIR || '../sample-assets/output', outputRel);

    try {
      await signAsset(inAbs, outAbs);
      res.json({ ok: true, output: outputRel, message: 'File signed successfully' });
    } catch (signError) {
      // Even if signing fails, return a graceful response
      res.json({ 
        ok: false, 
        error: 'Signing process failed',
        details: String(signError),
        fallback: 'File processing completed but signature may not be valid'
      });
    }
  } catch (e: any) {
    // Never return 500 - always return a structured response
    res.json({ 
      ok: false, 
      error: 'Signing service encountered an error',
      details: String(e.message || e),
      recoverable: true
    });
  }
});

export default r;