import 'dotenv/config';
import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import verify from './routes/verify.js';
import sign from './routes/sign.js';
import assets from './routes/assets.js';

const app = express();

// Parse JSON with error handling
app.use(express.json({ 
  limit: '50mb',
  type: ['application/json', 'text/plain']
}));

// Enhanced CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Request logging in debug mode
if (process.env.DEBUG) {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
    next();
  });
}

// Health endpoint with comprehensive checks
app.get('/health', (_req, res) => {
  const health = {
    ok: true,
    timestamp: new Date().toISOString(),
    simulator: process.env.HV_SIMULATOR !== '0',
    storage: 'unknown',
    version: '1.0.0'
  };
  
  // Check storage directory
  try {
    const storageDir = process.env.STORAGE_DIR || '../sample-assets/output';
    const resolvedPath = path.resolve(storageDir);
    health.storage = fs.existsSync(resolvedPath) ? 'available' : 'missing';
  } catch {
    health.storage = 'error';
  }
  
  res.json(health);
});

// API routes
app.use('/api/verify', verify);
app.use('/api/sign', sign);
app.use('/api/assets', assets);

// Serve stored files for previews with error handling
const storageDir = process.env.STORAGE_DIR || '../sample-assets/output';
try {
  const resolvedStorageDir = path.resolve(storageDir);
  if (!fs.existsSync(resolvedStorageDir)) {
    console.warn(`Storage directory does not exist: ${resolvedStorageDir}`);
    fs.mkdirSync(resolvedStorageDir, { recursive: true });
  }
  app.use('/files', express.static(resolvedStorageDir));
} catch (error) {
  console.warn('Could not setup static file serving:', error);
  // Create fallback handler
  app.use('/files', (req, res) => {
    res.status(404).json({ 
      error: 'File service unavailable',
      message: 'Static file serving is not configured'
    });
  });
}

// Global error handler (should rarely be hit due to our route-level handling)
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(200).json({
    error: 'Service temporarily unavailable',
    message: 'Please try again later',
    debug: process.env.DEBUG ? String(err) : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
    method: req.method,
    available: ['/health', '/api/verify/file', '/api/verify/url', '/api/assets/:id', '/files/:path']
  });
});

const port = Number(process.env.PORT || 4000);

// Graceful startup with error handling
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`🏛️  House Verified backend running on :${port}`);
  console.log(`   Health: http://localhost:${port}/health`);
  console.log(`   Simulator mode: ${process.env.HV_SIMULATOR !== '0' ? 'ON' : 'OFF'}`);
  console.log(`   Storage: ${path.resolve(storageDir)}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit the process - log and continue
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  // Don't exit the process in production-like behavior
});