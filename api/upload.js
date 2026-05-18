const https = require('https');

const REPO = process.env.GITHUB_REPO || 'onethirdtaiwan/my-website';
const TOKEN = process.env.GITHUB_TOKEN;

function ghRequest(method, apiPath, body) {
  return new Promise((resolve, reject) => {
    const b = body ? JSON.stringify(body) : null;
    const opts = {
      hostname: 'api.github.com', path: apiPath, method,
      headers: { Authorization: `token ${TOKEN}`, 'User-Agent': 'OTR-Admin', Accept: 'application/vnd.github.v3+json' }
    };
    if (b) { opts.headers['Content-Type'] = 'application/json'; opts.headers['Content-Length'] = Buffer.byteLength(b); }
    const req = https.request(opts, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => { try { resolve(JSON.parse(d)); } catch { reject(new Error(d)); } });
    });
    req.on('error', reject);
    if (b) req.write(b);
    req.end();
  });
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();
  if (!TOKEN) return res.status(503).json({ error: '請設定 GITHUB_TOKEN 環境變數' });

  const { filename, data } = req.body || {};
  if (!filename || !data) return res.status(400).json({ error: '缺少 filename 或 data 欄位' });

  const safe = filename.replace(/[^a-zA-Z0-9._\-]/g, '_');
  const apiPath = `/repos/${REPO}/contents/public/images/${safe}`;

  let sha;
  try {
    const existing = await ghRequest('GET', apiPath);
    sha = existing.sha;
  } catch {}

  const base64 = data.includes(',') ? data.split(',')[1] : data;
  const putBody = { message: `Upload image ${safe} via admin panel`, content: base64 };
  if (sha) putBody.sha = sha;

  await ghRequest('PUT', apiPath, putBody);
  return res.json({ path: `/images/${safe}` });
};
