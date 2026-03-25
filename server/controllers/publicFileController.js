const https = require('https');
const http = require('http');
const urlModule = require('url');

// GET /api/public/file?url=<encodedUrl>&filename=<optional>
exports.proxyFile = (req, res) => {
  const fileUrl = req.query.url;
  if (!fileUrl) return res.status(400).json({ success: false, message: 'Missing url' });

  try {
    const parsed = urlModule.parse(fileUrl);
    const client = parsed.protocol === 'https:' ? https : http;

    const options = {
      method: 'GET',
      headers: {
        'User-Agent': 'GemTalk-File-Proxy',
      },
    };

    const upstream = client.request(fileUrl, options, (upRes) => {
      // set content-type
      const contentType = upRes.headers['content-type'] || 'application/octet-stream';
      res.setHeader('Content-Type', contentType);

      // derive filename
      let filename = req.query.filename || '';
      if (!filename) {
        const parts = (parsed.pathname || '').split('/');
        filename = parts.pop() || 'file';
      }

      // force inline disposition so browsers open in tab
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

      // proxy status code
      res.statusCode = upRes.statusCode || 200;
      upRes.pipe(res);
    });

    upstream.on('error', (err) => {
      console.error('Proxy fetch error', err.message);
      res.status(502).json({ success: false, message: 'Failed to fetch file' });
    });

    upstream.end();
  } catch (err) {
    console.error('Proxy error', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
