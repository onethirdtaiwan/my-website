const fs = require('fs');
const path = require('path');
const https = require('https');

const REPO    = process.env.GITHUB_REPO  || 'onethirdtaiwan/my-website';
const TOKEN   = process.env.GITHUB_TOKEN;
const HOOK    = process.env.VERCEL_DEPLOY_HOOK;

function loadSettings() {
  try { return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'settings.json'), 'utf-8')); }
  catch { return {}; }
}

async function ghGet(apiPath) {
  return new Promise((resolve, reject) => {
    const req = https.request({ hostname: 'api.github.com', path: apiPath, method: 'GET',
      headers: { Authorization: `token ${TOKEN}`, 'User-Agent': 'OTR-Admin', Accept: 'application/vnd.github.v3+json' }
    }, res => { let d=''; res.on('data',c=>d+=c); res.on('end',()=>resolve(JSON.parse(d))); });
    req.on('error', reject); req.end();
  });
}

async function ghPut(apiPath, body) {
  return new Promise((resolve, reject) => {
    const b = JSON.stringify(body);
    const req = https.request({ hostname: 'api.github.com', path: apiPath, method: 'PUT',
      headers: { Authorization: `token ${TOKEN}`, 'User-Agent': 'OTR-Admin', Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(b) }
    }, res => { let d=''; res.on('data',c=>d+=c); res.on('end',()=>resolve(JSON.parse(d))); });
    req.on('error', reject); req.write(b); req.end();
  });
}

async function triggerDeploy() {
  if (!HOOK) return;
  const url = new URL(HOOK);
  return new Promise(resolve => {
    const req = https.request({ hostname: url.hostname, path: url.pathname + url.search, method: 'POST',
      headers: { 'Content-Length': 0 }
    }, () => resolve());
    req.on('error', resolve); req.end();
  });
}

module.exports = async function handler(req, res) {
  if (req.method === 'GET') return res.json(loadSettings());
  if (req.method === 'POST') {
    if (!TOKEN) return res.status(503).json({ error: '請設定 GITHUB_TOKEN 環境變數' });
    const newSettings = req.body || {};
    const file = await ghGet(`/repos/${REPO}/contents/data/settings.json`);
    await ghPut(`/repos/${REPO}/contents/data/settings.json`, {
      message: 'Update site settings via admin',
      content: Buffer.from(JSON.stringify(newSettings, null, 2)).toString('base64'),
      sha: file.sha,
    });
    await triggerDeploy();
    return res.json({ ok: true });
  }
  res.status(405).end();
};
