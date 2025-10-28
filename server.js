// Simple static file server for the Link Hub (no external deps)
// Serves files from the /public directory and supports SPA fallback

const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;
const publicDir = path.join(__dirname, 'public');

const mimeTypes = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=UTF-8',
  '.xml': 'application/xml; charset=UTF-8',
};

function sendFile(res, filePath, statusCode = 200) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=UTF-8' });
      res.end('Internal Server Error');
      return;
    }
    res.writeHead(statusCode, { 'Content-Type': contentType });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Normalize URL and prevent directory traversal
  let safePath;
  try {
    safePath = decodeURIComponent(req.url.split('?')[0]);
  } catch (e) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=UTF-8' });
    res.end('Bad Request');
    return;
  }

  // Remove multiple slashes and normalize
  safePath = path.normalize(safePath).replace(/^(\.\.\/)+/, '/');
  
  // Ensure the path doesn't escape publicDir
  let filePath = path.join(publicDir, safePath);
  const resolvedPath = path.resolve(filePath);
  const resolvedPublicDir = path.resolve(publicDir);
  
  if (!resolvedPath.startsWith(resolvedPublicDir)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=UTF-8' });
    res.end('Forbidden');
    return;
  }

  // If directory, serve index.html
  if (safePath === '/' || safePath.endsWith('/')) {
    filePath = path.join(publicDir, 'index.html');
  }

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      return sendFile(res, filePath);
    }

    // Try SPA fallback to index.html for unknown routes
    const indexPath = path.join(publicDir, 'index.html');
    fs.stat(indexPath, (indexErr, indexStats) => {
      if (!indexErr && indexStats.isFile()) {
        return sendFile(res, indexPath);
      }
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
      res.end('Not Found');
    });
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
