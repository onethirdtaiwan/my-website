export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { text, to } = req.body || {};
  if (!text || !to) return res.status(400).json({ error: 'Missing text or to' });

  const langpair = to === 'ja' ? 'zh-TW|ja-JP' : 'zh-TW|en-US';
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}&de=onethirdtaiwan@gmail.com`;

  try {
    const r = await fetch(url);
    const d = await r.json();
    const translation = d?.responseData?.translatedText || '';
    return res.status(200).json({ translation });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
