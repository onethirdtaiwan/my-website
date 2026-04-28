const fs = require('fs');
const path = require('path');

function loadProps() {
  const p = path.join(process.cwd(), 'data', 'properties.json');
  return JSON.parse(fs.readFileSync(p, 'utf-8'));
}

module.exports = function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'GET') {
    return res.json(loadProps());
  }
  res.status(503).json({ error: '線上版不支援修改，請使用本機伺服器管理物件。' });
};
