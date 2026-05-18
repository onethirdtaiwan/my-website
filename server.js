const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Data helpers ────────────────────────────────────────────────
const DATA_DIR = path.join(__dirname, 'data');
const PROPERTIES_FILE = path.join(DATA_DIR, 'properties.json');
const ADMIN_FILE = path.join(DATA_DIR, 'admin.json');

function readProperties() {
  return JSON.parse(fs.readFileSync(PROPERTIES_FILE, 'utf8'));
}

function writeProperties(data) {
  fs.writeFileSync(PROPERTIES_FILE, JSON.stringify(data, null, 2));
}

function readAdmin() {
  return JSON.parse(fs.readFileSync(ADMIN_FILE, 'utf8'));
}

function writeAdmin(data) {
  fs.writeFileSync(ADMIN_FILE, JSON.stringify(data, null, 2));
}

function verifyAdminPassword(input, hash) {
  if (!hash) return false;
  if (hash.startsWith('$2')) return bcrypt.compare(input, hash);
  const [salt, expected] = hash.split('$');
  return Promise.resolve(crypto.createHmac('sha256', salt).update(input).digest('hex') === expected);
}

function hashAdminPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHmac('sha256', salt).update(password).digest('hex');
  return `${salt}$${hash}`;
}

// ── Multer (image upload) ────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('只允許上傳圖片檔案'));
  }
});

// ── Middleware ────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'wanshe-secret-2026-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 8 * 60 * 60 * 1000 } // 8 hours
}));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Admin auth guard
function requireAuth(req, res, next) {
  if (req.session && req.session.isAdmin) return next();
  res.status(401).json({ error: '請先登入後台' });
}

// Serve admin pages (only with auth, except login)
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin', 'index.html'));
});
app.get('/admin/*', (req, res) => {
  const file = req.path.replace('/admin/', '');
  const filePath = path.join(__dirname, 'admin', file);
  if (fs.existsSync(filePath)) res.sendFile(filePath);
  else res.status(404).send('Not found');
});

// ── Auth API ──────────────────────────────────────────────────────
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  const admin = readAdmin();
  if (username !== admin.username) {
    return res.status(401).json({ error: '帳號或密碼錯誤' });
  }
  const valid = await verifyAdminPassword(password, admin.passwordHash);
  if (!valid) return res.status(401).json({ error: '帳號或密碼錯誤' });
  req.session.isAdmin = true;
  req.session.username = admin.username;
  res.json({ success: true });
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

app.get('/api/auth/me', (req, res) => {
  if (!(req.session && req.session.isAdmin)) return res.json({ isAdmin: false });
  const admin = readAdmin();
  res.json({ isAdmin: true, user: req.session.username || admin.username, username: admin.username });
});

app.post('/api/auth/change-password', requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: '新密碼至少需要 8 個字元' });
  }
  const admin = readAdmin();
  const valid = await verifyAdminPassword(currentPassword, admin.passwordHash);
  if (!valid) return res.status(401).json({ error: '目前密碼錯誤' });
  writeAdmin({ ...admin, passwordHash: hashAdminPassword(newPassword) });
  res.json({ ok: true });
});

app.get('/api/auth/account', requireAuth, (req, res) => {
  const admin = readAdmin();
  res.json({ username: admin.username });
});

app.post('/api/auth/account', requireAuth, async (req, res) => {
  const { newUsername, confirmPassword } = req.body;
  if (!newUsername || !confirmPassword) return res.status(400).json({ error: '請填寫所有欄位' });
  if (newUsername.length < 3) return res.status(400).json({ error: '帳號名稱至少需要 3 個字元' });
  if (!/^[a-zA-Z0-9_\-]+$/.test(newUsername)) return res.status(400).json({ error: '帳號只能使用英文、數字、底線或連字號' });
  const admin = readAdmin();
  const valid = await verifyAdminPassword(confirmPassword, admin.passwordHash);
  if (!valid) return res.status(401).json({ error: '密碼驗證失敗，請確認目前密碼' });
  writeAdmin({ ...admin, username: newUsername });
  req.session.username = newUsername;
  res.json({ ok: true });
});

// ── Properties API ────────────────────────────────────────────────
// Public: get all
app.get('/api/properties', (req, res) => {
  const props = readProperties();
  res.json(props);
});

// Public: get one
app.get('/api/properties/:id', (req, res) => {
  const props = readProperties();
  const prop = props.find(p => p.id === req.params.id);
  if (!prop) return res.status(404).json({ error: '找不到此物件' });
  res.json(prop);
});

// Admin: create
app.post('/api/properties', requireAuth, (req, res) => {
  const props = readProperties();
  const now = new Date().toISOString();
  const newProp = {
    id: req.body.id || uuidv4(),
    name: req.body.name || '',
    nameZh: req.body.nameZh || '',
    status: req.body.status || 'available',
    type: req.body.type || 'villa',
    location: req.body.location || '',
    priceDisplay: req.body.priceDisplay || '詢價',
    area: req.body.area ? Number(req.body.area) : null,
    bedrooms: req.body.bedrooms ? Number(req.body.bedrooms) : null,
    bathrooms: req.body.bathrooms ? Number(req.body.bathrooms) : null,
    floors: req.body.floors ? Number(req.body.floors) : null,
    yearBuilt: req.body.yearBuilt ? Number(req.body.yearBuilt) : null,
    descriptionZh: req.body.descriptionZh || '',
    descriptionEn: req.body.descriptionEn || '',
    features: req.body.features ? (Array.isArray(req.body.features) ? req.body.features : req.body.features.split(',').map(f => f.trim()).filter(Boolean)) : [],
    thumbnail: req.body.thumbnail || '',
    images: req.body.images ? (Array.isArray(req.body.images) ? req.body.images : [req.body.images]) : [],
    highlight: req.body.highlight || '',
    featured: req.body.featured === 'true' || req.body.featured === true,
    createdAt: now,
    updatedAt: now
  };
  props.push(newProp);
  writeProperties(props);
  res.status(201).json(newProp);
});

// Admin: update
app.put('/api/properties/:id', requireAuth, (req, res) => {
  const props = readProperties();
  const idx = props.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: '找不到此物件' });
  const existing = props[idx];
  const updated = {
    ...existing,
    name: req.body.name ?? existing.name,
    nameZh: req.body.nameZh ?? existing.nameZh,
    status: req.body.status ?? existing.status,
    type: req.body.type ?? existing.type,
    location: req.body.location ?? existing.location,
    priceDisplay: req.body.priceDisplay ?? existing.priceDisplay,
    area: req.body.area != null ? Number(req.body.area) : existing.area,
    bedrooms: req.body.bedrooms != null ? Number(req.body.bedrooms) : existing.bedrooms,
    bathrooms: req.body.bathrooms != null ? Number(req.body.bathrooms) : existing.bathrooms,
    floors: req.body.floors != null ? Number(req.body.floors) : existing.floors,
    yearBuilt: req.body.yearBuilt != null ? Number(req.body.yearBuilt) : existing.yearBuilt,
    descriptionZh: req.body.descriptionZh ?? existing.descriptionZh,
    descriptionEn: req.body.descriptionEn ?? existing.descriptionEn,
    features: req.body.features ? (Array.isArray(req.body.features) ? req.body.features : req.body.features.split(',').map(f => f.trim()).filter(Boolean)) : existing.features,
    thumbnail: req.body.thumbnail ?? existing.thumbnail,
    images: req.body.images ? (Array.isArray(req.body.images) ? req.body.images : [req.body.images]) : existing.images,
    highlight: req.body.highlight ?? existing.highlight,
    featured: req.body.featured != null ? (req.body.featured === 'true' || req.body.featured === true) : existing.featured,
    updatedAt: new Date().toISOString()
  };
  props[idx] = updated;
  writeProperties(props);
  res.json(updated);
});

// Admin: delete
app.delete('/api/properties/:id', requireAuth, (req, res) => {
  const props = readProperties();
  const idx = props.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: '找不到此物件' });
  props.splice(idx, 1);
  writeProperties(props);
  res.json({ success: true });
});

// Admin: upload image
app.post('/api/upload', requireAuth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: '未收到圖片' });
  res.json({ url: `/uploads/${req.file.filename}` });
});

// Admin: upload multiple images
app.post('/api/upload/multiple', requireAuth, upload.array('images', 20), (req, res) => {
  if (!req.files || req.files.length === 0) return res.status(400).json({ error: '未收到圖片' });
  const urls = req.files.map(f => `/uploads/${f.filename}`);
  res.json({ urls });
});

// ── Start ──────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🏔  萬設國際有限公司 官方網站`);
  console.log(`   Server: http://localhost:${PORT}`);
  console.log(`   Admin:  http://localhost:${PORT}/admin\n`);
});
