const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const SECRET = process.env.SESSION_SECRET || 'otr-change-me-2026';

function getToken(req) {
  const cookie = req.headers.cookie || '';
  for (const part of cookie.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k.trim() === 'session') return v.join('=');
  }
  return null;
}

function verifyToken(token) {
  if (!token) return null;
  const dot = token.lastIndexOf('.');
  if (dot === -1) return null;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
  if (sig !== expected) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64').toString());
    if (Date.now() > data.e) return null;
    return data;
  } catch { return null; }
}

function loadAdmin() {
  try { return JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'admin.json'), 'utf-8')); }
  catch { return { username: 'admin' }; }
}

module.exports = function handler(req, res) {
  const data = verifyToken(getToken(req));
  if (!data) return res.json({ isAdmin: false });
  const admin = loadAdmin();
  res.json({ isAdmin: true, user: data.u, username: admin.username || data.u });
};
