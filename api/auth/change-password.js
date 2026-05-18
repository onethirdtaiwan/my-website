const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const https = require('https');

const SECRET  = process.env.SESSION_SECRET || 'otr-change-me-2026';
const ADM_PWD = process.env.ADMIN_PASSWORD || 'Wanshe@2026';
const REPO    = process.env.GITHUB_REPO    || 'onethirdtaiwan/my-website';
const TOKEN   = process.env.GITHUB_TOKEN;

function getToken(req) {
  const cookie = req.headers.cookie || '';
  for (const part of cookie.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k.trim() === 'session') return v.join('=');
  }
  return null;
}

function verifySession(token) {
  if (!token) return false;
  const dot = token.lastIndexOf('.');
  if (dot === -1) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
  if (sig !== expected) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64').toString());
    return Date.now() <= data.e;
  } catch { return false; }
}

function loadAdmin() {
  try { return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'admin.json'), 'utf-8')); }
  catch { return { username: 'admin' }; }
}

function verifyPassword(input) {
  const admin = loadAdmin();
  if (admin && admin.passwordHash) {
    const [salt, hash] = admin.passwordHash.split('$');
    return crypto.createHmac('sha256', salt).update(input).digest('hex') === hash;
  }
  return input === ADM_PWD;
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHmac('sha256', salt).update(password).digest('hex');
  return `${salt}$${hash}`;
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

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  if (!verifySession(getToken(req))) return res.status(401).json({ error: '請重新登入' });

  const { currentPassword, newPassword } = req.body || {};
  if (!currentPassword || !newPassword) return res.status(400).json({ error: '請填寫所有欄位' });
  if (newPassword.length < 8) return res.status(400).json({ error: '新密碼至少需要 8 個字元' });
  if (!verifyPassword(currentPassword)) return res.status(401).json({ error: '目前密碼不正確' });

  const admin = loadAdmin();
  const newAdmin = { username: admin.username || 'admin', passwordHash: hashPassword(newPassword) };

  if (TOKEN) {
    let sha;
    try {
      const file = await ghRequest('GET', `/repos/${REPO}/contents/data/admin.json`);
      sha = file.sha;
    } catch {}
    const putBody = {
      message: 'Update admin password via admin panel',
      content: Buffer.from(JSON.stringify(newAdmin, null, 2)).toString('base64'),
    };
    if (sha) putBody.sha = sha;
    await ghRequest('PUT', `/repos/${REPO}/contents/data/admin.json`, putBody);
  } else {
    fs.writeFileSync(path.join(process.cwd(), 'data', 'admin.json'), JSON.stringify(newAdmin, null, 2));
  }

  return res.json({ ok: true });
};
