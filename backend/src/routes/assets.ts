import { Router } from 'express';
import fs from 'node:fs';
import path from 'node:path';

const r = Router();

r.get('/:id', (req, res) => {
  try {
    const id = req.params.id?.replace(/[^a-zA-Z0-9_-]/g, ''); // Sanitize ID
    if (!id) {
      return res.json({ 
        error: 'Invalid asset ID',
        id: req.params.id,
        available: ['flyer', 'flyer-tampered', 'press-unknown']
      });
    }

    const p = path.resolve('..', 'sample-assets', 'output', 'meta', `${id}.json`);
    
    if (!fs.existsSync(p)) {
      return res.json({ 
        error: 'Asset not found',
        id,
        available: ['flyer', 'flyer-tampered', 'press-unknown'],
        suggestion: 'Try one of the available asset IDs'
      });
    }

    try {
      const content = fs.readFileSync(p, 'utf8');
      const data = JSON.parse(content);
      res.json(data);
    } catch (parseError) {
      res.json({
        error: 'Asset data corrupted',
        id,
        details: 'Unable to parse asset metadata',
        fallback: {
          id,
          title: `Asset ${id}`,
          status: 'unknown',
          type: 'Unknown',
          issuedBy: 'Unknown',
          signedAt: new Date().toISOString()
        }
      });
    }
  } catch (e: any) {
    // Never return 500 - always return structured JSON
    res.json({
      error: 'Asset service encountered an error',
      id: req.params.id,
      details: String(e.message || e),
      fallback: {
        id: req.params.id || 'unknown',
        title: 'Unknown Asset',
        status: 'unknown',
        type: 'Unknown',
        issuedBy: 'Unknown',
        signedAt: new Date().toISOString()
      }
    });
  }
});

export default r;