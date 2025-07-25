const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');
const authMiddleware = require('../middleware/authMiddleware');

// Multer config: only accept .xls and .xlsx
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.xls' || ext === '.xlsx') {
    cb(null, true);
  } else {
    cb(new Error('Only Excel files are allowed (.xls, .xlsx)'));
  }
};

const upload = multer({ storage, fileFilter });

// POST /api/files/upload (protected)
router.post('/upload', authMiddleware, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  res.json({ message: 'File uploaded successfully', filename: req.file.filename });
});

// POST /api/files/parse (protected)
router.post('/parse', authMiddleware, async (req, res) => {
  const { filename } = req.body;
  if (!filename) return res.status(400).json({ message: 'No filename provided' });
  const filePath = path.join(__dirname, '../uploads', filename);
  try {
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: 'File not found' });
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet, { defval: '' });
    const columns = worksheet ? Object.keys(xlsx.utils.sheet_to_json(worksheet, { header: 1 })[0] || {}) : [];
    res.json({ columns, data });
  } catch (err) {
    res.status(500).json({ message: 'Failed to parse file', error: err.message });
  }
});

module.exports = router;
