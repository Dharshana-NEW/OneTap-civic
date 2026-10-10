const express = require("express");
const multer = require("multer");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 4004;

// Paths
const DATA_DIR = path.join(__dirname, "data");
const COMPLAINTS_FILE = path.join(DATA_DIR, "complaints.json");
const ADMINS_FILE = path.join(DATA_DIR, "admins.json");
const UPLOADS_DIR = path.join(__dirname, "uploads");

// Ensure folders
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);
if (!fs.existsSync(COMPLAINTS_FILE)) fs.writeFileSync(COMPLAINTS_FILE, "[]");
if (!fs.existsSync(ADMINS_FILE)) fs.writeFileSync(ADMINS_FILE, "[]");

// Helpers
const readJSON = (file) => {
  try { return JSON.parse(fs.readFileSync(file)); }
  catch { return []; }
};

const writeJSON = (file, data) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
};

// Default admin
let admins = readJSON(ADMINS_FILE);
if (admins.length === 0) {
  admins.push({
    id: uuidv4(),
    adminId: "admin",
    passwordHash: bcrypt.hashSync("admin123", 10),
  });
  writeJSON(ADMINS_FILE, admins);
}

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/uploads", express.static(UPLOADS_DIR));

// Pages
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public/admin.html"));
});

// Multer
const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (req, file, cb) => {
    cb(null, uuidv4() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ✅ FIXED AUDIO SAVE
function saveBase64Audio(base64Data) {
  try {
    const parts = base64Data.split(";base64,");
    if (parts.length !== 2) return null;

    const mimePart = parts[0];
    const ext = mimePart.split("/")[1] || "webm";

    const fileName = `${uuidv4()}.${ext}`;
    const filePath = path.join(UPLOADS_DIR, fileName);

    fs.writeFileSync(filePath, Buffer.from(parts[1], "base64"));
    return `/uploads/${fileName}`;
  } catch {
    return null;
  }
}

// SUBMIT
app.post("/api/complaint", upload.single("photo"), (req, res) => {
  try {
    const {
      name,
      mobile,
      problem,
      address,
      latitude,
      longitude,
      voiceNote,
    } = req.body;

    let complaints = readJSON(COMPLAINTS_FILE);

    const newComplaint = {
      id: uuidv4(),
      name,
      mobile,
      problem,
      address,
      latitude,
      longitude,
      photoUrl: req.file ? `/uploads/${req.file.filename}` : null,
      audioUrl: voiceNote ? saveBase64Audio(voiceNote) : null,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    complaints.push(newComplaint);
    writeJSON(COMPLAINTS_FILE, complaints);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET
app.get("/api/complaints", (req, res) => {
  res.json({ complaints: readJSON(COMPLAINTS_FILE) });
});

// STATS
app.get("/api/complaints/stats", (req, res) => {
  const c = readJSON(COMPLAINTS_FILE);

  res.json({
    total: c.length,
    pending: c.filter(x => x.status === "pending").length,
    in_progress: c.filter(x => x.status === "in_progress").length,
    resolved: c.filter(x => x.status === "resolved").length,
  });
});

// ADMIN LOGIN
app.post("/api/admin/login", (req, res) => {
  const { adminId, password } = req.body;

  const admin = readJSON(ADMINS_FILE).find(a => a.adminId === adminId);

  if (!admin) return res.json({ success: false });

  if (!bcrypt.compareSync(password, admin.passwordHash)) {
    return res.json({ success: false });
  }

  res.json({ success: true, token: uuidv4() });
});

// STATUS
app.put("/api/status", (req, res) => {
  let complaints = readJSON(COMPLAINTS_FILE);

  complaints = complaints.map(c =>
    c.id === req.body.id ? { ...c, status: req.body.status } : c
  );

  writeJSON(COMPLAINTS_FILE, complaints);
  res.json({ success: true });
});

// DELETE
app.delete("/api/complaint/:id", (req, res) => {
  let complaints = readJSON(COMPLAINTS_FILE);
  complaints = complaints.filter(c => c.id !== req.params.id);
  writeJSON(COMPLAINTS_FILE, complaints);

  res.json({ success: true });
});

// START
app.listen(PORT, () => {
  console.log(`🚀 http://localhost:${PORT}`);
});