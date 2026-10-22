import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const publicRoot = path.join(root, 'public');
const port = Number(process.env.PORT || 3000);
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon'
};

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url || '/', 'http://localhost');
    const decodedPath = decodeURIComponent(url.pathname);
    const relativePath = decodedPath === '/' ? 'index.html' : decodedPath.replace(/^\/+/, '');
    if (relativePath.split(/[\\/]/).includes('..')) {
      response.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Forbidden');
      return;
    }
    const candidates = decodedPath === '/'
      ? [path.join(root, 'index.html')]
      : [path.resolve(publicRoot, relativePath), path.resolve(root, relativePath)];
    let resolvedPath;
    for (const candidate of candidates) {
      if (candidate !== root && !candidate.startsWith(`${root}${path.sep}`)) continue;
      try {
        const info = await stat(candidate);
        if (info.isFile()) {
          resolvedPath = candidate;
          break;
        }
      } catch {
        // Try the next allowed root.
      }
    }
    if (!resolvedPath) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
      return;
    }
    const content = await readFile(resolvedPath);
    response.writeHead(200, {
      'Content-Type': mimeTypes[path.extname(resolvedPath).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-cache'
    });
    response.end(content);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
  }
});

server.listen(port, '0.0.0.0', () => console.log(`鹽埕老字號 preview listening on 0.0.0.0:${port}`));
