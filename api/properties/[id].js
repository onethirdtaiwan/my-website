const fs = require('fs');
const path = require('path');

function loadProps() {
  const p = path.join(process.cwd(), 'data', 'properties.json');
  return JSON.parse(fs.readFileSync(p, 'utf-8'));
}

module.exports = function handler(req, res) {
  const { id } = req.query;
  const props = loadProps();
  if (req.method === 'GET') {
    const prop = props.find(p => p.id === id);
    if (!prop) return res.status(404).json({ error: 'Not found' });
    return res.json(prop);
  }
  res.status(503).json({ error: '線上版不支援修改，請使用本機伺服器管理物件。' });
};
