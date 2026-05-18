const fs = require('fs');
const path = require('path');
const https = require('https');

const REPO = process.env.GITHUB_REPO || 'onethirdtaiwan/my-website';
const TOKEN = process.env.GITHUB_TOKEN;
const HOOK  = process.env.VERCEL_DEPLOY_HOOK;

function loadContent() {
  try { return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'content.json'), 'utf-8')); }
  catch { return {}; }
}

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

async function triggerDeploy() {
  if (!HOOK) return;
  try {
    const url = new URL(HOOK);
    await new Promise(resolve => {
      const req = https.request({ hostname: url.hostname, path: url.pathname + url.search, method: 'POST', headers: { 'Content-Length': 0 } }, () => resolve());
      req.on('error', resolve);
      req.end();
    });
  } catch {}
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') return res.json(loadContent());

  if (req.method === 'POST') {
    if (!TOKEN) return res.status(503).json({ error: '請在 Vercel 儀表板設定 GITHUB_TOKEN 環境變數' });
    const newContent = req.body || {};

    let sha;
    try {
      const file = await ghRequest('GET', `/repos/${REPO}/contents/data/content.json`);
      sha = file.sha;
    } catch {}

    const putBody = {
      message: 'Update site content via admin panel',
      content: Buffer.from(JSON.stringify(newContent, null, 2)).toString('base64'),
    };
    if (sha) putBody.sha = sha;

    await ghRequest('PUT', `/repos/${REPO}/contents/data/content.json`, putBody);
    await triggerDeploy();
    return res.json({ ok: true });
  }

  res.status(405).end();
};
