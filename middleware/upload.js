// middleware/upload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'card-' + unique + path.extname(file.originalname));
    }
});

// ✅ إزالة الفلتر تماماً - يقبل أي ملف
const upload = multer({
    storage,
    limits: { 
        fileSize: 50 * 1024 * 1024 // 50MB
    }
});

module.exports = upload;