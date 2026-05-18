const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const SECRET  = process.env.SESSION_SECRET || 'otr-change-me-2026';
const ADM_USR = process.env.ADMIN_USERNAME || 'admin';
const ADM_PWD = process.env.ADMIN_PASSWORD || 'Wanshe@2026';

function loadAdmin() {
  try { return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'admin.json'), 'utf-8')); }
  catch { return null; }
}

function verifyPassword(input) {
  const admin = loadAdmin();
  if (admin && admin.passwordHash) {
    const [salt, hash] = admin.passwordHash.split('$');
    return crypto.createHmac('sha256', salt).update(input).digest('hex') === hash;
  }
  return input === ADM_PWD;
}

function makeToken(user) {
  const payload = Buffer.from(JSON.stringify({ u: user, e: Date.now() + 86400000 })).toString('base64');
  const sig = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
  return `${payload}.${sig}`;
}

module.exports = function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { username, password } = req.body || {};
  const admin = loadAdmin();
  const expectedUser = (admin && admin.username) || ADM_USR;
  if (username === expectedUser && verifyPassword(password)) {
    const token = makeToken(username);
    res.setHeader('Set-Cookie', `session=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=86400`);
    return res.json({ ok: true });
  }
  return res.status(401).json({ error: '帳號或密碼錯誤' });
};
