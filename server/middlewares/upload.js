const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Local storage for PDFs
const uploadsDir = path.join(__dirname, '../uploads/articles');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

// Memory storage for images (will be uploaded to Cloudinary in controller)
const memoryStorage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'pdf' && file.mimetype === 'application/pdf') return cb(null, true);
  if (file.fieldname === 'image' && file.mimetype.startsWith('image/')) return cb(null, true);
  cb(new Error('Invalid file type'), false);
};

// Custom storage that routes pdf to disk, image to memory
const hybridStorage = {
  _handleFile(req, file, cb) {
    if (file.fieldname === 'pdf') {
      diskStorage._handleFile(req, file, cb);
    } else {
      memoryStorage._handleFile(req, file, cb);
    }
  },
  _removeFile(req, file, cb) {
    if (file.fieldname === 'pdf') {
      diskStorage._removeFile(req, file, cb);
    } else {
      memoryStorage._removeFile(req, file, cb);
    }
  },
};

const upload = multer({
  storage: hybridStorage,
  fileFilter,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 },
});

module.exports = upload;
