const fs = require('fs');
const path = require('path');
const https = require('https');

const REPO  = process.env.GITHUB_REPO  || 'onethirdtaiwan/my-website';
const TOKEN = process.env.GITHUB_TOKEN;
const HOOK  = process.env.VERCEL_DEPLOY_HOOK;

function loadProps() {
  try { return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'properties.json'), 'utf-8')); }
  catch { return []; }
}

async function ghGet(apiPath) {
  return new Promise((resolve, reject) => {
    const req = https.request({ hostname: 'api.github.com', path: apiPath, method: 'GET',
      headers: { Authorization: `token ${TOKEN}`, 'User-Agent': 'OTR-Admin', Accept: 'application/vnd.github.v3+json' }
    }, res => { let d=''; res.on('data',c=>d+=c); res.on('end',()=>{ try{resolve(JSON.parse(d))}catch{reject(new Error(d))} }); });
    req.on('error', reject); req.end();
  });
}

async function ghPut(apiPath, body) {
  return new Promise((resolve, reject) => {
    const b = JSON.stringify(body);
    const req = https.request({ hostname: 'api.github.com', path: apiPath, method: 'PUT',
      headers: { Authorization: `token ${TOKEN}`, 'User-Agent': 'OTR-Admin', Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(b) }
    }, res => { let d=''; res.on('data',c=>d+=c); res.on('end',()=>{ try{resolve(JSON.parse(d))}catch{reject(new Error(d))} }); });
    req.on('error', reject); req.write(b); req.end();
  });
}

async function triggerDeploy() {
  if (!HOOK) return;
  try {
    const url = new URL(HOOK);
    await new Promise(resolve => {
      const req = https.request({ hostname: url.hostname, path: url.pathname + url.search, method: 'POST',
        headers: { 'Content-Length': 0 }
      }, () => resolve());
      req.on('error', resolve); req.end();
    });
  } catch {}
}

async function saveProps(props) {
  const file = await ghGet(`/repos/${REPO}/contents/data/properties.json`);
  await ghPut(`/repos/${REPO}/contents/data/properties.json`, {
    message: 'Update properties via admin panel',
    content: Buffer.from(JSON.stringify(props, null, 2)).toString('base64'),
    sha: file.sha,
  });
  await triggerDeploy();
}

module.exports = async function handler(req, res) {
  const { id } = req.query;
  const props = loadProps();

  if (req.method === 'GET') {
    const prop = props.find(p => p.id === id);
    if (!prop) return res.status(404).json({ error: 'Not found' });
    return res.json(prop);
  }

  if (!TOKEN) return res.status(503).json({ error: '請在 Vercel 儀表板設定 GITHUB_TOKEN 環境變數以啟用管理功能' });

  if (req.method === 'PUT') {
    const idx = props.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    const body = req.body || {};
    if (body.features && typeof body.features === 'string') {
      body.features = body.features.split('\n').map(s => s.trim()).filter(Boolean);
    }
    props[idx] = { ...props[idx], ...body, id };
    await saveProps(props);
    return res.json(props[idx]);
  }

  if (req.method === 'DELETE') {
    const idx = props.findIndex(p => p.id === id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    props.splice(idx, 1);
    await saveProps(props);
    return res.json({ ok: true });
  }

  res.status(405).json({ error: 'Method not allowed' });
};
