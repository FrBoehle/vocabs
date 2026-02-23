import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const port = Number.parseInt(process.env.PORT ?? '4173', 10);
const host = process.env.HOST ?? '0.0.0.0';
const root = process.cwd();

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
};

function resolvePath(urlPath) {
  const cleanedPath = normalize(decodeURIComponent(urlPath.split('?')[0]));
  const candidate = cleanedPath === '/' ? 'index.html' : cleanedPath.replace(/^\/+/, '');
  return join(root, candidate);
}

createServer(async (req, res) => {
  if ((req.url ?? '').startsWith('/favicon.ico')) {
    res.writeHead(204);
    res.end();
    return;
  }

  try {
    const filePath = resolvePath(req.url ?? '/');
    const file = await readFile(filePath);
    const contentType = mimeTypes[extname(filePath)] ?? 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(file);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 - Datei nicht gefunden');
  }
}).listen(port, host, () => {
  console.log(`Vocab Vista läuft auf http://localhost:${port}`);
});
