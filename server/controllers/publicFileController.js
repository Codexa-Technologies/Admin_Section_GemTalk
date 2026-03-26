const https = require('https');
const http = require('http');
const urlModule = require('url');

// Helper: fetch a URL and pipe the final response to `res`, following redirects up to maxRedirects
const fetchAndPipe = (fileUrl, req, res, filename, maxRedirects = 5) => {
  if (maxRedirects < 0) {
    res.status(502).json({ success: false, message: 'Too many redirects' });
    return;
  }

  const parsed = urlModule.parse(fileUrl);
  const client = parsed.protocol === 'https:' ? https : http;

  const options = {
    method: 'GET',
    headers: {
      'User-Agent': 'GemTalk-File-Proxy',
    },
  };

  const reqUp = client.request(fileUrl, options, (upRes) => {
    // Follow redirects from upstream
    if (upRes.statusCode >= 300 && upRes.statusCode < 400 && upRes.headers.location) {
      const nextUrl = urlModule.resolve(fileUrl, upRes.headers.location);
      // consume & ignore this response's data, then follow
      upRes.resume();
      return fetchAndPipe(nextUrl, req, res, filename, maxRedirects - 1);
    }

    // Set content-type from upstream (fallback to octet-stream)
    let contentType = upRes.headers['content-type'] || 'application/octet-stream';

    // Heuristic: if the URL or provided filename indicates a PDF (folder named 'pdfs' or .pdf extension),
    // force the content-type to application/pdf so browsers open it inline instead of downloading.
    const upstreamPath = parsed.pathname || '';
    const filenameLower = (filename || '').toLowerCase();
    if (upstreamPath.includes('/pdfs/') || upstreamPath.endsWith('.pdf') || filenameLower.endsWith('.pdf')) {
      contentType = 'application/pdf';
    }

    res.setHeader('Content-Type', contentType);

    // derive filename if not provided
    let name = filename || '';
    if (!name) {
      const parts = (parsed.pathname || '').split('/');
      name = parts.pop() || 'file';
    }

    // force inline disposition so browsers open in tab
    res.setHeader('Content-Disposition', `inline; filename="${name}"`);

    // proxy status code
    res.statusCode = upRes.statusCode || 200;
    upRes.pipe(res);
  });

  reqUp.on('error', (err) => {
    console.error('Proxy fetch error', err.message);
    if (!res.headersSent) {
      res.status(502).json({ success: false, message: 'Failed to fetch file' });
    } else {
      try { res.end(); } catch (e) {}
    }
  });

  reqUp.end();
};

// GET /api/public/file?url=<encodedUrl>&filename=<optional>
exports.proxyFile = (req, res) => {
  const fileUrl = req.query.url;
  if (!fileUrl) return res.status(400).json({ success: false, message: 'Missing url' });

  try {
    const filename = req.query.filename || '';
    fetchAndPipe(fileUrl, req, res, filename);
  } catch (err) {
    console.error('Proxy error', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
