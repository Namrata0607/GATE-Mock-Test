const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage();  
// Memory storage to store the file in memory as a buffer

const fileUploadMiddleware = multer({
    storage,
    fileFilter: function (req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase(); // Ensure case-insensitivity
        if (ext !== '.xlsx') {
            console.error(`File upload error: Invalid file type (${ext}). Only .xlsx files are allowed.`);
            return cb(new Error('Only .xlsx files are allowed'));
        }
        console.log("File accepted:", file.originalname); // Debug log
        cb(null, true);
    },
    limits: {
        fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
    },
});

module.exports = fileUploadMiddleware;