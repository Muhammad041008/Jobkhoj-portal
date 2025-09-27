const multer = require('multer');
const path = require('path');

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadDir = './uploads';

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set storage engine
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Check file type
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png|pdf|doc|docx/;
  // Check extname
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mimetype
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images and documents (PDF, DOC, DOCX) are allowed!'));
  }
}

// Initialize upload
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
});

// For single file upload
const singleUpload = upload.single('file');

// For multiple files upload
const multipleUpload = upload.array('files', 5);

// Middleware to handle upload errors
const handleUpload = (req, res, next) => {
  singleUpload(req, res, function(err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      return res.status(400).json({ message: err.message });
    } else if (err) {
      // An unknown error occurred when uploading.
      return res.status(400).json({ message: err.message });
    }

    // Everything went fine.
    next();
  });
};

module.exports = { upload, handleUpload, multipleUpload };