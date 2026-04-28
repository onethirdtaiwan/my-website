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
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') return res.json(loadProps());

  if (!TOKEN) return res.status(503).json({ error: '請在 Vercel 儀表板設定 GITHUB_TOKEN 環境變數以啟用管理功能' });

  if (req.method === 'POST') {
    const props = loadProps();
    const body = req.body || {};
    const newId = body.id || `prop-${Date.now()}`;
    const newProp = { ...body, id: newId };
    if (body.features && typeof body.features === 'string') {
      newProp.features = body.features.split('\n').map(s => s.trim()).filter(Boolean);
    }
    props.push(newProp);
    await saveProps(props);
    return res.json(newProp);
  }

  res.status(405).json({ error: 'Method not allowed' });
};
