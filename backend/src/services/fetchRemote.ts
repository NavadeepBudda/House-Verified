import got from 'got';

export async function fetchToBuffer(url: string, maxBytes = 15 * 1024 * 1024) {
  try {
    // Validate URL
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      throw new Error('Only HTTP and HTTPS URLs are supported');
    }

    const resp = await got(url, { 
      timeout: { request: 8000, response: 15000 },
      followRedirect: true,
      maxRedirects: 3,
      headers: {
        'User-Agent': 'House-Verified/1.0'
      }
    });

    if (!resp.rawBody || resp.rawBody.length === 0) {
      throw new Error('Empty response from server');
    }

    const buf = Buffer.from(resp.rawBody);
    if (buf.length > maxBytes) {
      throw new Error(`File too large: ${buf.length} bytes (max: ${maxBytes})`);
    }
    
    return buf;
  } catch (error: any) {
    // Re-throw with more context but don't let it bubble up as unhandled
    if (error.code === 'ENOTFOUND') {
      throw new Error('Host not found - check the URL');
    } else if (error.code === 'ECONNREFUSED') {
      throw new Error('Connection refused by server');
    } else if (error.code === 'ETIMEDOUT') {
      throw new Error('Request timed out');
    } else if (error.response?.statusCode) {
      throw new Error(`HTTP ${error.response.statusCode}: ${error.response.statusMessage || 'Request failed'}`);
    } else {
      throw new Error(error.message || 'Unknown network error');
    }
  }
}