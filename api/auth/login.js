const crypto = require('crypto');

const SECRET  = process.env.SESSION_SECRET  || 'otr-change-me-2026';
const ADM_USR = process.env.ADMIN_USERNAME  || 'admin';
const ADM_PWD = process.env.ADMIN_PASSWORD  || 'Wanshe@2026';

function makeToken(user) {
  const payload = Buffer.from(JSON.stringify({ u: user, e: Date.now() + 86400000 })).toString('base64');
  const sig = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
  return `${payload}.${sig}`;
}

module.exports = function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { username, password } = req.body || {};
  if (username === ADM_USR && password === ADM_PWD) {
    const token = makeToken(username);
    res.setHeader('Set-Cookie', `session=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=86400`);
    return res.json({ ok: true });
  }
  return res.status(401).json({ error: '帳號或密碼錯誤' });
};
