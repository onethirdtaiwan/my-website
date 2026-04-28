#!/usr/bin/env python3
"""
萬設國際有限公司 — Dev server (Python 3, no dependencies)
用法: python3 server.py
"""
import http.server
import json
import os
import re
import hashlib
import uuid
import mimetypes
import cgi
import shutil
import time
from urllib.parse import urlparse, parse_qs
from pathlib import Path

BASE_DIR  = Path(__file__).parent
PUBLIC    = BASE_DIR / "public"
ADMIN_DIR = BASE_DIR / "admin"
DATA_DIR  = BASE_DIR / "data"
UPLOADS   = BASE_DIR / "uploads"
UPLOADS.mkdir(exist_ok=True)

PROPERTIES_FILE = DATA_DIR / "properties.json"
ADMIN_FILE      = DATA_DIR / "admin.json"
PORT = 3000

# ── In-memory sessions ─────────────────────────────────────────
SESSIONS: dict[str, float] = {}   # token -> expires_at
SESSION_TTL = 8 * 3600

# ── Data helpers ──────────────────────────────────────────────
def read_json(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)

def write_json(path, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def hash_password(pw: str) -> str:
    salt = uuid.uuid4().hex
    h = hashlib.pbkdf2_hmac("sha256", pw.encode(), salt.encode(), 260_000)
    return f"{salt}${h.hex()}"

def verify_password(pw: str, stored: str) -> bool:
    try:
        salt, h = stored.split("$", 1)
    except ValueError:
        return False
    check = hashlib.pbkdf2_hmac("sha256", pw.encode(), salt.encode(), 260_000)
    return check.hex() == h

# Initialise admin on first run
admin = read_json(ADMIN_FILE)
if not admin.get("passwordHash"):
    admin["passwordHash"] = hash_password("Wanshe@2026")
    write_json(ADMIN_FILE, admin)
    print("✓ Admin password initialised  →  admin / Wanshe@2026")

# ── Cookie helpers ────────────────────────────────────────────
def get_session_token(headers):
    raw = headers.get("Cookie", "")
    for part in raw.split(";"):
        k, _, v = part.strip().partition("=")
        if k == "session":
            return v
    return None

def is_authed(headers) -> bool:
    tok = get_session_token(headers)
    if not tok or tok not in SESSIONS:
        return False
    if time.time() > SESSIONS[tok]:
        del SESSIONS[tok]
        return False
    return True

def make_session() -> str:
    tok = uuid.uuid4().hex
    SESSIONS[tok] = time.time() + SESSION_TTL
    return tok

# ── Handler ───────────────────────────────────────────────────
class Handler(http.server.BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        print(f"  {self.command} {self.path}")

    # ── helpers ──────────────────────────────────────────────
    def send_json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def send_error_json(self, msg, status=400):
        self.send_json({"error": msg}, status)

    def read_body_json(self):
        n = int(self.headers.get("Content-Length", 0))
        return json.loads(self.rfile.read(n).decode()) if n else {}

    def serve_file(self, path: Path):
        if not path.exists():
            self.send_response(404); self.end_headers(); return
        mime, _ = mimetypes.guess_type(str(path))
        data = path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", mime or "application/octet-stream")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def redirect(self, location):
        self.send_response(302)
        self.send_header("Location", location)
        self.end_headers()

    # ── routing ──────────────────────────────────────────────
    def do_GET(self):
        p = urlparse(self.path)
        path = p.path.rstrip("/") or "/"

        # API
        if path == "/api/properties":
            return self.send_json(read_json(PROPERTIES_FILE))

        m = re.match(r"^/api/properties/([^/]+)$", path)
        if m:
            props = read_json(PROPERTIES_FILE)
            item = next((x for x in props if x["id"] == m.group(1)), None)
            if not item: return self.send_error_json("找不到此物件", 404)
            return self.send_json(item)

        if path == "/api/auth/me":
            return self.send_json({"isAdmin": is_authed(self.headers)})

        # Uploads
        if path.startswith("/uploads/"):
            return self.serve_file(BASE_DIR / path.lstrip("/"))

        # Admin pages
        if path == "/admin" or path.startswith("/admin/"):
            rel = path[len("/admin/"):] or "index.html"
            if not rel: rel = "index.html"
            return self.serve_file(ADMIN_DIR / rel)

        # Static files
        if path == "/" or path == "/index.html":
            return self.serve_file(PUBLIC / "index.html")

        # Try public dir
        candidate = PUBLIC / path.lstrip("/")
        if candidate.is_file():
            return self.serve_file(candidate)

        # CSS / JS with direct path
        self.send_response(404); self.end_headers()

    def do_POST(self):
        p = urlparse(self.path)
        path = p.path

        # Auth login
        if path == "/api/auth/login":
            body = self.read_body_json()
            admin = read_json(ADMIN_FILE)
            if body.get("username") != admin["username"]:
                return self.send_error_json("帳號或密碼錯誤", 401)
            if not verify_password(body.get("password", ""), admin["passwordHash"]):
                return self.send_error_json("帳號或密碼錯誤", 401)
            tok = make_session()
            self.send_response(200)
            self.send_header("Set-Cookie", f"session={tok}; Path=/; HttpOnly; Max-Age={SESSION_TTL}")
            self.send_header("Content-Type", "application/json")
            body_out = json.dumps({"success": True}).encode()
            self.send_header("Content-Length", str(len(body_out)))
            self.end_headers()
            self.wfile.write(body_out)
            return

        if path == "/api/auth/logout":
            tok = get_session_token(self.headers)
            if tok and tok in SESSIONS:
                del SESSIONS[tok]
            self.send_response(200)
            self.send_header("Set-Cookie", "session=; Path=/; Max-Age=0")
            body_out = json.dumps({"success": True}).encode()
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body_out)))
            self.end_headers()
            self.wfile.write(body_out)
            return

        if path == "/api/auth/change-password":
            if not is_authed(self.headers):
                return self.send_error_json("請先登入", 401)
            body = self.read_body_json()
            admin = read_json(ADMIN_FILE)
            if not verify_password(body.get("currentPassword", ""), admin["passwordHash"]):
                return self.send_error_json("目前密碼錯誤", 401)
            np = body.get("newPassword", "")
            if len(np) < 8:
                return self.send_error_json("新密碼至少需要 8 個字元")
            admin["passwordHash"] = hash_password(np)
            write_json(ADMIN_FILE, admin)
            return self.send_json({"success": True})

        # Create property
        if path == "/api/properties":
            if not is_authed(self.headers):
                return self.send_error_json("請先登入", 401)
            body = self.read_body_json()
            props = read_json(PROPERTIES_FILE)
            now = __import__("datetime").datetime.utcnow().isoformat() + "Z"
            features_raw = body.get("features", [])
            if isinstance(features_raw, str):
                features_raw = [f.strip() for f in features_raw.replace("\n", ",").split(",") if f.strip()]
            new_prop = {
                "id": body.get("id") or str(uuid.uuid4()),
                "name": body.get("name", ""),
                "nameZh": body.get("nameZh", ""),
                "status": body.get("status", "available"),
                "type": body.get("type", "villa"),
                "location": body.get("location", ""),
                "priceDisplay": body.get("priceDisplay", "詢價"),
                "area": int(body["area"]) if body.get("area") else None,
                "bedrooms": int(body["bedrooms"]) if body.get("bedrooms") else None,
                "bathrooms": int(body["bathrooms"]) if body.get("bathrooms") else None,
                "floors": int(body["floors"]) if body.get("floors") else None,
                "yearBuilt": int(body["yearBuilt"]) if body.get("yearBuilt") else None,
                "descriptionZh": body.get("descriptionZh", ""),
                "descriptionEn": body.get("descriptionEn", ""),
                "features": features_raw,
                "thumbnail": body.get("thumbnail", ""),
                "images": body.get("images", []),
                "highlight": body.get("highlight", ""),
                "featured": bool(body.get("featured", False)),
                "createdAt": now,
                "updatedAt": now,
            }
            props.append(new_prop)
            write_json(PROPERTIES_FILE, props)
            return self.send_json(new_prop, 201)

        # Image upload
        if path in ("/api/upload", "/api/upload/multiple"):
            if not is_authed(self.headers):
                return self.send_error_json("請先登入", 401)
            ct = self.headers.get("Content-Type", "")
            if "multipart/form-data" not in ct:
                return self.send_error_json("需要 multipart/form-data")
            fs = cgi.FieldStorage(fp=self.rfile, headers=self.headers,
                                   environ={"REQUEST_METHOD": "POST", "CONTENT_TYPE": ct})
            urls = []
            items = fs.list or []
            for item in items:
                if item.filename and item.file:
                    ext = os.path.splitext(item.filename)[1] or ".jpg"
                    fname = f"{uuid.uuid4().hex}{ext}"
                    dest = UPLOADS / fname
                    with open(dest, "wb") as out:
                        shutil.copyfileobj(item.file, out)
                    urls.append(f"/uploads/{fname}")
            if path == "/api/upload":
                if not urls: return self.send_error_json("未收到圖片")
                return self.send_json({"url": urls[0]})
            return self.send_json({"urls": urls})

        self.send_response(404); self.end_headers()

    def do_PUT(self):
        p = urlparse(self.path)
        m = re.match(r"^/api/properties/([^/]+)$", p.path)
        if not m:
            self.send_response(404); self.end_headers(); return
        if not is_authed(self.headers):
            return self.send_error_json("請先登入", 401)
        pid = m.group(1)
        props = read_json(PROPERTIES_FILE)
        idx = next((i for i, x in enumerate(props) if x["id"] == pid), None)
        if idx is None:
            return self.send_error_json("找不到此物件", 404)
        body = self.read_body_json()
        existing = props[idx]
        features_raw = body.get("features", existing.get("features", []))
        if isinstance(features_raw, str):
            features_raw = [f.strip() for f in features_raw.replace("\n", ",").split(",") if f.strip()]
        updated = {**existing}
        for k in ["name","nameZh","status","type","location","priceDisplay","highlight","descriptionZh","descriptionEn","thumbnail"]:
            if k in body: updated[k] = body[k]
        for k in ["area","bedrooms","bathrooms","floors","yearBuilt"]:
            if k in body: updated[k] = int(body[k]) if body[k] else None
        if "features" in body: updated["features"] = features_raw
        if "images" in body: updated["images"] = body["images"]
        if "featured" in body: updated["featured"] = bool(body["featured"])
        updated["updatedAt"] = __import__("datetime").datetime.utcnow().isoformat() + "Z"
        props[idx] = updated
        write_json(PROPERTIES_FILE, props)
        return self.send_json(updated)

    def do_DELETE(self):
        p = urlparse(self.path)
        m = re.match(r"^/api/properties/([^/]+)$", p.path)
        if not m:
            self.send_response(404); self.end_headers(); return
        if not is_authed(self.headers):
            return self.send_error_json("請先登入", 401)
        pid = m.group(1)
        props = read_json(PROPERTIES_FILE)
        new_props = [x for x in props if x["id"] != pid]
        if len(new_props) == len(props):
            return self.send_error_json("找不到此物件", 404)
        write_json(PROPERTIES_FILE, new_props)
        return self.send_json({"success": True})


if __name__ == "__main__":
    mimetypes.add_type("text/css", ".css")
    mimetypes.add_type("application/javascript", ".js")
    server = http.server.HTTPServer(("", PORT), Handler)
    print(f"\n🏔  萬設國際有限公司 官方網站")
    print(f"   網站: http://localhost:{PORT}")
    print(f"   後台: http://localhost:{PORT}/admin")
    print(f"   帳號: admin  密碼: Wanshe@2026")
    print(f"\n   按 Ctrl+C 停止伺服器\n")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n伺服器已停止。")
